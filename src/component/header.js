import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Link, NavLink, useLocation } from "react-router-dom";
import Web3 from "web3";
import Logo from "./../assets/images/logo.png";
import UserIcon from "./../assets/images/user.svg";
import { Container } from "../theme/main.styled";
import { connect, useDispatch, useSelector } from "react-redux";
import { actions } from "../actions";
import { compactAddress } from "../helpers/functions";
import DisconnectModal from "./Modal/DisconnectModal";
import { setWeb3Provider } from "../web3";
import { chains, wallets, appMetadata } from "../helpers/web3Config";
import { init, useConnectWallet } from "@web3-onboard/react";

init({
  wallets: wallets,
  chains: chains,
  theme: "dark",
  appMetadata: appMetadata,
  connect: {
    autoConnectLastWallet: true,
  },
});

function useStickyHeader(offset = 0) {
  const [stick, setStick] = useState(false);
  const handleScroll = () => {
    setStick(window.scrollY > offset);
  };
  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  return stick;
}

const Header = (props) => {
  const { enableWeb3Modal, disableWeb3Modal } = props;
  const { auth, metamask } = useSelector((state) => state);
  //new ui
  const ref = useRef();
  const sticky = useStickyHeader(50);
  const headerClasses = ` ${sticky ? "sticky" : ""}`;
  const [isOpen, setOpen] = React.useState(true);
  const [modal, setModal] = useState({});
  //
  let web3Data = useSelector((state) => state.web3Data);
  let { pathname } = useLocation();
  const dispatch = useDispatch();
  const provider = Web3.givenProvider;
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  
  useEffect(() => {
    if (wallet?.provider) {
      console.log("wallet ", wallet);
      setWeb3Provider(wallet.provider);
    }
  }, [wallet]);

  useEffect(() => {
    // dispatch(checkWalletConnection());
  }, [dispatch, provider]);

  //connect wallet
  const connectMetamask = () => {
    // dispatch(connectWallet());
    enableWeb3Modal();
  };
  //disconnect wallet
  const disconnectwallet = async () => {
    await disableWeb3Modal();
    await setModal({
      open: false,
    });
    // dispatch(disconnectWallet());

    handleClose();
  };
  // const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setModal({ open: true, disconnectwallet: disconnectwallet, web3Data });
    // setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //
  // useEffect(() => {
  //   (async () => {
  //     if (localStorage.getItem("modalProvider")) await enableWeb3Modal();
  //   })();
  // }, []);
  const body = (
    <div className="paper">
      <div className="paper-inner">
        <div className="paper-head">
          <h2 className="paper_h2" id="simple-modal-title">
            Your wallet
          </h2>
          <span onClick={handleClose}>
            <i class="fa fa-times" aria-hidden="true"></i>
          </span>
        </div>
        <input
          className="paper_input"
          type="text"
          name="amount"
          value={web3Data?.accounts[0]}
          // value={metamask?.address}
          readOnly
        />{" "}
        <button className="paper_button" onClick={() => disconnectwallet()}>
          Disconnect
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <HeaderOuter className={headerClasses}>
        <Container className="flex">
          <HeaderInner>
            <LogoM>
              <Link to="/">
                <img src={Logo} alt="logo" />
              </Link>
            </LogoM>

            <Menu className={`${!isOpen ? "show" : ""}`}>
              <NavLink exact activeClassName="active" to="/launchpad">
                IDO launchpad
              </NavLink>
              <NavLink activeClassName="active" to="/staking">
                Staking / Farming
              </NavLink>
              <NavLink activeClassName="active" to="/claims">
                Claims
              </NavLink>
            </Menu>

            <HeaderRight>
              <Link to="/">
                EN <i className="fas fa-caret-down"></i>
              </Link>
              <Link className="user" to="/user-profile">
                <img width="20px" src={UserIcon}></img>
              </Link>
              <Button
                as="a"
                to="/home"
                onClick={() => {
                  // eslint-disable-next-line babel/no-unused-expressions
                  !web3Data?.isLoggedIn ? connectMetamask() : handleOpen();
                }}
                className="btn btn-primary"
              >
                {!web3Data.isLoggedIn
                  ? "connect wallet"
                  : compactAddress(web3Data.accounts[0])}
              </Button>
            </HeaderRight>
            <Hamburger
              onClick={() => setOpen(!isOpen)}
              className={`${!isOpen ? "open" : ""}`}
              data-menu="11"
            >
              <div className="icon-left"></div>
              <div className="icon-right"></div>
            </Hamburger>
          </HeaderInner>
        </Container>
      </HeaderOuter>
      <DisconnectModal modal={modal} setModal={setModal} />
      {/* <div>
        <Modal
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>{" "}
        *
      </div> */}
    </div>
  );
};

const mapDipatchToProps = (dispatch) => {
  return {
    enableWeb3Modal: () => dispatch(actions.enableWeb3Modal()),
    disableWeb3Modal: () => dispatch(actions.disableWeb3Modal()),
    getCompletedIGOPools: (id) => dispatch(actions.getCompletedIGOPools()),
    getUpcomingIGOPools: () => dispatch(actions.getUpcomingIGOPools()),
  };
};

const mapStateToProps = (state) => {
  return {
    completedIGOPools: state.completedIGOPools,
    upcomingIGOPools: state.upcomingIGOPools,
    web3Data: state.web3Data,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(Header);

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const HeaderOuter = styled.header`
  transition: all 500ms;
  min-height: 90px;
  width: 100%;
  margin-bottom: 30px;
  padding: 33px 0;
  position: sticky;
  top: 0;
  z-index: 9999;
  background: #030303;
  border-bottom: 2px solid rgb(255, 255, 255, 0);
  &.sticky {
    background: rgb(255, 255, 255, 0.1);
    padding: 20px 0;
    border-bottom-color: rgb(255, 255, 255, 0.1);
    backdrop-filter: blur(10px) brightness(0.9);
  }
  @media (max-width: 991px) {
    padding: 25px 0;
    min-height: inherit;
    &.sticky {
      padding: 15px 0;
    }
  }
`;
const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const LogoM = styled.div`
  min-width: 136px;
  @media (max-width: 640px) {
    min-width: inherit;
    width: 136px;
  }
`;
const Menu = styled(FlexDiv)`
  a {
    color: var(--text-color);
    margin: 0px 21px;
    font-size: 1.7rem;
  }
  @media (max-width: 1024px) {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary);
    flex-direction: column;
    padding: 15px 0;
    backdrop-filter: blur(10px) brightness(0.9);
    a {
      padding: 10px 15px;
      width: 100%;
      margin: 0;
    }
  }
  &.show {
    display: flex;
  }
`;
const HeaderRight = styled(FlexDiv)`
  a {
    color: var(--text-color);
  }
  .user {
    margin: 0 25px;
  }
  @media (max-width: 1024px) {
    margin-left: auto;
  }
  @media (max-width: 640px) {
    a:not(.btn) {
      display: none;
    }
  }
`;
const Button = styled.button`
  min-width: 180px;
  text-align: center;
  background: var(--primary);
  border-radius: 5px;
  padding: 14px 0;
  box-shadow: 0 0 0 rgba(245, 204, 39, 0.53);
  &:hover {
    box-shadow: 0 0 20px rgba(245, 204, 39, 0.53);
  }
  @media (max-width: 767px) {
    min-width: inherit;
    padding: 10px 10px;
  }
  @media (max-width: 640px) {
    a {
      display: block !important;
    }
  }
`;
const Hamburger = styled.a`
  position: relative;
  width: 30px;
  height: 30px;
  transition-duration: 0.5s;
  display: none;
  @media (max-width: 1024px) {
    display: block;
    margin-left: 15px;
  }
  .icon-left {
    transition-duration: 0.5s;
    position: absolute;
    height: 4px;
    width: 15px;
    top: 13px;
    background-color: var(--text-color);
    cursor: pointer;
    &:before {
      transition-duration: 0.5s;
      position: absolute;
      width: 15px;
      height: 4px;
      background-color: var(--text-color);
      content: "";
      top: -10px;
    }
    &:after {
      transition-duration: 0.5s;
      position: absolute;
      width: 15px;
      height: 4px;
      background-color: var(--text-color);
      content: "";
      top: 10px;
    }
  }
  .icon-right {
    transition-duration: 0.5s;
    position: absolute;
    height: 4px;
    width: 15px;
    top: 13px;
    background-color: var(--text-color);
    left: 15px;
    &:before {
      transition-duration: 0.5s;
      position: absolute;
      width: 15px;
      height: 4px;
      background-color: var(--text-color);
      content: "";
      top: -10px;
    }
    &:after {
      transition-duration: 0.5s;
      position: absolute;
      width: 15px;
      height: 4px;
      background-color: var(--text-color);
      content: "";
      top: 10px;
    }
  }

  &.open {
    .icon-left {
      transition-duration: 0.5s;
      background: transparent;
      &:before {
        transform: rotateZ(45deg) scaleX(1.4) translate(2px, 2px);
      }
      &:after {
        transform: rotateZ(-45deg) scaleX(1.4) translate(2px, -2px);
      }
    }
    .icon-right {
      transition-duration: 0.5s;
      background: transparent;
      &:before {
        transform: rotateZ(-45deg) scaleX(1.4) translate(-2px, 2px);
      }
      &:after {
        transform: rotateZ(45deg) scaleX(1.4) translate(-2px, -2px);
      }
    }
  }
  &:hover {
    cursor: pointer;
  }
`;
