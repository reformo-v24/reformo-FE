import Web3 from "web3";

import { onboard } from "./web3Onboard";
let web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-testnet-rpc.publicnode.com")
);

const metamaskConnectInit = async () => {
  try {
    if (typeof window.ethereum !== "undefined") {
      // await onboard.connectWallet();
      // web3 = new Web3(onboard.provider[0].provider);
      return true;
    } else {
      console.error("Metamask not detected");
      return false;
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return false;
  }
};

const walletConnectInit = async () => {
  try {
    await onboard.connectWallet();
    web3 = new Web3(onboard.provider[0].provider);
    return true;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return false;
  }
};


const walletConnectModalInit = async () => {
  try {
    await onboard.connectWallet();
    
    web3 = new Web3(onboard.provider[0].provider);
    // Additional logic if needed
    return true;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return false;
  }
};

const phantomWalletConnectInit = async () => {
  try {
    localStorage.setItem("walletConnect", 2);
    const walletSelected = await onboard.connectWallet();
    if (walletSelected && onboard.getState().walletName === 'phantom') {
      web3 = onboard.getState().provider;
      return true;
    } else {
      window.open("https://phantom.app/", "_blank");
      return false;
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return false;
  }
};
if (!web3) {
  if (Number(localStorage.getItem("walletConnect")) === 1) {
    walletConnectInit();
  } else if (Number(localStorage.getItem("walletConnect")) === 2) {
    phantomWalletConnectInit();
  } else metamaskConnectInit();
}

function setWeb3Provider(provider) {
  console.log("i recieved provider", provider);
  web3 = new Web3(provider);
}

export {
  web3,  
  setWeb3Provider,
  walletConnectInit,
  metamaskConnectInit,
  walletConnectModalInit,
  phantomWalletConnectInit,
};
