import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);

	const navigate = useNavigate()

	useEffect(() => {
		if (!store.token) {
			navigate('/')
		}
	}, [])

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
