import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="landing-container text-center">
			<div className="landing-contianer-left text-center">
				<div className="landing-logo">

				</div>
			</div>
			<div className="landing-contianer-right text-center">

			</div>
		</div>
	);
};
