
import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import metamaskSDK from "@web3-onboard/metamask";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import trustModule from "@web3-onboard/trust";
import walletConnectModule from "@web3-onboard/walletconnect";
import Reformologo from "../assets/ReformoLogo.png";
const project_id=process.env.REACT_APP_PROJECT_ID;
const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

const injected = injectedModule({
  displayUnavailable: false,
});
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    dappMetadata: {
      name: "Demo Web3Onboard",
    },
  },
});
const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });
const trust = trustModule();

const wcV2InitOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: project_id,
  /**
   * Chains required to be supported by all wallets connecting to your DApp
   */
  requiredChains: [1],
  /**
   * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
   * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
   * To connect with WalletConnect
   */
  dappUrl: "http://YourAwesomeDapp.com",
};
const walletConnect = walletConnectModule(wcV2InitOptions);
const wallets= [
  metamaskSDKWallet,
  coinbaseWalletSdk,
  trust,
  walletConnect,
  injected,
];

const chains = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: "0x5",
    token: "ETH",
    label: "Ethereum Testnet (Görli)",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: "0x38",
    token: "BNB",
    label: "Binance Smart Chain Mainnet",
    rpcUrl: "https://bsc-dataseed.binance.org/",
  },
  {
    id: "0x61",
    token: "BNB",
    label: "Binance Smart Chain Testnet",
    rpcUrl: "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
  },
  {
    id: "0x13881",
    token: "MATIC",
    label: "Polygon Mainnet",
    rpcUrl: "https://rpc-mainnet.matic.network",
  },
  {
    id: "0x89",
    token: "MATIC",
    label: "Polygon Testnet (Mumbai)",
    rpcUrl: "https://matic-mumbai.chainstacklabs.com",
  },
];

const appMetadata = {
  name: 'Reformo ',
    icon: Reformologo,
    logo: Reformologo,
    description: 'funds for your Organization',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
};

const web3Onboard = Onboard({
  wallets,
  chains,
  appMetadata,
});
export { web3Onboard, chains, wallets,appMetadata};