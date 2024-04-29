import React, { PureComponent, Component, useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Container,
  SquareBtns,
  Networks,
  NameBlock,
} from "../theme/main.styled";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PopEdit from "./../component/editProfile";
import CurrentStaking from "./../component/Modal/CurrentStakingPoolModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CoverBg from "./../assets/images/cover.jpg";
import Profilepic from "./../assets/images/profilepic.jpg";
import icon1 from "./../assets/images/icon1.png";
import icon2 from "./../assets/images/icon2.png";
import icon3 from "./../assets/images/icon3.png";
import icon4 from "./../assets/images/icon4.png";
import icon5 from "./../assets/images/icon5.png";
import icon6 from "./../assets/images/icon6.png";
import icon from "./../assets/images/icon.png";
import { connect } from "react-redux";
import { actions } from "../actions";
import axios from "axios";
import {
  getContractInstance,
  TimeStampToDateString,
} from "../helpers/functions";
import getContractAddresses from "../contractData/contractAddress/addresses";
import Timer from "../component/timer";
import { dataFunctions } from "../component/walletFunctions";
import ReactTooltip from "react-tooltip";
import { MoonLoader } from "react-spinners";
import { web3 } from "../web3";
let percentage = 0;
const Launchpad = (props) => {
  const [personalInfo, setPersonalInfo] = useState({
    Profilepic: "",
    name: "",
    emailAddress: "",
    coverBg: "",
    socialLinks: {
      twitterLink: "",
      telegramLink: "",
      mediumLink: "",
    },
  });
  const [ToggleState, setToggleState] = useState(1);
  const [editProfile, setEditProfile] = useState({});
  const [currentStaking, setCurrentStaking] = useState({});
  const [currentSPDetail, setCurrentSPDetail] = useState([]);
  const [userTokenClaimArr, setUserTokenClaimArr] = useState([]);
  const [currentStake, setCurrentStake] = useState({
    num: 0,
    APY: 0,
    deposits: 0,
  });
  const [totalStake, setTotalStake] = useState(0);
  const [tier, setTier] = useState(0);
  const [IGOParticipants, setIGOParticipants] = useState({
    no_of_participants: 1,
    total_participants: 3,
  });
  const [KYCStatus, setKYCStatus] = useState("approved");
  const [coinMarket, setCoinMarket] = useState({});
  const [userData, setUserData] = useState("");
  let navigate = useNavigate();
  const toggleTab = (index) => {
    setToggleState(index);
  };
  const {
    getUserProfileDetail,
    web3Data,
    fetchUserProfileDetail,
    getUserIGOPools,
    fetchUserIGOPools,
    editUserProfileDetail,
    updatedProfileDetail,
  } = props;
  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  const getPrice = async () => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=fund&sparkline=false`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.status == 200) setCoinMarket(response.data[0]);
  };
  useEffect(() => {
    getPrice();
  }, [currentSPDetail]);

  useEffect(() => {
    if (0 < totalStake && totalStake <= 250) setTier(1);
    else if (250 < totalStake && totalStake <= 1000) setTier(2);
    else if (1000 < totalStake && totalStake <= 2500) setTier(3);
    else if (2500 < totalStake && totalStake <= 5000) setTier(4);
    else if (5000 < totalStake && totalStake <= 7500) setTier(5);
    else if (7500 < totalStake && totalStake <= 10000) setTier(6);
    else if (10000 < totalStake && totalStake <= 25000) setTier(7);
    else if (25000 < totalStake && totalStake <= 50000) setTier(8);
    else if (50000 < totalStake && totalStake <= 100000) setTier(9);
    else {
      setTier(0);
    }
  }, [totalStake]);
  const getUserData = async (web3Data) => {
    try{ 
    const poolDays = [30,90,180,365];
    let obj = [];
    for (let i = 0; i < poolDays.length; i++) {
      const stakingContractInstance = await getContractInstance(poolDays[i]);
      const tokenContractInstance = await getContractInstance("Token");
      const allowanceAddress = await getContractAddresses();
      let deposits = await stakingContractInstance.methods
        .userDeposits(web3Data.accounts[0])
        .call();
      const allowance = Number(
        web3.utils.fromWei(
          await tokenContractInstance.methods
            .allowance(web3Data.accounts[0], allowanceAddress[poolDays[i]])
            .call()
        )
      );
      const userBalance = web3.utils.fromWei(
        await tokenContractInstance.methods
          .balanceOf(web3Data.accounts[0])
          .call(),
        "ether"
      );
      const WithdrawAmount = Number(
        web3.utils.fromWei(deposits ? deposits[0] : "0")
      );
      const calRate = await stakingContractInstance.methods.rate().call();
      const rate = (await (+calRate * 365)) / poolDays[i];
      const APY = (+rate / 100000).toFixed();
      if (WithdrawAmount > 0) {
        await obj.push({
          num: poolDays[i],
          deposits,
          allowance,
          userBalance,
          WithdrawAmount,
          APY,
        });
      }
    }
    const farmingContractInstance = await getContractInstance(
      "farming",
      "pancakeSwap",
      false
    );
    const lpTokenContractInstance = await getContractInstance(
      "lpToken",
      "pancakeSwap",
      false
    );
    // let userLPBalance = await web3.utils.fromWei(
    //   await lpTokenContractInstance.methods
    //     .balanceOf(web3Data.accounts[0])
    //     .call(),
    //   "ether"
    // );
    let userLPStake = await farmingContractInstance.methods
      .userDeposits(web3Data.accounts[0])
      .call();
    setUserData({
      ...userData,
      userLPStake: userLPStake,
    });
    await setCurrentSPDetail(obj);
    if (obj.length > 0) setRefresh(obj);
  } catch (error) {
    console.error("Error occurred while profile getUserData:", error);
  } 
  };
  const setRefresh = (obj) => {
    setTimeout(() => {
      setCurrentSPDetail(obj);
    }, 1000);
  };
  useEffect(() => {
    if (fetchUserIGOPools) {
      callUserData(fetchUserIGOPools, web3Data);
    }
  }, [fetchUserIGOPools]);
  useEffect(() => {
    if (fetchUserProfileDetail) {
      userPersonalData();
    }
  }, [fetchUserProfileDetail]);
  const callUserData = async (pools, web3Data) => {
    const walletNo = +localStorage.getItem("walletNo");

    const data = await dataFunctions(
      +walletNo === 2 ? "SOL" : "ETH",
      pools,
      web3Data,
      null
    );
    // setSolanaVesting(data.solanaVesting);
    setUserTokenClaimArr(data?._userTokensClaimArr);
    // setUserTokendata(data?._userTokensClaimArr);
    // return web3.utils.fromWei(_userTokenClaimamount);
  };
  useEffect(() => {
    const total = async function () {
      let totalStake = 0;
      setCurrentStake(currentSPDetail[0]);
      await currentSPDetail.map((stake) => {
        totalStake += stake.WithdrawAmount;
      });
      setTotalStake(totalStake);
    };
    if (currentSPDetail.length !== 0) {
      total();
    }
  }, [currentSPDetail]);
  useEffect(() => {
    if (web3Data?.isLoggedIn) {
      getUserData(web3Data);
      getUserProfileDetail(web3Data?.accounts[0]);
      getUserIGOPools(web3Data?.accounts[0], "BNB", 1);
      // getIGOParticipants(web3Data?.accounts[0]);
    } else
      setPersonalInfo({
        Profilepic: "",
        name: "",
        emailAddress: "",
        coverBg: "",
        socialLinks: {
          twitterLink: "",
          telegramLink: "",
          mediumLink: "",
        },
      });
  }, [web3Data]);
  const userPersonalData = async () => {
    // fetchUserProfileDetail
    if (fetchUserProfileDetail?.status == false) {
      setPersonalInfo({
        Profilepic: "",
        name: "",
        emailAddress: "",
        coverBg: "",
        socialLinks: {
          twitterLink: "",
          telegramLink: "",
          mediumLink: "",
        },
      });
    } else {
      await setPersonalInfo({
        Profilepic: fetchUserProfileDetail?.profilePics.profile,
        name: fetchUserProfileDetail?.name,
        emailAddress: fetchUserProfileDetail?.email,
        coverBg: fetchUserProfileDetail?.profilePics.cover,
        // socialLinks: {
        //   twitterLink: fetchUserProfileDetail?.twitter,
        //   telegramLink: fetchUserProfileDetail?.telegram,
        //   mediumLink: fetchUserProfileDetail?.medium,
        // },
      });
      // if (fetchUserProfileDetail?.kycStatus == "nonblockpass")
      //   setKYCStatus("Not Registered");
      // else setKYCStatus(fetchUserProfileDetail?.kycStatus);
      // await setKYCStatus(fetchUserProfileDetail.kycStatus);
    }
  };
  const editUserProfile = async () => {
    let data = await {
      username: personalInfo.name,
      email: personalInfo.emailAddress,
      profileLink: personalInfo.Profilepic,
      coverLink: personalInfo.coverBg,
    };
    if (web3Data?.isLoggedIn) {
      await editUserProfileDetail(web3Data?.accounts[0], data);
    }
  };
  useEffect(() => {
    if (updatedProfileDetail) {
      getUserProfileDetail(web3Data?.accounts[0]);
      setEditProfile({ open: false });
    }
  }, [updatedProfileDetail]);
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
  const getIGOParticipants = async () => {
    // setIGOParticipants({ no_of_participants: 4, total_participants: 5 });
  };
  return (
    <>
      <AccentImg
        style={{
          backgroundImage: `url(${
            personalInfo.coverBg ? personalInfo.coverBg : CoverBg
          })`,
        }}
      />
      {/* Replace same image as cover image */}
      <Container>
        <ProfileTop>
          <CoverImg
            style={{
              backgroundImage: `url("${
                personalInfo.coverBg ? personalInfo.coverBg : CoverBg
              }")`,
            }}
          />
          <UserDetails>
            <div
              className="userImg"
              style={{
                backgroundImage: `url("${
                  personalInfo.Profilepic ? personalInfo.Profilepic : Profilepic
                }")`,
              }}
            />
            <div>
              <h3>
                {personalInfo.name ? personalInfo.name : "USERNAME"}{" "}
                <strong>
                  <i
                    class="fas fa-edit"
                    onClick={() => setEditProfile({ open: true })}
                  ></i>
                </strong>
              </h3>
              <h4>
                KYC Status:{" "}
                {KYCStatus == "approved" ? (
                  <span className="completed">
                    <i className="fas fa-check-circle"></i>{" "}
                    {KYCStatus?.toUpperCase()}
                  </span>
                ) : KYCStatus == "rejected" || KYCStatus == "blocked" ? (
                  <span className="failed">
                    <i className="fas fa-exclamation-circle"></i>{" "}
                    {KYCStatus?.toUpperCase()}
                  </span>
                ) : (
                  <span className="warning">
                    <i className="fas fa-exclamation-circle"></i>{" "}
                    {KYCStatus?.toUpperCase()}
                  </span>
                )}
                {/* <span className="failed">
                  <i className="fas fa-exclamation-circle"></i> Pending
                </span>
                <span className="completed">
                  <i className="fas fa-check-circle"></i> Completed
                </span> */}
              </h4>
            </div>
          </UserDetails>
          <TabLinks>
            <li className="active">Overview</li>
            {/* <li>Seed Staking </li>
            <li>NFTs</li> */}
          </TabLinks>
          <ActionRight>
            {/* <Button className="add-wallet">Add Wallets</Button> */}
            <SquareBtns className="networks">
              <Link
                onClick={() =>
                  window.open(
                    `${
                      personalInfo.socialLinks?.telegramLink
                        ? personalInfo.socialLinks?.telegramLink
                        : "https://desktop.telegram.org/"
                    }`
                  )
                }
              >
                <i class="fab fa-telegram-plane"></i>
              </Link>
              <Link
                onClick={() =>
                  window.open(
                    `${
                      personalInfo.socialLinks?.twitterLink
                        ? personalInfo.socialLinks?.twitterLink
                        : "https://twitter.com/"
                    }`
                  )
                }
              >
                <i class="fab fa-twitter"></i>
              </Link>
              <Link
                onClick={() =>
                  window.open(
                    `${
                      personalInfo.socialLinks?.mediumLink
                        ? personalInfo.socialLinks?.mediumLink
                        : "https://medium.com/"
                    }`
                  )
                }
              >
                <i class="fab fa-medium-m"></i>
              </Link>
            </SquareBtns>
          </ActionRight>
        </ProfileTop>

        <GridView>
          <GridCard className="col-4">
            <h3>IGOs Participated</h3>
            <div className="cardBody">
              <div className="progressSec">
                <CircularProgressbar
                  value={Math.round(
                    (+IGOParticipants?.no_of_participants /
                      +IGOParticipants?.total_participants) *
                      100
                  )}
                  text={
                    IGOParticipants?.total_participants > 0
                      ? Math.round(
                          (+IGOParticipants?.no_of_participants /
                            +IGOParticipants?.total_participants) *
                            100
                        ) + "%"
                      : "0%"
                  }
                />
                {console.log(
                  "Total participants",
                  Math.floor(
                    (+IGOParticipants?.no_of_participants /
                      +IGOParticipants?.total_participants) *
                      100
                  ) + "%"
                )}
                {/* react-circular-progressbar */}
              </div>
              <div className="cardcol">
                <span className="fos5">
                  {IGOParticipants.no_of_participants}/
                  {IGOParticipants.total_participants}
                </span>
              </div>
            </div>
          </GridCard>
          <GridCard className="col-5">
            <h3>
              Current Staking Pool{" "}
              <span onClick={() => setCurrentStaking({ open: true })}>
                View All
              </span>
            </h3>
            {/* currentSPDetail?.map(
                (currentStake) =>
                    currentStake.num==7 ? 
                  currentStake.WithdrawAmount > 0 && ( */}
            {currentSPDetail.length != 0 ? (
              <div className="cardBody">
                <div className="cardcol br-1 f-col">
                  <span className="fos1">Days</span>
                  <strong className="fos4">{currentStake.num}</strong>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos1">APY</span>
                  <strong className="fos4">{currentStake.APY}%</strong>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos1">LEFT</span>

                  <strong className="fos4">
                    {!+currentStake.deposits?.[2] ? (
                      "0D"
                    ) : +currentStake.deposits?.[2] >
                      new Date().getTime() / 1000 ? (
                      <Timer timeLeft={currentStake.deposits?.[2]} />
                    ) : (
                      <p>Reached</p>
                    )}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="cardBody">
                <div className="cardcol br-1 f-col">
                  <span className="fos1">Days</span>
                  <strong className="fos4">0</strong>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos1">APY</span>
                  <strong className="fos4">0 %</strong>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos1">LEFT</span>
                  <strong className="fos4">0D</strong>
                </div>
              </div>
            )}
            {/* <div className="cardBody">
              <div className="cardcol br-1 f-col">
                <span className="fos1">Days</span>
                <strong className="fos4">
                  {currentSPDetail.length != 0
                    ? currentSPDetail?.map(
                        (currentStake) =>
                          currentStake.WithdrawAmount > 0 && currentStake.num
                      )
                    : 0}
                </strong>
              </div>
              <div className="cardcol br-1 f-col">
                <span className="fos1">APY</span>
                <strong className="fos4">
                  {currentSPDetail.length != 0
                    ? currentSPDetail?.map(
                        (currentStake) =>
                          currentStake.WithdrawAmount > 0 && currentStake.APY
                      )
                    : 0}
                  %
                </strong>
              </div>
              <div className="cardcol br-1 f-col">
                <span className="fos1">LEFT</span>

                <strong className="fos4">
                  {currentSPDetail.length != 0
                    ? currentSPDetail?.map(
                        (currentStake) =>
                          currentStake.WithdrawAmount > 0 &&
                          (!+currentStake.deposits?.[2] ? null : +currentStake
                              .deposits?.[2] >
                            new Date().getTime() / 1000 ? (
                            <Timer timeLeft={currentStake.deposits?.[2]} />
                          ) : (
                            <p>Reached</p>
                          ))
                      )
                    : "0D"}
                </strong>
              </div>
            </div> */}
            {/* <div className="cardBody">
              <div className="cardcol br-1 f-col">
                <span className="fos1">Days</span>
                <strong className="fos4">14</strong>
              </div>
              <div className="cardcol br-1 f-col">
                <span className="fos1">APY</span>
                <strong className="fos4">10%</strong>
              </div>
              <div className="cardcol br-1 f-col">
                <span className="fos1">LEFT</span>
                <strong className="fos4">5D</strong>
              </div>
            </div> */}
          </GridCard>
          <GridCard className="col-3">
            <h3>TOKEN</h3>
            {/* <div className="cardBody f-col">
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Price</span>
                <div className="fos2">
                  1.197635% last 24h <strong>$1.32999</strong>
                </div>
              </div>
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Holders</span>
                <strong className="fos2">48350</strong>
              </div>
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Mcap</span>
                <strong className="fos2">$54055000</strong>
              </div>
            </div> */}
            <div className="cardBody f-col">
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Price</span>
                <div className="fos2">
                  {Number(coinMarket?.price_change_percentage_24h?.toFixed(4))}%
                  last 24h{" "}
                  <strong>
                    ${Number(coinMarket?.current_price?.toFixed(6))}
                  </strong>
                </div>
              </div>
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Holders</span>
                <strong className="fos2">48350</strong>
              </div>
              <div className="cardcol bb-1 f-col">
                <span className="fos1">Mcap</span>
                <strong className="fos2">${coinMarket?.market_cap}</strong>
              </div>
            </div>
          </GridCard>

          <GridCard className="col-3">
            <h3>BUSD Invested</h3>
            <div className="cardBody">
              <div className="cardcol">
                <img width="80" src={icon} alt="icon" />
              </div>
            </div>
          </GridCard>
          <GridCard className="col-4">
            <h3>Staking Balance</h3>
            <div className="cardBody">
              <div className="cardcol br-1 f-col">
                <span className="fos1">TOKEN STAKED</span>
                <strong className="fos4">
                  {totalStake}
                  {/* {userData
                    ? +userData?.stakedBalance.toLocaleString(undefined, 4)
                    : 0} */}
                </strong>
              </div>
              <div className="cardcol br-1 f-col">
                <span className="fos1">LIQUIDITY BALANCE</span>
                <strong className="fos4">
                  {userData
                    ? (+web3.utils.fromWei(
                        userData ? userData.userLPStake[0] : "0"
                      )).toFixed(4)
                    : 0}
                  {/* {userData
                    ? (+userData?.userLPBalance).toLocaleString(undefined, 4)
                    : 0} */}
                </strong>
              </div>
            </div>
          </GridCard>
          <GridCard className="col-5">
            <h3>Tier</h3>
            <div className="cardBody f-col">
              <div className="cardcol">
                {tier == 0 ? (
                  <p className="fos2">
                    Once you start having activity, your tier level will be
                    shown here.
                  </p>
                ) : (
                  <p className="fos4">TIER {tier}</p>
                )}
              </div>
            </div>
          </GridCard>
        </GridView>

        <ClaimTop>
          <h1>Claim your IGO tokens </h1>
          <Networks>
            <p>Select a Network</p>
            <SquareBtns className="networks">
              <Link to="#" className="active">
                <img src={icon1} alt="icon1"></img>
              </Link>
              <Link to="#">
                <img src={icon2} alt="icon2"></img>
              </Link>
              <Link to="#">
                <img src={icon3} alt="icon3"></img>
              </Link>
              <Link to="#">
                <img src={icon4} alt="icon4"></img>
              </Link>
              <Link to="#">
                <img src={icon5} alt="icon5"></img>
              </Link>
              <Link to="#">
                <img src={icon6} alt="icon6"></img>
              </Link>
            </SquareBtns>
          </Networks>
        </ClaimTop>

        <ClaimList>
          {console.log("fetchUserIGOPools", userTokenClaimArr)}
          {fetchUserIGOPools
            ? fetchUserIGOPools.map((pool, key) => (
                <ClaimRow
                  key={key}
                  onClick={() => {
                    navigate("/claims");
                  }}
                >
                  <NameBlock className="lg name">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${pool.logo})` }}
                    />
                    <div>
                      <h4>{pool.name}</h4>
                    </div>
                  </NameBlock>
                  {pool.vestingType === "linear" && (
                    <ClaimCol>
                      <p>
                        Claimed
                        <span>
                          {userTokenClaimArr?.[key]?.claimedAmount
                            ? (+userTokenClaimArr?.[key]
                                ?.claimedAmount).toFixed(4)
                            : 0}
                        </span>
                      </p>
                    </ClaimCol>
                  )}
                  <ClaimCol>
                    <p>
                      {pool.vestingType === "linear"
                        ? "Claimable / Left"
                        : "Your allocation"}
                      <span>
                        {pool.vestingType === "linear"
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
                          // setCurrentIDO(key);
                          // setOpenFirst(true);
                          // claimAvailableVestings(key);
                          // setVestingFunc("multiple");
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
                        // onClick={() => {
                        //   setCurrentIDO(key);
                        //   unLockSolana(key);
                        // }}
                      >
                        Unlock Tokens
                      </Button>
                    ) : (
                      <Button
                        className="primary"
                        // onClick={() => {
                        //   setCurrentIDO(key);
                        //   setOpenFirst(true);
                        //   setVestingFunc(
                        //     userTokenClaimArr?.key?.isVesting
                        //       ? "multiple"
                        //       : "non-merkle"
                        //   );
                        // }}
                      >
                        Claim tokens
                      </Button>
                    )}
                    {/* <Button className="disabled">UNAVAILABLE</Button> */}
                  </ClaimCol>
                </ClaimRow>
              ))
            : ""}
        </ClaimList>
        <CurrentStaking
          currentStaking={currentStaking}
          setCurrentStaking={setCurrentStaking}
          currentSPDetail={currentSPDetail}
          setCurrentSPDetail={setCurrentSPDetail}
        />
        <PopEdit
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          editUserProfile={editUserProfile}
        ></PopEdit>

        {/* <Button className="btn primary mt-2" onClick={notify}>
          Notify!
        </Button> */}
        {/* <ToastContainer
          position="bottom-right"
          autoClose={8000}
          hideProgressBar={true}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="dark"
        /> */}
      </Container>
    </>
  );
};

const ProfileTop = styled.div`
  height: 370px;
  width: 100%;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
`;
const CoverImg = styled.div`
  height: 300px;
  width: 100%;
  background-size: cover;
  border-radius: 25px;
  position: relative;
  overflow: hidden;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(rgb(0, 0, 0, 0), rgb(0, 0, 0));
    opacity: 0.58;
  }
`;
const AccentImg = styled.div`
  position: absolute;
  width: 100%;
  background-size: cover;
  background-position: center top;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  filter: blur(25px);
  opacity: 0.2;
`;
const UserDetails = styled.div`
  position: absolute;
  bottom: 14px;
  left: 90px;
  display: flex;
  .userImg {
    background-size: cover;
    background-position: center top;
    width: 156px;
    height: 156px;
    border-radius: 17px;
    margin-right: 25px;
  }
  h3 {
    font-size: 3rem;
    margin: 22px 0 12px 0;
    strong {
      font-size: 2rem;
      vertical-align: top;
      margin-top: 5px;
      display: inline-block;
      margin-left: 8px;
    }
  }
  h4 {
    font-size: 1.5rem;
    span.warning {
      color: var(--yellow);
      padding-left: 4px;
    }
    span.failed {
      color: var(--red);
      padding-left: 4px;
    }
    span.nonregistered {
      color: var(--text-color);
      padding-left: 4px;
    }
    span.completed {
      color: var(--green);
      padding-left: 4px;
    }
  }
  @media (max-width: 1400px) {
    left: 40px;
  }
`;
const ActionRight = styled.div`
  position: absolute;
  right: 25px;
  bottom: 13px;
  display: flex;
  .add-wallet {
    height: 44px;
    margin-right: 26px;
    background: rgba(255, 255, 255, 0.1);
    padding-top: 12px;
  }
`;
const TabLinks = styled.div`
  position: absolute;
  bottom: 0;
  left: 272px;
  flex-flow: columns;
  display: flex;
  li {
    cursor: pointer;
    list-style: none;
    padding: 26px 15px 23px;
    margin-right: 5px;
    font-weight: 600;
    position: relative;
    overflow: hidden;
    &.active {
      border-bottom: 3px solid var(--primary);
      color: var(--primary);
      &:after {
        content: "";
        width: 60px;
        height: 40px;
        background: var(--primary);
        position: absolute;
        bottom: -15px;
        left: 50%;
        margin-left: -30px;
        z-index: -1;
        filter: blur(15px);
        opacity: 0.4;
      }
    }
  }
  @media (max-width: 1400px) {
    left: 230px;
  }
`;
const GridView = styled.section`
  /* Grid Sizes */
  --c3: calc(25% - 26px);
  --c4: calc(33.33% - 26px);
  --c5: calc(41.66% - 26px);
  padding: 54px 0 0;
  display: flex;
  width: 100%;
  flex-flow: wrap;
  gap: 26px;
  /* grid-template-columns: var(--c4) auto var(--c3); */
`;
const GridCard = styled.section`
  border-radius: 25px;
  background: rgb(255, 255, 255, 0.1);
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  min-height: 300px;
  &.col-3 {
    width: var(--c3);
  }
  &.col-4 {
    width: var(--c4);
  }
  &.col-5 {
    width: var(--c5);
  }
  h3 {
    font-size: 2.5rem;
    padding: 18px 40px 14px 25px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.15);

    span {
      font-size: 1.5rem;
      font-weight: normal;
      margin-left: 30%;
      cursor: pointer;
      display: inline-block;
      &:hover {
        color: var(--primary);
        text-decoration: underline;
      }
    }
  }
  .progressSec {
    width: 50%;
    .CircularProgressbar {
      filter: drop-shadow(0 0 15px rgb(30, 80, 255, 0.5));
      .CircularProgressbar-path {
        stroke: var(--primary);
      }
      .CircularProgressbar-trail {
        stroke: rgb(255, 255, 255, 0.1);
      }
      .CircularProgressbar-text {
        font-size: 1.5rem;
        fill: var(--text-color);
      }
    }
  }
  .fos1 {
    font-size: 1.8rem;
  }
  .fos2 {
    font-size: 2rem;
  }
  .fos4 {
    font-size: 5rem;
  }
  .fos5 {
    font-size: 6rem;
    font-weight: 600;
  }

  .cardBody {
    display: flex;
    width: 100%;
    padding: 20px;
    flex-grow: 1;
  }
  .f-row {
    flex-flow: row;
  }
  .f-col {
    flex-flow: column;
  }
  .cardcol {
    align-items: center;
    display: flex;
    justify-content: center;
    flex-grow: 1;
    &.br-1 {
      border-right: 2px solid rgb(255, 255, 255, 0.1);
      &:last-child {
        border-right: 0;
      }
      span {
        margin-bottom: 10px;
      }
    }
    &.bb-1 {
      border-bottom: 2px solid rgb(255, 255, 255, 0.1);
      align-items: flex-start;
      padding: 10px 0;
      &:last-child {
        border-bottom: 0;
      }
      span {
        margin-bottom: 4px;
      }
    }
  }
`;

const ClaimTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 100px 0 0;
  h1 {
    font-size: 4.2rem;
    align-self: center;
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
  border-radius: 25px;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  .name {
    margin-right: auto;
    max-width: 35%;
    h4 {
      font-size: 2.2rem;
      margin: 0;
      line-height: 1.3;
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

const mapDipatchToProps = (dispatch) => {
  return {
    getUserProfileDetail: (address) =>
      dispatch(actions.getUserProfileDetail(address)),
    editUserProfileDetail: (address, data) =>
      dispatch(actions.editUserProfileDetail(address, data)),
    getUserIGOPools: (address, network, page) =>
      dispatch(actions.getUserIGOPools(address, network, page)),
  };
};

const mapStateToProps = (state) => {
  return {
    web3Data: state.web3Data,
    fetchUserProfileDetail: state.fetchUserProfileDetail,
    fetchUserIGOPools: state.fetchUserIGOPools,
    updatedProfileDetail: state.updatedProfileDetail,
    // completedIGOPools: state.completedIGOPools,
    // upcomingIGOPools: state.upcomingIGOPools,
    // upcomingIGOPagination: state.upcomingIGOPagination,
    // completedIGOPagination: state.completedIGOPagination,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(Launchpad);
