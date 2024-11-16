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
    const [bike,setBike] = useState('');
    const [helmet,setHelmet] = useState('');

    const navigate = useNavigate();

    const registerInputLength = store.registerInputLength

    const handleRegister = async (e) => {
        e.preventDefault()
        const registered = await actions.register(email, password, username, name, surname, role, bike, helmet)

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
                    <label htmlFor="surname">Surname:</label>
                    <input
                        type="surname"
                        id="surname"
                        value={surname}
                        onChange={(e) => setsurname(e.target.value)}
                    />
                </div>
                <div className='tag-container'>
                    <label htmlFor="bike">Bike:</label>
                    <select id="bike" value={bike} onChange={(e) => setBike(e.target.value)}>
                        <option value="">Which Bike is sending it?</option>
                        <option value="Bike Santa Cruz Nomad 4">Santa Cruz Nomad 4</option>
                        <option value="Bike Santa Cruz Nomad 4 Arena">Santa Cruz Nomad 4 Arena</option>
                        <option value="Bike Kona Process 153">Kona Process 153</option>
                        <option value="Bike Orbea Rallon Morado-Azul">Orbea Rallon Morado-Azul</option>
                        <option value="Bike Mondraker Summun 21">Mondraker Summun 21</option>
                        <option value="Bike Canondale Jekyll 2">Canondale Jekyll 2</option>
                        <option value="Bike Trek Session">Trek Session</option>
                        <option value="Bike Commencal Supremme V5">Commencal Supremme V5</option>
                        <option value="Custom bike">Custom bike</option>
                    </select>
                </div>  
                <div className='tag-container'>
                    <label htmlFor="helmet">Helmet:</label>
                    <select id="helmet" value={helmet} onChange={(e) => setHelmet(e.target.value)}>
                        <option value="">Which Helmet protects our Bananer?</option>
                        <option value="Helmet Scott Spartan">Scott Spartan</option>
                        <option value="Helmet Troy Lee Stage">Troy Lee Stage</option>
                        <option value="Helmet Bluegrass Legit">Bluegrass Legit</option>
                        <option value="Helmet Bluegrass Legit White Iridiscent">Bluegrass Legit White Iridiscent</option>
                        <option value="Helmet Fox Rampage Azul">Fox Rampage Azul</option>
                        <option value="Helmet Fox Rampage Pro Carbon">Fox Rampage Pro Carbon</option>
                        <option value="Helmet Fox Rampage Custom Ibai Rider">Fox Rampage Custom Ibai Rider</option>
                        <option value="Helmet Poc Coron Air Negro">Poc Coron Air Negro</option>
                        <option value="Helmet 100% Status Negro">100% Status Negro</option>
                        <option value="Custom helmet">Custom helmet</option>
                    </select>
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

