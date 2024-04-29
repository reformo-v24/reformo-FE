import React from "react";
import { useSelector } from "react-redux";
import Toast from "./Toast";
import Loading from "./Loading";


//for delivering notification.
const Notify = () => {
	const { notify } = useSelector((state) => state);

	return (
		<div>
			{notify.loading && <Loading />}
			
			{notify.error && (
				<Toast msg={{ title: "Error", body: notify.error, color: "red" }} />
			)}

			{notify.success && (
				<Toast
					msg={{ title: "Success", body: notify.success, color: "green" }}
				/>
			)}
		</div>
	);
};

export default Notify;
