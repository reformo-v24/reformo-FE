import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import errorfortoast from "../assets/errorfortoast.png"
import Failedfortoast from "../assets/Failedfortoast.png";
import successfortoast from "../assets/successfortoast.png"
import {
  Button,
  Container,
  NameBlock,
  ProgressSec,
  ProgressBar,
  SquareBtns,
  TableLayout,
  Loading,
} from "../theme/main.styled";
import ReactHtmlParser from "react-html-parser";
// import { web3 } from "../../redux/actions/metamaskAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Modal from "@material-ui/core/Modal";
import { onboard } from "../web3Onboard";
import { FundsContractAbi } from "./abis";
import { connect } from "react-redux";
import BusdIDOabi from "./busdIDO.json";
import tokenABI from "./tokenABI.json";
import igoLaunchpadABI from "./../helpers/igoLaunchpadABI.json";
import { actions } from "./../actions";
import { TimeStampToDateString } from "../helpers/function";
import Loader from "../assets/loader.gif"
import {
  CloseBtn,
  PopupBx,
  PopUpMain,
  StakeCalc,
  StakeMsg,
  TextBox,
} from "../component/Modal/StakingModal";

import {web3} from "../web3"

let nIntervId = null;
let blockIntervId = null;
let resultBarIntervId = null;

const PoolDetails = (props) => {
  const { getSinglePoolDetail, singlePoolDetail, web3Data } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // use state hooks to set and get values.
  // const [singlePoolDetail?, setPool_detail] = useState("");
  const [number1, setNumber1] = useState();
  const [number2, setNumber2] = useState();
  const [amount, setAmount] = useState();
  const [whichtier, setwhichtier] = useState(0);
  const [txloader, settxloader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [minvalueone, setMinValueOne] = useState();
  const [minvaluetwo, setMinValueTwo] = useState();
  const [minvaluethree, setMinValueThree] = useState();
  const [minvaluefour, setMinValueFour] = useState();
  const [minvaluefive, setMinValueFive] = useState();
  const [minvaluesix, setMinValueSix] = useState();
  const [minvalueseven, setMinValueSeven] = useState();
  const [minvalueeight, setMinValueEight] = useState();
  const [minvaluenine, setMinValueNine] = useState();
  const [tokenAllowance, setTokenAllowance] = useState(0);
  const [userBalance, setUserBalance] = useState();
  const [totalTokenSupply, setTotalTokenSupply] = useState("");
  const [tierMaxLimit, setTierMaxLimit] = useState("");
  const [userdetails, setUserDetails] = useState({});
  const [totalPoolRaise, setTotalPoolRaise] = useState();
  const [startTime, setStartTime] = useState("");
  const [startTimeMobile, setStartTimeMobile] = useState("");
  const [phaseID, setPhaseID] = useState(0);
  const [contractAddr, setContractAddr] = useState();
  //var checkvalid = 0;
  const id = useParams().id;
  const name = useParams().name;
  var y = 0;
  if (name === "upcomming") {
    y = 1;
  }

  async function timeloop() {
    if (nIntervId) {
      await clearInterval(nIntervId);
      nIntervId = await null;
    }
    if (blockIntervId) {
      await clearInterval(blockIntervId);
      blockIntervId = await null;
    }
    if (resultBarIntervId) {
      await clearInterval(resultBarIntervId);
      resultBarIntervId = await null;
    }
    await timeCounter();
  }
  
  const fetchIGODetails = async () => {
    await setLoader(true);
    await getSinglePoolDetail(id);
    timeCounter();
  };
  useEffect(() => {
    fetchIGODetails();
  }, [id]);
  useEffect(() => {
    const changeContractAddress = async () => {
      if (singlePoolDetail?.phases[phaseID].phaseContractAddress) {
        // contractAddr = web3.utils.toChecksumAddress(singlePoolDetail?.address);
        await timeloop();
        await setContractAddr(
          singlePoolDetail?.phases[phaseID].phaseContractAddress
        );
      }
    };
    changeContractAddress();
  }, [singlePoolDetail, phaseID]);

  useEffect(() => {
    //Consuming smart contract ABI and contract address.

    async function simpleContract() {
      try {
        if (contractAddr) {
          const SimpleContract = new web3.eth.Contract(
            singlePoolDetail?.isPaymentTokenNative
              ? BusdIDOabi
              : igoLaunchpadABI,
            contractAddr
          );
          //Getting total bnb from blockchain
          let totalTokenFxn = !singlePoolDetail?.isPaymentTokenNative
            ? "totalBUSDReceivedInAllTier"
            : "totalBnbReceivedInAllTier";

          const result = await SimpleContract.methods[totalTokenFxn]().call();
          //Getting max cap from blockchain
        
          await setTotalPoolRaise(+web3.utils.fromWei(result));
        }
      } catch (err) {
        console.error("Error occured while simpleContract fatch data",err);
      }
    }
    if (!blockIntervId) {
      blockIntervId = setInterval(() => {
        simpleContract();
      }, 1000);
    }
  }, [contractAddr]);

  useEffect(() => {
    const getUserDetails = async () => {
      try{ 
      let _userDetails = {};
      const igoContractInstance = new web3.eth.Contract(
        igoLaunchpadABI,
        contractAddr
      );
      const usertierDetails = await igoContractInstance.methods
        .userDetails(web3Data.address)
        .call();
      _userDetails.tier = usertierDetails.tier;
      _userDetails.investedAmount = usertierDetails.investedAmount;
      // Get balance of connected address.
      // if (web3 && web3Data?.address) {
      _userDetails.balance = await web3.eth.getBalance(web3Data?.address);
      if (!singlePoolDetail?.isPaymentTokenNative && web3Data?.address) {
        const tokenContractInstance = new web3.eth.Contract(
          tokenABI,
          web3.utils.toChecksumAddress(singlePoolDetail.paymentTokenAddress)
        );
        _userDetails.allowance = web3.utils.fromWei(
          await tokenContractInstance.methods
            .allowance(web3Data?.address, contractAddr)
            .call()
        );

        _userDetails.totalSupply = web3.utils.fromWei(
          await tokenContractInstance.methods.totalSupply().call()
        );

        _userDetails.balance = await tokenContractInstance.methods
          .balanceOf(web3Data?.address)
          .call();
      }
      setTokenAllowance(_userDetails.allowance);
      setUserDetails(_userDetails);
    } catch (error) {
      console.error("Error occurred while getUserDetails for pool:", error);
    }
    };
    if (web3Data.address && contractAddr) getUserDetails();
    settxloader(false);
    // timeCounter();
  }, [web3Data, contractAddr, tokenAllowance]);
  
  useEffect(() => {
    if (!resultBarIntervId) {
      resultBarIntervId = setInterval(async function () {
        //Consuming smart contract ABI and contract address.
        if (contractAddr) {
          try {
            const SimpleContract = new web3.eth.Contract(
              singlePoolDetail?.isPaymentTokenNative
                ? BusdIDOabi
                : igoLaunchpadABI,
              contractAddr
            );
            //Getting total bnb from blockchain
            let totalTokenFxn = !singlePoolDetail?.isPaymentTokenNative
              ? "totalBUSDReceivedInAllTier"
              : "totalBnbReceivedInAllTier";

            const result = await SimpleContract?.methods[
              totalTokenFxn
            ]().call();
            //Getting max cap from blockchain
            const total = await SimpleContract?.methods.maxCap().call();

            setNumber2(result / 10 ** 18);
            await setNumber1((result / 10 ** 18 / (total / 10 ** 18)) * 100);
            await setLoader(false);
          } catch (error) {
            console.error("Error occurred in SimpleContract:", error);
            // Optionally, handle the error or log additional information
          }
        }
      }, 1000);
    }
  }, [contractAddr, singlePoolDetail?.isPaymentTokenNative]);


  const transactionMetamask = async () => {
    try {
      // use web3 function to convert to wei , removing 10**18 multiplier
      const avalue = web3.utils.toWei(amount.toString());

      const provider = window.provider;
      const chainid = "0x61";

      //check for BSC Mainnet
      if (
        chainid === "0x38" ||
        chainid === 56 ||
        chainid === "0x61" ||
        chainid === 97
      ) {
        if (+userBalance < +avalue) {
          return toast.info(
            `Not enough ${singlePoolDetail?.paymentTokenSymbol} balance`,
            { style: {background:"#FFFFFF", color:"black"},icon:<img src={errorfortoast} /> }
          );
          
        }
        // const address = window.addressselected;
        const address = provider[0].accounts[0];
        console.log("address", address);
        //loader start before getting data.
        // toast.info("Transaction in progress...",  { style: {background:"#FFFFFF", color:"black"},icon:<img src={errorfortoast} /> , position: toast.POSITION.TOP_CENTER });
        if (!singlePoolDetail?.isPaymentTokenNative) {
          settxloader(true);
          // let newWeb3 = new Web3(provider);
          const igoContractInstance = new web3.eth.Contract(
            !singlePoolDetail?.isPaymentTokenNative
              ? igoLaunchpadABI
              : FundsContractAbi,
            contractAddr
          );

          await igoContractInstance.methods
            .buyTokens(avalue)
            .send({ from: web3Data?.address })
            .on("transactionHash", (hash) => {})
            .on("receipt", (receipt) => {
              onReciept(receipt);
            })
            .on("error", (error) => {
              onError(error);
              setOpen(false);
            });
        } else {
          const txstatus = await web3.eth.sendTransaction({
            to: singlePoolDetail?.paymentTokenAddress,
            from: address,
            value: avalue,
          });
          if (txstatus.status) {
            // loader stop after getting data.
            onReciept(txstatus);
          } else {
            onError();
            setOpen(false);
          }
        }
      } else {
        //Clearing cache to get web3Data? connection pop up.
        // await web3Modal.clearCachedProvider();
        const [primaryWallet] = onboard.state.get().wallets;
        await onboard.disconnectWallet({ label: primaryWallet.label });
        console.log("Wallet disconnected");

        toast.info("Please switch to Binance Smart Chain", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      settxloader(false);
      setOpen(false);
      return {
        connectedStatus: false,
        status: toast.error("Transaction reverted, try again.",{ style: {background:"#FFFFFF", color:"black"},icon:<img src={Failedfortoast} />, position: toast.POSITION.TOP_CENTER  }),
      };
    }
  };

  const onReciept = (txstatus) => {
    settxloader(false);
    var hash = `https://bscscan.com/tx/${txstatus.transactionHash}`;
    var label = "View your transaction";
    setOpen(false);
    toast.success( "Transaction confirmed!",{ style: {background:"#FFFFFF", color:"black"},icon:<img src={successfortoast} />, position: toast.POSITION.TOP_CENTER  });
    // toast.info(msg,{ style: {background:"#FFFFFF", color:"black"},icon:<img src={errorfortoast} /> })
  };
  const onError = () => {
    settxloader(false);
    setOpen(false);
    // return toast.error("Transaction Failed!",{ style: {background:"#FFFFFF", color:"black",},icon:<img src={Failedfortoast} />});
  };
  
  function popup(error, msg, timer){
    const toastOptions = {
      style: { background:"#FFFFFF", color:"black" },
      position: toast.POSITION.TOP_CENTER,
      icon: <img src={error === "error" ? Failedfortoast : (error === "success" ? successfortoast : errorfortoast)} />
    };

    if (error === "process") {
      toast.info(msg, toastOptions);
    } else if (error === "success") {
      toast.success(msg, toastOptions);
    } else if (error === "error") {
      toast.error(msg, toastOptions);
    } else {
      console.error("Unknown error type:", error);
    }
  }
  const checktierswhitelist = async () => {
    let tier_value = +userdetails.tier;
    if (!web3Data?.address) {
      return toast.info("Your wallet is not connected!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    //Switch cases according to tiers.
    // if (tier_value.tier > 0) {
    switch (tier_value) {
      case 1:
        setwhichtier(1);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[0]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[0]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[0]);
        setOpen(true);

        break;
      case 2:
        setwhichtier(2);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[1]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[1]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[1]);
        setOpen(true);
        break;
      case 3:
        setwhichtier(3);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[2]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[2]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[2]);
        setOpen(true);
        break;
      case 4:
        setwhichtier(4);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[3]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[3]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[3]);
        setOpen(true);
        break;
      case 5:
        setwhichtier(5);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[4]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[4]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[4]);
        setOpen(true);
        break;
      case 6:
        setwhichtier(6);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[5]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[5]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[5]);
        setOpen(true);
        break;
      case 7:
        setwhichtier(7);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[6]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[6]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[6]);
        setOpen(true);
        break;
      case 8:
        setwhichtier(8);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[7]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[7]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[7]);
        setOpen(true);
        break;
      case 9:
        setwhichtier(9);
        setTierMaxLimit(singlePoolDetail?.phases[phaseID].maxTierCap[8]);
        setAmount(singlePoolDetail?.phases[phaseID].maxUserCap[8]);
        setMinValueOne(singlePoolDetail?.phases[phaseID].minUserCap[8]);
        setOpen(true);
        break;
      default:
        return popup(
          "success",
          "This wallet is not KYC verified for any of tiers",
          true
        );
    }
    // } else {
    // 	return toast.info('Address does not match!', { position: toast.POSITION.TOP_CENTER })
    // }
  };

  if (Number(singlePoolDetail?.phases[phaseID]?.start_date)) {
    var closed = 0;
    var closesIn = 0;
    var startIn = 0;
    var filled = 0;
    var date = new Date();
    var now_utc =
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      ) / 1000;

    var start = Number(singlePoolDetail?.phases[phaseID]?.start_date);
    var end = Number(singlePoolDetail?.phases[phaseID]?.end_date);
    // console.log("start", start, "end", end, "now_utc", now_utc);
    if (number1 > "99.98") {
      startIn = 0;
      closesIn = 0;
      closed = 0;
      filled = 1;
      y = 1;
    } else if (end < now_utc) {
      closed = 1;
      y = 1;
    } else if (now_utc < start) {
      startIn = 1;
      y = 1;
    } else if (end >= now_utc && now_utc >= start) {
      closesIn = 1;
      y = 0;
    } else {
      startIn = 0;
      closesIn = 0;
      y = 1;
    }
  }

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const body = () => {
    // if (
    //   !singlePoolDetail?.isPaymentTokenNative &&
    //   +userdetails?.allowance == 0
    // ) {
    return (
      //   <div className="paper">
      <PopUpMain>
        <PopupBx>
          <CloseBtn onClick={handleClose}>
            <i className="far fa-times-circle"></i>
          </CloseBtn>
          
          {txloader && <>
                  <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <div>
                  <img src={Loader} alt="Loader" width={80} height={80} style={{marginBottom:"38px", }}/>
                  </div>
                  <div>
                  <h4>Transaction is in process...</h4>
                  </div>
                  </div>
                </> }
          {!txloader && (
            <div>
              {!singlePoolDetail?.isPaymentTokenNative &&
              +userdetails?.allowance == 0 &&
              tokenAllowance == 0 ? (
                <StakeMsg>
                  <h4>Approve Token!</h4>
                  <Button
                    className="primary full"
                    onClick={async () => approveTokens()}
                  >
                    Approve
                  </Button>
                </StakeMsg>
              ) : (
                <StakeCalc>
                  <h4>Buy Token</h4>
                  <p>Enter amount in {singlePoolDetail?.paymentTokenSymbol}</p>
                  <div className="inputblock">
                    <TextBox
                      type="number"
                      min="0"
                      name="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter Amount"
                    ></TextBox>
                  </div>
                  <Button
                    className="primary full"
                    onClick={async () => transactionMetamask()}
                  >
                    CONFIRM
                  </Button>
                </StakeCalc>
              )}
              
            </div>
          )}
        </PopupBx>
      </PopUpMain>
    );
    
  };
  const approveTokens = async () => {
    // let newWeb3 = new Web3(window.provider);
    const tokenContractInstance = new web3.eth.Contract(
      tokenABI,
      web3.utils.toChecksumAddress(singlePoolDetail.paymentTokenAddress)
    );
    // const { web3Data } = this.state;
    settxloader(true);
    await tokenContractInstance.methods
      .approve(
        contractAddr,
        web3.utils.toWei(userdetails.totalSupply).toString()
      )
      .send({ from: web3Data?.address })
      .on("transactionHash", (hash) => {
        // onTransactionHash(hash);
        console.log(hash);
      })
      .on("receipt", (receipt) => {
        setTokenAllowance(1);
        setOpen(open);
      })
      .on("error", (error) => {
        onError(error);
        setOpen(false);
      });
  };

  const timeCounter = () => {
    if (!nIntervId) {
      nIntervId = setInterval(function () {
        var date = new Date();
        var now_utc =
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
          ) / 1000;

        var closes_in_days = "";
        var closes_in_hours = "";
        var closes_in_minutes = "";
        var closes_seconds = "";
        var desktopTimer = "";
        var mobileTimer = "";
        var closes_in_sec = "";
        if (Number(singlePoolDetail?.phases[phaseID]?.start_date) && startIn) {
          var start = Number(singlePoolDetail?.phases[phaseID]?.start_date);
          closes_in_sec = start - now_utc;

          closes_in_days = Math.floor(closes_in_sec / (3600 * 24));

          closes_in_sec -= closes_in_days * 86400;

          closes_in_hours = Math.floor(closes_in_sec / 3600) % 24;
          closes_in_sec -= closes_in_hours * 3600;

          closes_in_minutes = Math.floor(closes_in_sec / 60) % 60;
          closes_in_sec -= closes_in_minutes * 60;

          closes_seconds = Math.floor(closes_in_sec % 60);
          // console.log("start", start, "now_utc", now_utc);
          desktopTimer = `${
            Number(closes_in_days) > 0 ? closes_in_days : 0
          } days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_seconds} seconds`;
          mobileTimer = `${
            Number(closes_in_days) > 0 ? closes_in_days : 0
          } d: ${closes_in_hours} h: ${closes_in_minutes} m: ${closes_seconds} s`;

          if (
            closes_in_days === 0 &&
            closes_in_hours === 0 &&
            closes_in_minutes === 0 &&
            closes_seconds === 2
          ) {
            window.location.reload();
          }
          setStartTime(desktopTimer);
          setStartTimeMobile(mobileTimer);
        }

        if (Number(singlePoolDetail?.phases[phaseID]?.end_date) && closesIn) {
          var end = Number(singlePoolDetail?.phases[phaseID]?.end_date);
          closes_in_sec = end - now_utc;

          closes_in_days = Math.floor(closes_in_sec / (3600 * 24));

          closes_in_sec -= closes_in_days * 86400;

          closes_in_hours = Math.floor(closes_in_sec / 3600) % 24;
          closes_in_sec -= closes_in_hours * 3600;

          closes_in_minutes = Math.floor(closes_in_sec / 60) % 60;
          closes_in_sec -= closes_in_minutes * 60;

          closes_seconds = Math.floor(closes_in_sec % 60);

          desktopTimer = `${
            Number(closes_in_days) > 0 ? closes_in_days : 0
          } days: ${closes_in_hours} hours: ${closes_in_minutes} minutes: ${closes_seconds} seconds`;
          mobileTimer = `${
            Number(closes_in_days) > 0 ? closes_in_days : 0
          }d: ${closes_in_hours}h: ${closes_in_minutes}m: ${closes_seconds}s`;
          if (
            closes_in_days === 0 &&
            closes_in_hours === 0 &&
            closes_in_minutes === 0 &&
            closes_seconds === 2
          ) {
            window.location.reload();
          }
          setStartTime(desktopTimer);
          setStartTimeMobile(mobileTimer);
        }
      }, 1000);
    }
  };
  var allocation = totalPoolRaise * singlePoolDetail?.up_pool_raise;
  var num = Math.ceil(
    (totalPoolRaise / singlePoolDetail?.targetPoolRaise) * 100
  );
  var full = "";
  if (num === 50) {
    full = "fullupload";
  }
  var distributedDate = TimeStampToDateString(
    singlePoolDetail?.tokenDistributionDate
  );
  return (
    <>
      <Container>
        <PoolInfo>
          <PoolInfoLeft>
            <NameBlock className="lg">
              <div
                className="ComLogo"
                style={{
                  backgroundImage: `url(${singlePoolDetail?.imageURL})`,
                }}
              />
              <div>
                <h4>{singlePoolDetail?.igoName}</h4>
              </div>
            </NameBlock>
            <p>{singlePoolDetail?.content}</p>
            <SquareBtns>
              {singlePoolDetail?.socialLinks.twitter ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.twitter}`)
                  }
                >
                  <i className="fab fa-twitter"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.telegram ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.telegram}`)
                  }
                >
                  <i className="fab fa-telegram-plane"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.discord ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.discord}`)
                  }
                >
                  <i className="fab fa-discord"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.browser_web ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.browser_web}`)
                  }
                >
                  <i className="fas fa-globe"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.youtube ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.youtube}`)
                  }
                >
                  <i className="fab fa-youtube"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.facebook ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.facebook}`)
                  }
                >
                  <i className="fab fa-facebook"></i>
                </Link>
              ) : (
                ""
              )}
              {singlePoolDetail?.socialLinks.instagram ? (
                <Link
                  onClick={() =>
                    window.open(`${singlePoolDetail?.socialLinks.instagram}`)
                  }
                >
                  <i className="fab fa-instagram"></i>
                </Link>
              ) : (
                ""
              )}
            </SquareBtns>
          </PoolInfoLeft>
          <PoolInfoRight>
            <PoolCard>
              <TabNav>
                {singlePoolDetail?.phases.length &&
                  singlePoolDetail?.phases.map((singlePhase, key) => (
                    <Link
                      key={key}
                      className={`${phaseID == key ? "active" : ""}`}
                      //   className={`tabs ${getActiveClass(1, "active")}`}
                      onClick={async () => {
                        if (resultBarIntervId)
                          await clearInterval(resultBarIntervId);
                        resultBarIntervId = await null;
                        setPhaseID(key);
                      }}
                      to="#"
                    >
                      Phase {key + 1}
                    </Link>
                  ))}
              </TabNav>
              {loader && <Loading />}
              {!loader && (
                <div className="poolBottom">
                  <PhaseLayout>
                    <div className="phaseCol">
                      <h1>{singlePoolDetail?.paymentTokenSymbol} Coin</h1>
                      <span>
                        1 {singlePoolDetail?.paymentTokenSymbol} ={" "}
                        {singlePoolDetail?.price}{" "}
                        {singlePoolDetail?.igoTokenSymbol}
                      </span>
                    </div>
                  </PhaseLayout>

                  <label>
                    Total Raise :{" "}
                    <span>
                      {totalPoolRaise ? totalPoolRaise.toFixed(4) : "0"}{" "}
                      {singlePoolDetail?.paymentTokenSymbol}
                      {/* <sub>Filled</sub> */}
                    </span>
                  </label>
                  <label>
                    {startIn ? <p>Start in</p> : ""}
                    {startIn === 1 ? <h3>{startTime}</h3> : ""}
                    {closesIn ? <p>Ends in</p> : ""}
                    {closesIn === 1 ? <h3>{startTime}</h3> : ""}
                    {closed ? <p>Status</p> : ""}
                    {closed ? <h3>Closed</h3> : ""}
                    {filled ? <h3>Filled</h3> : ""}
                  </label>
                  <ProgressSec>
                    <p>Max Participants : Limited</p>
                    <strong>
                      {totalPoolRaise
                        ? (totalPoolRaise * singlePoolDetail?.price).toFixed(2)
                        : "0"}
                      /
                      {singlePoolDetail?.targetPoolRaise *
                        singlePoolDetail?.price}{" "}
                      {/* {singlePoolDetail?.total_supply?.$numberDecimal}{" "} */}
                      {singlePoolDetail?.igoTokenSymbol}{" "}
                      <span>
                        {totalPoolRaise
                          ? (
                              (totalPoolRaise /
                                singlePoolDetail.targetPoolRaise) *
                              100
                            ).toFixed(2)
                          : "0"}{" "}
                        %
                      </span>
                    </strong>
                    <ProgressBar>
                      <div
                        style={{
                          width: `${
                            totalPoolRaise
                              ? (
                                  (totalPoolRaise /
                                    singlePoolDetail.targetPoolRaise) *
                                  100
                                ).toFixed(2)
                              : "0"
                          }%`,
                        }}
                      />
                    </ProgressBar>
                  </ProgressSec>
                  {y ? (
                    ""
                  ) : (
                    <Button
                      style={{ marginTop: "20px" }}
                      className="primary full no-shadow"
                      onClick={() => checktierswhitelist()}
                    >
                      Buy Tokens
                    </Button>
                  )}
                </div>
              )}
            </PoolCard>
          </PoolInfoRight>
        </PoolInfo>

        <Information className="flex">
          <div>
            <h2>Pool Information</h2>
            <StakingCard>
              <TableLayout className="poolBottom">
                <label>
                  TOKEN DISTRIBUTION <span>{distributedDate}</span>
                </label>
                {singlePoolDetail?.phases[phaseID] && (
                  <label>
                    MIN. ALLOCATION{" "}
                    <span>
                      {singlePoolDetail.phases[phaseID].minUserAllocation
                        ? singlePoolDetail.phases[phaseID].minUserAllocation +
                          " " +
                          singlePoolDetail.paymentTokenSymbol
                        : "TBA"}
                    </span>
                  </label>
                )}
                {singlePoolDetail?.phases[phaseID] && (
                <label>
                  MAX. ALLOCATION{" "}
                  <span>
                    {singlePoolDetail?.phases[phaseID].maxUserAllocation
                      ? singlePoolDetail?.phases[phaseID].maxUserAllocation +
                        " " +
                        singlePoolDetail?.paymentTokenSymbol
                      : "TBA"}
                  </span>
                </label>
                )}
                <label>
                  TOKEN PRICE{" "}
                  <span>
                    {singlePoolDetail?.price
                      ? `1 ${singlePoolDetail?.paymentTokenSymbol} = ` +
                        singlePoolDetail?.price +
                        " " +
                        singlePoolDetail?.igoTokenSymbol
                      : "TBA"}{" "}
                  </span>
                </label>
                <label>
                  ACCESS TYPE <span>{singlePoolDetail?.accessType}</span>
                </label>
              </TableLayout>
            </StakingCard>
          </div>

          <div>
            <h2>Token Information</h2>
            <StakingCard>
              <TableLayout className="poolBottom">
                <label>
                  NAME <span>{singlePoolDetail?.igoName}</span>
                </label>
                <label>
                  SYMBOL <span>{singlePoolDetail?.igoTokenSymbol}</span>
                </label>
                <label>
                  DECIMALS <span>{singlePoolDetail?.igoTokenDecimal}</span>
                </label>
                <label>
                  ADDRESS <span>{singlePoolDetail?.igoTokenAddress}</span>
                </label>
                <label>
                  TOTAL SUPPLY{" "}
                  <span>
                    {singlePoolDetail?.phases[phaseID].igoTokenSupply}
                  </span>
                </label>
              </TableLayout>
            </StakingCard>
          </div>
        </Information>
        <AboutProject>
          <h2>About the Project</h2>
          {ReactHtmlParser(singlePoolDetail?.igoDescription)}
        </AboutProject>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body()}
      </Modal>
    </>
  );
};
const PhaseLayout = styled.div`
  .phaseCol {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    font-size: 1.7rem;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 0 11px;
    font-weight: 600;
    h1 {
      font-size: 3.7rem;
    }
    span {
      align-self: center;
      font-weight: normal;
    }
    .primary {
      margin-top: 18px;
    }
    &:last-child {
      border-bottom: 0px;
    }
  }
  @media (max-width: 480px) {
    label {
      font-size: 1.6rem;
      align-items: center;
      &:last-child {
        span {
          margin-top: 10px;
        }
      }
    }
  }
`;
const PoolInfo = styled.div`
  display: flex;
  margin-top: 30px;
  width: 100%;
  @media (max-width: 991px) {
    flex-flow: column;
  }
`;
const PoolInfoLeft = styled.div`
  padding-right: 30px;
  width: 60%;
  @media (max-width: 991px) {
    width: 100%;
    padding-right: 0;
  }
  div.lg {
    margin-bottom: 20px;
    h4 {
      font-size: 3rem;
      font-weight: 600;
      margin: 0;
    }
  }
  p {
    ${"" /* width: 100%; */}
    font-size: 2.2rem;
    line-height: 1.8;
    margin-bottom: 30px;
  }
`;
const PoolInfoRight = styled.div`
  padding-left: 30px;
  width: 40%;
  margin-left: auto;
  @media (max-width: 1200px) {
    width: 50%;
  }
  @media (max-width: 991px) {
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    margin-top: 30px;
  }
`;
const PoolCard = styled.div`
  // background: rgba(255, 255, 255, 0.1);

  background: #151517;
  // border-radius: 10px;
  position: relative;
  /*The background extends to the outside edge of the padding. No background is drawn beneath the border.*/
  background-clip: padding-box;
  border: solid 1px transparent;
  border-radius: 0.8rem;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -3px; /* same as border width */
    border-radius: inherit; /* inherit container box's radius */
    background: linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  }

  // border-radius: 26px;
  display: table;
  margin-left: auto;
  width: 100%;
  .poolBottom {
    padding: 26px 20px 20px;
    label {
      display: flex;
      flex-flow: column;
      font-size: 1.8rem;
      margin-bottom: 16px;
      span {
        font-size: 3rem;
        margin-top: 10px;
        font-weight: 600;
      }
    }
  }
  @media (max-width: 768px) {
    .poolBottom {
      label {
        font-size: 1.5rem;
      }
    }
  }
`;
const TabNav = styled.div`
  // background: rgb(255, 255, 255, 0.1);
  background : linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  backdrop-filter: blur(3px);
  display: flex;
  border-radius: 17px;
  overflow: hidden;
  margin: 30px 20px 10px 20px;
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
      background: var(--text-color);
      // color: var(--primary);
      color: #000;
    }
  }
  @media (max-width: 1400px) {
    /* a {height: 70px; line-height: 34px;} */
  }

  @media (max-width: 768px) {
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
const Information = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 80px 0 0;
  position: relative;
  h2 {
    margin: 0 0 20px;
  }
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    right: 50%;
    // background: #1d143c;
    opacity:0.2;
    background: rgba(251, 174, 72, 0.6);
    width: 200px;
    height: 200px;
    box-shadow: 160px 0px 0 #4b202e;
    border-radius: 100%;
    transform: translate(0%, 0%) scale(4);
    filter: blur(50px);
    z-index: -1;
  }
  & > div {
    max-width: calc(50% - 15px);
  }
  @media (max-width: 991px) {
    flex-flow: column;
    & > div {
      width: 100%;
      max-width: 100%;
      margin-bottom: 50px;
    }
  }
`;
const StakingCard = styled.div`
  width: 600px;
  max-width: 100%; /* min-height: 620px; */
  // background: rgb(255, 255, 255, 0.1);
  // border-radius: 30px;

  background: #151517;
  // border-radius: 10px;
  position: relative;
  /*The background extends to the outside edge of the padding. No background is drawn beneath the border.*/
  background-clip: padding-box;
  border: solid 1px transparent;
  border-radius: 0.8rem;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -3px; /* same as border width */
    border-radius: inherit; /* inherit container box's radius */
    background: linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  }



  padding: 30px;
  button {
    margin-top: 30px;
    padding: 20px 30px 20px;
  }
  & > div {
    position: relative;
    z-index: 2;
  }
  @media (max-width: 991px) {
    width: 100%;
  }
  @media (max-width: 640px) {
    padding: 20px;
    button {
      padding: 13px 30px 11px;
    }
  }
  @media (max-width: 480px) {
  }
`;
const AboutProject = styled.div`
  margin: 80px auto 0;
  width: 1000px;
  max-width: 100%;
  h2 {
    font-size: 3.5rem;
    margin: 0 0 10px;
    opacity: 0.8;
  }
  h4 {
    font-size: 2.2rem;
    margin: 0 0 10px;
    opacity: 0.8;
  }
  p {
    font-size: 1.8rem;
    margin: 0 0 35px;
    opacity: 0.8;
    line-height: 1.6;
  }
  @media (max-width: 991px) {
    margin: 40px auto 0;
  }
`;
const mapDipatchToProps = (dispatch) => {
  return {
    getSinglePoolDetail: (id) => dispatch(actions.getSinglePoolDetail(id)),
    getUpcomingIGOPools: () => dispatch(actions.getUpcomingIGOPools()),
  };
};

const mapStateToProps = (state) => {
  return {
    singlePoolDetail: state.singlePoolDetail,
    upcomingIGOPools: state.upcomingIGOPools,
    web3Data: state.web3Data,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(PoolDetails);
