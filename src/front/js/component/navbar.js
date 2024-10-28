import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { store, actions } = useContext(Context)

	useEffect(() => { console.log(store.token) }, [])

	const handleLogout = () => {
		actions.logout()
		navigate('/');
	};

	const handleLogin = async (e) => {
		navigate("/login");
	}

	return (
		<nav className="navbar p-3" style={{ backgroundColor: 'rgb(255, 255, 255);' }}>
			<div className="navbar-container">
				<div className="navbar-container-left">
					<Link to="/">
						<img src={"https://res.cloudinary.com/dflvexboa/image/upload/v1724271495/ajvismnteuh2wjl7ub9c.png"} alt="Be Banana Logo" style={{ height: "75px" }} className="navbar-logo mb-0 h1" />
					</Link>
					<h1>BEBANANA</h1>
				</div>
				<div className="navbar-container-right">
					{/* <div className="navbar-link mr-auto">
						<Link to="/demo">
							<button className="btn btn-secondary">Demo</button>
						</Link>
					</div> */}
					{(location.pathname !== "/login" && location.pathname !== "/register") && (store.token ?
						<button className="navbar-button btn btn-lg" onClick={handleLogout}>LOGOUT</button> :
						<button className="navbar-button" onClick={handleLogin}>LOGIN</button>
					)}

				</div>
			</div>
		</nav>
	);
};
