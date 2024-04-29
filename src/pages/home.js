import React, { Component, useEffect, useState } from "react";
import Banner from "./../component/homeBanner";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import axios from "axios";
import {
  Button,
  Container,
  SecTitle,
  NameBlock,
  Loading,
} from "../theme/main.styled";
import errorfortoast from "../assets/errorfortoast.png";
import successfortoast from "../assets/successfortoast.png";
import Failedfortoast from "../assets/Failedfortoast.png";
import Gs from "../theme/globalStyles";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Media from "./../theme/media-breackpoint";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { toast } from "react-toastify";
import HeroIMG from "./../assets/images/banner-img.png";
import imgArt1 from "./../assets/images/img-art1-1.png";
import imgArt2 from "./../assets/images/img-art1-2.png";
import ColImg from "./../assets/images/colimg.png";
import CTAbg from "./../assets/images/cta-bg.png";
import team1 from "./../assets/images/team1.jpg";
import team2 from "./../assets/images/team2.jpg";
import team3 from "./../assets/images/team3.jpg";
import team4 from "./../assets/images/team4.jpg";
import team5 from "./../assets/images/team5.jpg";
import { services } from "../services";
import client1 from "./../assets/images/KaironLabs.png";
import client2 from "./../assets/images/FerrumNetwork.png";
import client3 from "./../assets/images/BasicsCapital.png";
import client4 from "./../assets/images/GoodGamesGuild.png";
import client5 from "./../assets/images/Elrond.png";
import client6 from "./../assets/images/EverseCapital.png";
import client7 from "./../assets/images/BlockchainGameAlliance.png";
import client8 from "./../assets/images/BlueWheel.png";
import client9 from "./../assets/images/ApeSwap.png";
import client10 from "./../assets/images/AsteroidCapital.png";
import client11 from "./../assets/images/YieldGuild.png";
import client12 from "./../assets/images/AlturaNFT.png";
import client13 from "./../assets/images/Polygon.png";
import client14 from "./../assets/images/X21.png";
import client15 from "./../assets/images/Travala.png";
import client16 from "./../assets/images/UniqueNetwork.png";
import quote from "./../assets/images/quote.png";

import Timer from './Timer';
import { actions } from "../actions";
import { connect, useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import ApplyAsProject from "../component/Modal/ApplyAsProjectModal";
import { liveIGOPools } from "../reducers/auth.reducer";
const Home = (props) => {
  const [answerShow1, setAnswerShow1] = useState(false);
  const [answerShow2, setAnswerShow2] = useState(false);
  const [answerShow3, setAnswerShow3] = useState(false);
  const [answerShow4, setAnswerShow4] = useState(false);
  const [answerShow5, setAnswerShow5] = useState(false);
  const [openApplyProjectModal, setOpenApplyProjectModal] = useState(false);
  const walletAddress = useSelector((state) => state.web3Data?.accounts[0]);
  const [poolRegistrationStatus, setPoolRegistrationStatus] = useState({});
  const [filterdata, setFilterData] = useState([])
  const [reload, setReload] = useState(false);
  const reloadfn = () => setReload(true);
  const {
    completedIGOPools,
    upcomingIGOPools,
    getCompletedIGOPools,
    getUpcomingIGOPools,
    getLiveIGOPools,
    liveIGOPools,

  } = props;
  const navigate = useNavigate();
  useEffect(() => {
    getCompletedIGOPools();
    getUpcomingIGOPools(1);
    getLiveIGOPools(1);
  }, [getCompletedIGOPools, getUpcomingIGOPools,walletAddress]);
  useEffect(() => {
    setFilterData([
      ...liveIGOPools,
      ...upcomingIGOPools
    ])
  }, [getLiveIGOPools, getUpcomingIGOPools, liveIGOPools, upcomingIGOPools]);
  
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
      const response = await services.post(`/userParticipate/participate`, requestBody);
      if (response.data.success) {
        setPoolRegistrationStatus(prevStatus => ({
          ...prevStatus,
          [poolId]: true
        }));
        popup(
          "success",
          "Registered Successfully",
          true
        );
        document.getElementById(`registerButton_${poolId}`).innerHTML = "Registered"; //temp
      } else {
       popup("error", response.data.message);
      }
    } catch (error) {
     popup("error", "Please Try again letter");
    }
  };

  const responsive = {
    0: {
      items: 1,
    },
    640: {
      items: 2,
    },
    991: {
      items: 3,
    },
    1400: {
      items: 4,
    },
  };
  const advisors = {
    0: {
      items: 2,
      margin: 20,
    },
    640: {
      items: 3,
      margin: 20,
    },
    991: {
      items: 4,
      margin: 30,
    },
    1400: {
      items: 5,
      margin: 30,
    },
  };
  const testimonials = {
    0: {
      items: 1,
      margin: 20,
    },
    640: {
      items: 2,
      margin: 20,
    },
    991: {
      items: 2,
      margin: 30,
    },
    1400: {
      items: 2,
      margin: 30,
    },
  };
  const options = {
    loop: upcomingIGOPools.length < 4 ? false : true,
    mouseDrag: true,
    center: false,
    items: 4,
    margin: 0,
    autoplay: true,
    dots: false,
    autoplayTimeout: 8500,
    smartSpeed: 900,
    nav: false,

    responsive: {
      0: {
        items: 1,
      },
      640: {
        items: 2,
      },
      991: {
        items: 3,
      },
      1400: {
        items: 4,
      },
    },
  };
  useEffect(() => {
    window.scrollTo(0, 10);
  }, []);
  const isPoolRegistered = (poolId) => {
    return poolRegistrationStatus[poolId] || false;
  };
  useEffect(()=>{

  },[handleRegister])

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      
        const statusPromises = filterdata.map(async (pool) => {
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
            console.error(`Error fetching registration status for pool ${pool._id}:`, error.response.data.message);
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

  }, [filterdata, walletAddress]);
  


  return (
    <>
      <Banner></Banner>
      {upcomingIGOPools.length !== 0 || liveIGOPools.length !== 0 ? (
        <Upcoming>
          <Container>
            <SecTitle className="row">
              <h3>Upcoming IDOs</h3>{" "}
              <Link
                className="view-more"
                style={{ color: "white" }}
                to={`/launchpad`}
              >
                View More
              </Link>
            </SecTitle>
            <OwlCarousel
              className="owl-theme"
              // responsive={responsive}
              // loop={upcomingIGOPools.length >= 4 ? true : false}
              {...options}
              margin={30}
            >
              {filterdata.map((pool) => (
                <PoolCard key={pool._id} style={{ width: "100%", minHeight: "680px", maxHeight: "680px" }}>
                  <div className="poolTop" style={{ minHeight: "29rem", maxHeight: "29rem" }} >
                    <NameBlock className="lg" style={{ cursor: "pointer" }} onClick={() => {
                      navigate(`/pool_detail/${pool?.poolStatus}/${pool._id}`);
                    }}>
                      <div className="ComLogo" style={{ backgroundImage: `url(${pool?.imageURL})`, width: "30%" }} />
                       <div style={{ width: "auto" }}>
                        <h4>{pool.igoName}</h4>
                        <span>
                          1 BUSD = {pool.price}{pool.igoTokenSymbol}
                        </span>
                      </div>
                    </NameBlock>
                    <div style={{ width: "40%", display: "flex", justifyContent: "center", border: "2px solid #FBAE48", marginLeft: "89px",padding: "5px 10px 10px 11px", borderRadius: "10px", backgroundColor:"rgb(255,255,255,0.1)", }}>
                   <strong> {pool.poolStatus}</strong>
                    </div>
                    <div className="ComLogo" style={{ width: "30%", display: "flex", justifyContent: "center", }} />
                    
                    {/* Description */}
                    {ReactHtmlParser(pool.igoDescription.substring(0, 120))}
                  
                  </div>
                  <div className="poolBottom">
                    <div style={{ fontFamily: "Arial, sans-serif", marginTop: "3px" }}>
                      <label>
                        Targeted Raise:{" "}
                        <span>
                          {pool.targetPoolRaise} {pool?.paymentTokenSymbol}
                        </span>
                      </label>
                    </div>
                    <div style={{ fontFamily: "Arial, sans-serif", marginTop: "5px" }}>
                      <label>
                        Access: <span>{pool?.accessType}</span>
                      </label>
                    </div>
                    {pool.userRegister && pool.userRegister.startDate && pool.userRegister.endDate ? (
                      <>
                        <div style={{ fontFamily: "Arial, sans-serif", marginTop: "5px", display: "flex", flexDirection: "column" }}>
                          <label style={{ display: "flex" , flexDirection: "column" , color:"#ababab", marginBottom:"10px"}}>
                            Register Period (From): <br />
                          </label>
                          <div>{new Date(parseInt(pool.userRegister.startDate) * 1000).toLocaleString()}</div>
                        </div>
                        <div style={{ fontFamily: "Arial, sans-serif", marginTop: "5px", display: "flex", flexDirection: "column", marginBottom:"26px"  }}>
                          <label style={{ display: "flex",  flexDirection: "column", marginTop: "10px", color:"#ababab",marginBottom: "10px"}}>
                            Register  Period (To): <br />
                          </label>
                          <div>{new Date(parseInt(pool.userRegister.endDate) * 1000).toLocaleString()}</div>
                        </div>
                      </>
                    ) : (
                      <div style={{textAlign: "center", marginBottom: "35px", marginTop: "80px"}}>No registration Required <br/>All are welcome!</div>
                    )}

                    {pool.poolStatus === "upcoming" ? (
                      <Button className="register primary full no-shadow" disabled>
                        Coming Soon
                      </Button>
                    ) : (
                      pool.poolStatus === "Enrolling" && pool.userRegister.status && (
                        <div className="register primary full no-shadow">
                        <Button
                           id={`registerButton_${pool._id}`}
                          className="register primary full no-shadow"
                          disabled={isPoolRegistered(pool._id)}
                          onClick={() => {
                            if (!isPoolRegistered(pool._id)) {
                              handleRegister(pool._id, walletAddress);
                            }
                          }}
                        >
                          {isPoolRegistered(pool._id) ? "Registered" : "Register"}
                        </Button>
                      </div>
                      )
                    )}
                    <div className="RegisterStartEnd">

                    {pool.userRegister?.status && (
                      <div className="poolBottom1">
                        {Date.now() < new Date(parseInt(pool.userRegister?.startDate) * 1000) ? (
                          <>
                            <label><strong>Registration Starts In: </strong></label>
                            <span>
                            <Timer  endDate={new Date(parseInt(pool.userRegister?.startDate) * 1000)} />
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
                  </div>
                </PoolCard>

              ))}
              {/* {upcomingIGOPools.map((pool) => {
                if (pool.description) {
                  var description = pool.description.replace(
                    "<p>&nbsp;</p>\n<p>&nbsp;</p>\n",
                    ""
                  );
                  let count = 0;
                  description = parse(description, {
                    replace: (domNode) => {
                      if (count === 6) {
                        ++count;
                        return <p>{domNode.children[0].data + " ..."}</p>;
                      }
                      ++count;
                      return domNode;
                    },
                  });
                  var length = description.length;
                }
                return (
                  <ItemIgo>
                    <NameBlock>
                      <div
                        className="ComLogo"
                        style={{ backgroundImage: `url(${pool.image})` }}
                      />
                      <div>
                        <h4>{pool.title}</h4>
                        <span>{pool.poolType}</span>
                      </div>
                    </NameBlock>
                    <div className="tags">
                      <span>1ST PHASE</span>
                      <span>{pool.symbol}</span>
                    </div>
                    <p>{length > 8 ? description.slice(0, 5) : description}</p>
                    <Button
                      className="primary full no-shadow"
                      onClick={() => {
                        navigate(`/pool_detail/upcomming/${pool._id}`);
                      }}
                    >
                      View More
                    </Button>
                  </ItemIgo>
                );
              })} */}

              {/* <ItemIgo>
                <NameBlock>
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${HeroIMG})` }}
                  />
                  <div>
                    <h4>ARtonar</h4>
                    <span>Public</span>
                  </div>
                </NameBlock>
                <div className="tags">
                  <span>1ST PHASE</span>
                  <span>TBA</span>
                </div>
                <p>
                  The G4AL Platform is the easiest and fastest approach for
                  developers who want to experiment with Web3, enabling the
                  addition of blockchain features to their games in a few
                  minutes without any Web3 knowledge.
                </p>
                <Button className="primary full no-shadow">View More</Button>
              </ItemIgo>
              <ItemIgo>
                <NameBlock>
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${HeroIMG})` }}
                  />
                  <div>
                    <h4>Astro Hounds</h4>
                    <span>Public</span>
                  </div>
                </NameBlock>
                <div className="tags">
                  <span>1ST PHASE</span>
                  <span>TBA</span>
                </div>
                <p>
                  Aradena is a medieval fantasy metaverse including Aradena:
                  Battlegrounds. Fight with medieval warriors and fantastical
                  beasts in a revolutionary PvP miniature strategy combat game.
                </p>
                <Button className="primary full no-shadow">View More</Button>
              </ItemIgo>
              <ItemIgo>
                <NameBlock>
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${HeroIMG})` }}
                  />
                  <div>
                    <h4>Realm Hunter</h4>
                    <span>Public</span>
                  </div>
                </NameBlock>
                <div className="tags">
                  <span>1ST PHASE</span>
                  <span>TBA</span>
                </div>
                <p>
                  Aradena is a medieval fantasy metaverse including Aradena:
                  Battlegrounds. Fight with medieval warriors and fantastical
                  beasts in a revolutionary PvP miniature strategy combat game.
                </p>
                <Button className="primary full no-shadow">View More</Button>
              </ItemIgo>
              <ItemIgo>
                <NameBlock>
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${HeroIMG})` }}
                  />
                  <div>
                    <h4>Aradena Battlegrounds</h4>
                    <span>Public</span>
                  </div>
                </NameBlock>
                <div className="tags">
                  <span>1ST PHASE</span>
                  <span>TBA</span>
                </div>
                <p>
                  Aradena is a medieval fantasy metaverse including Aradena:
                  Battlegrounds. Fight with medieval warriors and fantastical
                  beasts in a revolutionary PvP miniature strategy combat game.
                </p>
                <Button className="primary full no-shadow">View More</Button>
              </ItemIgo>
              <ItemIgo>
                <NameBlock>
                  <div
                    className="ComLogo"
                    style={{ backgroundImage: `url(${HeroIMG})` }}
                  />
                  <div>
                    <h4>Aradena Battlegrounds</h4>
                    <span>Public</span>
                  </div>
                </NameBlock>
                <div className="tags">
                  <span>1ST PHASE</span>
                  <span>TBA</span>
                </div>
                <p>
                  Aradena is a medieval fantasy metaverse including Aradena:
                  Battlegrounds. Fight with medieval warriors and fantastical
                  beasts in a revolutionary PvP miniature strategy combat game.
                </p>
                <Button className="primary full no-shadow">View More</Button>
              </ItemIgo> */}
            </OwlCarousel>
          </Container>
        </Upcoming>
      ) : (
        <Loading></Loading>
      )}

      <ProtectSec>
        <Container className="container">
          <div className="secHalf">
            <img src={imgArt1}></img>
            <img className="floating-man" src={imgArt2}></img>
          </div>
          <div className="secHalf">
            <SecTitle>
              <h3>Reformo Platform Protected Launch</h3>
            </SecTitle>
            <ul>
              <li>DAO Voting System for Projects</li>
              <li>Reinforced penalties for non-compliant projects</li>
              <li>Strict policies for projects listings</li>
              <li>Launch refund for participants</li>
            </ul>
            <Button
              className="primary"
              onClick={() =>
            
                window.open("https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2")
              }
            >
              Buy TOKEN
            </Button>
          </div>
        </Container>
      </ProtectSec>

      <HomeUsp>
        <Container>
          <SecTitle>
            <h3>
              The Easiest way of Investing in Blockchain Games, NFTS and
              Metaverses
            </h3>
          </SecTitle>
          <HomeGrid>
            <GridCard>
              <h3>Access to Leading Projects</h3>
              <p>
                As a launchpad and incubator we're constantly searching for the
                best upcoming games, NFTS and metaverses projects for our
                holders to invest
              </p>
            </GridCard>
            <GridCard>
              <h3>Access to Leading Projects</h3>
              <p>
                As a launchpad and incubator we're constantly searching for the
                best upcoming games, NFTS and metaverses projects for our
                holders to invest
              </p>
            </GridCard>
            <GridCard>
              <h3>Access to Leading Projects</h3>
              <p>
                As a launchpad and incubator we're constantly searching for the
                best upcoming games, NFTS and metaverses projects for our
                holders to invest
              </p>
            </GridCard>
            <GridCard>
              <h3>Access to Leading Projects</h3>
              <p>
                As a launchpad and incubator we're constantly searching for the
                best upcoming games, NFTS and metaverses projects for our
                holders to invest
              </p>
            </GridCard>
            <GridCard className="long"></GridCard>
          </HomeGrid>
        </Container>
      </HomeUsp>

      <Container>
        <CTA>
          <h4>
            Apply for your blockchain gaming or NFT Project to launch at MD
            Platform
          </h4>
          <p>
            Are you a Crypto Influencer or KOL? We would love to meet and work
            with you
          </p>
          <Button
            className="secondary rounded"
            onClick={() => setOpenApplyProjectModal(true)}
          >
            Apply Now
          </Button>
        </CTA>
      </Container>

      <JoiningSteps>
        <Container className="justify-center">
          <SecTitle className="text-center">
            <h3>
              How to join the blockchain gaming <br />
              revolution with us
            </h3>
            <p>
              Only 3 little steps are needed for you to start enjoying all the
              advantages of Reformo Platform
            </p>
          </SecTitle>
          <div className="stepContainer">
            <Steps>
              <span>
                <i className="fas fa-shopping-cart"></i>
              </span>
              <h5>1. Purchase TOKEN</h5>
              <p>
                TOKEN is Reformo Platform's token that enables its holders to
                participate in the IDOs, INOs, stake and farm for passive income
              </p>
              <Link to="">
                Buy TOKEN <i className="fas fa-caret-right"></i>
              </Link>
            </Steps>
            <Steps>
              <span>
                <i className="fas fa-handshake"></i>
              </span>
              <h5>2. Stake or Farm your TOKEN</h5>
              <p>
                Add your TOKEN to one of our staking or farming pools and earn
                passive income
              </p>
              <Link to="">
                Buy TOKEN <i className="fas fa-caret-right"></i>
              </Link>
            </Steps>
            <Steps>
              <span>
                <i className="fas fa-id-card"></i>
              </span>
              <h5>3. Complete KYC</h5>
              <p>
                It's a simple step to ensure your participation in the IDOs{" "}
                <br />
                (not necessary for INOs)
              </p>
              <Link to="">
                Buy TOKEN <i className="fas fa-caret-right"></i>
              </Link>
            </Steps>
            <Steps>
              <span>
                <i className="fas fa-check-circle"></i>
              </span>
              <h5>4. You're all set!</h5>
              <p>
                Now you can purchase the tokens and NFTs os the best blockchain
                games
              </p>
            </Steps>
          </div>
        </Container>
      </JoiningSteps>

      <Advisors>
        <Container>
          <SecTitle>
            <h3>Our Advisors</h3>
            <p>
              Only 3 little steps are needed for you to start enjoying all the
              advantages of Reformo Platform
            </p>
          </SecTitle>
          <OwlCarousel className="owl-theme" responsive={advisors} loop>
            <TeamItem>
              <img src={team1} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
            <TeamItem>
              <img src={team2} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
            <TeamItem>
              <img src={team3} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
            <TeamItem>
              <img src={team4} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
            <TeamItem>
              <img src={team5} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
            <TeamItem>
              <img src={team5} alt=""></img>
              <h4>Tim Jooste</h4>
              <p>NFT Advisor and Founder of Koin Games</p>
            </TeamItem>
          </OwlCarousel>
        </Container>
      </Advisors>

      <FaqMain>
        <Container>
          <SecTitle>
            <h3>Frequently Asked Questions</h3>
            <p>
              Haven't found the answers you are looking for? Contact us at
              support@Rasierplatform.com
            </p>
          </SecTitle>
          <FaqItems
            onClick={() => setAnswerShow1(!answerShow1)}
            className={answerShow1 ? "active" : ""}
          >
            <h3>What does IDO and INO mean?</h3>
            <p>
              These are acronyms that stand for Initial Gaming Offer (IDO) and
              Initial NFT Offer (INO) which are the main services provided by MD
              Platform. Though the IDOs and INOs TOKEN holders can purchase the
              tokens or NFTs or a project prior to the listing and because of
              that, the investors are able to enjoy higher ROI from these
              projects.
            </p>
          </FaqItems>
          <FaqItems
            onClick={() => setAnswerShow2(!answerShow2)}
            className={answerShow2 ? "active" : ""}
          >
            <h3>How can one join Reformo Platform IDOs and INOs?</h3>
            <p>
              These are acronyms that stand for Initial Gaming Offer (IDO) and
              Initial NFT Offer (INO) which are the main services provided by MD
              Platform. Though the IDOs and INOs TOKEN holders can purchase the
              tokens or NFTs or a project prior to the listing and because of
              that, the investors are able to enjoy higher ROI from these
              projects.
            </p>
          </FaqItems>
          <FaqItems
            onClick={() => setAnswerShow3(!answerShow3)}
            className={answerShow3 ? "active" : ""}
          >
            <h3>What are the utilities of TOKEN?</h3>
            <p>
              These are acronyms that stand for Initial Gaming Offer (IDO) and
              Initial NFT Offer (INO) which are the main services provided by MD
              Platform. Though the IDOs and INOs TOKEN holders can purchase the
              tokens or NFTs or a project prior to the listing and because of
              that, the investors are able to enjoy higher ROI from these
              projects.
            </p>
          </FaqItems>
          <FaqItems
            onClick={() => setAnswerShow4(!answerShow4)}
            className={answerShow4 ? "active" : ""}
          >
            <h3>How can I get back the tokens I purchased on an IDO?</h3>
            <p>
              These are acronyms that stand for Initial Gaming Offer (IDO) and
              Initial NFT Offer (INO) which are the main services provided by MD
              Platform. Though the IDOs and INOs TOKEN holders can purchase the
              tokens or NFTs or a project prior to the listing and because of
              that, the investors are able to enjoy higher ROI from these
              projects.
            </p>
          </FaqItems>
          <FaqItems
            onClick={() => setAnswerShow5(!answerShow5)}
            className={answerShow5 ? "active" : ""}
          >
            <h3>
              What should I do after buying the TOKEN? Can I join the IDOs?
            </h3>
            <p>
              These are acronyms that stand for Initial Gaming Offer (IDO) and
              Initial NFT Offer (INO) which are the main services provided by MD
              Platform. Though the IDOs and INOs TOKEN holders can purchase the
              tokens or NFTs or a project prior to the listing and because of
              that, the investors are able to enjoy higher ROI from these
              projects.
            </p>
          </FaqItems>
        </Container>
      </FaqMain>

      <Clients>
        <Container>
          <SecTitle className="text-center">
            <h3>Take a look at our clients</h3>
          </SecTitle>
          <ClientLogos>
            <a href="/">
              <img src={client1} alt=""></img>
            </a>
            <a href="/">
              <img src={client2} alt=""></img>
            </a>
            <a href="/">
              <img src={client3} alt=""></img>
            </a>
            <a href="/">
              <img src={client4} alt=""></img>
            </a>
            <a href="/">
              <img src={client5} alt=""></img>
            </a>
            <a href="/">
              <img src={client6} alt=""></img>
            </a>
            <a href="/">
              <img src={client7} alt=""></img>
            </a>
            <a href="/">
              <img src={client8} alt=""></img>
            </a>
            <a href="/">
              <img src={client9} alt=""></img>
            </a>
            <a href="/">
              <img src={client10} alt=""></img>
            </a>
            <a href="/">
              <img src={client11} alt=""></img>
            </a>
            <a href="/">
              <img src={client12} alt=""></img>
            </a>
            <a href="/">
              <img src={client13} alt=""></img>
            </a>
            <a href="/">
              <img src={client14} alt=""></img>
            </a>
            <a href="/">
              <img src={client15} alt=""></img>
            </a>
            <a href="/">
              <img src={client16} alt=""></img>
            </a>
          </ClientLogos>
        </Container>
      </Clients>

      <Container>
        <CTA>
          <h4>Join Reformo Platform's KOL and Content Creator Network</h4>
          <p>
            Are you a Crypto Influencer or KOL? We would love to meet and work
            with you
          </p>
          <Button className="secondary rounded">Apply Now</Button>
        </CTA>
      </Container>

      <Testimonials>
        <Container>
          <div className="testimonials-grid">
            <div className="testimonials-col1">
              <SecTitle>
                <h3>Voices of Our Holders</h3>
                <p>Here's what our community saying about us</p>
              </SecTitle>
            </div>
            <div className="testimonials-col2">
              <OwlCarousel
                className="owl-theme"
                nav
                navText={[
                  '<i class="fas fa-chevron-left"></i>',
                  '<i class="fas fa-chevron-right"></i>',
                ]}
                responsive={testimonials}
                items={2}
              >
                <ClientsSays>
                  <NameBlock className="NameBlock">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Ran Neuner</h4>
                      <span>Content Creator and Crypto Investor</span>
                    </div>
                  </NameBlock>
                  <p>
                    "I feel like I am at home. I feel like I’m part of MD
                    Platform even tho I’m not the biggest token holder in the
                    world I do own obviously a lot of TOKEN maybe I don’t
                    participate in all IDOs but I do participate in a lot of
                    them, I feel like I’m at home and that’s the beauty of
                    crypto."
                  </p>
                </ClientsSays>
                <ClientsSays>
                  <NameBlock className="NameBlock">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Ran Neuner</h4>
                      <span>Content Creator and Crypto Investor</span>
                    </div>
                  </NameBlock>
                  <p>
                    "I feel like I am at home. I feel like I’m part of MD
                    Platform even tho I’m not the biggest token holder in the
                    world I do own obviously a lot of TOKEN maybe I don’t
                    participate in all IDOs but I do participate in a lot of
                    them, I feel like I’m at home and that’s the beauty of
                    crypto."
                  </p>
                </ClientsSays>
                <ClientsSays>
                  <NameBlock className="NameBlock">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Ran Neuner</h4>
                      <span>Content Creator and Crypto Investor</span>
                    </div>
                  </NameBlock>
                  <p>
                    "I feel like I am at home. I feel like I’m part of MD
                    Platform even tho I’m not the biggest token holder in the
                    world I do own obviously a lot of TOKEN maybe I don’t
                    participate in all IDOs but I do participate in a lot of
                    them, I feel like I’m at home and that’s the beauty of
                    crypto."
                  </p>
                </ClientsSays>
                <ClientsSays>
                  <NameBlock className="NameBlock">
                    <div
                      className="ComLogo"
                      style={{ backgroundImage: `url(${HeroIMG})` }}
                    />
                    <div>
                      <h4>Ran Neuner</h4>
                      <span>Content Creator and Crypto Investor</span>
                    </div>
                  </NameBlock>
                  <p>
                    "I feel like I am at home. I feel like I’m part of MD
                    Platform even tho I’m not the biggest token holder in the
                    world I do own obviously a lot of TOKEN maybe I don’t
                    participate in all IDOs but I do participate in a lot of
                    them, I feel like I’m at home and that’s the beauty of
                    crypto."
                  </p>
                </ClientsSays>
              </OwlCarousel>
            </div>
          </div>
        </Container>
      </Testimonials>
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

const Upcoming = styled.div`
  padding: 150px 0 150px 0;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    // background: #0f0c2a;
    background: rgba(251, 174, 72, 0.6);
    width: 400px;
    height: 400px;
    border-radius: 100%;
    transform: scale(3) translate(20%, -30%);
    // transform: matrix(-0.97, -0.25, -0.25, 0.97, 0, 0);
    filter: blur(50px);
    opacity: 0.2;
    z-index: -1;
  }
  @media (max-width: 768px) {
    padding: 100px 0 100px 0;
  }
`;
const ItemIgo = styled.div`
  padding: 20px;
  min-height: 460px;
  max-height: 460px;
  display: flex;
  flex-flow: column;
  background: #151517;
  position: relative;
  /*The background extends to the outside edge of the padding. No background is drawn beneath the border.*/
  background-clip: padding-box;
  border: solid 4px transparent;
  border-radius: 0.9rem;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -5px; /* same as border width */
    border-radius: inherit; /* inherit container box's radius */
    background: linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  }

  .tags {
    font-size: 1.6rem;
    margin: 20px 0;
    span {
      &:after {
        content: "|";
        margin: 0 13px;
      }
      &:last-child:after {
        display: none;
      }
    }
  }
  p {
    font-size: 1.6rem;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 240px;
    width: 100%;
  }
  .primary {
    margin-top: auto;
  }
`;

const ProtectSec = styled.div`
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    // background: #190b2c;
    opacity:0.2;
    background: rgba(251, 174, 72, 0.6);
    width: 400px;
    height: 500px;
    border-radius: 100%;
    transform: scale(3) translate(-20%, 0%);
    filter: blur(40px);
    z-index: -1;
  }
  ul {
    margin-bottom: 56px;
  }
  li {
    font-size: 2.4rem;
    margin-bottom: 34px;
    position: relative;
    padding-left: 25px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 6px;
      width: 12px;
      height: 12px;
      background: currentColor;
      border-radius: 100%;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .container {
    display: flex;
    align-items: center;
  }
  .secHalf {
    padding: 0 15px;
    width: 50%;
    position: relative;
  }
  .floating-man {
    position: absolute;
    top: 0;
    left: 15px;
    width: calc(100% - 30px);
  }
  @media (max-width: 991px) {
    ul {
      margin-bottom: 40px;
    }
    li {
      font-size: 2rem;
      margin-bottom: 20px;
      line-height: 1.2;
    }
  }
  @media (max-width: 768px) {
    .container {
      display: flex;
      flex-flow: column;
    }
    .secHalf {
      width: 100%;
      margin-bottom: 20px;
      padding: 0;
    }
  }
`;

const HomeUsp = styled.section`
  padding: 150px 0 0;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 100%;
    right: 0;
    // background: #1c032b;
    opacity:0.2;
    background: rgba(251, 174, 72, 0.6);
    width: 400px;
    height: 300px;
    border-radius: 100%;
    transform: scale(3) translate(20%, 10%);
    filter: blur(50px);
    z-index: -1;
  }
  @media (max-width: 768px) {
    padding: 100px 0 0;
  }
`;
const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 30px;
  @media (max-width: 991px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const GridCard = styled.div`
  border-radius: 26px;
  background-color: rgb(255, 255, 255, 0.1);
  padding: 34px 25px 70px;
  min-height: 200px;
  &.long {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 3;
    grid-column-end: 4;
    background: url(${ColImg}) no-repeat center;
    background-size: auto;
  }
  h3 {
    font-size: 3rem;
    line-height: 1.3;
    font-weight: 600;
    margin-bottom: 25px;
  }
  P {
    font-size: 1.8rem;
    line-height: 1.4;
  }
  @media (max-width: 991px) {
    h3 {
      font-size: 2.5rem;
      line-height: 1.3;
      font-weight: 600;
      margin-bottom: 25px;
    }
    P {
      font-size: 1.8rem;
      line-height: 1.4;
    }
    &.long {
      display: none;
    }
  }
  @media (max-width: 640px) {
    padding: 34px 25px;
  }
`;

const CTA = styled.section`
  border-radius: 26px;
  width: 100%;
  position: relative;
  margin: 150px 0;
  padding: 62px 45px;
  // background: url(${CTAbg}) no-repeat center;
  background : linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  background-size: cover;
  display: grid;
  align-items: center;
  grid-template-areas:
    "heading button"
    "text button";
  /* &:after {content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url(${CTAbg}) no-repeat center; background-size: cover;} */
  h4 {
    grid-area: heading;
    font-size: 4rem;
    font-weight: 600;
    width: 85%;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  p {
    grid-area: text;
    font-size: 2rem;
    width: 85%;
  }
  button {
    grid-area: button;
  }
  @media (max-width: 991px) {
    padding: 40px 45px;
    h4 {
      font-size: 3.2rem;
      line-height: 1.4;
    }
  }
  @media (max-width: 768px) {
    margin: 120px 0;
    grid-template-areas: "heading" "text" "button";
    text-align: center;
    h4 {
      width: 100%;
      font-size: 2.8rem;
    }
    p {
      width: 100%;
    }
    button {
      margin: 40px auto 0;
    }
  }
  @media (max-width: 640px) {
    padding: 35px 20px;
  }
`;

const JoiningSteps = styled.section`
  overflow: hidden;
  .stepContainer {
    display: flex;
    width: 100%;
    text-align: left;
    padding: 16px 0 40px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 44px;
      width: 100vw;
      left: 50%;
      height: 3px;
      background: #ffffff;
      opacity: 0.25;
      transform: translateX(-50%);
    }
  }
  @media (max-width: 768px) {
    .stepContainer {
      flex-flow: wrap;
      padding: 16px 0 0;
      &:after {
        display: none;
      }
    }
  }
`;
const Steps = styled.section`
  text-align: center;
  width: 25%;
  text-align: left;
  padding: 0 15px;
  display: flex;
  flex-flow: column;
  position: relative;
  z-index: 1;
  span {
    width: 58px;
    height: 58px;
    display: flex;
    background: var(--primary);
    line-height: 58px;
    border-radius: 100%;
    justify-content: center;
    align-items: center;
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  h5 {
    justify-content: center;
    margin-bottom: 18px;
    font-size: 2rem;
    font-weight: 600;
  }
  p {
    font-size: 1.5rem;
    margin-bottom: 15px;
    line-height: 1.4;
  }
  a {
    color: #FBAE48;
    text-transform: uppercase;
    margin-top: auto;
  }
  @media (max-width: 768px) {
    width: 50%;
    text-align: center;
    margin: 0 0 30px;
    span {
      margin: 0 auto 20px;
    }
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;
const Advisors = styled.section`
  text-align: center;
  padding: 127px 0;
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
    box-shadow: 140px 20px 0 #4b202e;
    border-radius: 100%;
    transform: translate(-80%, -50%) scale(3.2);
    filter: blur(40px);
    z-index: -1;
  }

  .owl-carousel {
    padding: 40px 0 0 0;
  }
  @media (max-width: 991px) {
    .owl-carousel {
      padding: 0 0 0 0;
    }
  }
  @media (max-width: 768px) {
    padding: 70px 0 0;
  }
`;
const TeamItem = styled.div`
  border-radius: 26px;
  background-color: rgb(255, 255, 255, 0.25);
  overflow: hidden;
  text-align: center;
  padding: 0 0 10px;
  img {
    border-radius: 26px;
  }
  h4 {
    font-size: 2rem;
    font-weight: 600;
    margin: 14px 0 6px 0;
  }
  p {
    width: 100%;
    font-size: 1.3rem;
    line-height: 1.4;
    padding: 0 10px;
  }
  @media (max-width: 640px) {
    padding: 0 0 15px;
    h4 {
      font-size: 1.8rem;
    }
  }
`;

const FaqMain = styled.section`
  text-align: center;
  padding: 0 0;
  @media (max-width: 768px) {
    padding: 100px 0 0;
  }
`;
const FaqItems = styled.div`
  border-radius: 26px;
  background-color: rgba(255, 255, 255, 0);
  border: 2px solid rgba(255, 255, 255, 0.25);
  text-align: left;
  padding: 0 27px;
  width: 1020px;
  margin: 0 auto;
  padding: 26px 27px 2px;
  margin-bottom: 18px;
  h3 {
    font-size: 2.5rem;
    position: relative;
    margin-bottom: 20px;
    line-height: 1.3;
    padding: 0 40px 0 0;
    &:after {
      content: "+";
      width: 37px;
      height: 37px;
      background: var(--primary);
      position: absolute;
      right: 0;
      top: -3px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 1;
      border-radius: 100%;
      // box-shadow: 0 0 20px rgba(30, 80, 255, 0.8);
      cursor: pointer;
    }
  }
  p {
    font-size: 1.7rem;
    display: none;
    padding: 0 0 23px 0;
  }
  &.active {
    background-color: rgba(255, 255, 255, 0.05);
    h3 {
      &:after {
        content: "-";
      }
    }
    p {
      display: block;
    }
  }
  @media (max-width: 991px) {
    h3 {
      font-size: 2.2rem;
      margin-bottom: 23px;
    }
  }
  @media (max-width: 768px) {
    padding: 18px 20px;
    h3 {
      font-size: 2rem;
      margin: 0;
      &:after {
        width: 25px;
        height: 25px;
        font-size: 2rem;
        top: 0;
      }
    }
    p {
      margin-top: 18px;
      padding-bottom: 0;
    }
  }
`;
const Clients = styled.div`
  padding-top: 150px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0%;
    left: 0;
    // background: #0f0c2a;
    background: rgba(251, 174, 72, 0.6);
    width: 400px;
    height: 450px;
    border-radius: 100%;
    transform: scale(3) translate(0%, -5%);
    filter: blur(50px);
    z-index: -1;
    opacity: 0.2;
  }
  @media (max-width: 768px) {
    padding-top: 100px;
  }
`;
const ClientLogos = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  padding: 0 8.3%;
  gap: 30px;
  @media (max-width: 991px) {
    padding: 0 0%;
    gap: 10px;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Testimonials = styled.div`
  .testimonials-grid {
    display: flex;
    width: 100%;
    justify-content: space-between;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 0%;
      left: 50%;
      background: #1b0e2a;
      width: 300px;
      height: 400px;
      border-radius: 100%;
      transform: scale(1.5) translate(22%, -17%) rotate(30deg);
      filter: blur(60px);
      z-index: -1;
    }
    .testimonials-col1 {
      width: 25%;
      padding: 22px 0 30px;
    }
    .testimonials-col2 {
      width: 66.66%;
    }
    .owl-dots {
      display: none;
    }
    .owl-carousel {
      position: static;
      .owl-nav {
        position: absolute;
        left: 0;
        bottom: 20px;
        color: var(--text-color);
        .owl-prev,
        .owl-next {
          background-color: transparent;
          width: 38px;
          height: 38px;
          border: 2px solid #fff;
          border-radius: 100%;
          margin: 0 10px 0 0;
          font-size: 1.7rem;
        }
      }
    }
  }
  @media (max-width: 1920px){
    .NoregisterMessage{
      margin-top: 10vh;

    }
  }
  @media (max-width: 991px) {
    .testimonials-grid {
      .testimonials-col1 {
        width: 30%;
      }
    }
  }
  @media (max-width: 768px) {
    .testimonials-grid {
      flex-flow: column;
      &:after {
        left: 10%;
        top: 50%;
      }
      .testimonials-col1 {
        width: 100%;
        padding: 0;
        text-align: center;
      }
      .testimonials-col2 {
        width: 100%;
        .owl-carousel {
          position: static;
          .owl-nav {
            display: none;
          }
          .owl-dots {
            display: block;
          }
        }
      }
    }
  }
`;
const ClientsSays = styled.div`
  border-radius: 26px;
  background: url(${quote}) no-repeat rgb(255, 255, 255, 0.1);
  padding: 26px;
  background-position: calc(100% - 24px) 24px;
  min-height: 342px;
  p {
    font-size: 1.5rem;
    font-weight: normal;
    line-height: 1.5;
  }
  .NameBlock {
    margin-bottom: 27px;
    .ComLogo {
      width: 76px;
      height: 76px;
      margin-right: 24px;
      flex-shrink: 0;
    }
    h4 {
      font-size: 2.2rem;
    }
    span {
      padding: 0;
      background: none;
    }
  }
`;

const PoolCard = styled.div`
// background: rgba(255, 255, 255, 0.1);
min-height: 700px;
max-height: 800px;
// width: 100%;
// width: 350px;

background: #151517;
// border-radius: 10px;
position: relative;
/*The background extends to the outside edge of the padding. No background is drawn beneath the border.*/
background-clip: padding-box;
border: solid 1px transparent;
border-radius: 0.7rem;
margin-bottom: 20px;
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
  background: linear-gradient( 267.83deg,
  #fbae48 6.21%,
  #f05c87 107.97%);
}
@media (max-width: 1920px){
  .NoregisterMessage{
    bottom: 178px !important;
  }
  // .no-shadow{
  //   position: absolute !important;
  //   bottom : 0 !important;
  // }
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
  .poolBottom1{
    padding: 26px 14px 20px;
    label{
      display: flex;
      justify-content: center;
      font-size: 1.8rem;
      margin-bottom: 16px;
    }
    span{
      text-align: center;

    }
  }

  @media (max-width: 830px) {
    .poolBottom {
      label {
        font-size: 1.5rem;
      }
    }
  }
`;


const mapDipatchToProps = (dispatch) => {
  return {
    getCompletedIGOPools: (id) => dispatch(actions.getCompletedIGOPools()),
    getUpcomingIGOPools: (page) => dispatch(actions.getUpcomingIGOPools(page)),
    getLiveIGOPools: (page) => dispatch(actions.getLiveIGOPools(page))

  };
};

const mapStateToProps = (state) => {
  return {
    completedIGOPools: state.completedIGOPools,
    upcomingIGOPools: state.upcomingIGOPools,
    liveIGOPools: state.liveIGOPools
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Home);
// export default Home;
