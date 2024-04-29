/* eslint-disable babel/no-unused-expressions */
import React, { PureComponent, Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import getContractAddresses from "../../contractData/contractAddress/addresses";
import styled from "styled-components";
import {
  Button,
  Container,
  ExchangeBar,
  ProgressBar,
} from "../../theme/main.styled";
import { Link } from "react-router-dom";
import { web3Services } from "../../services/web3.service";
import { Modal } from "react-responsive-modal";
import ErrorIcon from "../../assets/error.png";
import GreenCIcon from "../../assets/green-close.png";
import RedCIcon from "../../assets/red-close.png";
import BlueCIcon from "../../assets/close-vector.png";
import ProcessLoader from "../../assets/processing-loader.gif";
import HexagonLoader from "../../assets/loader.gif";
import WarningIcon from "../../assets/SymbolWarning.png";
import CompleteIcon from "../../assets/complete.png";
import { FaCalculator } from "react-icons/fa";
import ModalData from "../../pages/staking";
import errorfortoast from "../../assets/errorfortoast.png";
import successfortoast from "../../assets/successfortoast.png";
import Failedfortoast from "../../assets/Failedfortoast.png";
import Timer from "../timer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { web3 } from "../../web3";

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
      stroke-miterlimit="16"></line>
    <line
      x1="25"
      y1="15"
      x2="15"
      y2="25"
      stroke="#7BF5FB"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"></line>
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
      stroke-miterlimit="16"></line>
    <line
      x1="25"
      y1="15"
      x2="15"
      y2="25"
      stroke="#FB7B7B"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-miterlimit="16"></line>
  </svg>
);
class Staking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen1: false,
      web3Data: {
        isLoggedIn: false,
        accounts: [],
      },
      networkId: "0x38",
      isPaused: false,
      contractTimes: {},
      totalSupply: null,
      rate: null,
      lockDuration: null,
      rewardsAtMaturity: null,
      deposits: null,
      allowance: null,
      amount: "",
      stakeAmount: "",
      activeContract: 1,
      userBalance: 0,
      txnStatus: { status: "false", msg: "" },
      error: "",
      // networkId: 56,
      openFirst: false,
      openFirst1: false,
      poolclosed: false,
      msg: "",
      openSixth: false,
      txnCompleteModal: false,
      stakeFailedModal: false,
      currentFunction: "",
      poolclosed1: false,
      testAmount: 0,
      poolclosed2: false,
      txnHash: "",
      showMiniModals: true,
      calRate: 0,
      stakeWarning: false,
      tokenSymbol: "Token",
    };
  }

  static async getDerivedStateFromProps(nextProps, prevState) {
    let { web3Data } = nextProps;
    if (web3Data !== prevState.web3Data) return { web3Data: web3Data };
    else return null;
  }

  async componentDidUpdate(prevProps, prevState) {
    let { web3Data } = this.props;
    const { activeContract } = this.state;
    if (this.state.amount !== prevState.amount) {
      this.props.setStakeAmount({
        ...this.props.stakeAmount,
        amount: this.state.amount,
        // open: false,
      });
    }

    if (web3Data.accounts[0] !== prevProps.web3Data.accounts[0]) {
      this.setState({ web3Data }, () => {
        if (web3Data?.isLoggedIn) this.getUserData(web3Data);
        if (!web3Data?.isLoggedIn)
          this.setState({ deposits: null, allowance: null, userBalance: 0 });
        this.closePopUp();
      });
      // if (web3Data?.isLoggedIn) this.checkLogOut();
    }
    if (activeContract !== prevState.activeContract) {
      this.refreshStates();
      this.callContractMethods(activeContract);
      if (web3Data.accounts[0]) this.getUserData(web3Data);
    }
  }
  checkLogOut() {
    const interValCheck = setInterval(() => {
      web3.eth.getAccounts().then((resp) => {
        if (!resp[0]) {
          this.props.getWeb3(1);
          clearInterval(interValCheck);
        }
      });
    }, 10);
  }
  onClose1 = () => {
    this.state.poolclosed1 = false;
    this.setState({ poolclosed1: false });
  };
  setNetworkId = async () => {
    this.setState({ networkId: await web3.eth.getChainId() });
  };
  async componentDidMount() {
    try {
      // toast.configure();
      const { web3Data } = this.props;
      this.setNetworkId();
      await this.callContractMethods();
      if (!web3Data?.isLoggedIn) {
        if (!+localStorage.getItem("disconnected")) this.props.getWeb3();
      } else {
        this.setState({ web3Data: web3Data });
        this.getUserData(web3Data);
      }
    } catch (error) {
      console.error(
        "Error occurred in staking callContractMethods componentDidMount :",
        error
      );
      // Optionally, handle the error or log additional information
    }
  }
  getUserData = async (web3Data) => {
    try {
      const stakingContractInstance = await(
        this.state.activeContract
      );
      const tokenContractInstance = await ("Token");
      const allowanceAddress = await getContractAddresses();
      let deposits = await stakingContractInstance?.methods
        .userDeposits(web3Data.accounts[0])
        .call();
      const allowance = Number(
        web3.utils.fromWei(
          await tokenContractInstance.methods
            .allowance(
              web3Data.accounts[0],
              allowanceAddress[this.state.activeContract]
            )
            .call()
        )
      );
      const userBalance = web3.utils.fromWei(
        await tokenContractInstance.methods
          .balanceOf(web3Data.accounts[0])
          .call(),
        "ether"
      );
      this.setState({ deposits, allowance, userBalance });
    } catch (error) {
      console.error("Error occurred while getUserData:", error);
    }
  };
  callContractMethods = async () => {
    try {
      const { activeContract } = this.state;
      const stakingContractInstance = await (activeContract);
      const tokenContractInstance = await ("Token");
      const tokenSymbol = await tokenContractInstance?.methods.symbol().call();
      const isPaused = await stakingContractInstance?.methods
        .isStopped()
        .call();

      const totalSupply = await tokenContractInstance?.methods
        .totalSupply()
        .call();
      const calRate = await stakingContractInstance?.methods.rate().call();
      const rate = (+calRate * 365) / activeContract;
      const lockDuration = await stakingContractInstance?.methods
        .lockDuration()
        .call();

      this.setState({
        rate,
        lockDuration,
        totalSupply,
        calRate,
        isPaused,
        tokenSymbol,
      });
      this.props.setStakeCalc({
        open: this.props.stakeCalc.open ? true : false,
        rate: rate,
        calRate: calRate,
      });
    } catch (error) {
      console.error("Error occurred in staking callContractMethods :", error);
      // Optionally, handle the error or log additional information
    }
  };

  popup = (error, msg, timer) => {
    error === "process"
      ? toast.info(msg, {
          style: { background: "#FFFFFF", color: "black" },
          icon: <img src={errorfortoast} />,
        })
      : null;
    error === "success"
      ? toast.success(msg, {
          style: { background: "#FFFFFF", color: "black" },
          icon: <img src={successfortoast} />,
        })
      : null;
    error === "error"
      ? toast.error(msg, {
          style: { background: "#FFFFFF", color: "black" },
          icon: <img src={Failedfortoast} />,
        })
      : null;
    this.setState((prevState) => ({
      ...prevState,
      txnStatus: { status: error, msg: msg },
    }));
    this.props.setStakeAmount({
      ...this.props.stakeAmount,
      txnStatus: { status: error, msg: msg },
    });

    if (timer) {
      setTimeout(
        () =>
          this.setState((prevState) => ({
            ...prevState,
            txnStatus: { status: false, msg: msg },
          })),
        15000
      );
    }
  };

  approve = async () => {
    try {
      const tokenContractInstance = await ("Token");
      const addresses = await getContractAddresses();
      const { web3Data, isPaused } = this.state;
      if (isPaused) return this.popup("error", "Staking is paused");
      if (!web3Data?.isLoggedIn) {
        return this.popup("error", "Please connect to metamask");
      }
      //console.log("web3Data", web3Data.accounts[0]);
      await tokenContractInstance.methods
        .approve(addresses[this.state.activeContract], this.state.totalSupply)
        .send({ from: web3Data.accounts[0] })
        .on("transactionHash", (hash) => {
          //console.log("hash", hash);
          this.setState({ txnHash: hash });
          return this.popup(
            "process",
            "Please wait your transaction is in process",
            true
          );
        })
        .on("receipt", (receipt) => {
          //console.log("receipt", receipt);
          this.getUserData(this.state.web3Data);
          window.removeEventListener("receipt", this.approve);
          return this.popup(
            "success",
            "Your staking is approved . You can invest now !",
            true
          );
        })
        .on("error", (error) => {
          //console.log(error);
          window.removeEventListener("error", this.withdraw);
          // return this.popup("error", error.message);
          return this.onTransactionError(error);
        });
    } catch (error) {
      console.error("Error occurred while approve staking:", error);
    }
  };
  withdraw = async () => {
    try {
      const stakingContractInstance = await (
        this.state.activeContract
      );
      const { web3Data, deposits } = this.state;
      if (!web3Data?.isLoggedIn)
        return this.popup("error", "Please connect to metamask");
      if (new Date().getTime() / 10 < +deposits[2])
        return this.popup("error", "Didn't reached maturity date .");
      await stakingContractInstance.methods
        .withdraw()
        .send({ from: web3Data.accounts[0] })
        .on("transactionHash", (hash) => {
          this.setState({ txnHash: hash });
          return this.popup("process");
        })
        .on("receipt", (receipt) => {
          window.removeEventListener("receipt", this.withdraw);
          this.setState({
            txnCompleteModal: this.state.openFirst,
            openFirst: false,
            amount: "",
          });
          return this.onReciept(receipt);
        })
        .on("error", (error) => {
          window.removeEventListener("error", this.withdraw);
          return this.popup("error", error.message, true);
        });
    } catch (error) {
      console.error("Error occurred while withdraw amount :", error);
    }
  };

  makeTransaction = async (fxnName) => {
    try {
      const stakingContractInstance = await (
        this.state.activeContract
      );
      const { amount, web3Data, userBalance, isPaused, allowance } = this.state;

      if (isPaused) return this.popup("error", "Staking is paused");
      if (!web3Data?.isLoggedIn)
        return this.popup("error", "Please connect to metamask");
      if (!+amount) return this.popup("error", "Please enter a valid value");
      if (+amount > +userBalance)
        return this.popup("error", "Can not stake more than user balance");
      if (allowance < +amount) await this.approve();
      await stakingContractInstance.methods[fxnName](web3.utils.toWei(amount))
        .send({ from: web3Data.accounts[0] })
        .on("transactionHash", (hash) => {
          this.setState({ txnHash: hash, showMiniModals: false });
          this.props.setStakeAmount({
            ...this.props.stakeAmount,
            txnHash: hash,
            showMiniModals: false,
          });
          return this.popup("process");
        })
        .on("receipt", (receipt) => {
          window.removeEventListener("receipt", this.makeTransaction);
          this.setState({
            txnCompleteModal: this.state.openFirst,
            openFirst: false,
          });
          this.props.setStakeAmount({
            ...this.props.stakeAmount,
            txnCompleteModal: true,
            // open: false,
          });
          return this.onReciept(receipt);
        })
        .on("error", (error) => {
          this.props.setStakeAmount({
            ...this.props.stakeAmount,
            stakeFailedModal: true,
            // open: false,
          });
          this.setState({ stakeFailedModal: true });
          return this.onTransactionError(error);
        });
    } catch (error) {
      console.error("Error occurred in makeTransaction:", error);
    }
  };

  onReciept = (receipt) => {
    if (receipt.status) {
      this.getUserData(this.state.web3Data);
      this.popup("success", "Transaction Successful", true);
    } else {
      //console.log("error");
    }
  };

  onTransactionError = (error) => {
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

  closePopUp = () => {
    this.setState({ isOpen1: false });
  };
  refreshStates = () => {
    this.setState({
      error: "",
      txnStatus: { status: false, msg: "" },
    });
  };
  render() {
    //  let dateToday = new Date();
    const {
      rate,
      deposits,
      allowance,
      activeContract,
      amount,
      openFirst,
      openFirst1,
      stakeFailedModal,
      poolclosed,
      poolclosed1,
      poolclosed2,
      txnStatus,
      currentFunction,
      txnCompleteModal,
      testAmount,
      txnHash,
      showMiniModals,
      calRate,
      msg,
      networkId,
      stakeWarning,
      tokenSymbol,
    } = this.state;
    let currentTimestamp = Date.now();
    var t1 = 1659657540;
    var t2 = currentTimestamp / 10;
    if (t2 > t1) {
      this.state.poolclosed = true;
      this.state.msg = `Deposits for 180 days pools closed.`;
    } else {
      this.state.msg = `Hurry up! The last date to join the 180 Days pool is on August 4th.`;
    }
    const WithdrawAmount = Number(
      web3.utils.fromWei(deposits ? deposits[0] : "0")
    );

    const stakingAmount = amount;
    const contracts = [7, 14, 30, 60 ];

    return (
      <>
        <div>
          <CheckGrid className="checkGrid">
            <CheckLabel>Lock duration</CheckLabel>
            {contracts.map((num) => (
              <CheckBox
                onClick={() =>
                  this.setState({ activeContract: num, poolclosed2: false })
                }>
                {num}{" "}
                <input
                  type="radio"
                  name="days"
                  checked={activeContract === num ? true : false}
                />
                <span />
              </CheckBox>
            ))}
          </CheckGrid>
          <StakingData>
            <p>
              Your staked amount :
              <span>
                {WithdrawAmount} {tokenSymbol}
              </span>
            </p>
            <p>
              APY Rate :<span>{(rate / 10).toFixed()} %</span>
            </p>
            <p>
              Maturity Date :
              <span>
                {!+deposits?.[2] ? null : +deposits?.[2] >
                  new Date().getTime() / 10 ? (
                  <Timer timeLeft={deposits?.[2]} />
                ) : (
                  <p>Reached</p>
                )}
              </span>
            </p>
            <p>
              Balance :
              <span>
                {(+this.state.userBalance)
                  .toFixed(4)
                  .toLocaleString(undefined, 4)}{" "}
                {tokenSymbol}{" "}
                <i
                  class="fas fa-calculator"
                  onClick={() => {
                    this.setState({ openSixth: true });
                    this.props.setStakeCalc({
                      open: true,
                      rate: rate,
                      calRate: calRate,
                    });
                  }}></i>
              </span>
            </p>
          </StakingData>
          {!WithdrawAmount ? (
            !allowance ? (
              <Button
                className="primary full no-shadow"
                onClick={(e) => {
                  poolclosed2 === false
                    ? this.approve()
                    : this.setState({ poolclosed1: true });
                }}>
                Approve
              </Button>
            ) : (
              <Button
                className="primary full no-shadow"
                onClick={(e) => {
                  poolclosed2 === false
                    ? this.props.setStakeAmount({
                        open: true,
                        txnStatus,
                        currentFunction: "stake",
                        stakeWarning: WithdrawAmount > 0,
                        WithdrawAmount,
                        amount,
                        setStakeAmountVal: (e) => this.setState({ amount: e }),
                        userBalance: this.state.userBalance,
                        makeTransaction: this.makeTransaction,
                      })
                    : this.setState({ poolclosed1: true });
                }}>
                Stake
              </Button>
            )
          ) : null}
          {WithdrawAmount ? (
            <>
              {new Date().getTime() / 10 >= +deposits[2] ? (
                <Button
                  className="primary full no-shadow"
                  onClick={(e) => {
                    this.setState(
                      {
                        currentFunction: "withdraw",
                      },
                      () => this.withdraw()
                    );
                  }}>
                  Withdraw
                </Button>
              ) : (
                <div className="button-list">
                  <Button
                    className="primary full no-shadow"
                    onClick={() => {
                      poolclosed2 === false
                        ? !+allowance
                          ? this.approve()
                          : this.props.setStakeAmount({
                              open: true,
                              txnStatus,
                              currentFunction: "stake",
                              stakeWarning: WithdrawAmount > 0,
                              WithdrawAmount,
                              amount,
                              setStakeAmountVal: (e) =>
                                this.setState({ amount: e }),
                              userBalance: this.state.userBalance,
                              makeTransaction: this.makeTransaction,
                            })
                        : this.setState({ poolclosed1: true });
                    }}>
                    {!allowance ? "Approve" : "Stake"}
                  </Button>

                  <Button
                    className="primary full no-shadow"
                    onClick={(e) => {
                      this.setState(
                        {
                          currentFunction: "withdraw",
                          showMiniModals: true,
                        },
                        () => this.withdraw()
                      );
                    }}>
                    Withdraw
                  </Button>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <div>
          <Modal
            classNames={{ modal: "customModal4" }}
            open={poolclosed1}
            onClose={() => this.onClose1()}
            closeIcon={closeIcon}
            center>
            <div className="wth-Frame-1">
              <div style={{ color: "white" }}>
                Deposits for 60 days pools closed.
              </div>
            </div>
          </Modal>
        </div>

        {/* <div>
          <Modal
            classNames={{ modal: "customModal5" }}
            open={stakeFailedModal}
            onClose={() =>
              this.setState(
                { stakeFailedModal: false, showMiniModals: true },
                this.popup(false, "")
              )
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
                  {currentFunction === "stake" ? "Stake" : "Withdraw"} failed!
                </h2>
                <p>Something happened </p>
              </div>
            </div>
          </Modal>
        </div> */}

        {/* {showMiniModals ? (
          <>
            {txnStatus.status === "success"
              ? toast.success(txnStatus.msg)
              : null}
            {txnStatus.status === "process"
              ? toast.info("Processing...")
              : null}
            {txnStatus.status === "error" ? toast.error(txnStatus.msg) : null}
          </>
        ) : null} */}

        <div></div>
      </>
    );
  }
}

const CheckGrid = styled.div`
  display: flex; /* gap: 13px; */
  flex-flow: wrap;
  margin: 30px -7px 0;
`;
const CheckBox = styled.label`
  margin: 0 7px 14px;
  width: calc(25% - 14px);
  text-align: center;
  font-size: 2rem;
  border-radius: 8px;
  padding: 15px 10px 15px;
  color: var(--text-color);
  cursor: pointer;
  border: 2px solid var(--text-color);
  font-size: 1.7rem;
  position: relative;
  input {
    opacity: 0;
    position: absolute;
  }
  span {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: none;
  }
  input:checked + span {
    background: rgba(255, 255, 255, 0.2);
    // background: #2E1A00;
    // border:2px solid rgba(46, 26, 0, 1)
  }
  /* input:checked + span:after {content: ""; width: 30px; height: 8px; background: var(--primary); display: inline-block; top: 50%; position: relative; transform: translateY(-50%); filter: blur(10px); vertical-align: top;} */
  &:last-child,
  &:nth-last-child(2) {
    width: calc(50% - 14px);
  }
`;
const CheckLabel = styled.label`
  width: 100%;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 11px 7px;
`;

const StakingData = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px 0 0 0;
  p {
    width: calc(50% - 14px);
    font-size: 1.8rem;
    margin-bottom: 20px;
    line-height: 1.5;
    padding-right: 10px;
    span {
      width: 100%;
      display: block;
      font-size: 2rem;
      font-weight: 600;
    }
    i {
      margin-left: 10px;
    }
  }
  @media (max-width: 480px) {
    p {
      width: 100%;
      margin-bottom: 10px;
      font-size: 1.6rem;
      span {
        display: inline-block;
        width: auto;
        margin-left: 10px;
        font-size: 1.6rem;
      }
    }
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: (val) => dispatch(),
    enableMetamask: () => dispatch(),
    enabledWalletConnect: () => dispatch(),

    // getKYCData: (address) => dispatch(actions.getKYCData(address)),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.web3Data,
    kycData: state.fetchKYCData,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(Staking);
