import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Container,
  Button,
  Loading,
  TableLayout,
} from "../../theme/main.styled";
import { Link } from "react-router-dom";
import Timer from "../timer";

function PopBox(props) {
  // const [isOpen, setOpen] = React.useState(true);
  const [ToggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  const {
    currentStaking,
    setCurrentStaking,
    currentSPDetail,
    setCurrentSPDetail,
  } = props;
  return (
    <>
      {currentStaking.open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn onClick={() => setCurrentStaking({ open: false })}>
              <i className="far fa-times-circle"></i>
            </CloseBtn>
            <h2>All Pools</h2>
            <CSTable>
              <thead>
                <tr>
                  <th>Days</th>
                  <th>APY</th>
                  <th>LEFT</th>
                </tr>
              </thead>
              {currentSPDetail !== 0
                ? currentSPDetail?.map((currentStake) =>
                    currentStake.WithdrawAmount > 0 ? (
                      <tbody>
                        <tr>
                          <td>{currentStake.num}</td>
                          <td>{currentStake.APY} %</td>
                          <td>
                            {!+currentStake.deposits?.[2] ? null : +currentStake
                                .deposits?.[2] >
                              new Date().getTime() / 1000 ? (
                              <Timer timeLeft={currentStake.deposits?.[2]} />
                            ) : (
                              <p>Reached</p>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </CSTable>

            {/* <RowCard>
              <div className="cardBody">
                <div className="cardcol br-1 f-col">
                  <span className="fos4">Days</span>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos4">APY</span>
                </div>
                <div className="cardcol br-1 f-col">
                  <span className="fos4">LEFT</span>
                </div>
              </div>

              {currentSPDetail !== 0
                ? currentSPDetail?.map((currentStake) =>
                    currentStake.WithdrawAmount > 0 ? (
                      <div className="cardBody">
                        <div className="cardcol br-1 f-col">
                          <strong className="fos1">{currentStake.num}</strong>
                        </div>
                        <div className="cardcol br-1 f-col">
                          <strong className="fos1">{currentStake.APY} %</strong>
                        </div>
                        <div className="cardcol br-1 f-col">
                          <strong className="fos1">
                            {!+currentStake.deposits?.[2] ? null : +currentStake
                                .deposits?.[2] >
                              new Date().getTime() / 1000 ? (
                              <Timer timeLeft={currentStake.deposits?.[2]} />
                            ) : (
                              <p>Reached</p>
                            )}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </RowCard> */}
            <BtnGrp>
              <Button
                onClick={() => setCurrentStaking({ open: false })}
                className="btn primary no-shadow"
              >
                Close
              </Button>
            </BtnGrp>
          </PopupBx>
        </PopUpMain>
      )}
    </>
  );
}
const CSTable = styled.table`
  width: 100%;
  height: auto;
  margin: 20px 0px;
  th {
    text-align: left;
    padding: 10px 10px;
  }
  td {
    text-align: left;
    padding: 10px 10px;
  }
`;
const PopupBx = styled.div`
  width: 552px;
  height: 370px;
  background: rgb(255, 255, 255, 0.12);
  border: 2px solid rgb(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(8px) brightness(1.2);
  position: relative;
  padding: 25px;
  max-width: calc(100% - 40px);
  .inputblock {
    position: relative;
    margin: 15px 0 20px;
    label:not(.btn) {
      margin-bottom: 10px;
      display: block;
    }
    &.flex {
      display: flex;
      align-items: flex-end;
    }
    .inputblock {
      padding-left: 16px;
      margin: 0;
      .btn {
        height: 38px;
        padding: 0 22px;
        min-width: inherit;
        display: inline-block;
        vertical-align: top;
        border-width: 1px;
        font-size: 1.5rem;
        line-height: 38px;
        margin-right: 8px;
      }
    }
  }
  @media (max-width: 480px) {
    padding: 18px;
    .inputblock {
      overflow: hidden;
    }
  }
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
const TabNav = styled.div`
  background: rgb(255, 255, 255, 0.1);
  display: flex;
  border-radius: 17px;
  overflow: hidden;
  margin: 30px 0 10px 0;
  a {
    padding: 20px 40px;
    flex-grow: 1;
    text-align: center;
    height: 60px;
    line-height: 20px;
    font-size: 2rem;
    color: var(--text-color);
    font-weight: 600;
    border-radius: 17px;
    &.active {
      background: var(--text-color);
      color: var(--primary);
    }
  }
  @media (max-width: 1400px) {
    /* a {height: 70px; line-height: 34px;} */
  }
  @media (max-width: 768px) {
    margin: 40px 0 0 0;
    a {
      height: 60px;
      line-height: 20px;
    }
  }
  @media (max-width: 480px) {
    a {
      font-size: 1.7rem;
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
  &.invisible {
    position: absolute;
    opacity: 0;
    visibility: hidden;
  }
  &:focus {
    outline: none;
  }
`;
const BtnGrp = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 15px;
  .btn {
    flex-grow: 1;
    text-transform: uppercase;
    border-radius: 8px;
    max-width: 100%;
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
const HasImage = styled.div`
  width: 77px;
  height: 77px;
  display: inline-block;
  flex-shrink: 0;
  border-radius: 7px;
  background: #000000;
  &.coverImg {
    width: 190px;
  }
`;
const PopScroller = styled.div`
  max-height: 52vh;
  overflow: auto;
`;

export default PopBox;
