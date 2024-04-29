import { walletConnectModalInit, web3 } from "../web3";
import Web3 from "web3";
import { Web } from "@material-ui/icons";
import CONSTANT from "../constant";
const server = CONSTANT.ENV;
export async function getNetworkId() {
  try {
    return await web3.eth.getChainId();
  } catch (error) {
    return 1;
  }
}
export async function getWeb3(walletNo, temp) {
  if (+walletNo === 2) {
    let obj = await connectPhanthomWallet();
    if (obj) return obj;
    else
      return {
        isLoggedIn: false,
        accounts: [],
      };
  }
  if (web3) {
    let web3Data = {
      isLoggedIn: false,
      accounts: [],
    };
    try {
      const responseData = await web3.eth.getAccounts();
      if (responseData.length) {
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
}
export async function enabledWalletConnect() {
  try {
    await walletConnectModalInit();
    const resp = await getWeb3("walle");
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
}

export async function enableMetamask() {
  // let ethereum = window.ethereum;
  try {
    await window.ethereum.send("eth_requestAccounts");
    const resp = await getWeb3("meta");
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
}

export async function connectPhanthomWallet() {
  try {
    const resp = await window.solana.connect();
    return {
      isLoggedIn: true,
      accounts: [resp.publicKey.toString()],
    };
  } catch (err) {
    console.log(err);
  }
}
export const networkProviders = {
  binance: new Web3(
    new Web3.providers.HttpProvider(
      server === "DEVELOPMENT"
        ? "https://bsc-testnet.public.blastapi.io/"
        : "https://bsc-dataseed2.binance.org/"
    )
  ),
 
};

export const networkConfigs =
  server === "DEVELOPMENT"
    ? {
        binance: {
          chainId: "0x61",
          chainName: "Binance Test Chain",
          nativeCurrency: {
            name: "Binance Chain Token",
            symbol: "BNB",
            decimals: 18,
          },

          rpcUrls: ["https://bsc-testnet.public.blastapi.io"],
          blockExplorerUrls: ["https://test.bscscan.com/"],
        },
        polygon: {
          chainId: "0x13881",
          chainName: "Mumbai Testnet",
          nativeCurrency: {
            name: "Mumbai Testnet",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        },
        avalanche: {
          chainId: "0xA869",
          chainName: "Avalanche Fuji Testnet",
          nativeCurrency: {
            name: "Avalanche Fuji Testnet",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://testnet.snowtrace.io/"],
        },
        fantom: {
          chainId: "0xfa2",
          chainName: "Fantom Testnet Opera",
          nativeCurrency: {
            name: "Fantom Testnet Opera",
            symbol: "FTM",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.testnet.fantom.network/"],
          blockExplorerUrls: ["https://testnet.ftmscan.com/"],
        },
      }
    : {
        binance: {
          chainId: "0x38",
          chainName: "Binance Smart Chain",
          nativeCurrency: {
            name: "Binance Chain Token",
            symbol: "BNB",
            decimals: 18,
          },
          rpcUrls: ["https://bsc-dataseed2.binance.org/"],
          blockExplorerUrls: ["https://bscscan.com/"],
        },
        polygon: {
          chainId: "0x89",
          chainName: "Polygon Mainnet",
          nativeCurrency: {
            name: "Polygon Mainnet",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://polygon-rpc.com/"],
          blockExplorerUrls: ["https://polygonscan.com/"],
        },
        avalanche: {
          chainId: "0xA86A",
          chainName: "Avalanche Mainnet C-Chain",
          nativeCurrency: {
            name: "Avalanche Mainnet C-Chain",
            symbol: "AVAX",
            decimals: 18,
          },
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
        },
        fantom: {
          chainId: "0xfa",
          chainName: "Fantom Opera",
          nativeCurrency: {
            name: "Fantom Opera",
            symbol: "FTM",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.ftm.tools/"],
          blockExplorerUrls: ["https://ftmscan.com/"],
        },
      };
