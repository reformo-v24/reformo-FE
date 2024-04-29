import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "../../assets/loader.gif"
import {
  Container,
  Button,
  Loading,
  TableLayout,
} from "../../theme/main.styled";

function PopBox(props) {
  const [open, setOpen] = useState(false);
  const [stakeAmountCal, setStakeAmountCal] = useState();
  const [amount, setAmount] = useState(0);
  const { stakeCalc, setStakeCalc, stakeAmount, setStakeAmount } = props;
  
  return (
    <>
      {/* {open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn
              onClick={() => {
                setStakeAmountCal(0);
                setAmount(0);
                setStakeCalc({
                  open: false,
                  rate: stakeCalc.rate,
                  calRate: stakeCalc.calRate,
                });
              }}
            >
              <i className="far fa-times-circle"></i>
            </CloseBtn> */}
      {/* <StakeMsg className="completed">
              <i className="fas fa-check-circle"></i>
              <h4>Stake Completed!</h4>
              <p>
                You have staked 1 TOKEN to the selected pool Check your
                transaction <a href="">here</a>
              </p>
              <Button className="primary full">DONE</Button>
            </StakeMsg> */}
      {/* <StakeMsg className="failed">
                        <i className="fas fa-check-circle"></i>
                        <h4>Stake Failed!</h4>
                        <p>Something happened</p>
                        <Button className='primary full'>Close</Button>
                    </StakeMsg> */}

      {/* <Loading></Loading>
                    <StakeCalc>
                        <h4>Farm</h4>
                        <p>Amount in Cake-LP</p>
                        <div className='inputblock'>
                            <TextBox type='text' placeholder='Enter Amount'></TextBox>
                            <span>Max</span>
                        </div>
                        <Button className='primary full'>CONFIRM</Button>
                    </StakeCalc> */}
      {/* </PopupBx>
        </PopUpMain>
      )} */}
      {stakeAmount?.open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn
              onClick={() => {
                setStakeAmount({
                  open: false,
                });
              }}
            >
              <i className="far fa-times-circle"></i>
            </CloseBtn>
            {stakeAmount.txnStatus.status === "process" ? (
              <StakeMsg className="completed">
                <Loading />
                <img src={Loader} alt="Loader" width={80} height={80} style={{marginBottom:"38px"}}/>
                <h4>Please wait transaction is in process....</h4>
              </StakeMsg>
            ) : stakeAmount.currentFunction === "stake" &&
              stakeAmount.stakeWarning ? (
              <StakeMsg className="warning">
                <i className="fas fa-exclamation-circle"></i>
                <h4>Warning!</h4>
                <p>You are already stacking this pool</p>
                <p>
                  By staking more funds in the same pool ,your lock period will
                  restart as of today
                </p>
                <BtnGrp>
                  <Button
                    className="primary full"
                    onClick={() =>
                      setStakeAmount({
                        open: false,
                        showMiniModals: true,
                      })
                    }
                  >
                    No, Cancel
                  </Button>
                  <Button
                    className="primary full"
                    onClick={() =>
                      setStakeAmount({ ...stakeAmount, stakeWarning: false })
                    }
                  >
                    Yes, Approve
                  </Button>
                </BtnGrp>
              </StakeMsg>
            ) : stakeAmount.txnStatus.status === "success" ? (
              <StakeMsg className="completed">
                <i className="fas fa-check-circle"></i>
                <h4>Stake Completed!</h4>
                <p>
                  You have staked {stakeAmount.amount} TOKEN to the selected
                  pool Check your transaction{" "}
                  <a
                    href={`https://testnet.bscscan.com/tx/${stakeAmount.txnHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                </p>
                <Button
                  className="primary full"
                  onClick={() => {
                    setStakeAmount({
                      open: false,
                    });
                  }}
                >
                  DONE
                </Button>
              </StakeMsg>
            ) : stakeAmount.stakeFailedModal ? (
              <StakeMsg className="failed">
                <i className="fas fa-check-circle"></i>
                <h4>Stake Failed!</h4>
                <p>Something happened</p>
                <Button
                  className="primary full"
                  onClick={() => {
                    setStakeAmount({
                      open: false,
                    });
                  }}
                >
                  Close
                </Button>
              </StakeMsg>
            ) : (
              <StakeCalc>
                <h4>
                  {stakeAmount.currentFunction === "stake"
                    ? "Stake"
                    : "Withdraw"}
                </h4>
                <p>Amount in RSTF</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    placeholder="Enter Amount"
                    value={stakeAmountCal}
                    onChange={(e) => {
                      if (!isNaN(e.target.value)) {
                        setStakeAmountCal(e.target.value);
                        stakeAmount.setStakeAmountVal(e.target.value);
                      }
                    }}
                  ></TextBox>
                  {/* <span> */}
                  <button
                    onClick={(e) => {
                      setStakeAmountCal(
                        stakeAmount.currentFunction === "stake"
                          ? stakeAmount.userBalance
                          : stakeAmount.WithdrawAmount
                      );
                      stakeAmount.setStakeAmountVal(
                        stakeAmount.currentFunction === "stake"
                          ? stakeAmount.userBalance
                          : stakeAmount.WithdrawAmount
                      );
                    }}
                  >
                    Max
                  </button>
                  {/* </span> */}
                </div>
                <Button
                  className="primary full"
                  onClick={async () => {
                    stakeAmount.makeTransaction("stake");
                  }}
                >
                  CONFIRM
                </Button>
              </StakeCalc>
            )}
          </PopupBx>
        </PopUpMain>
      )}
      {stakeCalc.open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn
              onClick={() => {
                setStakeAmountCal(0);
                setAmount(0);
                setStakeCalc({
                  open: false,
                  rate: stakeCalc.rate,
                  calRate: stakeCalc.calRate,
                });
              }}
            >
              <i className="far fa-times-circle"></i>
            </CloseBtn>
            <StakeCalc>
              <h4>Stake Calculation</h4>
              <TextBox
                type="text"
                value={stakeAmountCal ? stakeAmountCal : ""}
                onChange={(e) => {
                  setStakeAmountCal(e.target.value);
                  setAmount(
                    ((+e.target.value * stakeCalc.calRate) / 10000).toFixed(4)
                  );
                }}
                placeholder="Enter Amount"
              ></TextBox>
              <TableLayout className="popList">
                <label>
                  Amount <span>{amount}</span>
                </label>
                <label>
                  APY <span>{(stakeCalc.rate / 100000).toFixed()}%</span>
                </label>
              </TableLayout>
            </StakeCalc>
          </PopupBx>
        </PopUpMain>
      )}
    </>
  );
}

export const StakeMsg = styled.div`
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

export const BtnGrp = styled.div`
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
export const StakeCalc = styled.div`
  padding-top: 12px;
  h4 {
    font-size: 2.5rem;
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
      // color: var(--primary);
      text-align: center;
      position: absolute;
      top: 50%;
      right: 12px;
      margin-top: -15px;
      font-size: 1.5rem;
    }
  }
`;
export const TextBox = styled.input`
  border-radius: 5px;
  border: 1px solid var(--text-color);
  background: none;
  width: 100%;
  height: 52px;
  font-size: 15px;
  color: var(--text-color);
  padding: 10px 15px;
`;
export const PopupBx = styled.div`
  width: 442px; /* height: 370px; */
  background: rgb(255, 255, 255, 0.12);
  border: 2px solid rgb(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(8px) brightness(1.2);
  position: relative;
  padding: 25px;
  max-width: calc(100% - 40px);
`;
export const CloseBtn = styled.div`
  color: var(--text-color);
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 2rem;
  cursor: pointer;
`;
export const PopUpMain = styled.div`
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
