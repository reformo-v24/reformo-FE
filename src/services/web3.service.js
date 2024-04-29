import Web3 from "web3";
import { onboard } from "../web3Onboard";
import {setWeb3Provider} from "../web3";

let web3 = new Web3(
  new Web3.providers.HttpProvider("https://bsc-testnet.public.blastapi.io")
);

const chainId = "0x61";
async function getNetworkId() {
  try {
    let provider = await onboard.connectWallet();
    web3 = new Web3(provider[0].provider);
    await setWeb3Provider(provider[0].provider);
    const resp = await web3.eth.net.getId();
    return resp;
  } catch (error) {
    return 1;
  }
}

const getWeb3 = async (isAuthenticate) => {
  if (web3 !== null) {
    let web3Data = {
      isLoggedIn: false,
      accounts: [],
    };
    try {
      let provider = await onboard.connectWallet();
      web3 = new Web3(provider[0].provider);
      await setWeb3Provider(provider[0].provider);
      const responseData = await web3.eth.getAccounts();
      const resp = await web3.eth.net.getId();
      if (responseData.length && resp === chainId) {
        web3Data.accounts = responseData;
        web3Data.isLoggedIn = true;

        return web3Data;
      } else {
        return web3Data;
      }
    } catch {
      return web3Data;
    }
  }
};

const enabledWalletConnect = async () => {
  try {
    const resp = await getWeb3();
    return resp;
  } catch (error) {
    if (error.code === -32002) {
      return {
        isLoggedIn: false,
        accounts: [],
      };
    }
    return {
      isLoggedIn: false,
      accounts: [],
    };
  }
};

const enableMetamask = async () => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const resp = await getWeb3();
    return resp;
  } catch (error) {
    if (error.code === -32002) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLoggedIn: false,
        accounts: [],
      };
    }
    if (error.code === 4001) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLoggedIn: false,
        accounts: [],
      };
    }
    return {
      error: true,
      code: error.code,
      msg: error.message,
      isLoggedIn: false,
      accounts: [],
    };
  }
};

let web3Data = {
  isLoggedIn: false,
  accounts: [],
};
const fetchAccountData = async (provider) => {
  try {
    window.provider = provider;
    web3 = new Web3(provider[0].provider);
    await setWeb3Provider(provider[0].provider);
    localStorage.setItem("modalProvider", 1);
    const accounts = await web3.eth.getAccounts();
    const chainid = await web3.eth.net.getId();
    web3Data.isLoggedIn = true;
    web3Data.accounts = accounts;
    web3Data.address = accounts[0];
    return web3Data;
  } catch (err) {
    console.error("An error occurred while fetch user Account Data:", err);
    return web3Data;
  }
};


const enableWeb3Modal = async (dispatch) => {
  let _provider;
  try {
    _provider = await onboard.connectWallet();
    // Prompt the user to switch to chain id 97
    const success = await onboard.setChain({ chainId: "0x61" });
    // '0x61' is hexadecimal representation  of 97

    await fetchAccountData(_provider);
    return web3Data;
  } catch (error) {
    console.error("An error occurred while connecting the wallet:", error);
    return  web3Data;
  }
};

const disableWeb3Modal = async () => {
  let web3Data = {
    isLoggedIn: false,
    accounts: [],
  };

  try {
    const [primaryWallet] = onboard.state.get().wallets;
    await onboard.disconnectWallet({ label: primaryWallet.label });
    console.log("Wallet disconnected");
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
  }
  localStorage.removeItem("modalProvider");
  return web3Data;
};

export const web3Services = {
  enableWeb3Modal,
  enabledWalletConnect,
  enableMetamask,
  getNetworkId,
  getWeb3,
  web3,
  disableWeb3Modal,
};
