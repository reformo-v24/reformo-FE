import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Container, Button, Loading, TableLayout } from "../theme/main.styled";
import { Link } from "react-router-dom";
import Profilepic from "../assets/images/profilepic.jpg";
import CoverBg from "../assets/images/cover.jpg";
import { storeNFT } from "../config/storage";
function PopBox(props) {
  // const [isOpen, setOpen] = React.useState(true);
  const [ToggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const getActiveClass = (index, className) =>
    ToggleState === index ? className : "";
  const {
    editProfile,
    setEditProfile,
    personalInfo,
    setPersonalInfo,
    editUserProfile,
  } = props;

  const coverPhotoImageHash = async (e) => {
    let imageHashGenrate = await storeNFT(
      e.target.files[0],
      e.target.files[0].name,
      e.target.id
    );
    setPersonalInfo({
      ...personalInfo,
      coverBg: imageHashGenrate.image,
    });
  };
  const profilePhotoImageHash = async (e) => {
    let imageHashGenrate = await storeNFT(
      e.target.files[0],
      e.target.files[0].name,
      e.target.id
    );
    setPersonalInfo({
      ...personalInfo,
      Profilepic: imageHashGenrate.image,
    });
  };
  // const editUserProfile = async () => {
  //   let data = await {
  //     username: personalInfo.name,
  //     email: personalInfo.emailAddress,
  //     profileLink: personalInfo.Profilepic,
  //     coverLink: personalInfo.coverBg,
  //   };

  // };
  return (
    <>
      {editProfile.open && (
        <PopUpMain>
          <PopupBx>
            <CloseBtn onClick={() => setEditProfile({ open: false })}>
              <i className="far fa-times-circle"></i>
            </CloseBtn>
            <h2>Edit My Profile</h2>
            <TabNav>
              <Link
                className={`tabs ${getActiveClass(1, "active")}`}
                onClick={() => toggleTab(1)}
                to="#"
              >
                Personal Info
              </Link>
              <Link
                className={`tabs ${getActiveClass(2, "active")}`}
                onClick={() => toggleTab(2)}
                to="#"
              >
                Social Links
              </Link>
            </TabNav>

            {getActiveClass(
              1,
              <PopScroller>
                <div className="inputblock">
                  <label>Username</label>
                  <TextBox
                    type="text"
                    value={personalInfo.name}
                    placeholder=""
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                  ></TextBox>
                </div>
                <div className="inputblock">
                  <label>Email</label>
                  <TextBox
                    type="email"
                    value={personalInfo.emailAddress}
                    placeholder=""
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        emailAddress: e.target.value,
                      })
                    }
                  ></TextBox>
                </div>
                <div className="inputblock flex">
                  <HasImage>
                    <img
                      src={
                        personalInfo.Profilepic
                          ? personalInfo.Profilepic
                          : Profilepic
                      }
                      height="100%"
                      width="100%"
                      alt="Profile Pic"
                    />
                  </HasImage>
                  <div className="inputblock">
                    <label>Profile Photo</label>
                    <TextBox
                      className="invisible"
                      type="file"
                      id="Profile_photo"
                      onChange={(e) => profilePhotoImageHash(e)}
                    />
                    <Button
                      htmlFor="Profile_photo"
                      as="label"
                      className="btn secondary white"
                    >
                      Change
                    </Button>
                    <Button
                      className="btn secondary white"
                      onClick={() =>
                        setPersonalInfo({
                          ...personalInfo,
                          Profilepic: "",
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="inputblock flex">
                  <HasImage className="coverImg">
                    <img
                      src={
                        personalInfo.coverBg ? personalInfo.coverBg : CoverBg
                      }
                      height="100%"
                      width="100%"
                      alt="cover"
                    />
                  </HasImage>
                  <div className="inputblock">
                    <label>Cover Photo</label>
                    <TextBox
                      className="invisible"
                      type="file"
                      id="cover_photo"
                      onChange={(e) => coverPhotoImageHash(e)}
                    />
                    <Button
                      htmlFor="cover_photo"
                      as="label"
                      className="btn secondary white"
                    >
                      Change
                    </Button>
                    <Button
                      className="btn secondary white"
                      onClick={() =>
                        setPersonalInfo({
                          ...personalInfo,
                          coverBg: "",
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {/* <BtnGrp>
                  <Button
                    onClick={() => setEditProfile({ open: false })}
                    className="btn secondary"
                  >
                    Cancel
                  </Button>
                  <Button className="btn primary no-shadow">Save</Button>
                </BtnGrp> */}
              </PopScroller>
            )}

            {getActiveClass(
              2,
              <PopScroller>
                <div className="inputblock">
                  <label>Twitter</label>
                  <TextBox
                    type="text"
                    value={personalInfo.socialLinks?.twitterLink}
                    placeholder="https://twitter.com/username"
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        socialLinks: {
                          ...personalInfo.socialLinks,
                          twitterLink: e.target.value,
                        },
                      })
                    }
                  ></TextBox>
                </div>
                <div className="inputblock">
                  <label>Telegram</label>
                  <TextBox
                    type="text"
                    value={personalInfo.socialLinks?.telegramLink}
                    placeholder="https://desktop.telegram.org/username"
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        socialLinks: {
                          ...personalInfo.socialLinks,
                          telegramLink: e.target.value,
                        },
                      })
                    }
                  ></TextBox>
                </div>
                <div className="inputblock">
                  <label>Medium</label>
                  <TextBox
                    type="text"
                    value={personalInfo.socialLinks?.mediumLink}
                    placeholder="https://medium.com/@username"
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        socialLinks: {
                          ...personalInfo.socialLinks,
                          mediumLink: e.target.value,
                        },
                      })
                    }
                  ></TextBox>
                </div>
              </PopScroller>
            )}
            <BtnGrp>
              <Button
                onClick={() => setEditProfile({ open: false })}
                className="btn secondary"
              >
                Cancel
              </Button>
              <Button
                className="btn primary no-shadow"
                onClick={() => editUserProfile()}
              >
                Save
              </Button>
            </BtnGrp>
          </PopupBx>
        </PopUpMain>
      )}
    </>
  );
}

const PopupBx = styled.div`
  width: 552px; /* height: 370px; */
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
    max-width: 50%;
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
