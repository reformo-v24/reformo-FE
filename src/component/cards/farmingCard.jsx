/* eslint-disable babel/no-unused-expressions */
/* eslint-disable no-inner-declarations */
import React, { PureComponent, Component, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Container,
  ExchangeBar,
  ProgressBar,
  Loading,
} from "../../theme/main.styled";
import { Link } from "react-router-dom";
import icon1 from "../../assets/images/icon1.png";
import icon2 from "../../assets/images/icon2.png";
import down from "../../assets/images/caret-down-solid.svg";
import { connect } from "react-redux";
import errorfortoast from "../../assets/errorfortoast.png"
import successfortoast from "../../assets/successfortoast.png"
import Failedfortoast from "../../assets/Failedfortoast.png"
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CompleteIcon from "../../assets/complete.png";
import ErrorIcon from "../../assets/error.png";
import GreenCIcon from "../../assets/green-close.png";
import RedCIcon from "../../assets/red-close.png";
import BlueCIcon from "../../assets/close-vector.png";
import ProcessLoader from "../../assets/processing-loader.gif";
import { web3Services } from "../../services/web3.service";
import getContractAddresses from "../../contractData/contractAddress/addresses";
import { FaCalculator, FaChevronDown } from "react-icons/fa";
import HexagonLoader from "../../assets/loader.gif";
import Timer from "../timer";
import { GoAlert } from "react-icons/go";
import ReactTooltip from "react-tooltip";
import Collapse from "@kunukn/react-collapse";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { web3 } from "../../web3";

// const { web3 } = web3Services;

const closeIcon = (
  <svg fill="currentColor" viewBox="0 0 30 30" width={40} height={40}>
    <line
      x1="15"
      y1="15"
      x2="25"
      y2="25"
      stroke="#7BF5FB"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"
    ></line>
    <line
      x1="25"
      y1="15"
      x2="15"
      y2="25"
      stroke="#7BF5FB"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"
    ></line>
  </svg>
);

const closeIconRed = (
  <svg fill="currentColor" viewBox="0 0 30 30" width={40} height={40}>
    <line
      x1="15"
      y1="15"
      x2="25"
      y2="25"
      stroke="#FB7B7B"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"
    ></line>
    <line
      x1="25"
      y1="15"
      x2="15"
      y2="25"
      stroke="#FB7B7B"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"
    ></line>
  </svg>
);
class Farming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      isOpen2: false,
      web3Data: {
        isLoggedIn: false,
        accounts: [],
      },
      contractTimes: {},
      totalSupply: null,
      rate: null,
      lockDuration: null,
      rewardsAtMaturity: null,
      deposits: null,
      allowance: null,
      amount: { index: false, value: "" },
      activeContract: 7,
      userBalance: 0,
      txnStatus: { status: "false", msg: "" },
      error: { index: false, msg: "" },
      networkId: 97,
      poolDetails: null,
      userPoolDetails: null,
      poolContracts: [],
      openFirst: false,
      openFifth: false,
      txnCompleteModal: false,
      stakeFailedModal: false,
      currentFunction: "stake",
      txnHash: "",
      testamt: {},
      showMiniModals: true,
      timeLeft: -1,
      bnbUSDPrice: 0,
      currentSwap: "bakerySwap",
      mainLoader: false,
      APY: "-",
      poolsDropdown: false,
    };
  }

  static async getDerivedStateFromProps(nextProps, prevState) {
    let { web3Data } = nextProps;
    if (web3Data !== prevState.web3Data) return { web3Data: web3Data };
    else return null;
  }

  async componentDidUpdate(prevProps, prevState) {
    let { web3Data, currentSwap } = this.props;
    if (this.state.amount !== prevState.amount) {
      this.props.setFarming({
        ...this.props.farming,
        amount: this.state.amount,
        // open: false,
      });
    }
    if (currentSwap !== prevProps.currentSwap) {
      this.setState({ timeLeft: -1 });
      if (web3Data?.isLoggedIn) this.callUserData(web3Data);
      this.callContractMethods();
    }
    const { poolDetails, userPoolDetails, timeLeft } = this.state;
    if (web3Data.accounts[0] !== prevProps.web3Data.accounts[0]) {
      this.setState({ web3Data }, () => {
        if (web3Data?.isLoggedIn) {
          this.loopUserData(web3Data);
          this.closePopUp();
        }
      });
      // if (web3Data?.isLoggedIn) this.checkLogOut();
    }
    if (this.state.web3Data.accounts[0] !== prevState.web3Data.accounts[0]) {
      this.loopUserData(web3Data);
    }
    if (
      userPoolDetails?.userDeposits[0] !==
      prevState.userPoolDetails?.userDeposits[0]
    ) {
      await this.setState({ timeLeft: -1 }, () => this.setTimeLeft());
    }
    if (poolDetails !== prevState.poolDetails) this.callTOKENPrice();
    if (userPoolDetails && poolDetails && timeLeft === -1) {
      this.setTimeLeft();
    }
  }
  setTimeLeft = () => {
    if (this.state.timeLeft === -1) {
      const { poolDetails, userPoolDetails } = this.state;
      const currDuration = poolDetails?.lockDuration
        ? poolDetails?.lockDuration
        : 168;
      const _timeLeft = userPoolDetails?.hasStaked
        ? userPoolDetails?.userDeposits[1] && currDuration
          ? new Date().getTime() / 1000 +
            3 *
              (+userPoolDetails?.userDeposits[1] +
                1200 * currDuration -
                +poolDetails?.currentBlock)
          : 0
        : 0;
      this.setState({ timeLeft: _timeLeft });
    }
  };
  checkLogOut() {
    const interValCheck = setInterval(() => {
      web3.eth.getAccounts().then((resp) => {
        if (!resp[0]) {
          this.props.getWeb3(1);
          clearInterval(interValCheck);
        }
      });
    }, 1000);
  }

  componentDidMount() {
    try{ 
    const { web3Data } = this.props;
  
    this.callContractMethods();
    if (!web3Data?.isLoggedIn) {
      if (!+localStorage.getItem("disconnected")) this.props.getWeb3();
    } else {
      this.setState({ web3Data: web3Data });
      this.callUserData(web3Data);
    }
    // this.callTOKENPrice();
  } catch (error) {
    console.error("Error occurred while farming callContractMethods :", error);
  }
  }
  callTOKENPrice = async () => {
    // if (!this.props.isV1) return this.setState({ APY: '200' }); // remove this code line when new contract uses actual APY calculation
    const { poolDetails } = this.state;
    const pancakeLPContractInstance = await (
      "lpToken",
      this.props.currentSwap,
      this.props.isV1
    );
    const reserves = await pancakeLPContractInstance.methods
      .getReserves()
      .call();
    const totalSupply = +web3.utils.fromWei(
      await pancakeLPContractInstance.methods.totalSupply().call()
    );

    const rstperlp = +web3.utils.fromWei(reserves[0]) / totalSupply;

  
    const APY = (this.amountCalc(1, true) / (rstperlp * 2)) * 100;

    this.setState({ APY: +poolDetails.stakedBalance ? APY : "-" });
  };
  loopUserData = (web3Data) => {
    setInterval(() => {
      this.callContractMethods(true);
    }, 5000);
  };

  callUserData = async (web3Data) => {
    try { 
    const poolContracts = await getContractAddresses();
    let obj = {};
    const farmingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );
    const lpTokenContractInstance = await (
      "lpToken",
      this.props.currentSwap,
      this.props.isV1
    );
    obj.totalSupply = await lpTokenContractInstance.methods
      .totalSupply()
      .call();
    obj.currentBlock = await farmingContractInstance.methods
      .currentBlock()
      .call();
    obj.allowance = Number(
      web3.utils.fromWei(
        await lpTokenContractInstance.methods
          .allowance(
            web3Data.accounts[0],
            this.props.isV1
              ? poolContracts.oldFarmingContract[this.props.currentSwap]
                  .contract
              : poolContracts.farmingContract[this.props.currentSwap].contract
          )
          .call()
      )
    );
    obj.userBalance = web3.utils.fromWei(
      await lpTokenContractInstance.methods
        .balanceOf(web3Data.accounts[0])
        .call(),
      "ether"
    );
    let rewardPerBlock = +web3.utils.fromWei(
      await farmingContractInstance.methods.rewPerBlock().call()
    );
    let stakedBalance = await farmingContractInstance.methods
      .stakedBalance()
      .call();
    let accShare = await farmingContractInstance.methods.accShare().call();
    let lockDuration = +(await farmingContractInstance.methods
      .lockDuration()
      .call());
    obj.userDeposits = await farmingContractInstance.methods
      .userDeposits(web3Data.accounts[0])
      .call();
    obj.hasStaked = await farmingContractInstance.methods
      .hasStaked(web3Data.accounts[0])
      .call();
    if (obj.hasStaked) {
      obj.oldRewards = +web3.utils.fromWei(
        await farmingContractInstance.methods
          .viewOldRewards(web3Data.accounts[0])
          .call()
      );
    }

    ///////////////////////////////////////////////////////////////
    function addHexColor(c1, c2) {
      var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
      while (hexStr.length < 3) {
        hexStr = "0" + hexStr;
      } // Zero pad.
      return hexStr;
    }
    let key = "0x000000000000000000000000" + web3Data.accounts[0].substr(2, 42);
    let newKey = web3.utils.soliditySha3(
      { type: "bytes32", value: key },
      { type: "uint", value: "15" }
    );
    let newHexkey =
      newKey.substr(0, newKey.length - 3) +
      addHexColor(newKey.substr(newKey.length - 3, newKey.length), 3);
    //need to pass newKey + 3 into the next line.
    let userAccShare = await web3.eth.getStorageAt(
      poolContracts.farmingContract[this.props.currentSwap].contract,
      newHexkey,
      obj.currentBlock
    );
    //////////////////////////////////////////////////////////////////

    let period = await farmingContractInstance.methods.period().call();
    if (obj.hasStaked && !+obj.oldRewards && +period === +obj.userDeposits[3]) {
      obj.poolShare =
        +(await farmingContractInstance.methods
          .fetchUserShare(web3Data.accounts[0])
          .call()) / 100;
      if (this.props.isV1) {
        if (!obj.poolShare) {
          obj.poolShare = "< 0.01";
          obj.disableHarvest = true;
        }
      } else {
        if (!obj.poolShare) {
          obj.poolShare = 0;
          obj.disableHarvest = true;
        } else {
          obj.poolShare = (+obj.userDeposits[0] / +stakedBalance) * 100;
          obj.poolShare =
            obj.poolShare < 0.000001
              ? "< 0.000001"
              : Number(obj.poolShare).toFixed(6);
        }
      }
      obj.rewardsAtMaturity =
        +web3.utils.fromWei(
          await farmingContractInstance.methods
            .calculate(web3Data.accounts[0])
            .call()
        ) + obj.oldRewards;
      let lastRewardBlock = await farmingContractInstance.methods
        .lastRewardBlock()
        .call();
      obj.currentBlock = await farmingContractInstance.methods
        .currentBlock()
        .call();
      obj.endingBlock = await farmingContractInstance.methods
        .endingBlock()
        .call();
      const sVal =
        +obj.endingBlock > +obj.currentBlock
          ? obj.currentBlock
          : obj.endingBlock;
      if (this.props.isV1 && obj.disableHarvest) {
        obj.rewardsAtMaturity = this.calculate_for_0_poolshare(
          obj.userDeposits[0],
          +sVal - +lastRewardBlock,
          rewardPerBlock,
          stakedBalance,
          accShare,
          userAccShare
        );
      }
      obj.rewardsIfUnstakeToday = this.rewards_if_unstaked_today(
        obj.userDeposits,
        lockDuration,
        obj.rewardsAtMaturity
      );
    } else {
      obj.poolShare = "0";
      obj.rewardsAtMaturity = obj.oldRewards;
      obj.rewardsIfUnstakeToday = "0";
    }
    await this.setState({ userPoolDetails: obj }, () => {
      this.setTimeLeft();
      // this.setState({ timeLeft: -1 });
    });
    this.props.setFarming({
      ...this.props.farming,
      userPoolDetails: obj,
    });
  } catch (error) {
    console.error("Error occurred while callUserData:", error);
  } 
  };

  callContractMethods = async (needloader) => {
   try {
    if (!needloader) this.setState({ mainLoader: true });
    const poolContracts = this.props.isV1
      ? await getContractAddresses().oldFarmingContract
      : await getContractAddresses().farmingContract;
    let obj = {};
    const getTokenSymbol = await ("Token");
    obj.tokenSymbol = await getTokenSymbol.methods.symbol().call();
    const farmingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );
    obj.contractAddress = await web3.utils.toChecksumAddress(
      poolContracts.contract
    );
    obj.period = await farmingContractInstance.methods.period().call();
    obj.currentBlock = await farmingContractInstance.methods
      .currentBlock()
      .call();
    obj.stakedBalance = +web3.utils.fromWei(
      await farmingContractInstance?.methods.stakedBalance().call()
    );
    obj.lockDuration = +(await farmingContractInstance.methods
      .lockDuration()
      .call());
    obj.accShare = await farmingContractInstance.methods.accShare().call();
    obj.totalReward = +web3.utils.fromWei(
      await farmingContractInstance.methods.totalReward().call()
    );
    let endAccShare = await farmingContractInstance.methods
      .endAccShare(+obj.period ? +obj.period - 1 : 0)
      .call();
    // obj.rewardDistributed =
    //   +obj.totalReward +
    //   +web3.utils.fromWei(endAccShare[5]) -
    //   +web3.utils.fromWei(
    //     await farmingContractInstance.methods.rewardBalance().call()
    //   );
    obj.rewardBalance = web3.utils.fromWei(
      await farmingContractInstance.methods.rewardBalance().call()
    );
    obj.totalParticipants = await farmingContractInstance.methods
      .totalParticipants()
      .call();

    obj.currentBlock = await farmingContractInstance.methods
      .currentBlock()
      .call();
    obj.startingBlock = await farmingContractInstance.methods
      .startingBlock()
      .call();
    obj.endingBlock = await farmingContractInstance.methods
      .endingBlock()
      .call();
    obj.rewardPerBlock =
      +web3.utils.fromWei(
        await farmingContractInstance.methods.rewPerBlock().call()
      ) * 20;
    obj.rewardDistributed =
      ((obj.currentBlock - obj.startingBlock) * obj.rewardPerBlock) / 20;
    obj.rewardDistributed =
      obj.rewardDistributed >= obj.totalReward
        ? obj.totalReward
        : obj.rewardDistributed;
    this.setState({ poolDetails: obj, mainLoader: false }, () => {
      if (this.state.web3Data?.isLoggedIn)
        this.callUserData(this.state.web3Data);
      // if (!needloader) this.setState({ timeLeft: -1 });
    });
    } catch (error) {
      console.error("Error occurred in callContractMethods:", error);
      // Optionally, handle the error or log additional information
    }
  };

  rewards_if_unstaked_today(depositsArr, lockDuration, rewardsAtMaturity) {
    let daysTillNow = Math.floor(
      (new Date().getTime() / 1000 - depositsArr[1]) / 86400
    );
    let calculatedDays =
      daysTillNow / lockDuration >= 1 ? 1 : daysTillNow / lockDuration;
    let amount = Number(
      +calculatedDays * (rewardsAtMaturity - web3.utils.fromWei(depositsArr[0]))
    );
    amount += +web3.utils.fromWei(depositsArr[0]);
    return amount;
  }

  popup = (error, msg, timer) => {
    error === "process" ? toast.info(msg,{ style: {background:"#FFFFFF", color:"black"},icon:<img src={errorfortoast} /> }) : null;
    error === "success" ? toast.success(msg,{ style: {background:"#FFFFFF", color:"black"},icon:<img src={successfortoast} /> }) : null;
    error === "error" ? toast.error(msg,{ style: {background:"#FFFFFF", color:"black",},icon:<img src={Failedfortoast} />}) : null;
    this.props.setFarming({
      ...this.props.farming,
      txnStatus: { status: error, msg: msg },
    });
    this.setState((prevState) => ({
      ...prevState,
      txnStatus: { status: error, msg: msg },
    }));
    if (timer) {
      setTimeout(() => {
        this.props.setFarming({
          ...this.props.farming,
          txnStatus: { status: false, msg: msg },
        });
        this.setState((prevState) => ({
          ...prevState,
          txnStatus: { status: false, msg: msg },
        }));
      }, 15000);
    }
  };

  approve = async (key) => {
    try{ 
    // if (this.props.isV1)
    //   return this.popup('error', 'Pool ended. Please invest in new pools.');
    const poolContracts = this.props.isV1
      ? await getContractAddresses().oldFarmingContract
      : await getContractAddresses().farmingContract;
    const lpTokenContractInstance = await (
      "lpToken",
      this.props.currentSwap,
      this.props.isV1
    );

    if (!this.state.web3Data?.isLoggedIn)
      return this.popup("error", "Please connect to metamask");
    const { web3Data, userPoolDetails } = this.state;
    await lpTokenContractInstance.methods
      .approve(
        poolContracts[this.props.currentSwap].contract,
        userPoolDetails.totalSupply
      )
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        // onTransactionHash(hash);
        this.setState({ txnHash: hash });
        return this.popup("process");
      })
      .on("receipt", (receipt) => {
        this.callUserData(this.state.web3Data);
        window.removeEventListener("receipt", this.approve);
        return this.popup(
          "success",
          "Your farming is approved . You can stake now !"
        );
      })
      .on("error", (error) => {
        window.removeEventListener("error", this.withdraw);
        // return this.popup("error", error.message);
        return this.onTransactionError(error);
      });
    } catch (error) {
      console.error("Error occurred while approve staking:", error);
    }
  };
  withdraw = async () => {
    try{
    
    const stakingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );

    const { amount, web3Data, poolDetails, userPoolDetails } = this.state;

    if (!web3Data?.isLoggedIn)
      return this.popup("error", "Please connect to metamask");

    if ((+userPoolDetails?.rewardsAtMaturity)?.toFixed(4) > 20) {
      return this.popup("error", "Please harvest your RST first");
    }
    if (!+amount.value)
      return this.popup("error", "Please enter a valid amount to withdraw ");
    if (+web3.utils.fromWei(userPoolDetails.userDeposits[0]) < +amount.value) {
      return this.popup("error", "Exceeded withdrawal amount");
    }
    if (
      !this.props.isV1 &&
      +userPoolDetails.userDeposits[1] + 1200 * poolDetails.lockDuration >
        +poolDetails.currentBlock
    )
      return this.popup("error", "Withdraw has not started yet");

    await stakingContractInstance.methods
      .withdraw(web3.utils.toWei(amount.value))
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        this.props.setFarming({
          ...this.props.farming,
          txnHash: hash,
        });
        this.setState({ txnHash: hash, showMiniModals: false });
        return this.popup("process");
      })
      .on("receipt", (receipt) => {
        this.props.setFarming({
          ...this.props.farming,
          txnCompleteModal: true,
          // open: false,
          amount: { index: false, value: "" },
        });
        this.setState({
          txnCompleteModal: this.state.openFirst,
          openFirst: false,
          amount: { index: false, value: "" },
        });
        this.onReciept(receipt);
      })
      .on("error", (error) => {
        this.props.setFarming({
          ...this.props.farming,
          stakeFailedModal: this.props.farming.open,
        });
        this.setState({ stakeFailedModal: this.state.openFirst });
        return this.onTransactionError(error);
      });
    } catch (error) {
      console.error("Error occurred while withdraw amount :", error);
    } 
  };

  makeTransaction = async (fxnName) => {
    try {
    if (this.props.isV1)
      return this.popup("error", "Pool ended. Please invest in new pools.");
    const stakingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );
    const { amount, web3Data, userPoolDetails, poolDetails } = this.state;
    if (amount.value > userPoolDetails.allowance) {
      return this.approve();
    }
    if (!web3Data?.isLoggedIn)
      return this.popup("error", "Please connect to metamask");
    if (poolDetails.startingBlock > poolDetails.currentBlock)
      return this.popup("error", "Staking period has not started yet");
    if (poolDetails.currentBlock > poolDetails.endingBlock)
      return this.popup("error", "Staking period has ended");
    if (!+amount.value) return this.popup("error", "Please enter the amount");
    if (+amount.value > +userPoolDetails.userBalance)
      return this.popup("error", "Not enough balance");
    this.popup(false, "");
    await stakingContractInstance.methods[fxnName](
      web3.utils.toWei(amount.value)
    )
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        this.props.setFarming({
          ...this.props.farming,
          txnHash: hash,
        });
        this.setState({ txnHash: hash, showMiniModals: false });
        return this.popup("process");
      })
      .on("receipt", (receipt) => {
        this.props.setFarming({
          ...this.props.farming,
          txnCompleteModal: true,
          // open: false,
          amount: { index: false, value: "" },
        });
        this.setState({
          txnCompleteModal: this.state.openFirst,
          openFirst: false,
          amount: { index: false, value: "" },
        });
        this.onReciept(receipt);
      })
      .on("error", (error) => {
        this.props.setFarming({
          ...this.props.farming,
          stakeFailedModal: this.props.farming.open,
        });
          console.log("Stake Failed error :", error);

        this.setState({ stakeFailedModal: this.state.openFirst });
        return this.onTransactionError(error);
      });
    } catch (error) {
;      console.error("Error occurred while make transaction:", error);
    }
  };
  async renew() {
    if (this.props.isV1) {
      const showRenew =
        this.state.poolDetails?.period !==
          this.state.userPoolDetails?.userDeposits[3] &&
        +this.state.userPoolDetails?.userDeposits[0] > 0;

      const c2 =
        +this.state.poolDetails.currentBlock >
        +this.state.userPoolDetails?.userDeposits[1] + 201600;
      if (showRenew && c2) {
        return this.popup("error", "Pool ended. Please invest in new pools.");
      }
    }
    const stakingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );
    const { web3Data, poolDetails } = this.state;
    if (!web3Data?.isLoggedIn)
      return this.popup("error", "Please connect to metamask");
    if (poolDetails.currentBlock > poolDetails.endingBlock) {
      return this.popup("error", "Period ended");
    }
    this.popup("false", "");
    await stakingContractInstance.methods
      .renew()
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        this.setState({ txnHash: hash });
        return this.popup("process");
      })
      .on("receipt", (receipt) => {
        this.onReciept(receipt);
      })
      .on("error", (error) => {
        return this.onTransactionError(error);
      });
  }

  claimRewards = async () => {
    try{
    const stakingContractInstance = await (
      "farming",
      this.props.currentSwap,
      this.props.isV1
    );
    const { web3Data, userPoolDetails } = this.state;
    if (!web3Data?.isLoggedIn)
      return this.popup("error", "Please connect to metamask");
    if (!+userPoolDetails?.rewardsAtMaturity)
      return this.popup("error", "No rewards to harvest");
    this.popup("false", "");
    let fxn = +userPoolDetails.oldRewards ? "claimOldRewards" : "claimRewards";
    await stakingContractInstance.methods[fxn]()
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        this.setState({ txnHash: hash });
        return this.popup("process");
      })
      .on("receipt", (receipt) => {
        this.onReciept(receipt);
      })
      .on("error", (error) => {
        return this.onTransactionError(error);
      });
    } catch (error) {
      console.error("Error occurred while claim Rewards:", error);
    }
  };

  onReciept = (receipt) => {
    if (receipt.status) {
      this.callUserData(this.state.web3Data);
      this.popup("success", "Transaction Successful", true);
    } else {
      console.log("error");
    }
  };

  onTransactionError = (error, modal) => {
    let msg = "Transaction reverted";
    if (error.code === 4001) {
      msg = "Transaction denied by user";
    } else if (error.code === -32602) {
      msg = "wrong parameters";
    } else if (error.code === -32603) {
      msg = "Internal Error";
    } else if (error.code === -32002) {
      msg = "Complete previous request";
    }
    this.popup("error", msg, true);
  };

  async toggle(index) {
    let collapse = "isOpen" + index;
    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  }
  closePopUp = () => {
    this.setState({ isOpen1: false });
  };
  closePopUp = () => {
    this.setState({ isOpen2: false });
  };
  refreshStates = () => {
    this.setState({
      error: { index: false, msg: "" },
      txnStatus: { status: false, msg: "" },
    });
  };
  setPoolType = (closedPool) => {
    this.setState({
      poolContracts: closedPool ? this.props.closedPools : this.props.openPools,
      txnStatus: { status: false, msg: "" },
    });
  };

  calculate_for_0_poolshare = (
    amt,
    noOfBlocks,
    rewardPerBlock,
    stakedBalance,
    accShare,
    userAccShare
  ) => {
    let rewards = noOfBlocks * web3.utils.toWei(rewardPerBlock.toString());
    let newStakebalance = +stakedBalance ? +stakedBalance : 100;
    let newAccShare = +accShare + (rewards * 1e6) / newStakebalance;
    let rewDebt = (+amt * userAccShare) / 1e6;
    let rew = ((+amt * newAccShare) / 1e6 - rewDebt) / 10 ** 18;

    return rew;
  };

  amountCalc = (amt, isApy) => {
    let { poolDetails } = this.state;
    let obj = { 1: 0, 7: 0, 30: 0 };
    if (poolDetails) {
      function calc(noOfDays) {
     

        let rewards =
          noOfDays *
          28800 *
          web3.utils.toWei((poolDetails.rewardPerBlock / 20).toString());

        let newStakebalance = +poolDetails.stakedBalance
          ? +web3.utils.toWei((poolDetails.stakedBalance + +amt).toString())
          : 100;

        let newAccShare =
          +poolDetails.accShare + (rewards * 1e6) / newStakebalance;

        let rewDebt = (+amt * 10 ** 18 * poolDetails.accShare) / 1e6;

        let rew = ((+amt * 10 ** 18 * newAccShare) / 1e6 - rewDebt) / 10 ** 18;
     

        return rew.toFixed(4);
      }

      // console.log("this", calc(365));
      const n = 1;
      if (isApy) return calc(365);
      obj["1"] = calc(1);
      obj["7"] = calc(7);
      obj["30"] = calc(30);
      this.props.setFarmingCalc({
        ...this.props.farmingCalc,
        testamt: { ...this.props.farmingCalc.testamt, ...obj },
      });
      this.setState((prevState) => ({
        testamt: { ...prevState.testamt, ...obj },
      }));
    }
  };

  render() {
    const {
      poolDetails,
      userPoolDetails,
      amount,
      txnStatus,
      openFirst,
      currentFunction,
      txnCompleteModal,
      stakeFailedModal,
      txnHash,
      testamt,
      showMiniModals,
      timeLeft,
    } = this.state;
    // console.log('1');
    const showRenew =
      poolDetails?.period !== userPoolDetails?.userDeposits[3] &&
      +userPoolDetails?.userDeposits[0] > 0;
    const isZeroLeft =
      poolDetails?.rewardDistributed >= poolDetails?.totalReward;
    if (this.state.mainLoader) return <Loading />;
    return (
      <>
        <div>
          <Network>
            <label>Select a Network</label>
            <Link className="active">
              <img src={icon1}></img>
            </Link>
            <Link className="">
              <img src={icon2}></img>
            </Link>

            <Select className="">
              {this.props?.swaps.map((swap, key) => (
                <option
                  id={key}
                  onClick={() => {
                    this.props.setCurrentSwap(key);
                    this.setState({ poolsDropdown: false });
                  }}
                >
                  {swap.name}
                </option>
              ))}
              {/* <option>Pancake Swap</option>
              <option>Bakery Swap</option> */}
            </Select>
          </Network>
          <TableTop>
            <span>Pool details</span>
            <span>
              {+userPoolDetails?.rewardsAtMaturity
                ? +userPoolDetails?.rewardsAtMaturity < 0.00001
                  ? "< 0.00001"
                  : (+userPoolDetails?.rewardsAtMaturity)?.toFixed(4)
                : null}{" "}
              {poolDetails?.tokenSymbol} earned{" "}
              {userPoolDetails?.disableHarvest ? (
                <>
                  <Button
                    className="primary no-shadow sm"
                    disabled={userPoolDetails?.disableHarvest}
                  >
                    Harvest
                    {this.props.isV1 && (
                      <GoAlert data-tip="*There is a known bug regarding farmers with less than 0.01% pool share. Their rewards will be airdropped instead of being harvested." />
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  className="primary no-shadow sm"
                  onClick={() => this.claimRewards()}
                  disabled={userPoolDetails?.disableHarvest}
                >
                  HARVEST
                </Button>
              )}
            </span>
          </TableTop>
          <TableLayout className="poolBottom">
            <label>
              {/* {console.log(
                "{isZeroLeft ? 0 : (+this.state.APY).toFixed(2)}",
                (+this.state.APY).toFixed(2)
              )} */}
              APY <span>{isZeroLeft ? 0 : (+this.state.APY).toFixed(2)} %</span>
            </label>
            <label>
              REWARD PER MINUTE{" "}
              <span>
                {isZeroLeft ? 0 : poolDetails?.rewardPerBlock.toFixed(5)}{" "}
                {poolDetails?.tokenSymbol}
              </span>
            </label>
            <label>
              UNLOCKS IN{" "}
              <span>
                {this.props.isV1 && userPoolDetails?.userDeposits[3] == 2 ? (
                  "Already Matured"
                ) : +timeLeft === -1 || +timeLeft === 0 ? (
                  "7 Days"
                ) : timeLeft > new Date().getTime() / 1000 ? (
                  <Timer timeLeft={timeLeft} />
                ) : (
                  "Already Reached"
                )}
              </span>
            </label>
            <label>
              YOUR STAKE{" "}
              <span>
                {userPoolDetails
                  ? (+web3.utils.fromWei(
                      userPoolDetails ? userPoolDetails.userDeposits[0] : "0"
                    )).toFixed(4) +
                    " " +
                    ` ${this.props.token}`
                  : "-"}
              </span>
            </label>
            <label>
              POOL SHARE{" "}
              <span>
                {userPoolDetails
                  ? userPoolDetails?.poolShare +
                    //   .toFixed(14)
                    //   .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') +
                    // //  userPoolDetails?.poolShare?.toLocaleString(4)
                    " %"
                  : "-"}
              </span>
            </label>
            <label>
              PARTICIPANTS <span>{poolDetails?.totalParticipants}</span>
            </label>
            <label>
              DISTRIBUTED TOKENS{" "}
              <span>
                {poolDetails?.rewardDistributed > 0
                  ? poolDetails?.rewardDistributed?.toLocaleString(4)
                  : 0}
                <b> / </b>
                {poolDetails?.totalReward?.toLocaleString(4)}
              </span>
              <ProgressBar className="primary">
                {[
                  poolDetails
                    ? +poolDetails.rewardDistributed
                      ? Math.floor(
                          (+poolDetails?.rewardDistributed /
                            (+poolDetails?.totalReward
                              ? +poolDetails?.totalReward
                              : 1)) *
                            100
                        )
                      : 1
                    : 1,
                ].map((key) => (
                  <div style={{ width: `${key}%` }} />
                ))}
                {/* <div style={{ width: "70%" }} /> */}
              </ProgressBar>
            </label>
          </TableLayout>
          <BtnGrp>
            <Button
              className="btn secondary white"
              onClick={() => window.open(`${this.props.viewPool}`)}
            >
              View Pool
            </Button>
            {!Number(userPoolDetails?.allowance) ? (
              <Button
                className="btn primary no-shadow"
                onClick={() => this.approve()}
                disabled={isZeroLeft}
              >
                {isZeroLeft ? "Closed" : "Approve"}
              </Button>
            ) : null}
            {/* <Button className="btn primary no-shadow">Approve</Button> */}
          </BtnGrp>
          {+userPoolDetails?.userDeposits[0] ? (
            <div>
              <ReactTooltip className="custom-tooltip" />
              <BtnGrp>
                {showRenew ? (
                  <Button
                    className="btn primary no-shadow"
                    onClick={() => this.renew()}
                  >
                    Renew{" "}
                    <GoAlert data-tip="After renewal your accumulated rewards will get transfered to your wallet directly and LP tokens will be farmed again in new pool. " />
                  </Button>
                ) : (
                  <Button
                    className="btn primary no-shadow"
                    disabled={isZeroLeft}
                    onClick={
                      () =>
                        this.props.setFarming({
                          open: true,
                          txnStatus,
                          token: this.props.token,
                          amount,
                          setAmount: (e) => this.setState({ amount: e }),
                          currentFunction: "stake",
                          userPoolDetails,
                          makeTransaction: this.makeTransaction,
                          withdraw: this.withdraw,
                        })
                      // this.setState({
                      //   openFirst: true,
                      //   currentFunction: "stake",
                      // })
                    }
                  >
                    {isZeroLeft ? "Closed" : "Stake"}
                  </Button>
                )}
                <Button
                  className="btn primary no-shadow"
                  // disabled={isZeroLeft}
                  onClick={
                    () =>
                      this.props.setFarming({
                        open: true,
                        txnStatus,
                        token: this.props.token,
                        amount,
                        setAmount: (e) => this.setState({ amount: e }),
                        currentFunction: "withdraw",
                        userPoolDetails,
                        makeTransaction: this.makeTransaction,
                        withdraw: this.withdraw,
                      })
                    // this.setState({
                    //   openFirst: true,
                    //   currentFunction: "withdraw",
                    // })
                  }
                >
                  Unstake LP
                </Button>
              </BtnGrp>
            </div>
          ) : Number(userPoolDetails?.allowance) ? (
            <BtnGrp>
              <Button
                className="btn primary no-shadow"
                disabled={isZeroLeft}
                onClick={
                  () =>
                    this.props.setFarming({
                      open: true,
                      txnStatus,
                      token: this.props.token,
                      amount,
                      setAmount: (e) => this.setState({ amount: e }),
                      currentFunction: "stake",
                      userPoolDetails,
                      makeTransaction: this.makeTransaction,
                      withdraw: this.withdraw,
                    })
                  // this.setState({
                  //   openFirst: true,
                  //   currentFunction: "stake",
                  // })
                }
              >
                {isZeroLeft ? "Closed" : "Stake"}
              </Button>
            </BtnGrp>
          ) : null}
          <p className="mt-2">
            Balance :{" "}
            {userPoolDetails
              ? (+userPoolDetails?.userBalance).toLocaleString(undefined, 4)
              : 0}{" "}
            {this.props.token}{" "}
            <i
              class="fas fa-calculator"
              onClick={() => {
                this.props.setFarmingCalc({
                  open: true,
                  setFarmAmountVal: (e) => this.amountCalc(e),
                  testamt,
                  APY: this.state.APY,
                });
              }}
              // onClick={() => this.setState({ openFifth: true })}
            ></i>
          </p>
        </div>
        <div>
          <Modal
            classNames={{ modal: "customModal2" }}
            open={openFirst}
            onClose={() =>
              this.setState({
                openFirst: false,
                showMiniModals: true,
              })
            }
            closeIcon={closeIcon}
            center
          >
            <div className="withdraw-box">
              {txnStatus.status === "process" ? (
                <Loading />
              ) : (
                <>
                  <ReactTooltip className="custom-tooltip" />
                  <h2>{currentFunction === "stake" ? "Farm" : "Withdraw"}</h2>
                  <label className="alert-outer">
                    Amount in {this.props.token}
                    {this.props.isV1 && (
                      <div
                        className="alert-btn"
                        data-tip="*There is a known bug regarding farmers with less than 0.01% pool share. Their rewards will be airdropped instead of being harvested."
                      >
                        <GoAlert />
                      </div>
                    )}
                  </label>
                  <div className="popup-form">
                    <div className="form-grp">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter amount"
                        value={amount.value}
                        onChange={(e) => {
                          if (!isNaN(e.target.value))
                            this.setState({
                              amount: { index: 0, value: e.target.value },
                            });
                        }}
                      />
                      <button
                        onClick={() =>
                          this.setState({
                            amount: {
                              index: 0,
                              value:
                                currentFunction === "stake"
                                  ? userPoolDetails?.userBalance
                                  : web3.utils.fromWei(
                                      userPoolDetails
                                        ? userPoolDetails.userDeposits[0]
                                        : "0"
                                    ),
                            },
                          })
                        }
                        // {}
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <button
                    className="approve-stake-btn"
                    onClick={() =>
                      currentFunction === "stake"
                        ? this.makeTransaction("stake", 0)
                        : this.withdraw(0)
                    }
                  >
                    {amount?.value > userPoolDetails?.allowance
                      ? "Approve"
                      : "Confirm"}
                  </button>
                </>
              )}
            </div>
          </Modal>
        </div>

        <div>
          <Modal
            classNames={{ modal: "customModal5" }}
            open={stakeFailedModal}
            onClose={() =>
              this.setState({ stakeFailedModal: false, showMiniModals: true })
            }
            closeIcon={closeIconRed}
            center
          >
            <div className="wth-Frame-1">
              <img src={ErrorIcon} alt="" />
            </div>
            <div className="wth-Frame-2">
              <div className="withdraw-box">
                <h2>
                  {currentFunction === "stake" ? "Farm" : "Withdraw"} failed!
                </h2>
                <p>Something happened</p>
                <button className="approve-stake-btn">Try again</button>
              </div>
            </div>
          </Modal>
        </div>
        <div>
          <Modal
            classNames={{ modal: "customModal4" }}
            open={txnCompleteModal}
            onClose={() =>
              this.setState({ txnCompleteModal: false, showMiniModals: true })
            }
            closeIcon={closeIcon}
            center
          >
            <div className="wth-Frame-1">
              <img src={CompleteIcon} alt="" />
            </div>
            <div className="wth-Frame-2">
              <div className="withdraw-box">
                <h2>
                  {currentFunction === "stake" ? "Farming" : "Withdraw"}{" "}
                  completed!
                </h2>
                {currentFunction === "stake" ? (
                  <p>Your LP tokens has been farmed</p>
                ) : null}
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
                <button
                  className="approve-stake-btn"
                  onClick={() => this.setState({ txnCompleteModal: false })}
                >
                  Done
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  }

}

const TableLayout = styled.div`
  label {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    font-size: 1.7rem;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 0 11px;
    font-weight: 600;
    span {
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
const BtnGrp = styled.div`
  display: flex;
  gap: 16px;
  .btn {
    flex-grow: 1;
    text-transform: uppercase;
    border-radius: 8px;
  }
  @media (max-width: 480px) {
    .btn {
      width: 50%;
      min-width: inherit;
    }
  }
  @media (max-width: 400px) {
    flex-flow: column;
    margin-top: 20px;
    .btn {
      width: 100%;
      min-width: inherit;
      margin: 0;
    }
  }
`;
const Network = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 38px;
  label {
    font-size: 1.8rem;
    margin-right: 15px;
  }
  a {
    width: 44px;
    height: 44px;
    border-radius: 4.5px;
    background-color: rgb(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    &.active {
      background: rgb(255, 255, 255, 0.4);
    }
    img {
      max-height: 20px;
    }
  }
  @media (max-width: 1400px) {
    label {
      margin-right: 0;
    }
    a {
      width: 40px;
      height: 40px;
    }
  }
  @media (max-width: 480px) {
    flex-flow: wrap;
  }
`;
const Select = styled.select`
  appearance: none;
  background: none;
  border: none;
  background: url(${down}) no-repeat;
  background-position: calc(100% - 2px) center;
  background-size: 11px;
  color: var(--color-text);
  font-size: 1.8rem;
  padding: 2px 20px 2px 5px;
  margin-left: auto;
  option {
    color: black;
    padding: 5px 10px;
  }
  @media (max-width: 480px) {
    width: auto;
    margin: 10px auto 0 0;
  }
`;
const TableTop = styled.div`
  display: flex;
  font-size: 20px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  span {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
  }
  @media (max-width: 480px) {
    span {
      font-size: 1.8rem;
    }
  }
`;
const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: (val) => dispatch(),
    enableMetamask: () => dispatch(),
    enabledWalletConnect: () => dispatch(),
    // getOpenPools: () => dispatch(actions.getOpenPools()),
    // getKYCData: (address) => dispatch(actions.getKYCData(address)),
    // getClosedPools: () => dispatch(actions.getClosedPools()),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.web3Data,
    kycData: state.fetchKYCData,
    // openPools: state.fetchOpenPools,
    // closedPools: state.fetchClosedPools,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(Farming);
