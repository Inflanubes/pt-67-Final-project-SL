import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/login.css";

const login = () => {
    const { actions } = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault()
        const logged = await actions.login(email, password)


        if (logged) {
            navigate(logged.additional_claims?.role === 'Rider' ? '/rider' : '/photographer');
            console.log("logged", logged)
        }
    }
    /* if user role photographer demo if role rider navigate demo*/
    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">login</button>
                <Link to="/register">
                    <span className="register-button btn btn-lg" href="#" role="button">
                        Register here if you are not a Banananer yet
                    </span>
                </Link>
            </form>
        </div>
    );
};

export default login;