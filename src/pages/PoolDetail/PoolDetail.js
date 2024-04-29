import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { web3 } from "../../redux/actions/metamaskAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import { onboard } from "../../web3Onboard";
import Modal from "@material-ui/core/Modal";

import "./PoolDetail.css";
import PoolInformation from "./PoolInformation";
import AboutProject from "./AboutProject";
import TelegramIcon from "@material-ui/icons/Telegram";
import LanguageIcon from "@material-ui/icons/Language";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";

import txprogress from "../../images/loading.gif";
import { connect, useSelector } from "react-redux";
import { actions } from "../../actions";
import { Button, Loading } from "../../theme/main.styled";
import {web3} from "../../web3";

const PoolDetail = (props) => {
  const { getSinglePoolDetail, singlePoolDetail, web3Data } = props;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [number1, setNumber1] = useState();
  const [number2, setNumber2] = useState();
  const [amount, setAmount] = useState();
  const [whichtier, setwhichtier] = useState(0);
  const [txloader, settxloader] = useState(false);
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
  const id = useParams().id;
  const name = useParams().name;
  var y = 0;
  if (name === "upcomming") {
    y = 1;
  }

  useEffect(() => {
  
    getSinglePoolDetail(id);
  }, [id]);


  const [contractAddr, setContractAddr] = useState();
  useEffect(() => {
    if (singlePoolDetail?.phases[0].phaseContractAddress) {
   
      setContractAddr(singlePoolDetail?.phases[0].phaseContractAddress);
    }
  }, [singlePoolDetail]);



  useEffect(() => {
    async function simpleContract() {
      try {
        if (contractAddr) {
          const SimpleContract = new web3.eth.Contract(
            singlePoolDetail?.isPaymentTokenNative
          );
          //Getting total bnb from blockchain
          let totalTokenFxn = !singlePoolDetail?.isPaymentTokenNative
            ? "totalBUSDReceivedInAllTier"
            : "totalBnbReceivedInAllTier";
       
          const result = await SimpleContract.methods[totalTokenFxn]().call();
          //Getting max cap from blockchain
          setTotalPoolRaise(+web3.utils.fromWei(result));
        }
      } catch (err) {
        console.error(err);
      }
    }
    simpleContract();
  }, [contractAddr]);

  useEffect(() => {
    const getUserDetails = async () => {
      let _userDetails = {};
      const igoContractInstance = new web3.eth.Contract(
        contractAddr
      );
      const usertierDetails = await igoContractInstance.methods
        .userDetails(web3Data.address)
        .call();
      _userDetails.tier = usertierDetails.tier;
      _userDetails.investedAmount = usertierDetails.investedAmount;
      // Get balance of connected address.
      _userDetails.balance = await web3.eth.getBalance(web3Data?.address);
      if (!singlePoolDetail?.isPaymentTokenNative && web3Data?.address) {
        const tokenContractInstance = new web3.eth.Contract(
    
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
    };
    if (web3Data.address && contractAddr) getUserDetails();
    settxloader(false);
  }, [web3Data, contractAddr, tokenAllowance]);

  useEffect(() => {
    setInterval(async function () {
      if (contractAddr) {
        const SimpleContract = new web3.eth.Contract(
        );
        //Getting total bnb from blockchain
        let totalTokenFxn = !singlePoolDetail?.isPaymentTokenNative
          ? "totalBUSDReceivedInAllTier"
          : "totalBnbReceivedInAllTier";

        const result = await SimpleContract.methods[totalTokenFxn]().call();
        const total = await SimpleContract.methods.maxCap().call();
        setNumber2(result / 10 ** 18);
        setNumber1((result / 10 ** 18 / (total / 10 ** 18)) * 100);
      }
    }, 20000);
  }, [contractAddr, singlePoolDetail?.isPaymentTokenNative]);


  const transactionMetamask = async () => {
    try {
  
      const avalue = web3.utils.toWei(amount.toString());

      const provider = window.provider;

      const chainid = provider.chainId;
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
            {
              position: toast.POSITION.TOP_CENTER,
            }
          );
        }
        const address = window.addressselected;

        toast.info("Transaction in progress...", {
          position: toast.POSITION.TOP_CENTER,
        });
        if (!singlePoolDetail?.isPaymentTokenNative) {
          settxloader(true);
          const igoContractInstance = new web3.eth.Contract(
            !singlePoolDetail?.isPaymentTokenNative
      
      
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
            onReciept(txstatus);
          } else {
            onError();
            setOpen(false);
          }
        }
      } else {
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
        status: toast.error("Transaction reverted, try again.", {
          position: toast.POSITION.TOP_CENTER,
        }),
      };
    }
  };

  const onReciept = (txstatus) => {
    settxloader(false);
    var hash = `https://bscscan.com/tx/${txstatus.transactionHash}`;
    var label = "View your transaction";
    const CustomToastWithLink = () => (
      <div style={{ textAlign: "center" }}>
        Transaction confirmed! <br />
      
      </div>
    );
    setOpen(false);
    toast.info(CustomToastWithLink, { position: toast.POSITION.TOP_CENTER });
  };
  const onError = () => {
    settxloader(false);
    setOpen(false);
    return toast.error("Transaction Failed!", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const checktierswhitelist = async () => {
    let tier_value = +userdetails.tier;
    if (!web3Data?.address) {
      return toast.info("Your wallet is not connected!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    // } else {
    // 	return toast.info('Address does not match!', { position: toast.POSITION.TOP_CENTER })
    // }
  };

  if (singlePoolDetail?.start_date) {
    var closed = 0;
    var closesIn = 0;
    var startIn = 0;
    var filled = 0;
    var date = new Date();
    var now_utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );

    var start = singlePoolDetail?.start_date;
    var end = singlePoolDetail?.end_date;
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
 
    return (
      <div className="paper">
        <div className="paper-inner">
          <div className="paper-head">
            <h2 className="paper_h2" id="simple-modal-title">
              {!singlePoolDetail?.isPaymentTokenNative &&
              +userdetails?.allowance == 0 &&
              tokenAllowance == 0
                ? "Approve Token"
                : "Buy Token"}
            </h2>

            <span onClick={() => handleClose()}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>
          </div>
          {txloader && <Loading></Loading>}
          {!txloader && (
            <div>
              {!singlePoolDetail?.isPaymentTokenNative &&
              +userdetails?.allowance == 0 &&
              tokenAllowance == 0 ? (
                <br />
              ) : (
                <div>
                  <p className="amt">
                    Enter amount in {singlePoolDetail?.paymentTokenSymbol} :{" "}
                  </p>
                  <input
                    className="paper_input "
                    type="number"
                    min="0"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              )}
              <Button
                className="paper_button primary"
                onClick={() =>
                  !singlePoolDetail?.isPaymentTokenNative &&
                  +userdetails?.allowance == 0 &&
                  tokenAllowance == 0
                    ? approveTokens()
                    : transactionMetamask()
                }
              >
                {!singlePoolDetail?.isPaymentTokenNative &&
                +userdetails?.allowance == 0 &&
                tokenAllowance == 0
                  ? "Approve"
                  : "Confirm"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
   
  };
  const approveTokens = async () => {
    const tokenContractInstance = new web3.eth.Contract(
      web3.utils.toChecksumAddress(singlePoolDetail.paymentTokenAddress)
    );
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

  const [startTime, setStartTime] = useState("");
  const [startTimeMobile, setStartTimeMobile] = useState("");


  var allocation = totalPoolRaise * singlePoolDetail?.up_pool_raise;
  var num = Math.ceil(
    (totalPoolRaise / singlePoolDetail?.targetPoolRaise) * 100
  );
  var full = "";
  if (num === 50) {
    full = "fullupload";
  }
  return (
    <div>
      <div className="pool_detail_banner">
        <div className="container_cust">
          <div className="inner_pool_detail_banner">
            <div className="left_ban">
              <div className="ti_tle">
                <img src={singlePoolDetail?.imageURL} alt="" />
                <div className="socia_grd">
                  <div>
                    <h3>{singlePoolDetail?.igoName}</h3>

                    <p>{singlePoolDetail?.content}</p>
                  </div>
                  <div className="socia_l">
                    <ul>
                      {singlePoolDetail?.socialLinks.twitter ? (
                        <li className="nav-item ">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>
                              <i
                                className="fa fa-twitter"
                                aria-hidden="true"
                              ></i>
                            </span>{" "}
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.facebook ? (
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>
                              <i
                                className="fa fa-medium"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.telegram ? (
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <TelegramIcon />
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.browser_web ? (
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.browser_web}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <LanguageIcon />
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.youtube ? (
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <YouTubeIcon />
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.instagram ? (
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <InstagramIcon />
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      {singlePoolDetail?.socialLinks.discord ? (
                        <li className="nav-item ">
                          <a
                            className="nav-link"
                            href={singlePoolDetail?.socialLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>
                              <i
                                className="fa fa-discord"
                                area-hidden="true"
                              ></i>
                            </span>{" "}
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="right_ban">
              <div className="detail_card_outer">
                <div className="detail_card">
                  <div className="tit_row">
                    <div className="tit_le2">
                   
                      <h3>
                        <div className="pooldetail-title">
                          {singlePoolDetail?.paymentTokenSymbol} Coin{" "}
                        </div>
                        <span>
                          {" "}
                          1 {singlePoolDetail?.paymentTokenSymbol} ={" "}
                          {singlePoolDetail?.price}{" "}
                          {singlePoolDetail?.igoTokenSymbol}{" "}
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="allocation">
                    <div>
                      <p>Total Raised</p>
                      <div className="timer_desktop">
                        <h3 style={{ color: "white", fontSize: 18 }}>
                          {totalPoolRaise ? totalPoolRaise.toFixed(4) : "0"}{" "}
                          {singlePoolDetail?.paymentTokenSymbol}
                        </h3>
                      </div>
                      <div className="timer_mobile">
                        <h3 style={{ color: "white", fontSize: 14 }}>
                          {totalPoolRaise ? totalPoolRaise.toFixed(4) : "0"}{" "}
                          {singlePoolDetail?.paymentTokenSymbol}
                        </h3>
                      </div>
                    </div>
                    <div className="rts">
                      {startIn ? <p className="status-p">Start in</p> : ""}
                      <div className="timer_desktop">
                        {startIn === 1 ? (
                          <h3
                            style={{ color: "white", fontSize: 18 }}
                            id="poolonpagestart"
                          >
                            {startTime}
                          </h3>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="timer_mobile">
                        {startIn === 1 ? (
                          <h3
                            style={{ color: "white", fontSize: 14 }}
                            id="poolonpagestart"
                          >
                            {startTimeMobile}
                          </h3>
                        ) : (
                          ""
                        )}
                      </div>
                      {closesIn ? <p className="status-p">Ends in</p> : ""}
                      <div className="timer_desktop">
                        {closesIn === 1 ? (
                          <h3
                            style={{ color: "white", fontSize: 18 }}
                            id="poolonpagestart"
                          >
                            {startTimeMobile}
                          </h3>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="timer_mobile">
                        {closesIn === 1 ? (
                          <h3
                            style={{ color: "white", fontSize: 14 }}
                            id="poolonpagestart"
                          >
                            {startTimeMobile}
                          </h3>
                        ) : (
                          ""
                        )}
                      </div>
                      {closed ? <p className="status-p">Status</p> : ""}
                      {closed ? <h3>Closed</h3> : ""}
                      {filled ? <h3>Filled</h3> : ""}
                    </div>
                  </div>

                  <div className="prog_bar">
                    <div className="prog_bar_grd">
                      <span className="prog _percent">
                        <p>Progress</p>{" "}
                        {totalPoolRaise
                          ? (
                              (totalPoolRaise /
                                singlePoolDetail.targetPoolRaise) *
                              100
                            ).toFixed(2)
                          : "0"}
                        %
                      </span>
                      {
                        <span className="parti _nls">
                          {totalPoolRaise
                            ? (
                                totalPoolRaise * singlePoolDetail?.price
                              ).toFixed(2)
                            : "0"}
                          /
                          {singlePoolDetail?.targetPoolRaise *
                            singlePoolDetail?.price}{" "}
                    
                          {singlePoolDetail?.igoTokenSymbol}
                        </span>
                      }
                    </div>
               
                    <div className={`battery ${full}`}>
                      {num
                        ? [...Array(num)].map(() => (
                            <div className="bar active" data-power="10"></div>
                          ))
                        : ""}
                    </div>
                  </div>
                  <div className="buy-btnbtc">
         
                    {y ? (
                      ""
                    ) : (
                      <Button
                        className="primary"
                        onClick={() => checktierswhitelist()}
                       
                      >
                        Buy Tokens
                      </Button>
                    )}
            
                    <div className="prog_bar_grd">
                      <span className="parti">
                        <p>Limited</p> Participants{" "}
         
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Modal for transaction amount input. */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body()}
        </Modal>
      </div>
      <PoolInformation singlePoolDetail={singlePoolDetail} />
      <AboutProject singlePoolDetail={singlePoolDetail} />
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

    </div>
  );
};

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

export default connect(mapStateToProps, mapDipatchToProps)(PoolDetail);
