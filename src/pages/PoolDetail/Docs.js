import React from "react";
import { useParams } from "react-router-dom";

//Docs component.
const Docs = () => {
	const doc = useParams().name;
	const dir = useParams().dir;
	return (
		<div>
			<h2
				style={{
					color: "white",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				{dir}
			</h2>
			<embed src={`/${dir}/${doc}`} width="100%" height="2100px" />
		</div>
	);
};
export default Docs;
