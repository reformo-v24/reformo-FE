import React, { PureComponent, Component, useEffect, useState } from "react";
import Banner from "../component/homeBanner";
import "./stakingstyle.css";
import styled from "styled-components";
import {
  Button,
  Container,
  ExchangeBar,
  ProgressBar,
  Loading,
  TableLayout,
} from "../theme/main.styled";
import { Link } from "react-router-dom";

import icon1 from "./../assets/images/icon1.png";
import icon2 from "./../assets/images/icon2.png";
import down from "./../assets/images/caret-down-solid.svg";
import StakingModule from "../component/cards/stakingCard";
import FarmingModule from "../component/cards/farmingCard";
import StakingModal from "../component/Modal/StakingModal";
import FarmingModal from "../component/Modal/FarmingModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const swaps = [
  {
    name: "Pancake Swap",
    id: "pancakeSwap",
    token: "Cake-LP",
    viewPool:
      // "https://pancakeswap.finance/add/TBNB/0x510601cb8Db1fD794DCE6186078b27A5e2944Ad6",
      "https://pancakeswap.finance/add/TBNB/0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2?chainId=97",
  },
  // {
  //   name: "Bakery Swap",
  //   id: "bakerySwap",
  //   token: "BLP",
  //   viewPool:
  //     "https://www.bakeryswap.org/#/add/ETH/0x477bC8d23c634C154061869478bce96BE6045D12",
  // },
];

const Staking = (props) => {
  const [ToggleState, setToggleState] = useState(1);
  const [currentSwap, setCurrentSwap] = useState(0);
  const [Buy, setBuy] = useState("");
  const [stakeCalc, setStakeCalc] = useState({});
  const [stakeAmount, setStakeAmount] = useState({});
  const [farmingCalc, setFarmingCalc] = useState({});
  const [farming, setFarming] = useState({});
  const [poolclosed, setPoolclosed] = useState(false);
  const [poolclosed1, setPoolclosed1] = useState(false);
  const [poolclosed2, setPoolclosed2] = useState(false);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  return (
    <>
      <StakingMain>
        <Container>
          <StakingLeft>
            <h1>Stake or farm your TOKEN to join gaming IDOs</h1>
            <p>And Get Free Tokens from Incubated Projects ( Reformo Staking)</p>
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
                <option value="https://www.gate.io/en/trade/SFUND_USDT">
                  Buy On Gate.Io
                </option>
                <option value="https://www.bybit.com/en-US/trade/spot/SFUND/USDT">
                  Buy On Bybit
                </option>
                <option value="https://www.huobi.com/en-us/exchange/sfund_usdt">
                  Buy On Huobi
                </option>
                {/* <option value="">Apply As A Project</option> */}
              </select>
              <Button
                className="primary no-shadow"
                onClick={() => (Buy ? window.open(`${Buy}`) : "")}
              >
                BUY NOW
              </Button>
            </ExchangeBar>
          </StakingLeft>
          <StakingRight>
            <Bubbles>
              <span />
              <span />
              <span />
            </Bubbles>
            <StakingCard>
              <TabNav>
                <Link
                  className={`tabs ${getActiveClass(1, "active")}`}
                  onClick={() => toggleTab(1)}
                  to="#"
                >
                  Stake
                </Link>
                <Link
                  className={`tabs ${getActiveClass(2, "active")}`}
                  onClick={() => toggleTab(2)}
                  to="#"
                >
                  Farm
                </Link>
                {/* <Link
                  className={`tabs ${getActiveClass(3, "active")}`}
                  onClick={() => toggleTab(3)}
                  to="#"
                >
                  Closed
                </Link> */}
              </TabNav>
              {getActiveClass(
                1,
                <StakingModule
                  stakeCalc={stakeCalc}
                  setStakeCalc={setStakeCalc}
                  stakeAmount={stakeAmount}
                  setStakeAmount={setStakeAmount}
                />
              )}
              {getActiveClass(
                2,
                <FarmingModule
                  currentSwap={swaps[currentSwap].id}
                  token={swaps[currentSwap].token}
                  viewPool={swaps[currentSwap].viewPool}
                  swaps={swaps}
                  currentSwapIndex={currentSwap}
                  setCurrentSwap={setCurrentSwap}
                  farmingCalc={farmingCalc}
                  setFarmingCalc={setFarmingCalc}
                  farming={farming}
                  setFarming={setFarming}
                />
              )}
  
            </StakingCard>
          </StakingRight>
        </Container>
      </StakingMain>
      <StakingModal
        stakeCalc={stakeCalc}
        setStakeCalc={setStakeCalc}
        stakeAmount={stakeAmount}
        setStakeAmount={setStakeAmount}
      />
      <FarmingModal
        farmingCalc={farmingCalc}
        setFarmingCalc={setFarmingCalc}
        farming={farming}
        setFarming={setFarming}
      />
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
    </>
  );
};

const StakingMain = styled.div`
  min-height: 500px;
`;
const StakingLeft = styled.div`
  width: 45%;
  align-self: center;
  margin-right: auto;
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
const StakingRight = styled.div`
  width: 44.34%;
  align-self: flex-end;
  position: relative;
  margin-top: 71px;
  @media (max-width: 991px) {
    width: 550px;
    max-width: 100%;
    margin: 70px auto 0;
  }
`;
const StakingCard = styled.div`
  width: 551px;
  max-width: 100%; /* min-height: 620px; */
  // background: rgb(255, 255, 255, 0.1);

  background: #151517;
  backdrop-filter: blur(3px);
  // border-radius: 30px;
  padding: 30px;
  margin: 0 0 0 auto;
  backdrop-filter: blur(30px) brightness(0.8);
  box-shadow: 0 0 20px rgb(0 0 0 / 40%);
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to right, rgb(220, 31, 255), rgb(3, 225, 255), rgb(0, 255, 163))  2 / 1 / 0 stretch;
  button {
    margin-top: 30px;
    padding: 20px 30px 20px;
  }
  & > div {
    position: relative;
    z-index: 2;
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
const TabNav = styled.div`
  // background: rgb(0, 0, 0, 0.3);
  background : linear-gradient(90deg, #dc1fff 0%, #03e1ff 50%, #00ffa3 100%);
  backdrop-filter: blur(3px);
  display: flex;
  border-radius: 25px;
  overflow: hidden;
  margin: 0 0 31px 0;
  a {
    padding: 20px 20px;
    flex-grow: 1;
    text-align: center;
    height: 80px;
    line-height: 40px;
    font-size: 2rem;
    color: var(--text-color);
    font-weight: 600;
    border-radius: 25px;
    &.active {
      background: var(--text-color);
      // text-decoration:underline;
      // color: var(--primary);
      color: #1d1d23;
      // background: rgb(255, 255, 255, 0.1);
      // backdrop-filter: blur(30px) brightness(0.8);
      box-shadow: 0 0 20px rgb(0 0 0 / 40%);
    }
  }
  @media (max-width: 1400px) {
    a {
      height: 70px;
      line-height: 34px;
    }
  }
  @media (max-width: 480px) {
    a {
      font-size: 1.7rem;
    }
  }
`;

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
const Bubbles = styled.div`
  span:first-child {
    position: absolute;
    width: 158px;
    height: 158px;
    background: #ffdc62;
    border-radius: 100%;
    z-index: -1;
    top: 44px;
    left: -26px;
    &:after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: -10px;
      width: 12px;
      height: 12px;
      background: #766ec2;
      border-radius: 100%;
    }
    &:before {
      content: "";
      position: absolute;
      top: -14px;
      left: -35px;
      width: 20px;
      height: 20px;
      background: #199f84;
      border-radius: 100%;
    }
  }
  span:nth-child(2) {
    position: absolute;
    width: 40px;
    height: 40px;
    background: #ff54b0;
    border-radius: 100%;
    z-index: 1;
    top: 54%;
    left: 212px;
    filter: blur(15px);
  }
  span:last-child {
    position: absolute;
    width: 158px;
    height: 158px;
    background: #48ade6;
    border-radius: 100%;
    z-index: -1;
    bottom: 94px;
    right: -44px;
    &:after {
      content: "";
      position: absolute;
      top: -42px;
      right: -2px;
      width: 20px;
      height: 20px;
      background: #d2252b;
      border-radius: 100%;
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
export default Staking;
