import React from "react";
import "./AboutProject.css";
import { Markup } from "interweave";
import ReactHtmlParser from "react-html-parser";
//About project component.
const AboutProject = ({ singlePoolDetail }) => {
  if (singlePoolDetail?.igoDescription) {
    var content_length = singlePoolDetail?.igoDescription.split("\n").length;
    var content = singlePoolDetail?.igoDescription.split("\n");
    var first_length = Math.ceil(content_length / 2);
    var secondlength = content_length - first_length;
    var contentOne = content.splice(0, first_length);
  }
  return (
    <div>
      <div className="about_project">
        <div className="container_cust">
          <div className="inner_about_project border-left-radius border-right-radius">
            <h3>About the Project</h3>
            <div className="content_grid">
              {ReactHtmlParser(singlePoolDetail?.igoDescription)}
              {/* {contentOne ? (
                <div className="content">
                  <Markup
                    content={
                      singlePoolDetail?.igoDescription ? contentOne[0] : ""
                    }
                  />
                </div>
              ) : (
                ""
              )}
              {secondlength >= 1 ? (
                <div className="content">
                  <Markup
                    content={singlePoolDetail?.igoDescription ? content[0] : ""}
                  />
                </div>
              ) : (
                ""
              )} */}
            </div>
            <div className="whitepaper-btn">
              {singlePoolDetail?.white_paper ? (
                <a
                  href={`${singlePoolDetail?.white_paper}`}
                  className="border-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Whitepaper
                </a>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutProject;
