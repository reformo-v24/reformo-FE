import React, { useEffect, useState, useRef } from "react";
import "./stakingstyle.css";
import HeaderNew from "./Home/Header";
import Footer from "./Home/footer";
import Staking from "../components/cards/stakingCard";
import "react-responsive-modal/styles.css";
import Farming from "../components/cards/farmingCard";
import { FaChevronDown, FaInfoCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import Collapse from "@kunukn/react-collapse";
import Timer from "../components/timer";
import { connect } from "react-redux";

const StakingFarming = (props) => {
  const swaps = [
    {
      name: "Pancake Swap",
      id: "pancakeSwap",
      token: "Cake-LP",
      viewPool:
        "https://pancakeswap.finance/add/BNB/0x477bC8d23c634C154061869478bce96BE6045D12",
    },
    {
      name: "Bakery Swap",
      id: "bakerySwap",
      token: "BLP",
      viewPool:
        "https://www.bakeryswap.org/#/add/ETH/0x477bC8d23c634C154061869478bce96BE6045D12",
    },
  ];
  const wrapperRef = useRef(null);

  // useEffect(() => {
  //   enableWeb3Modal();
  // }, []);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(wrapperRef);
  const [currTab, setCurrTab] = useState("Stake");
  const tabArr = ["Stake", "Farm", "Closed"];
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentSwap, setCurrentSwap] = useState(0);
  const onInit = ({ state, style, node }) => {
    setIsOpen(false);
  };
  let s0 = 1644258600000,
    s1 = 1644863400000,
    s2 = 1645468200000,
    s3 = 1646073000000;
  function setTimer() {
    let date = new Date().getTime();
    if (date < s1) return s1;
    else if (date < s2) return s2;
    else if (date < s3) return s3;
    else return 0;
  }

  return (
    <div>
      <HeaderNew />
      <div className="stake-banner">
        <div className="container_cust">
          <div className="row_cust">
            <div className="w-50">
              <div className="stake-banner-left">
                <h1>
                  <span>Stake</span> or <span>farm</span> your RST to join
                  gaming <span>IDOs</span>
                 
                </h1>
                <p className="new">
                  And Get Free Tokens from Incubated Projects ({" "}
                  <a
                    rel="noreferrer"
                    href="#"
                    target="_blank"
                  >
                    Raise Staking
                  </a>{" "}
                  )
                </p>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
                  className="hero-btn"
                >
                  Buy on Pancakeswap
                </a>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://pancakeswap.finance/swap?chain=bscTestnet&outputCurrency=0x641C37C5BedDc99cE7671f29EaD6dcE67Fdc49d2"
                  className="hero-btn"
                >
                  Buy on KuCoin
                </a>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.gate.io/en/trade/SFUND_USDT"
                  className="hero-btn"
                >
                  Buy on Gate.io
                </a>
           
              </div>
            </div>
            <div className="w-50">
              <div className="stake-banner-right">
                <div className="stake-banner-top">
                  {tabArr.map((name, key) => {
                    return (
                      <button
                        key={key}
                        className={name === currTab ? "active" : null}
                        onClick={() => {
                          setCurrTab(name);
                          // setIsOpen(false);
                        }}
                      >
                        {name}
                    
                      </button>
                    );
                  })}
              
                </div>
                {currTab === "Stake" ? <Staking /> : null}
                {currTab === "Farm" ? (
                  <Farming
                    currentSwap={swaps[currentSwap].id}
                    token={swaps[currentSwap].token}
                    viewPool={swaps[currentSwap].viewPool}
                    swaps={swaps}
                    currentSwapIndex={currentSwap}
                    setCurrentSwap={setCurrentSwap}
                  />
                ) : null}
                {currTab === "Closed" ? (
                  <Farming
                    currentSwap={swaps[currentSwap].id}
                    token={swaps[currentSwap].token}
                    viewPool={swaps[currentSwap].viewPool}
                    swaps={swaps}
                    currentSwapIndex={currentSwap}
                    setCurrentSwap={setCurrentSwap}
                    isV1={true}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
const mapDipatchToProps = (dispatch) => {
  return {
    enableWeb3Modal: () => dispatch(),
  };
};

const mapStateToProps = (state) => {
  return {
    web3Data: state.web3Data,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(StakingFarming);
