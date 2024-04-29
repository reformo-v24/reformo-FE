import styled,{keyframes} from "styled-components";

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;
const rotateAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`;
export const Container = styled.div`
  width: 1360px;
  margin: 0px auto;
  max-width: 100%;
  padding: 0 0;
  display: flex;
  flex-flow: wrap;
  @media only screen and (max-width: 1400px) {
    width: 992px;
    padding: 0 15px;
  }
  @media (max-width: 768px) {
    padding: 0 20px;
  }
  /* @media only screen and (max-width: 1400px) {
        width: 1190px;
    } */
`;
export const Button = styled.button`
  min-width: 180px;
  text-align: center;
  font-size: 2rem;
  border-radius: 5px;
  padding: 13px 30px 11px;
  color: #ffffff;
  cursor: pointer;
  &.full {
    width: 100%;
    border-radius: 8px;
  }
  &.primary {
    border: 2px solid var(--primary);
   
    box-shadow: 0 0 0 rgba(30, 80, 255, 0.8);
    background: var(--primary);
  }
  &.secondary {
    border: 2px solid var(--primary);
    background: none;
    &.rounded {
      border: 2px solid #fff;
      border-radius: 80px;
      text-transform: uppercase;
      font-weight: 600;
      padding: 16px 40px 14px;
    }
    &.white {
      border: 2px solid var(--text-color);
    }
  }
  &.disabled {
    background-color: #545454;
  }
  &:hover {
    box-shadow: 0 0 20px rgba(245, 204, 39, 0.53);
  }
  &.no-shadow {
    box-shadow: none;
  }
  &.ml-25 {
    margin-left: 25px;
  }
  &.mr-25 {
    margin-right: 25px;
  }
  &.sm {
    padding: 4px 12px;
    min-width: inherit;
    font-size: 13px;
    margin-top: 5px;
  }
  @media (max-width: 640px) {
    font-size: 1.6rem;
    min-width: 160px;
    &.ml-25 {
      margin-left: 15px;
    }
    &.mr-25 {
      margin-right: 15px;
    }
  }
`;
export const SecTitle = styled.div`
  display: flex;
  flex-flow: column;
  margin: 0 0 50px;
  width: 100%;
  .view-more {
    font-size: 2rem;
  }

  h3 {
    font-size: 4.2rem;
    font-weight: 600;
    line-height: 1.3;
  }
  p {
    font-size: 2rem;
    font-weight: normal;
    margin-top: 20px;
  }

  &.row {
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
  }
  &.text-center {
    text-align: center;
    justify-content: center;
  }

  @media (max-width: 991px) {
    margin: 0 0 40px;
    h3 {
      font-size: 3.2rem;
    }
  }
  @media (max-width: 768px) {
    flex-flow: column;
    justify-content: center;
    margin: 0 0 25px;
    &.row {
      flex-flow: column;
      justify-content: center;
    }
    .view-more {
      margin-top: 10px;
    }
  }
  @media (max-width: 640px) {
    p {
      margin-top: 10px;
    }
  }
`;

export const NameBlock = styled.div`
  display: flex;
  align-items: center;
  .ComLogo {
    width: 56px;
    height: 56px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #000;
    border-radius: 100%;
    margin-right: 14px;
  }
  h4 {
    font-size: 1.7rem;
    font-weight: 600;
    margin-bottom: 5px;
  }
  span {
    font-size: 1.1rem;
    background-color: rgb(255, 255, 255, 0.2);
    padding: 1px 8px;
    border-radius: 4px;
  }
  &.lg {
    .ComLogo {
      width: 77px;
      height: 77px;
      border-radius: 25px;
      margin-right: 24px;
    }
    h4 {
      font-size: 2.5rem;
      font-weight: normal;
      margin-bottom: 15px;
    }
    span {
      font-size: 1.3rem;
      background-color: rgb(255, 255, 255, 0.1);
      padding: 2px 13px;
    }
  }
  @media (max-width: 768px) {
    &.lg {
      .ComLogo {
        width: 60px;
        height: 60px;
        border-radius: 15px;
        margin-right: 15px;
      }
      h4 {
        font-size: 2.2rem;
      }
    }
  }
`;

export const ProgressSec = styled.div`
  // background: var(--primary);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 17px;
  padding: 13px 20px;
  margin: 30px 0 0 0;
  box-shadow: 0 0 14px rgba(18, 16, 21, 0.5);
  p {
    font-size: 1.5rem;
    margin-bottom: 14px;
    color:#fff;
  }
  strong {
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
    color:#fff;
  }
`;
export const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgb(0, 0, 0, 0.5);
  display: flex;
  border-radius: 3px;
  overflow: hidden;
  div {
    background: #fff;
    width: 0.1%;
    border-radius: 3px;
  }
  &.primary {
    div {
      background: var(--primary);
    }
  }
`;
export const ExchangeBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  margin: 36px auto 0 0;
  display: inline-flex;
  padding: 10px 10px 10px 24px;
  border-radius: 17px;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  select {
    background: none;
    border: 0;
    height: auto;
    color: var(--color-text);
    font-size: 2rem;
  }
  option {
    color: #000;
  }
  @media (max-width: 768px) {
    width: 100%;
    max-width: inherit;
  }
  @media (max-width: 640px) {
    flex-flow: column;
    padding: 24px 20px;
    select {
      padding: 0 0;
      margin-bottom: 20px;
    }
  }
`;

export const Networks = styled.div`
  p {
    margin-bottom: 5px;
  }
`;
export const SquareBtns = styled.div`
  display: flex;
  a {
    border-radius: 7px;
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-txt);
    margin-right: 15px;
    font-size: 24px;
    img {
      max-height: 22px;
      max-width: 22px;
      width: auto;
    }
    &.active {
      background: rgb(255, 255, 255, 0.4);
    }
    &:hover {
      text-shadow: 0 0 20px var(--primary);
      overflow: hidden;
      img {
        filter: drop-shadow(0 0 20px var(--primary));
      }
    }
  }
  &.networks {
    a {
      width: 44px;
      height: 44px;
      margin-right: 9px;
    }
  }
`;

// export const Loading = styled.div`
//   position: relative;
//   text-align: center;
//   padding: 30px 0;
//   filter: drop-shadow(0 0 30px var(--primary));
//   &:after {
//     content: "";
//     display: inline-block;
//     vertical-align: top;
//     width: 128px;
//     height: 128px;
//     border: 12px solid var(--primary);
//     border-right: 12px solid transparent;
//     border-radius: 100%;
//     animation: rotation 2s linear 0s infinite;
//   }
// `;
export const Loading = styled.div`
  position: relative;
  text-align: center;
  padding: 30px 0;
  filter: drop-shadow(0 0 30px var(--primary));
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px; /* Adjust the size as needed */
    height: 50px; /* Adjust the size as needed */
    border: 5px solid var(--primary);
    border-radius: 50%;
    border-top-color: transparent;
    animation: ${rotateAnimation} 1s linear infinite;
  }
`;
export const TableLayout = styled.div`
  label {
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    font-size: 1.7rem;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 0 11px;
    font-weight: 600;
    span {
      font-weight: normal;
    }
    .primary {
      margin-top: 18px;
    }
    &:last-child {
      border-bottom: 0px;
    }
  }
  @media (max-width: 480px) {
    label {
      font-size: 1.6rem;
      align-items: center;
      &:last-child {
        span {
          margin-top: 10px;
        }
      }
    }
  }
`;
