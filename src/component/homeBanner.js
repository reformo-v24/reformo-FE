import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button, Container, SecTitle } from "../theme/main.styled";
import Media from "./../theme/media-breackpoint";

import HeroIMG1 from "./../assets/images/banner-l1.png";
import HeroIMG2 from "./../assets/images/banner-l2.png";
import HeroIMG3 from "./../assets/images/banner-l3.png";
import HeroIMG4 from "./../assets/images/banner-l4.png";
import HeroIMG5 from "./../assets/images/banner-l5.png";
import HeroIMG6 from "./../assets/images/banner-l6.png";
import partner1 from "./../assets/images/partner1.png";
import partner2 from "./../assets/images/partner2.png";
import partner3 from "./../assets/images/partner3.png";
import partner4 from "./../assets/images/partner4.png";
import partner5 from "./../assets/images/partner5.png";

function Header(props) {
  return (
    <Banner className="bannerMain">
      <Container>
        <BannerLeft>
          <h1>
            Become an early investor in the top <span>Blockchain Games</span>,{" "}
            <span>NFTS</span> and <span>Metaverses</span>
          </h1>
          <p>
          Reformo Platform is the leading blockchain gaming launchpad with over
            50 projects launched and the highest average ROI in the industry
          </p>
          <BannerBtns>
            <Button
              className="primary mr-25"
              onClick={() =>
                window.open("https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2")
              }
            >
              Buy TOKEN
            </Button>
            <Button className="secondary">How to Start</Button>
          </BannerBtns>
        </BannerLeft>
        <BannerRight className="parallax">
          <img className="ly-1" src={HeroIMG1}></img>
          {/* <img className="ly-2" src={HeroIMG2}></img>
          <img className="ly-3" src={HeroIMG3}></img>
          <img className="ly-4" src={HeroIMG4}></img>
          <img className="ly-5" src={HeroIMG5}></img>
          <img className="ly-6" src={HeroIMG6}></img> */}
        </BannerRight>
        <BannerLogos>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
          >
            <img src={partner1}></img>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
          >
            <img src={partner2}></img>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
          >
            <img src={partner3}></img>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
          >
            <img src={partner4}></img>
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56&outputCurrency=0x477bc8d23c634c154061869478bce96be6045d12"
          >
            <img src={partner5}></img>
          </a>
        </BannerLogos>
      </Container>
    </Banner>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const Banner = styled.section`
  padding: 90px 0 0 0;
  @media (max-width: 1400px) {
    padding: 10px 0 0 0;
  }
`;
const BannerLeft = styled.div`
  width: 50%;
  position: relative;
  z-index: 2;
  h1 {
    font-size: 5.1rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0 0 32px 0;
    /* @media(max-width:1400px){ 
            font-size: 3.5rem;
        }  */
  }
  span {
    color: var(--primary);
  }
  P {
    font-size: 2.5rem;
    line-height: 1.4;
    /*  @media(max-width:1400px){ 
            font-size: 2.0rem;
        }  */
  }
  @media (max-width: 991px) {
    text-align: center;
    width: 100%;
    order: 2;
    margin: 30px 0;
  }
  @media (max-width: 640px) {
    h1 {
      font-size: 3.2rem;
    }
    p {
      font-size: 1.8rem;
    }
  }
  @media (max-width: 480px) {
    h1 {
      font-size: 2.8rem;
    }
  }
`;
const BannerBtns = styled(FlexDiv)`
  justify-content: flex-start;
  margin: 50px 0 0 0;
  @media (max-width: 991px) {
    justify-content: center;
  }
`;
const BannerRight = styled.div`
  width: 50%;
  position: relative;
  z-index: 1;
  .ly-1 {
    position: relative;
    z-index: 5;
  }
  img {
    width: 100%;
    margin-top: -80px;
  }
  img:not(.ly-1) {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 4;
  }
  @media (max-width: 991px) {
    text-align: center;
    width: 80%;
    max-width: 500px;
    order: 1;
    margin: 0px auto;
  }
`;
const BannerLogos = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 106px 0 0 0;
  align-items: center;
  a {
    margin: 0 30px;
  }
  @media (max-width: 991px) {
    text-align: center;
    width: 100%;
    order: 3;
    margin: 60px 0 0 0;
    a {
      margin: 0 10px;
    }
  }
  @media (max-width: 768px) {
    flex-flow: wrap;
    margin: 30px 0 0 0;
    a {
      margin: 0 20px 15px;
      img {
        max-height: 25px;
      }
    }
  }
  @media (max-width: 640px) {
    a {
      margin: 0 10px 15px;
      img {
        max-height: 23px;
      }
    }
  }
`;
export default Header;
