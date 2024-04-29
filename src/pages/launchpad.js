import React, { PureComponent, Component, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Banner from "../component/homeBanner";
import styled from "styled-components";
import axios from "axios";
import {
  Button,
  Container,
  SecTitle,
  NameBlock,
  ProgressSec,
  ProgressBar,
  ExchangeBar,
  Loading,
} from "../theme/main.styled";
import { Link, useNavigate } from "react-router-dom";
import errorfortoast from "../assets/errorfortoast.png";
import successfortoast from "../assets/successfortoast.png";
import Failedfortoast from "../assets/Failedfortoast.png";
import HeroIMG from "./../assets/images/banner-img.png";
import BnnerImg from "./../assets/images/BnnerImg.png";
import { connect, useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import ApplyAsProject from "../component/Modal/ApplyAsProjectModal";
import RfundImg from "../assets/images/Rfund-img.png";
import tierImg from "../assets/images/tier-img.png";
import GetstartedImg from "../assets/images/getstarted-img.png";
import { toast } from "react-toastify";
import { services } from "../services";
import Timer from "./Timer";


const Launchpad = (props) => {
  const [Buy, setBuy] = useState("");
  const [openApplyProjectModal, setOpenApplyProjectModal] = useState(false);
  const [ToggleState, setToggleState] = useState(1);
  const [cardIndex, setCardIndex] = useState(6);
  const [contractAddr, setContractAddr] = useState();
  const [totalPoolRaise, setTotalPoolRaise] = useState(0);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const reloadfn = () => setReload(!reload);
  const [poolRegistrationStatus, setPoolRegistrationStatus] = useState({});
  const walletAddress = useSelector((state) => state.web3Data?.accounts[0]);
  const {
    completedIGOPools,
    upcomingIGOPools,
    featuredIGOPools,
    getCompletedIGOPools,
    getFeaturedIGOPools,
    getUpcomingIGOPools,
    upcomingIGOPagination,
    completedIGOPagination,
    featuredIGOPagination,
    liveIGOPools,
    getLiveIGOPools,
    liveIGOPagination,
    getClosedregPools,
    closedregPagination,
    closedregIGOPools
  } = props;
  const [filterData, setFilterData] = useState([]);
  const toggleTab = async (index, type) => {
    setToggleState(index);
    if (type === "completed") {
      setCardIndex(6);
      setFilterData(completedIGOPools);
    } else if (type === "featured") {
      setCardIndex(6);
      setFilterData(featuredIGOPools);
    } else if (type === "upcoming") {
      setCardIndex(6);
      setFilterData(upcomingIGOPools);
    } else if (type === "Enrolling") {
      setCardIndex(6);
      setFilterData(liveIGOPools);
    } else if (type === "closed reg") {
      setCardIndex(6);
      setFilterData(closedregIGOPools);
    }else if (type === "all") {
      setCardIndex(6);
      setFilterData([
            ...featuredIGOPools,
            ...closedregIGOPools,
            ...liveIGOPools,
            ...upcomingIGOPools,
            ...completedIGOPools
          ]);;
    }
    // else {
    //   setFilterData([
    //     ...featuredIGOPools,
    //     ...closedregIGOPools,
    //     ...liveIGOPools,
    //     ...upcomingIGOPools,
    //     ...completedIGOPools
    //   ]);
    // }
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
  const handleRegister = async (poolId, walletAddress) => {
    if (!walletAddress) {
      popup("error", "Please connect your wallet before registration");
      return;
    }
    try {
      const requestBody = {
        _id: poolId,
        walletAddress: walletAddress
      };
      const response = await services.post(`userParticipate/participate`, requestBody);
      if (response.data.success === true) {
        setPoolRegistrationStatus(prevStatus => ({
          ...prevStatus,
          [poolId]: true
        }));
        popup(
          "success",
          "Registered Successfully",
          true
        );

      } else {
        popup("error", response.data.message);
      }
    } catch (error) {
      popup("error", "Please Try again letter");
    }
  };
  // const toggleTab = async (index, type) => {
  //   setToggleState(index);
  //   if (type !== "all") {
  //     setCardIndex(6);
  //     const _data =
  //       filterData === []
  //         ? index == 4
  //           ? completedIGOPools.filter((ele) => ele.poolStatus === type)
  //           : upcomingIGOPools.filter((ele) => ele.poolStatus === type)
  //         : filterData.filter((ele) => ele.poolStatus === type);
  //     console.log("_data", _data);
  //     setFilterData(_data);
  //   } else {
  //     setCardIndex(6);
  //     setFilterData(
  //       upcomingIGOPagination.pageNo > 1 ? filterData : upcomingIGOPools
  //     );
  //   }
  // };
  useEffect(() => {
    if (upcomingIGOPagination.totalCount >= cardIndex) {
      if (
        cardIndex >=
        upcomingIGOPagination.pageLimit * upcomingIGOPagination.pageNo
      ) {
        if (filterData.length < upcomingIGOPagination.totalCount)
          getUpcomingIGOPools(Number(upcomingIGOPagination.pageNo) + 1);
      }
    }
    if (completedIGOPagination.totalCount >= cardIndex) {
      if (
        cardIndex >=
        completedIGOPagination.pageLimit * completedIGOPagination.pageNo
      ) {
        if (filterData.length < completedIGOPagination.totalCount)
          getCompletedIGOPools(Number(completedIGOPagination.pageNo) + 1);
      }
    }
    if (featuredIGOPagination.totalCount >= cardIndex) {
      if (
        cardIndex >=
        featuredIGOPagination.pageLimit * featuredIGOPagination.pageNo
      ) {
        if (filterData.length < featuredIGOPagination.totalCount)
          getFeaturedIGOPools(Number(featuredIGOPagination.pageNo) + 1);
      }
    }
    if (liveIGOPagination.totalCount >= cardIndex) {
      if (
        cardIndex >=
        liveIGOPagination.pageLimit * liveIGOPagination.pageNo
      ) {
        if (filterData.length < liveIGOPagination.totalCount)
          getLiveIGOPools(Number(liveIGOPagination.pageNo) + 1);
      }
    }
    if (closedregPagination.totalCount >= cardIndex) {
      if (
        cardIndex >=
        closedregPagination.pageLimit * closedregPagination.pageNo
      ) {
        if (filterData.length < closedregPagination.totalCount)
          getClosedregPools(Number(closedregPagination.pageNo) + 1);
      }
    }
  }, [cardIndex]);

  useEffect(() => {

    if (upcomingIGOPagination.pageNo > 1) {
      if (filterData.length !== 0)
        setFilterData([...filterData, ...upcomingIGOPools]);
    }
    if (upcomingIGOPagination.pageNo == 1) {
      if (ToggleState == 1 || ToggleState == 2) {
        if (filterData.length == 0) setFilterData(upcomingIGOPools);
      }
      if (ToggleState == 6) {
        if (filterData.length == 0) setFilterData(completedIGOPools);
      }
    }
  }, [upcomingIGOPagination]);

  useEffect(() => {
    getCompletedIGOPools(1);
    getUpcomingIGOPools(1);
    getFeaturedIGOPools(1);
    getLiveIGOPools(1);
    getClosedregPools(1);
  }, [ToggleState]);
  //
  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  useEffect(() => {
    if (ToggleState === 3)
      setFilterData([
        ...liveIGOPools,
      ]);
  }, [upcomingIGOPools, featuredIGOPools, completedIGOPools, liveIGOPools,closedregIGOPools]);
  useEffect(() => {
    if (ToggleState === 3)
      setFilterData([
        ...liveIGOPools,
      ]);
  }, [upcomingIGOPools, featuredIGOPools, completedIGOPools, liveIGOPools,closedregIGOPools]);
  useEffect(() => {
    if (ToggleState === 4)
      setFilterData([
        ...closedregIGOPools,
      ]);
  },[upcomingIGOPools, featuredIGOPools, completedIGOPools, liveIGOPools,closedregIGOPools]);



  useEffect(() => {
    if (ToggleState === 1)
      setFilterData([
        ...featuredIGOPools,
        ...closedregIGOPools,
        ...liveIGOPools,
        ...upcomingIGOPools,
        ...completedIGOPools,
     
      ]);
  }, [upcomingIGOPools, featuredIGOPools, completedIGOPools, liveIGOPools,closedregIGOPools]);
  useEffect(() => {
    if (ToggleState === 5)
      setFilterData([
        ...featuredIGOPools,
      ]);
  }, [upcomingIGOPools, featuredIGOPools, completedIGOPools, liveIGOPools,closedregIGOPools]);
  const isPoolRegistered = (poolId) => {
    return poolRegistrationStatus[poolId] || false;
  };
  useEffect(() => {
    const fetchRegistrationStatus = async () => {

      const statusPromises = filterData.map(async (pool) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/userParticipate/participateStatus`);
          const responseData = response.data;
          if (responseData.success === false) {
            // Handle the case where the user is not found or has not participated
            return { poolId: pool._id, isRegistered: false };
          }
          const isRegistered = responseData.success;
          return { poolId: pool._id, isRegistered };
        } catch (error) {

          if (error.response.data.success === false) {
            return { poolId: pool._id, isRegistered: false };
          }
        }
      });

      const statuses = await Promise.all(statusPromises);
      const registrationStatus = statuses.reduce((acc, { poolId, isRegistered }) => {
        acc[poolId] = isRegistered;
        return acc;
      }, {});

      setPoolRegistrationStatus(registrationStatus);

    }
    fetchRegistrationStatus()

  }, [filterData, walletAddress]);
  return (
    <>
      <LaunchBanner>
        <Container>
          <LaunchBannerLeft>
            <h1>Enter the gateway of Blockchain Gaming</h1>
            <p>
              Eget nulla phasellus odio sit porttitor enatibus aliquam blandit
              gravida ultricies eleifend varius tempor vulputate malesuada
              tristique dictumst fringilla tempus quis neque condimentum
              consectetur ut egestas. Eget arcu.
            </p>
            <ExchangeBar>
              <select onChange={(e) => setBuy(e.target.value)}>
                <option disabled selected>
                  Select Exchange
                </option>
                <option value="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2">
                  Buy On Pancakeswap
                </option>
                <option value="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2">
                  Buy On KuCoin
                </option>
                <option value="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2">
                  Buy On Gate.Io
                </option>
                <option value="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2">
                  Buy On Bybit
                </option>
                <option value="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2">
                  Buy On Huobi
                </option>
                {/* <option value="">Apply As A Project</option> */}
              </select>
              <Button
                className="primary"
                onClick={() => (Buy ? window.open(`${Buy}`) : "")}
              >
                BUY NOW
              </Button>
            </ExchangeBar>
            <Button
              style={{ margin: "1rem 1rem" }}
              className="primary"
              onClick={() => setOpenApplyProjectModal(true)}
            >
              APPLY AS A PROJECT
            </Button>
          </LaunchBannerLeft>
          <LaunchBannerRight>
            <img src={BnnerImg}></img>
          </LaunchBannerRight>
        </Container>
      </LaunchBanner>

      <LaunchInfo>
        <Container>
          <div className="stepContainer">
            <span>
              {/* <i className="fas fa-piggy-bank"></i> */}
              <img src={RfundImg} />
            </span>
            <h5>What is Reformo Platform</h5>
            <p>
              Through the play-to-earn revolution, a completely new era is
              starting for the gaming industry. Whereas games were just about
              having fun before, now ...
            </p>
            <Link to="/">Learn more</Link>
          </div>
          <div className="stepContainer">
            <span>
              {/* <i className="fas fa-cog"></i> */}
              <img src={tierImg} />
            </span>
            <h5>Tier System</h5>
            <p>
              The initial version of the 9 tier system consisted of a system
              where it was based on guaranteed allocations for all tiers with a
              pool weight formula ...
            </p>
            <Link to="/">Learn more</Link>
          </div>
          <div className="stepContainer">
            <span>
              <i className="fas fa-thumbs-up"></i>
            </span>
            <h5>How to get started</h5>
            <p>
              It is great that you have decided to join the revolution of
              blockchain gaming with Reformo Platform! Before you start joining
              IDOs (Initial Game Offerings) at ...
            </p>
            <Link to="/">Learn more</Link>
          </div>
        </Container>
      </LaunchInfo>

      <Pools>
        <Container>
          <SecTitle className="title-flex">
            <h3>Pools</h3>
            <ul className="tabNav">
              <li
                className={`tabs ${getActiveClass(1, "active")}`}
                onClick={() => toggleTab(1, "all")}
              >
                All{" "}
              </li>
              <li
                className={`tabs ${getActiveClass(2, "active")}`}
                onClick={() => toggleTab(2, "upcoming")}
              >
                Upcoming{" "}
              </li>
              <li
                className={`tabs ${getActiveClass(3, "active")}`}
                onClick={() => toggleTab(3, "Enrolling")}
              >
            Enrolling
              </li>
              <li
                className={`tabs ${getActiveClass(4, "active")}`}
                onClick={() => toggleTab(4, "Closed Reg")}
              >
                InActive{" "}
              </li>
              <li
                className={`tabs ${getActiveClass(5, "active")}`}
                onClick={() => toggleTab(5, "featured")}
              >
                Active
              </li>
              <li
                className={`tabs ${getActiveClass(6, "active")}`}
                onClick={() => toggleTab(6, "completed")}
              >
                Completed
              </li>
            </ul>
          </SecTitle>
          {filterData.length !== 0 ? (
            <div className="tab-content">
              {filterData.slice(0, cardIndex).map((pool, key) => (
                <PoolCard
                  style={{ cursor: "pointer" }}
                  key={key}
                  onClick={() => {
                    if (pool.poolStatus !== "Enrolling") {
                      navigate(`/pool_detail/${pool?.poolStatus}/${pool._id}`);
                    }
                  }}
                >
                  <div onClick={() => {
                    navigate(`/pool_detail/${pool?.poolStatus}/${pool._id}`);
                  }}
                    className="poolTop"
                    style={{ minHeight: "30rem", maxHeight: "30rem" }}
                  >
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${pool?.imageURL})` }}
                      />
                      <div>
                        <h4>{pool.igoName}</h4>
                        <span>
                          1 BUSD = {pool.price} {pool.igoTokenSymbol}
                        </span>
                      </div>
                    </NameBlock>
                    <div style={{ width: "40%", display: "flex", justifyContent: "center", border: "2px solid #FBAE48", marginLeft: "89px", marginTop: "0px", padding: "5px 10px 10px 11px", borderRadius: "10px" }}>
                      {pool.poolStatus}
                    </div>
                    {/* {console.log(
                      "Description",
                      ReactHtmlParser(pool.igoDescription).length
                    )} */}
                    {ReactHtmlParser(pool.igoDescription.substring(0, 150))}{" "}
                    <span style={{ color: "blue" }}>
                      {pool.igoDescription.length > 150 ? "Read More..." : ""}
                    </span>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise :{" "}
                      <span>
                        {pool.targetPoolRaise} {pool?.paymentTokenSymbol}
                      </span>
                    </label>
                    <label>
                      Maximum :{" "}
                      <span>
                        {pool?.poolStatus == "featured"
                          ? pool?.phases[0].maxUserAllocation + " BUSD"
                          : "TBA"}{" "}
                        {/* 80 BUSD */}
                      </span>
                    </label>
                    <label>
                      Access : <span>{pool?.accessType}</span>
                    </label>
                    {pool?.poolStatus === "Enrolling" && pool.userRegister.status ? (
                      <div className="register primary full no-shadow" style={{ marginTop: "50px" }} >
                        {isPoolRegistered(pool._id) ? (
                          <Button className="register primary full no-shadow" disabled>
                            Registered
                          </Button>
                        ) : (
                          <Button
                            className="register primary full no-shadow"
                            key={key}
                            onClick={() => {
                              handleRegister(pool._id, walletAddress);
                            }}
                          >
                            Register
                          </Button>
                        )}
                      </div>

                    ) : pool?.poolStatus == "featured" ? (
                      <ProgressSec>
                        <p>Max Participants : Limited</p>
                        <strong>
                          {pool?.phases[0].totalRaisedAllocation
                            ? (pool?.phases[0].totalRaisedAllocation * pool?.price).toFixed(2)
                            : "0"}
                          /{pool?.targetPoolRaise * pool?.price} {pool?.igoTokenSymbol}{" "}
                          <span>
                            {pool?.phases[0].totalRaisedAllocation
                              ? (
                                (pool?.phases[0].totalRaisedAllocation /
                                  pool.targetPoolRaise) *
                                100
                              ).toFixed(2)
                              : "0"}{" "}
                            %
                          </span>
                        </strong>
                        <ProgressBar>
                          <div
                            style={{
                              width: `${pool?.phases[0].totalRaisedAllocation
                                  ? (
                                    (pool?.phases[0].totalRaisedAllocation /
                                      pool.targetPoolRaise) *
                                    100
                                  ).toFixed(2)
                                  : "0"
                                }%`,
                            }}
                          />
                        </ProgressBar>
                      </ProgressSec>
                    ) : pool?.poolStatus == "completed" ? (
                      <ProgressSec style={{ marginBottom: "50px" }}>
                        <p>Max Participants : Limited</p>
                        <strong>
                          {pool?.targetPoolRaise * pool?.price} / {pool?.targetPoolRaise * pool?.price} {pool?.igoTokenSymbol}{" "}
                          <span>
                            {((pool?.targetPoolRaise * pool?.price) /
                              (pool?.targetPoolRaise * pool?.price)) *
                              100}{" "}
                            %
                          </span>
                        </strong>
                        <ProgressBar>
                          <div style={{ width: "100%" }} />
                        </ProgressBar>
                      </ProgressSec>
                    ) : (
                      <ProgressSec>
                        <p>Max Participants : TBA</p>
                        <strong>
                          0.00 / {pool?.targetPoolRaise * pool?.price} {pool?.igoTokenSymbol} <span>0 %</span>
                        </strong>
                        <ProgressBar>
                          <div style={{ width: "0%" }} />
                        </ProgressBar>
                      </ProgressSec>
                    )}
                  </div>
                  <div className="RegisterStartEnd" style={{ textAlign: "center" }}>

                    {pool.userRegister?.status && pool?.poolStatus == "Enrolling" && (
                      <div className="poolBottom1">
                        {Date.now() < new Date(parseInt(pool.userRegister?.startDate) * 1000) ? (
                          <>
                            <label><strong>Registration Starts In: </strong></label>
                            <span>
                              <Timer endDate={new Date(parseInt(pool.userRegister?.startDate) * 1000)} />
                            </span>
                          </>
                        ) : (
                          <>
                            <label><strong>Registration Ends In: </strong></label>
                            <span>
                              <Timer endDate={new Date(parseInt(pool.userRegister?.endDate) * 1000)} />
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </PoolCard>
              ))}
              {/* <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard> */}
              {/* <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard>
                <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard>
                <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard>
                <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard>
                <PoolCard>
                  <div className="poolTop">
                    <NameBlock className="lg">
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${HeroIMG})` }}
                      />
                      <div>
                        <h4>Amazy</h4>
                        <span>1 BUSD = 40 AZY</span>
                      </div>
                    </NameBlock>
                    <p>
                      Outer Ring is an MMORPG (Massively Multiplayer Online
                      Role-Playing Game) that unites fantasy and science
                      fiction, based on the novel of the same name Outer Ring
                      Saga, in an open world that allows exploration, all
                      supported by its Play ...
                    </p>
                  </div>
                  <div className="poolBottom">
                    <label>
                      Total Raise : <span>379999.90 BUSD</span>
                    </label>
                    <label>
                      Maximum : <span>3321.95 BUSD</span>
                    </label>
                    <label>
                      Access : <span>Public</span>
                    </label>
                    <ProgressSec>
                      <p>Max Participants : 4422</p>
                      <strong>
                        9498980.12/9500000 RETH <span>80%</span>
                      </strong>
                      <ProgressBar>
                        <div style={{ width: "20%" }} />
                      </ProgressBar>
                    </ProgressSec>
                  </div>
                </PoolCard> */}
              {filterData.length > cardIndex ? (
                <LoadMore>
                  <Button
                    className="secondary"
                    onClick={() => setCardIndex(cardIndex + 3)}
                  >
                    Load More
                  </Button>
                </LoadMore>
              ) : (
                ""
              )}
              {/* {upcomingIGOPagination.totalCount >= cardIndex ? (
                <LoadMore>
                  <Button
                    className="secondary"
                    onClick={() => setCardIndex(cardIndex + 3)}
                  >
                    Load More
                  </Button>
                </LoadMore>
              ) : (
                ""
              )} */}
            </div>
          ) : (
            <span
              style={{
                fontSize: "25px",
              }}
            >
              No Data Found
            </span>
          )}
          {/* {getActiveClass(
            2,
            <div className="tab-content">
              <PoolCard>
                <div className="poolTop">
                  <NameBlock className="lg">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Amazy</h4>
                      <span>1 BUSD = 40 AZY</span>
                    </div>
                  </NameBlock>
                  <p>
                    Outer Ring is an MMORPG (Massively Multiplayer Online
                    Role-Playing Game) that unites fantasy and science fiction,
                    based on the novel of the same name Outer Ring Saga, in an
                    open world that allows exploration, all supported by its
                    Play ...
                  </p>
                </div>
                <div className="poolBottom">
                  <label>
                    Total Raise : <span>379999.90 BUSD</span>
                  </label>
                  <label>
                    Maximum : <span>3321.95 BUSD</span>
                  </label>
                  <label>
                    Access : <span>Public</span>
                  </label>
                </div>
              </PoolCard>
              <PoolCard>
                <div className="poolTop">
                  <NameBlock className="lg">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Amazy</h4>
                      <span>1 BUSD = 40 AZY</span>
                    </div>
                  </NameBlock>
                  <p>
                    Outer Ring is an MMORPG (Massively Multiplayer Online
                    Role-Playing Game) that unites fantasy and science fiction,
                    based on the novel of the same name Outer Ring Saga, in an
                    open world that allows exploration, all supported by its
                    Play ...
                  </p>
                </div>
                <div className="poolBottom">
                  <label>
                    Total Raise : <span>379999.90 BUSD</span>
                  </label>
                  <label>
                    Maximum : <span>3321.95 BUSD</span>
                  </label>
                  <label>
                    Access : <span>Public</span>
                  </label>
                </div>
              </PoolCard>
              <PoolCard>
                <div className="poolTop">
                  <NameBlock className="lg">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Amazy</h4>
                      <span>1 BUSD = 40 AZY</span>
                    </div>
                  </NameBlock>
                  <p>
                    Outer Ring is an MMORPG (Massively Multiplayer Online
                    Role-Playing Game) that unites fantasy and science fiction,
                    based on the novel of the same name Outer Ring Saga, in an
                    open world that allows exploration, all supported by its
                    Play ...
                  </p>
                </div>
                <div className="poolBottom">
                  <label>
                    Total Raise : <span>379999.90 BUSD</span>
                  </label>
                  <label>
                    Maximum : <span>3321.95 BUSD</span>
                  </label>
                  <label>
                    Access : <span>Public</span>
                  </label>
                </div>
              </PoolCard>
            </div>
          )} */}
        </Container>
      </Pools>
      <ApplyAsProject
        openApplyProjectModal={openApplyProjectModal}
        setOpenApplyProjectModal={setOpenApplyProjectModal}
      />
    </>
  );
};

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const LaunchBanner = styled.div``;
const LaunchBannerLeft = styled.div`
  width: 66.66%;
  align-self: center;
  h1 {
    font-size: 5.1rem;
    line-height: 1.4;
    margin-bottom: 20px;
  }
  p {
    font-size: 1.8rem;
    line-height: 1.8;
  }
  @media (max-width: 1400px) {
    width: 50%;
  }
  @media (max-width: 991px) {
    width: 100%;
  }
  @media (max-width: 640px) {
    h1 {
      font-size: 3.5rem;
    }
    p {
      font-size: 1.8rem;
    }
  }
  @media (max-width: 480px) {
    h1 {
      font-size: 3rem;
    }
  }
`;
const LaunchBannerRight = styled.div`
  width: 33.33%;
  align-self: center;
  text-align: center;
  margin-left: auto;
  @media (max-width: 991px) {
    display: none;
  }
`;
const LaunchInfo = styled.section`
  padding: 150px 0;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 50%;
    // background: #1d143c;
    opacity:0.2;
    background: rgba(251, 174, 72, 0.6);
    width: 200px;
    height: 200px;
    box-shadow: 160px 0px 0 #4b202e;
    border-radius: 100%;
    transform: translate(-100%, -50%) scale(4);
    filter: blur(50px);
    z-index: -1;
  }
  .stepContainer {
    text-align: center;
    width: 33.33%;
    text-align: center;
    padding: 0 30px;
    display: flex;
    flex-flow: column;
    position: relative;
    z-index: 1;
    span {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-size: 5rem;
    }
  }
  img {
    width: 70px;
    height: 70px;
  }
  h5 {
    justify-content: center;
    margin-bottom: 18px;
    font-size: 3rem;
    font-weight: 600;
  }
  p {
    font-size: 1.8rem;
    margin-bottom: 18px;
    line-height: 1.4;
  }
  a {
    color: #FBAE48;
    // background: rgba(251, 174, 72, 1);

    font-weight: 700;
    text-transform: uppercase;
    margin-top: auto;
  }
  @media (max-width: 991px) {
    .stepContainer {
      padding: 0 15px;
    }
    h5 {
      font-size: 2.5rem;
    }
    span {
      margin: 0 auto 20px;
    }
  }
  @media (max-width: 768px) {
    padding: 100px 0 60px;
    .stepContainer {
      width: 100%;
      margin-bottom: 40px;
    }
    width: 100%;
  }
`;
const Pools = styled.section`
  position: relative;
  min-height: 800px;
  &:after {
    content: "";
    position: absolute;
    top: 600px;
    right: 0;
    // background: #0f0c2a;
    width: 400px;
    height: 400px;
    border-radius: 100%;
    transform: scale(3) translate(20%, 0%);
    filter: blur(50px);
    z-index: -1;
  }
  .title-flex {
    flex-flow: row;
  }
  .tabNav {
    margin-left: auto;
    display: flex;
    align-self: center;
    li {
      padding: 5px 10px;
      margin-left: 10px;
      cursor: pointer;
      &.active {
        background: var(--primary);
        border-radius: 5px;
        color: #000;
      }
    }
  }
  .tab-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    width: 100%;
  }
  @media (max-width: 1024px) {
    .tab-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 640px) {
    .title-flex {
      flex-flow: column;
      align-items: center;
      h3 {
        margin-bottom: 20px;
      }
    }

    .tabNav {
      width: 100%;
      justify-content: center;
      .tabs {
        margin: 0 4px;
      }
    }
  }
  @media (max-width: 640px) {
    .tab-content {
      grid-template-columns: repeat(1, 1fr);
    }
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
  .poolTop {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px 20px 20px;
    & > div {
      margin-bottom: 13px;
    }
    p {
      font-size: 1.5rem;
      line-height: 1.6;
    }
  }
  .poolBottom {
    padding: 26px 20px 20px;
    label {
      display: flex;
      justify-content: space-between;
      font-size: 1.8rem;
      margin-bottom: 16px;
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
const LoadMore = styled.div`
  grid-column: 1 / span 3;
  text-align: center;
  padding-top: 30px;
  @media (max-width: 1024px) {
    grid-column: 1 / span 2;
  }
  @media (max-width: 640px) {
    padding-top: 10px;
    grid-column: 1 / span 1;
  }
`;
const mapDipatchToProps = (dispatch) => {
  return {
    getCompletedIGOPools: (page) =>
      dispatch(),
    getFeaturedIGOPools: (page) => dispatch(),
    getUpcomingIGOPools: (page) => dispatch(),
    getUpcomingIGOPagination: (page) =>
      dispatch(),
    getLiveIGOPools: (page) => dispatch(),
    getClosedregPools: (page) => dispatch()
  };
};

const mapStateToProps = (state) => {
  return {
    completedIGOPools: state.completedIGOPools,
    upcomingIGOPools: state.upcomingIGOPools,
    featuredIGOPools: state.featuredIGOPools,
    upcomingIGOPagination: state.upcomingIGOPagination,
    completedIGOPagination: state.completedIGOPagination,
    featuredIGOPagination: state?.featuredIGOPagination,
    liveIGOPools: state.liveIGOPools,
    liveIGOPagination: state?.liveIGOPagination,
    closedregIGOPools: state?.closedregIGOPools,
    closedregPagination: state?.closedregPagination
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Launchpad);
// export default Launchpad;
