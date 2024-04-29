import React, {
  PureComponent,
  Component,
  useEffect,
  useState,
  useRef,
} from "react";
import Loader from "../assets/loader.gif"
import Banner from "../component/homeBanner";
import styled from "styled-components";
import {
  Button,
  Container,
  NameBlock,
  SquareBtns,
  Networks,
  Loading,
} from "../theme/main.styled";
import { Link } from "react-router-dom";

import icon1 from "./../assets/images/icon1.png";
import icon2 from "./../assets/images/icon2.png";
import icon3 from "./../assets/images/icon3.png";
import icon4 from "./../assets/images/icon4.png";
import icon5 from "./../assets/images/icon5.png";
import icon6 from "./../assets/images/icon6.png";
import down from "./../assets/images/caret-down-solid.svg";
//
import { BiChevronsDown, BiMessageAltAdd } from "react-icons/bi";
import {
  PopupBx,
  PopUpMain,
  StakeMsg,
  CloseBtn,
  StakeCalc,
  TextBox,
} from "../component/Modal/StakingModal";
import CompleteIcon from "../assets/complete.png";
import GreenCIcon from "../assets/green-close.png";
import RedCIcon from "../assets/red-close.png";
import BlueCIcon from "../assets/close-vector.png";
import ProcessLoader from "../assets/processing-loader.gif";
import ReactTooltip from "react-tooltip";
import SearchClose from "../assets/search-close.png";
import EthIcon from "../assets/eth.png";
import BnbIcon from "../assets/bnb-icon.png";
import PolygonIcon from "../assets/polygon.png";
import SolanaIcon from "../assets/solana.png";
import AvalancheIcon from "../assets/ava.png";
import FtmIcon from "../assets/fantom.png";
import { MoonLoader } from "react-spinners";

import {
  getSolanaProvider,
  metamaskConnectInit,
  phantomWalletConnectInit,
  walletConnectInit,
  web3,
} from "../web3";
import {
  connectPhanthomWallet,
  enabledWalletConnect,
  enableMathWallet,
  enableMetamask,
  getNetworkId,
  getWeb3,
  networkConfigs,
} from "../helpers/metamask";
import {
  capitalizeFirstLetter,
  createMerkleProof,
  getContractInstance,
  getCSV,
  TimeStampToDateString,
} from "../helpers/function";
import { dataFunctions } from "../component/walletFunctions";
//

let totalPages = 10;

const Claims = (props) => {
  //
  const Wallets = { 0: "metaMask", 1: "walletConnect", 2: "mathWallet" };
  const chains = [
    {
      name: "BSC",
      icon: BnbIcon,
      param: "BNB",
      config: networkConfigs.binance,
      scanLink: "https://testnet.bscscan.com/tx/",
    },
    {
      name: "Polygon",
      icon: PolygonIcon,
      param: "MATIC",
      config: networkConfigs.polygon,
      scanLink: "https://polygonscan.com/tx/",
    },
    {
      name: "Avalanche",
      icon: AvalancheIcon,
      param: "AVAX",
      config: networkConfigs.avalanche,
      scanLink: "https://avascan.info/blockchain/x/tx/",
    },
    {
      name: "Ethereum",
      icon: EthIcon,
      param: "ETH",
      scanLink: "https://etherscan.io/tx/",
    },
    {
      name: "Fantom",
      icon: FtmIcon,
      param: "FTM",
      config: networkConfigs.fantom,
      scanLink: "https://ftmscan.com/tx/",
    },
    // {
    //   name: "Solana ",
    //   icon: SolanaIcon,
    //   param: "SOL",
    //   scanLink: "https://solscan.io/tx/",
    //   // clustur: "?cluster=devnet",
    // },
  ];

  // const [solanaVesting, setSolanaVesting] = useState("");
  const [web3Data, setWeb3Data] = useState({ isLoggedIn: false, accounts: [] });
  const [userTokenClaimArr, setUserTokenClaimArr] = useState([]);
  const [usertokendata, setUserTokendata] = useState([]);
  const [pools, setPools] = useState([]);
  const [tempList, setTempList] = useState([]);
  const [poolUnlockTime, setPoolUnlockTime] = useState([]);
  const [networkId, setNetworkId] = useState(1);
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [openVestingModal, setOpenVestingModal] = useState(false);
  const [currentIDO, setCurrentIDO] = useState(0);
  const [txnStatus, setTxnStatus] = useState({ status: "false", msg: "" });
  const [showMiniModals, setShowMiniModals] = useState(true);
  const [currentWallet, setCurrentWallet] = useState(0);
  const [activeChain, setAciveChain] = useState(undefined);
  const [txnHash, setTxnHash] = useState();
  const [vestingType, setVestingType] = useState("monthly");
  const [repetitionInterval, setRepetitionInterval] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [merkleUsers, setMerkleUsers] = useState([]);
  const [poolmessage, setpoolmessage] = useState(false);
  const [message, setMessage] = useState("");
  const [searchtext, setSearchtxt] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedVestingKey, setSelectedVestingKey] = useState(false);
  const [vestingFunc, setVestingFunc] = useState("");
  const [reload, setReload] = useState(false);
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (!+localStorage.getItem("disconnected")) callWeb3();
  }, [activeChain]);
  useEffect(() => {
    if (activeChain !== undefined) {
      callPools(activeChain);
    }
  }, [web3Data?.accounts[0], vestingType, currentPage, activeChain, reload]);
  const callMerkleUsers = async (pools) => {
    try {
      if (pools) {
        const _merkleUsers = await Promise.all(
          pools?.map(async (pool) => {
            let url1 = `http://localhost:5000/api/v1/claim/single/pools`;
            const response = await fetch(url1);
            const data = await response.json();
            console.log("claim_data", data);
            return data.data.dumpId?.uploadData;
          })
        );
        setMerkleUsers(_merkleUsers);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const [pool, setPool] = useState(false);
  const callPools = async (key) => {
    setTimeout(() => {
      setLoader(true);
    }, 500);
    let url = `http://localhost:5000/api/v1/claim/`;
    if (web3Data.isLoggedIn)
      url = url + `&walletAddress=${web3Data.accounts[0]}`;
    fetch(url, {
      headers: {
        "api-key":
          // "da3f89789b06fa0c5c3be65e5e18a7fafdda6bcdb51db9fe2b821c634c042405",
          "9979fd5e7cb73fc0a207226b7d62c7b43f98a8f27e3f05c5e79bd7d62cb1b0db",
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        totalPages = data.pagination?.totalPages;
        if (chains[activeChain].param === "SOL") callMerkleUsers(data.data);
        setPools(data.data);
        if (data?.data?.length === 0) {
          setMessage("No pools yet.");
          setpoolmessage(true);
        }
        setTempList(data.data);
      });
  };
  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts[0]) {
        callWeb3();
      } else {
        callWeb3(true);
      }
    });
  }, []);

  const isUserDataCalled = useRef();

  useEffect(() => {
    if (web3Data?.isLoggedIn && pools?.length) {
      const walletNo = +localStorage.getItem("walletNo");
      if (+walletNo === 2) {
        if (merkleUsers?.length) {
          isUserDataCalled.current = true;
          callUserData(pools, 1);
          checkForRefresh(pools);
        }
      } else if (pools?.[0].isInvested !== undefined) {
        isUserDataCalled.current = true;
        callUserData(pools, 2);
        checkForRefresh(pools);
      }
    }
  }, [web3Data, pools, merkleUsers]);
  const checkForRefresh = (pools) => {
    const walletNo = +localStorage.getItem("walletNo");

    if (vestingType === "linear" && !repetitionInterval && +walletNo !== 2) {
      setRepetitionInterval(
        setInterval(() => {
          if (+walletNo !== 2) callUserData(pools, 3);
        }, 5000)
      );
    } else if (vestingType !== "linear") {
      clearInterval(repetitionInterval);
    }
  };

  const callUserData = async (pools, temp) => {
    const walletNo = +localStorage.getItem("walletNo");
    if (walletNo === 2 && web3Data.isLoggedIn) {
      try {
        new (web3Data.accounts[0].trim());
      } catch (e) {
        return;
      }
    }
    const data = await dataFunctions(
      +walletNo === 2 ? "SOL" : "ETH",
      pools,
      web3Data,
      +walletNo === 2 ? merkleUsers : null
    );
    // setSolanaVesting(data.solanaVesting);
    setUserTokenClaimArr(data?._userTokensClaimArr);
    setUserTokendata(data?._userTokensClaimArr);
    // return web3.utils.fromWei(_userTokenClaimamount);
  };
  const connectToWallet = async (walletNo) => {
    localStorage.setItem("walletNo", walletNo);
    localStorage.setItem("disconnected", 0);
    let _accounts = null;
    try {
      if (walletNo == 2) _accounts = await connectPhanthomWallet();
      if (walletNo == 1) _accounts = await enabledWalletConnect();
      if (walletNo == 0) _accounts = await enableMetamask();
      if (_accounts?.isLoggedIn) {
        let _web3Data = await getWeb3(walletNo, 2);
        setWeb3Data(_web3Data);
      }
      setCurrentWallet(walletNo);
    } catch (e) {
      console.log(e);
    }
  };
  const callWeb3 = async (disconnect) => {
    if (disconnect) return setWeb3Data({ isLoggedIn: false, accounts: [] });
    const walletNo = localStorage.getItem("walletNo");
    try {
      if (+walletNo !== 2) {
        let _netWorkId = await getNetworkId();
        setNetworkId(
          web3.utils.isHexStrict(_netWorkId)
            ? web3.utils.toHex(_netWorkId)
            : _netWorkId
        );
      }
      console.log("called callweb3");
      let _web3Data = await getWeb3(walletNo, 1);
      setWeb3Data(_web3Data);
    } catch (e) {
      console.log(e);
    }
  };
  const makeTransaction = async (key) => {
    try{
    //----------solana claims starts --------------//
    const walletNo = localStorage.getItem("walletNo");
    if (+walletNo === 2) {
      try {
        // const solTxnResult = await swapClaim(
        //   userTokenClaimArr[key].solanaVesting,
        //   web3Data.accounts[0]
        // );
        // if (solTxnResult.status) {
        //   setTxnStatus((prevState) => ({
        //     ...prevState,
        //     status: "process",
        //     msg: "Transaction is processing ",
        //   }));
        //   setTxnHash(solTxnResult.signature);
        //   const connection = new Connection(
        //     "https://api.mainnet-beta.solana.com",
        //     "finalized"
        //   );
        //   const rsults = await connection.confirmTransaction(
        //     solTxnResult.signature
        //   );
        //   if (openFirst) setOpenSecond(true);
        //   setOpenFirst(false);
        //   callUserData(pools);
        //   return setTxnStatus((prevState) => ({
        //     ...prevState,
        //     status: "success",
        //     msg: "Transaction confirmed",
        //   }));
        // }
      } catch (err) {
        return onTransactionError(err);
      }
    }
    //----------solana claims ends --------------//
    // ---------evm chain claims starts --------------- //
    if (!web3Data.isLoggedIn) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please connect to metamask",
      }));
      return;
    }
    if (pools[key].networkId != networkId) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please switch to the mentioned network of the pool",
      }));
      return;
    }
    if (+pools[key].timestamp >= new Date().getTime() / 1000) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Claiming has not started yet",
      }));
      return;
    }
    setShowMiniModals(false);
    const contractInstance = getContractInstance(
      pools[key].networkName,
      true,
      pools[key].contractAddress,
      pools[key].vestingType
    );
    let params =
      vestingType === "linear"
        ? []
        : [pools[key].tokenAddress, pools[key].phaseNo];
    await contractInstance.methods
      .claim(...params)
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        setTxnStatus((prevState) => ({
          ...prevState,
          status: "process",
          msg: "Transaction is processing ",
        }));
        setTxnHash(hash);
        window.removeEventListener("transactionHash", makeTransaction);
      })
      .on("receipt", (receipt) => {
        window.removeEventListener("receipt", makeTransaction);
        if (openFirst) setOpenSecond(true);
        setOpenFirst(false);
        setTxnStatus((prevState) => ({
          ...prevState,
          status: "success",
          msg: "Transaction confirmed",
        }));
        callUserData(pools);
      })
      .on("error", (error) => {
        onTransactionError(error, key);
      });
    } catch (error) {
      console.error("Error occurred while cliam rewards:", error);
      // Optionally, handle the error or log additional information
    }
  };
  const onTransactionError = (error, key) => {
    let _msg = "Transaction reverted";
    if (error.code === 4001) {
      _msg = "Transaction denied by the user";
    } else if (error.code === -32602) {
      _msg = "wrong parameters";
    } else if (error.code === -32603) {
      _msg = "Internal Error";
    } else if (error.code === -32002) {
      _msg = "Complete previous request";
    } else _msg = "Transaction failed";
    setTxnStatus((prevState) => ({
      ...prevState,
      status: "error",
      msg: _msg,
    }));
  };
  const Ch = (key) => {
    return key == activeChain ? "active" : null;
  };
  // window.scroll({
  //   top: 0,
  //   left: 0,
  //   behavior: "smooth",
  // });
  useEffect(() => {
    const ch = localStorage.getItem("currentChain");
    setAciveChain(ch ? ch : 0);
    if (ch == 5) setVestingType("linear");
  }, []);
  const ChangeChain = async (key) => {
    localStorage.setItem("currentChain", key);
    try {
      if (chains[key].param === "SOL") {
        localStorage.setItem("walletNo", 2);
        setAciveChain(key);
        setWeb3Data({ isLoggedIn: false, accounts: [] });
        setPools([]);
        await phantomWalletConnectInit();
        setVestingType("linear");
        // if (isInitiated) connectToWallet(2);
      } else {
        setReload(!reload);
        setAciveChain(key);
        setPools([]);
        setpoolmessage(false);
        if (Number(localStorage.getItem("walletConnect")) === 1) {
          walletConnectInit();
        } else metamaskConnectInit();
        localStorage.setItem("walletNo", 0);
        connectToWallet(0);
      }

      // callPools(key);
      if (chains[key].config) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chains[key].config],
        });
      } else {
        if (chains[key].param === "SOL") return;
        else if (networkId != 1 || networkId != "0x1") {
          setTimeout(() => {
            setTxnStatus((prevState) => ({
              ...prevState,
              status: "false",
              msg: ``,
            }));
          }, 5000);
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "error",
            msg: `Please switch to Ethereum Network`,
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const addTokenToMetamask = async (key) => {
    let tokenAddress = pools[key].tokenAddress;
    const tokenContractInstance = getContractInstance(
      pools[key].networkName,
      false,
      tokenAddress,
      "token"
    );
    let tokenDecimals, tokenSymbol;
    try {
      tokenDecimals = await tokenContractInstance.methods.decimals().call();
      tokenSymbol = await tokenContractInstance.methods.symbol().call();
    } catch (err) {
      console.log(err);
    }
    // const provider = await detectEthereumProvider();
    window.ethereum.sendAsync(
      {
        method: "metamask_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: pools[key].image,
          },
        },
        id: Math.round(Math.random() * 100000),
      },
      (err) => {
        if (err) {
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "success",
            msg: "Token addition failed",
          }));
          return;
        }
        setTxnStatus((prevState) => ({
          ...prevState,
          status: "success",
          msg: "Token added successfuly",
        }));
      },
      (added) => {
        console.log("provider returned", added);
      }
    );
  };
  const managePage = (newPage) => {
    if (newPage && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const [addressModal, setAddressModal] = useState(false);

  // -------------------------------------------------------------------------------------------------------------------------

  const unLockSolana = async (key) => {
    // const solTxnResult = airdropByUser(
    //   userTokenClaimArr[key].solanaVesting,
    //   web3Data.accounts[0]
    // );
    // if (solTxnResult.status) {
    //   setTxnStatus((prevState) => ({
    //     ...prevState,
    //     status: "process",
    //     msg: "Transaction is processing ",
    //   }));
    //   setTxnHash(solTxnResult.signature);
    //   const connection = new Connection(
    //     "https://api.mainnet-beta.solana.com",
    //     "finalized"
    //   );
    //   const rsults = await connection.confirmTransaction(
    //     solTxnResult.signature
    //   );
    //   setOpenSecond(true);
    //   callUserData(pools);
    //   return setTxnStatus((prevState) => ({
    //     ...prevState,
    //     status: "success",
    //     msg: "Tokens unlocked ! Please proceed with claiming token.",
    //   }));
    // }
  };
  const [show, setShow] = useState(false);
  const handlePoolSearch = () => {
    setShow(!show);
    setSearchtxt("");
    setpoolmessage(false);
    if (show) {
      setpoolmessage(false);
      setPools(tempList);
    } else {
      var filtered = tempList.filter(
        (r, index) =>
          usertokendata.findIndex((obj, i) => index == i && obj.val > 0) > -1
      );
      setPools(filtered);
      setpoolmessage(false);
      if (filtered.length === 0) {
        setpoolmessage(true);
        setMessage(" No claimable tokens.");
      }
    }
  };
  const handleSearch = (txt) => {
    setSearchtxt(txt);
    setpoolmessage(false);
    setShow(false);
    if (txt?.length > 2) {
      let url = `http://localhost:5000/api/v1/claim/list?search=${txt}`;
      if (web3Data.isLoggedIn)
        url = url + `&walletAddress=${web3Data.accounts[0]}`;
      fetch(url, {
      })
        .then((response) => response.json())
        .then((data) => {
          setPools(data.data);
          setShow(false);
          setTempList(data.data);
          setpoolmessage(false);
          if (data?.data.length === 0) {
            setpoolmessage(true);
            setMessage(
              " No matching results. Try searching with another keyword."
            );
          }
        });
    } else if (txt?.length === 0) {
      callPools(activeChain);
      setpoolmessage(false);
    }
  };
  const handleclose = () => {
    setPools([]);
    setShow(false);
    setpoolmessage(false);
    callPools(activeChain);
    setSearchtxt("");
  };
  const getTotalAmount = (key) => {
    if (currentIDO !== null) {
      let amount = 0;
      const currVest = userTokenClaimArr[key ? key : currentIDO]?.vestings;
      for (let i = 0; i < currVest?.length; i++) {
        if (
          currVest[i].userStatus === "notClaimed" &&
          currVest[i].startTime < new Date().getTime() / 1000
        ) {
          amount = amount + Number(currVest[i]?.vestTokens);
        }
      }
      return amount;
    }
  };

  const claimAvailableVestings = async (key) => {
    if (!web3Data.isLoggedIn) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please connect to metamask",
      }));
      return;
    }
    if (pools[key].networkId != networkId) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please switch to the mentioned network of the pool",
      }));
      return;
    }

    let phaseNumbers = [];
    const currVest = userTokenClaimArr[key].vestings;
    for (let i = 0; i < currVest?.length; i++) {
      if (
        currVest[i].userStatus === "notClaimed" &&
        currVest[i].startTime < new Date().getTime() / 1000
      ) {
        phaseNumbers.push(i);
      }
    }
    if (!phaseNumbers?.length) {
      return setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "No vestings are available for claim !",
      }));
    }
    setShowMiniModals(false);
    setTxnStatus((prevState) => ({
      ...prevState,
      status: "process",
      msg: "Please wait",
    }));
    try {
      const csv = await getCSV(pools[currentIDO]._id, web3Data.accounts[0]);
      const amounts = phaseNumbers.map((key) =>
        web3.utils.toWei(currVest[key].vestTokens)
      );
      const proofs = phaseNumbers.map((key) => {
        const userArr = csv.map((ele) => {
          let newVestTokens = web3.utils.toWei(
            (+(ele.eTokens * currVest[key].percentage) / 100).toFixed(6)
          );
          return { walletAddress: ele.walletAddress, eTokens: newVestTokens };
        });
        return createMerkleProof(
          web3Data.accounts[0],
          web3.utils.toWei(currVest[key].vestTokens),
          userArr
        );
      });
      const contractInstance = getContractInstance(
        pools[currentIDO].networkName,
        true,
        pools[currentIDO].contractAddress,
        "merkle"
      );

      await contractInstance.methods
        .claimMultiple(amounts, phaseNumbers, proofs)
        .send({ from: web3Data.accounts[0] })
        .on("transactionHash", (hash) => {
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "process",
            msg: "Transaction is processing ",
          }));
          setTxnHash(hash);
          window.removeEventListener("transactionHash", claimAvailableVestings);
        })
        .on("receipt", (receipt) => {
          if (openFirst) setOpenSecond(true);
          setOpenFirst(false);
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "success",
            msg: "Transaction confirmed",
          }));
          callUserData(pools);
          window.removeEventListener("receipt", claimAvailableVestings);
        })
        .on("error", (error) => {
          onTransactionError(error, currentIDO);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const claimParticularVesting = async (vestingKey) => {
    if (!web3Data.isLoggedIn) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please connect to metamask",
      }));
      return;
    }
    if (pools[currentIDO].networkId != networkId) {
      setShowMiniModals(true);
      setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Please switch to the mentioned network of the pool",
      }));
      return;
    }
    const vestingToClaim =
      userTokenClaimArr[currentIDO]?.vestings[selectedVestingKey];

    if (vestingToClaim.startTime > new Date().getTime() / 1000)
      return setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Claiming not started yet !",
      }));
    if (vestingToClaim.userStatus === "claimed")
      return setTxnStatus((prevState) => ({
        ...prevState,
        status: "error",
        msg: "Already Claimed !",
      }));
    setTxnStatus((prevState) => ({
      ...prevState,
      status: "process",
      msg: "Please wait",
    }));
    //----------------------------------------------------------hex from backend----------/////////
    // const vestings = await getHexProofs(pools[vestingDetailsModal].dumpId._id,web3Data.accounts[0],vestingToClaim.vestingId )
    // const proof = vestings[vestingKey].hexProof
    //---------------------------------------------------------------//
    const contractInstance = getContractInstance(
      pools[currentIDO].networkName,
      true,
      pools[currentIDO].contractAddress,
      "merkle"
    );
    //////////////////////-------------------csv calling----------------/////////////
    try {
      const csv = await getCSV(pools[currentIDO]._id, web3Data.accounts[0]);
      const userArr = csv.map((ele) => {
        let newVestTokens = web3.utils.toWei(
          (+(ele.eTokens * vestingToClaim.percentage) / 100).toFixed(6)
        );
        return { walletAddress: ele.walletAddress, eTokens: newVestTokens };
      });
      const csvProof = createMerkleProof(
        web3Data.accounts[0],
        web3.utils.toWei(vestingToClaim.vestTokens),
        userArr
      );
      //////////////////////-------------------csv calling----------------/////////////

      const amount = web3.utils.toWei(vestingToClaim.vestTokens);
      const phase = vestingKey;
      setShowMiniModals(false);
      await contractInstance.methods
        .claimTokens(amount, phase, csvProof)
        .send({ from: web3Data.accounts[0] })
        .on("transactionHash", (hash) => {
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "process",
            msg: "Transaction is processing ",
          }));
          setTxnHash(hash);
          window.removeEventListener("transactionHash", claimParticularVesting);
        })
        .on("receipt", (receipt) => {
          if (openFirst) setOpenSecond(true);
          setOpenFirst(false);
          setTxnStatus((prevState) => ({
            ...prevState,
            status: "success",
            msg: "Transaction confirmed",
          }));
          callUserData(pools);
          window.removeEventListener("receipt", claimParticularVesting);
        })
        .on("error", (error) => {
          onTransactionError(error, currentIDO);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const buttonType = (vestings) => {
    const btnObj = { class: "cid-btn", btnName: <MoonLoader /> };
    if (vestings && vestings?.length && +vestings[0].vestTokens >= 0) {
      const notInvested = vestings.find(
        (element) => element.userStatus === "notInvested"
      )
        ? true
        : false;

      if (notInvested) {
        btnObj.class = "un-btn";
        btnObj.btnName = "Unavailable";
        return btnObj;
      }
      const notClaimed = vestings.find((element) => {
        if (
          element.userStatus === "notClaimed" &&
          element.startTime < new Date().getTime() / 1000
        ) {
          return true;
        }
      });

      const upComing = vestings.find(
        (element) => element.userStatus === "upcoming"
      )
        ? true
        : false;
      const claimedAll = vestings.find(
        (element) => element.userStatus === "notClaimed"
      )
        ? false
        : true;

      if (notClaimed) {
        btnObj.class = "ct-btn";
        btnObj.btnName = "Claim";
      }
      if (claimedAll && !upComing) {
        btnObj.class = "cid-btn";
        btnObj.btnName = "Claimed All !";
      }
      if (upComing && !notClaimed) {
        btnObj.class = "cid-btn";
        btnObj.btnName = "Upcoming";
      }

      return btnObj;
    } else return btnObj;
  };
  const userStatusKey = (status) => {
    return status === "claimed"
      ? "Claimed!"
      : status === "notClaimed"
      ? "Claim"
      : status === "upcoming"
      ? "Upcoming"
      : "-";
  };

  //
  const [ToggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";

  return (
    <>
      <Container>
        <ClaimTop>
          <Networks>
            <p>Select a Network</p>
            <SquareBtns className="networks">
              {chains.map((chain, key) => (
                <Link
                  className={`${
                    chain.param === chains[activeChain]?.param ? "active" : ""
                  }`}
                  onClick={() => {
                    setPools([]);
                    ChangeChain(key);
                    setShow(false);
                    setSearchtxt("");
                    setpoolmessage(false);
                  }}
                  to="#"
                >
                  <img src={chain.icon} alt="icon"></img>
                </Link>
              ))}
            </SquareBtns>
          </Networks>
          {activeChain !== 5 ? (
            <TabNav>
              <Link
                className={`tabs ${getActiveClass(1, "active")}`}
                onClick={() => {
                  toggleTab(1);
                  setReload(!reload);
                  setPools([]);
                  setSearchtxt("");
                  setShow(false);
                  setUserTokenClaimArr([]);
                  setVestingType("monthly");
                  setpoolmessage(false);
                }}
                to="#"
              >
                Monthly
              </Link>
              <Link
                className={`tabs ${getActiveClass(2, "active")}`}
                onClick={() => {
                  toggleTab(2);
                  setReload(!reload);
                  setPools([]);
                  setSearchtxt("");
                  setShow(false);
                  setUserTokenClaimArr([]);
                  setpoolmessage(false);
                  setVestingType("linear");
                }}
                to="#"
              >
                Linear
              </Link>
            </TabNav>
          ) : null}
        </ClaimTop>
        <ClaimTop>
          <h1>
            Claim your IDO tokens
            <CheckBox>
              <input
                id="claimable"
                type="checkbox"
                checked={show}
                onChange={() => handlePoolSearch()}
              ></input>
              <label htmlFor="claimable">Show only claimable tokens</label>
            </CheckBox>
          </h1>
          <Search>
            <input
              value={searchtext}
              type="search"
              name=""
              placeholder="Type to search ..."
              onChange={(event) => handleSearch(event.target.value)}
            ></input>
            {/* {searchtext?.length > 0 ? (
                <img
                  src={SearchClose}
                  onClick={() => handleclose()}
                  className="close"
                  alt=""
                />
              ) : (
                <b></b>
              )} */}
          </Search>
        </ClaimTop>

        <ClaimList>
          {pools?.map((pool, key) => {
            return (
              <ClaimRow>
                <NameBlock className="lg name">
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${pool.logo})` }}
                  />
                  <div>
                    <h4>{pool.name}</h4>
                  </div>
                </NameBlock>
                {vestingType === "linear" && (
                  <ClaimCol>
                    <p>
                      Claimed
                      <span>
                        {userTokenClaimArr?.[key]?.claimedAmount
                          ? (+userTokenClaimArr?.[key]?.claimedAmount).toFixed(
                              4
                            )
                          : 0}
                      </span>
                    </p>
                  </ClaimCol>
                )}
                <ClaimCol>
                  <p>
                    {vestingType === "linear"
                      ? "Claimable / Left"
                      : "Your allocation"}
                    <span>
                      {vestingType === "linear"
                        ? (+userTokenClaimArr?.[key]?.claimable
                            ? +userTokenClaimArr?.[key]?.claimable
                            : 0
                          ).toFixed(4) +
                          " / " +
                          (userTokenClaimArr?.[key]?.val
                            ? (+userTokenClaimArr?.[key]?.val).toFixed(4)
                            : 0)
                        : userTokenClaimArr?.[key]?.val}
                    </span>
                  </p>
                </ClaimCol>

                <ClaimCol>
                  <p>
                    Claim start date
                    <span>{TimeStampToDateString(pool.timestamp)}</span>
                  </p>
                </ClaimCol>
                <ClaimCol>
                  {userTokenClaimArr?.[key]?.isVesting ? (
                    <Button
                      className={
                        buttonType(userTokenClaimArr[key]?.vestings).class
                      } //'disabled'
                      onClick={() => {
                        setCurrentIDO(key);
                        setOpenFirst(true);
                        // claimAvailableVestings(key);
                        setVestingFunc("multiple");
                      }}
                    >
                      {buttonType(userTokenClaimArr?.[key]?.vestings).btnName}
                    </Button>
                  ) : userTokenClaimArr?.[key]?.claimed ? (
                    <Button className="disabled">Claimed!</Button>
                  ) : new Date().getTime() < +pool.timestamp || // divide timestamp by 1000
                    !+userTokenClaimArr?.[key]?.val ? (
                    <Button className="disabled">Unavailable</Button>
                  ) : userTokenClaimArr?.[key].unLock ? (
                    <Button
                      className="disabled"
                      onClick={() => {
                        setCurrentIDO(key);
                        unLockSolana(key);
                      }}
                    >
                      Unlock Tokens
                    </Button>
                  ) : (
                    <Button
                      className="primary"
                      onClick={() => {
                        setCurrentIDO(key);
                        setOpenFirst(true);
                        setVestingFunc(
                          userTokenClaimArr?.key?.isVesting
                            ? "multiple"
                            : "non-merkle"
                        );
                      }}
                    >
                      Claim tokens
                    </Button>
                  )}
                  {/* <Button className="disabled">UNAVAILABLE</Button> */}
                  <strong className="PlusIcon">
                    <i
                      class="fas fa-plus-circle"
                      data-tip="Add this token to your metamask."
                      onClick={() => addTokenToMetamask(key)}
                    >
                      <ReactTooltip />
                    </i>
                  </strong>
                </ClaimCol>
                {pool.vestingType === "merkle" && (
                  <ClaimCol>
                    <DropIcon>
                      <i
                        class="fas fa-caret-down"
                        onClick={() => {
                          setCurrentIDO(key);
                          setOpenVestingModal(openVestingModal ? false : true);
                        }}
                      ></i>
                    </DropIcon>
                  </ClaimCol>
                )}
                {openVestingModal && (
                  <TableDropDown>
                    <table>
                      <thead>
                        <tr>
                          <th>Vesting No.</th>
                          <th>Vesting %</th>
                          <th>Amount</th>
                          <th>State Date</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTokenClaimArr[key]?.vestings?.map((vest, key) => (
                          <tr>
                            <td>{key + 1}</td>
                            <td>{vest.percentage}</td>
                            <td>{(+vest.vestTokens).toFixed(4)}</td>
                            <td>{TimeStampToDateString(vest.startTime)}</td>
                            <td>
                              <button
                                className=""
                                onClick={() => {
                                  setOpenFirst(true);
                                  setSelectedVestingKey(key);
                                  setVestingFunc("singleVest");
                                }}
                              >
                                {userStatusKey(vest.userStatus)}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableDropDown>
                )}
              </ClaimRow>
            );
          })}
          {poolmessage === true ? (
            <div className="IDO-row">
              <div className="search-result">{message}</div>
            </div>
          ) : (
            <b></b>
          )}

          <PageNav>
            <a href="#">
              <i
                class="fas fa-chevron-left"
                onClick={() => managePage(currentPage - 1)}
              ></i>
            </a>
            <a href="#">{currentPage}</a>
            <a href="#">
              <i
                class="fas fa-chevron-right"
                onClick={() => managePage(currentPage + 1)}
              ></i>
            </a>
          </PageNav>
        </ClaimList>
      </Container>
      <div>
        {openFirst && (
          <PopUpMain>
            <PopupBx>
              <CloseBtn
                onClick={() => {
                  setOpenFirst(false);
                  setShowMiniModals(true);
                }}
              >
                <i className="far fa-times-circle"></i>
              </CloseBtn>

              {txnStatus.status === "process" ? (
                <>
                  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <div>
                  <img src={Loader} alt="Loader" width={80} height={80} style={{marginBottom:"38px", }}/>
                  </div>
                  <div>
                  <h4>Claim is in process...</h4>
                  </div>
                  </div>
                </>
              ) : txnStatus?.status === "error" ? (
                <StakeMsg className="failed">
                  <i className="fas fa-check-circle"></i>
                  <h4>Error!</h4>
                  <p>{txnStatus.msg}</p>
                  <Button
                    className="primary full"
                    onClick={() => {
                      setTxnStatus({ status: "false", msg: "" });
                      setOpenFirst(false);
                    }}
                  >
                    Close
                  </Button>
                </StakeMsg>
              ) : (
                <StakeCalc>
                  <h4>Claim</h4>
                  <p>Amount</p>
                  <div className="inputblock">
                    <TextBox
                      type="text"
                      placeholder="Enter amount"
                      defaultValue={
                        openFirst
                          ? vestingFunc === "non-merkle"
                            ? vestingType === "linear"
                              ? userTokenClaimArr[currentIDO].claimable
                              : userTokenClaimArr[currentIDO].val
                            : vestingFunc === "multiple"
                            ? getTotalAmount()
                            : userTokenClaimArr[currentIDO].vestings[
                                selectedVestingKey
                              ].vestTokens
                          : 0
                      }
                      disabled={true}
                    ></TextBox>
                  </div>
                  <Button
                    className="primary full"
                    onClick={() =>
                      vestingFunc === "non-merkle"
                        ? makeTransaction(currentIDO)
                        : vestingFunc === "multiple"
                        ? claimAvailableVestings(currentIDO)
                        : claimParticularVesting(selectedVestingKey)
                    }
                  >
                    CONFIRM
                  </Button>
                </StakeCalc>
              )}
            </PopupBx>
          </PopUpMain>
        )}
      </div>
      <div>
        {openSecond && (
          <PopUpMain>
            <PopupBx>
              <CloseBtn
                onClick={() => {
                  setOpenSecond(false);
                }}
              >
                <i className="far fa-times-circle"></i>
              </CloseBtn>
              <StakeMsg className="completed">
                <i className="fas fa-check-circle"></i>
                <h4>Claim completed!</h4>
                <p>
                  Check your transaction{" "}
                  <a
                    href={`${
                      chains[activeChain]?.scanLink +
                      txnHash +
                      (chains[activeChain]?.clustur
                        ? chains[activeChain]?.clustur
                        : "")
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                </p>
                <Button
                  className="primary full"
                  onClick={() => setOpenSecond(false)}
                >
                  DONE
                </Button>
              </StakeMsg>
            </PopupBx>
          </PopUpMain>
        )}
      </div>
      {showMiniModals ? (
        <>
          {txnStatus.status === "success" ? (
            <PopUpMain>
              <PopupBx>
                <CloseBtn
                  onClick={() => setTxnStatus({ status: "false", msg: "" })}
                >
                  <i className="far fa-times-circle"></i>
                </CloseBtn>
                <StakeMsg className="completed">
                  <i className="fas fa-check-circle"></i>
                  <h4>Success!</h4>
                  <p>{txnStatus.msg}</p>
                </StakeMsg>
              </PopupBx>
            </PopUpMain>
          ) : null}
          {txnStatus.status === "process" ? (
            <div className="process-notification">
              <div className="process-notification-inner">
                <a
                  href="javascript:void(0)"
                  onClick={() => setTxnStatus({ status: "false", msg: "" })}
                >
                  <img className="close-img" src={BlueCIcon} alt="" />
                </a>
                <h3>Processing...</h3>
                <p>
                  Check your transaction{" "}
                  <a
                    href={`https://bscscan.com/tx/${txnHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                </p>
                <img className="loader-img" src={ProcessLoader} alt="" />
              </div>
            </div>
          ) : null}

          {/* {txnStatus?.status === "error" ? (
              <PopUpMain>
                <PopupBx>
                  <StakeMsg className="failed">
                    <i
                      className="fas fa-check-circle"
                      onClick={() => setTxnStatus({ status: "false", msg: "" })}
                    ></i>
                    <h4>Error!</h4>
                    <p>{txnStatus.msg}</p>
                    <Button
                      className="primary full"
                      onClick={() => setTxnStatus({ status: "false", msg: "" })}
                    >
                      Close
                    </Button>
                  </StakeMsg>
                </PopupBx>
              </PopUpMain>
            ) : null} */}
        </>
      ) : null}
    </>
  );
};

const ClaimList = styled.div`
  margin-top: 40px;
  width: 100%;
  display: grid;
  gap: 26px;
  grid-template-columns: 1fr;
  @media (max-width: 991px) {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;
const ClaimRow = styled.div`
  display: flex;
  width: 100%;
  background: rgb(255, 255, 255, 0.1);
  // border-radius: 25px;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to right, rgb(220, 31, 255), rgb(3, 225, 255), rgb(0, 255, 163))  2 / 1 / 0 stretch;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  &.merkle {
    margin-bottom: 370px;
    div {
      .PlusIcon {
        margin-left: 16px;
      }
    }
  }
  .name {
    margin-right: auto;
    max-width: 35%;
    h4 {
      font-size: 2.2rem;
      margin: 0;
      line-height: 1.3;
      max-width: 340px;
    }
    /* .ComLogo {width: 82px; height: 82px;} */
  }
  @media (max-width: 991px) {
    flex-flow: column;
    .name {
      max-width: 100%;
      .ComLogo {
        width: 65px;
        height: 65px;
        flex-shrink: 0;
      }
    }
  }
`;
const ClaimCol = styled.div`
  padding: 0 15px 0 40px;
  &:nth-last-of-type(1) {
    display: flex;
    align-items: center;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.5;
    span {
      width: 100%;
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 5px;
    }
    i {
      margin-left: 10px;
    }
  }
  .PlusIcon {
    font-size: 2.5rem;
    margin-left: 30px;
  }
  &.merkle {
    .PlusIcon {
      margin-left: 16px;
    }
  }
  @media (max-width: 991px) {
    width: 100%;
    padding: 15px 0 0;
    p {
      width: 100%;
      margin-bottom: 0;
      font-size: 1.6rem;
      span {
        display: inline-block;
        width: auto;
        margin-top: 0;
        margin-left: 10px;
        font-size: 1.6rem;
      }
    }
  }
  @media (max-width: 480px) {
    p {
      span {
        display: block;
        margin-left: 0;
      }
    }
  }
`;

const DropIcon = styled.div`
  margin-left: 16px;
  font-size: 2.5rem;
  cursor: pointer;
  margin-right: -16px;
`;
const ClaimTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 30px 0 0;
  h1 {
    font-size: 4.2rem;
  }
  @media (max-width: 768px) {
    flex-flow: column;
    h1 {
      margin-bottom: 30px;
    }
  }
  @media (max-width: 480px) {
    h1 {
      font-size: 3.4rem;
    }
  }
`;
const TabNav = styled.div`
  background: rgb(255, 255, 255, 0.1);
  display: flex;
  border-radius: 17px;
  overflow: hidden;
  margin: 0 0 31px 0;
  a {
    padding: 20px 40px;
    flex-grow: 1;
    text-align: center;
    height: 60px;
    line-height: 20px;
    font-size: 2rem;
    color: var(--text-color);
    font-weight: 600;
    border-radius: 17px;
    &.active {
      // background: var(--text-color);
      background: linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
      color: var(--primary);
    }
  }
  @media (max-width: 1400px) {
    a {
      height: 70px;
      line-height: 34px;
    }
  }
  @media (max-width: 768px) {
    margin: 40px 0 0 0;
    a {
      height: 60px;
      line-height: 20px;
    }
  }
  @media (max-width: 480px) {
    a {
      font-size: 1.7rem;
    }
  }
`;
const Search = styled.div`
  width: 40%;
  position: relative;
  align-self: flex-start;
  color: var(--text-color);
  &:before {
    content: "\f002";
    font-weight: 600;
    font-family: "Font Awesome 5 Free";
    font-size: 2.5rem;
    position: absolute;
    left: 5px;
    bottom: 10px;
  }
  input {
    border: 0;
    border-bottom: 2px solid var(--text-color);
    background: none;
    width: 100%;
    font-size: 2rem;
    padding: 6px 45px;
    color: var(--text-color);
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const CheckBox = styled.div`
  position: relative;
  margin: 15px 0 0 0;
  input {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 0;
  }
  label {
    font-size: 1.8rem;
    font-weight: 400;
    cursor: pointer;
    user-select: none;
    display: flex;
    &:before {
      content: "\f0c8";
      font-family: "Font Awesome 5 Free";
      font-size: 2.5rem;
      display: inline-block;
      vertical-align: top;
      margin: -5px 10px 0 0;
    }
  }
  input:checked + label:before {
    content: "\f14a";
    font-weight: 600;
  }
`;
const PageNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  @media (max-width: 991px) {
    grid-column: 1 / span 2;
  }
  @media (max-width: 640px) {
    grid-column: 1 / span 1;
  }
  a {
    color: var(--text-color);
    font-weight: 600;
    margin: 0 10px;
  }
`;
const TableDropDown = styled.article`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 10px);
  height: 360px;
  background: rgb(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 30px 30px;
  overflow: auto;
  table {
    width: 100%;
    position: relative;
    tr {
      th {
        border: 1px solid rgb(255, 255, 255, 0.1);
        text-align: center;
        padding: 16px 10px;
      }
      td {
        border: 1px solid rgb(255, 255, 255, 0.1);
        text-align: center;
        padding: 16px 10px;
      }
    }
  }
`;

export default Claims;
