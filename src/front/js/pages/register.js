import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/register.css";

const register = () => {
    const {actions, store} = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username,setUsername] = useState('');
    const [name,setName] = useState('');
    const [surname,setsurname] = useState('');
    const [role,setRole] = useState('');
    const navigate = useNavigate();

    const registerInputLength = store.registerInputLength

    const handleRegister = async (e) => {
        e.preventDefault()
        const registered = await actions.register(email, password, username, name, surname, role)

        if (registered){
            navigate(registered.role === 'Rider' ? '/rider' : '/photographer');
            console.log("register", registered)
        }
    }

    return (
        <div className="register-container">
            <form onSubmit={handleRegister}>
                <div className='tag-container'>
                    <label htmlFor="role">BeBananaRole:</label>
                    <select id="role" type="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Wich Banananer will you be?</option>
                        <option value="rider">Rider</option>
                        <option value="photographer">Photographer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className='tag-container'>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="username"
                        id="username"
                        minLength={registerInputLength}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='tag-container'>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='tag-container'>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        minLength={registerInputLength}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='tag-container'>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='tag-container'>
                    <label htmlFor="surname">surname:</label>
                    <input
                        type="surname"
                        id="surname"
                        value={surname}
                        onChange={(e) => setsurname(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
                <Link to="/login">
				    <span className="btn btn-lg" href="#" role="button">
					    Login here if you are Bananer
				    </span>
			    </Link>
            </form>
        </div>
    );
};

export default register;

