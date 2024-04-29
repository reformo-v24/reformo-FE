import React from "react";
import "./Toast.css";
import LoadIcon from "../../images/loading.gif";
//For loader.
const Loading = () => {
	return (
		<div
			className="loader"
			style={{
				color: "white",
				top: "50%",
				left: "0",
				right: "0",
				margin: "0 auto",
				zIndex: 50,
			}}>
			<img className="loading" src={LoadIcon} alt="loading" />
		</div>
	);
};

export default Loading;
