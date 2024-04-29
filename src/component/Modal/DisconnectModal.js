import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Container,
  Button,
  Loading,
  TableLayout,
} from "../../theme/main.styled";

function PopBox(props) {
  const { modal, setModal } = props;
  return (
    <>
      {modal.open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn
              onClick={() => {
                setModal({
                  open: false,
                });
              }}
            >
              <i className="far fa-times-circle"></i>
            </CloseBtn>
            <StakeCalc>
              <h2>Your wallet</h2>
              {/* <p>Amount in Cake-LP</p> */}
              <div className="inputblock">
                <TextBox
                  type="text"
                  placeholder="Enter Amount"
                  value={modal.web3Data?.accounts[0]}
                  readOnly
                ></TextBox>
                {/* <span>Max</span> */}
              </div>
              <Button
                className="primary full"
                onClick={() => modal.disconnectwallet()}
              >
                Disconnect
              </Button>
            </StakeCalc>
          </PopupBx>
        </PopUpMain>
      )}
    </>
  );
}

const StakeMsg = styled.div`
  text-align: center;
  padding-top: 15px;
  i {
    font-size: 8.2rem;
    margin-bottom: 30px;
  }
  h4 {
    font-size: 2.5rem;
    margin-bottom: 18px;
  }
  p {
    font-size: 1.7rem;
    margin: 0 0 38px;
    line-height: 1.6;
    a {
      color: var(--primary);
    }
  }
  &.completed {
    i {
      color: var(--green);
      text-align: center;
      box-shadow: inset 0 0 0 2px var(--green), 0 0 60px var(--green);
      width: 8.2rem;
      height: 8.2rem;
      border-radius: 100%;
    }
  }
  &.warning {
    i {
      color: var(--yellow);
      text-align: center;
      box-shadow: inset 0 0 0 2px var(--yellow), 0 0 60px var(--yellow);
      width: 8.2rem;
      height: 8.2rem;
      border-radius: 100%;
    }
  }
  &.failed {
    i {
      color: var(--red);
      text-align: center;
      box-shadow: inset 0 0 0 2px var(--red), 0 0 60px var(--red);
      width: 8.2rem;
      height: 8.2rem;
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
const StakeCalc = styled.div`
  padding-top: 12px;
  h2 {
    font-size: 4.5rem;
    font-weight: 600;
    margin-bottom: 40px;
  }
  .popList {
    margin-top: 30px;
    label:last-child {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  .inputblock {
    position: relative;
    margin: 15px 0 20px;
    button {
      width: 60px;
      height: 30px;
      line-height: 30px;
      background: var(--text-color);
      border-radius: 4px;
      color: var(--primary);
      text-align: center;
      position: absolute;
      top: 50%;
      right: 12px;
      margin-top: -15px;
      font-size: 1.5rem;
    }
  }
`;
const TextBox = styled.input`
  border-radius: 5px;
  border: 1px solid var(--text-color);
  background: none;
  width: 100%;
  height: 52px;
  font-size: 15px;
  color: var(--text-color);
  padding: 10px 15px;
`;
const PopupBx = styled.div`
  width: 480px; /* height: 370px; */
  background: rgb(255, 255, 255, 0.12);
  border: 2px solid rgb(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(8px) brightness(1.2);
  position: relative;
  padding: 25px;
  max-width: calc(100% - 40px);
`;
const CloseBtn = styled.div`
  color: var(--text-color);
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 2rem;
  cursor: pointer;
`;
const PopUpMain = styled.div`
  background: rgb(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default PopBox;
