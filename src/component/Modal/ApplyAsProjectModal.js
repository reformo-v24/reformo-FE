import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { actions } from "../../actions";
import {
  Container,
  Button,
  Loading,
  TableLayout,
} from "../../theme/main.styled";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ApplyAsProject(props) {
  const {
    openApplyProjectModal,
    setOpenApplyProjectModal,
    applyAsProject,
    projectDetail,
  } = props;
  useEffect(() => {
    if (projectDetail) {
      if (projectDetail?.status) {
        toast.success(projectDetail.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setOpenApplyProjectModal(false);
      } else {
        toast.error("Uploading Failed", {
          position: toast.POSITION.TOP_CENTER,
        });
        setOpenApplyProjectModal(false);
      }
    }
  }, [projectDetail]);
  const addProject = async (e) => {
    e.preventDefault();
    const data = await new FormData(e.target);
    let formData = await {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      telegramUsername: data.get("telegramUsername"),
      projectName: data.get("projectName"),
      projectWebsiteLink: data.get("projectWebsiteLink"),
      gameplayVideo: data.get("gameplayVideo"),
      projectDescription: data.get("projectDescription"),
      developmentStatus: data.get("developmentStatus"),
      paperLinks: data.get("paperLinks"),
      twitterUsername: data.get("twitterUsername"),
    };
    await applyAsProject(formData);
    // console.log("projectDetail", await projectDetail.data);
    // if (projectDetail?.status) {
    //   toast.success(projectDetail.message, {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    //   setOpenApplyProjectModal(false);
    // } else {
    //   toast.error("Uploading Failed", {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    //   setOpenApplyProjectModal(false);
    // }
  };
  return (
    <>
      {openApplyProjectModal && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn onClick={() => setOpenApplyProjectModal(false)}>
              <i className="far fa-times-circle"></i>
            </CloseBtn>

            {/* <Loading></Loading> */}
            <StakeCalc>
              <h4>Apply As a Project</h4>
              <form className="contentBox" onSubmit={addProject}>
                <p>First Name: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    required
                  ></TextBox>
                </div>
                <p>Last Name: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    required
                  ></TextBox>
                </div>
                <p>Contact email: *</p>
                <div className="inputblock">
                  <TextBox
                    type="email"
                    name="email"
                    placeholder="Enter Contact Email"
                    required
                  ></TextBox>
                </div>
                <p>Telegram username *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="telegramUsername"
                    placeholder="Enter Telegram Username"
                    required
                  ></TextBox>
                </div>
                <p>Project name: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="projectName"
                    placeholder="Enter Project Name"
                    required
                  ></TextBox>
                </div>
                <p>Project website: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="projectWebsiteLink"
                    placeholder="Enter Project Website"
                    required
                  ></TextBox>
                </div>
                <p>Do you have a gameplay video? (If yes, kindly post it)</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="gameplayVideo"
                    placeholder="Upload gameplay video Link"
                  ></TextBox>
                </div>
                <p>What makes your project special? *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="projectDescription"
                    placeholder="Enter Detail..."
                    required
                  ></TextBox>
                </div>
                <p>What stage of development you are right now? *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="developmentStatus"
                    placeholder="Enter your answer here..."
                    required
                  ></TextBox>
                </div>
                <p>Whitepaper, litepaper and pitch deck links: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="paperLinks"
                    placeholder="Paste  your Whitepaper, litepaper and pitch deck links here..."
                    required
                  ></TextBox>
                </div>
                <p>Your project's twitter: *</p>
                <div className="inputblock">
                  <TextBox
                    type="text"
                    name="twitterUsername"
                    placeholder="Paste your project's twitter here..."
                    required
                  ></TextBox>
                </div>

                <Button type="submit" className="primary full">
                  SUBMIT
                </Button>
              </form>
            </StakeCalc>
          </PopupBx>
        </PopUpMain>
      )}
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
  .contentBox {
    height: 500px;
    overflow-y: auto;
    padding: 20px;
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
  width: 900px; /* height: 370px; */
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
const mapDipatchToProps = (dispatch) => {
  return {
    applyAsProject: (data) => dispatch(actions.applyAsProject(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    web3Data: state.web3Data,
    projectDetail: state.projectDetail,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(ApplyAsProject);
