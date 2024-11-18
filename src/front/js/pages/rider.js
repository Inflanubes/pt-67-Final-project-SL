import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import "../../styles/rider.css";
import { useNavigate } from "react-router-dom";

export const Rider = () => {
    const { store, actions } = useContext(Context);
    const [bicycle, setBicycle] = useState('');
    const [helmet, setHelmet] = useState('');
    const [showButtons, setShowButtons] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if (!store.token) {
            navigate('/')
        }
    }, [])

    const handleGetRiderPhotos = async (e) => {
        e.preventDefault();
        const getPhotos = await actions.getRiderPhotos(bicycle, helmet);

        if (getPhotos) {
            setShowButtons(true);
            console.log("Photos retrieved:", getPhotos);

        } else {
            setShowButtons(false);
            console.log("No photos found");
        }
    };

    const handleAddToCart = (photo) => {
        // Implement your cart logic here
        console.log("Added to cart:", photo);
    };

    const handleNextRider = () => {
        setBicycle('');
        setHelmet('');
        setShowButtons(false);
        actions.clearRiderPhotos();
    };

    return (
        <div className="rider-container">
            <form onSubmit={handleGetRiderPhotos}>
                <div className='tag-container'>
                    <label htmlFor="bicycle">Bicycle:</label>
                    <select id="bicycle" value={bicycle} onChange={(e) => setBicycle(e.target.value)}>
                        <option value="">Which Bike is sending it?</option>
                        <option value="santaCruz">Santa Cruz Nomad 4</option>
                        <option value="scNomad4Arena">Santa Cruz Nomad 4 Arena</option>
                        <option value="kona">Kona Process 153</option>
                        <option value="orbeaRallon">Orbea Rallon Morado-Azul</option>
                        <option value="summun21">Mondraker Summun 21</option>
                        <option value="cannondaleJekyll2">Canondale Jekyll 2</option>
                        <option value="trekSession">Trek Session</option>
                        <option value="comSupV5">Commencal Supremme V5</option>
                        <option value="customBike">Custom bike</option>
                    </select>
                </div>
                <div className='tag-container'>
                    <label htmlFor="helmet">Helmet:</label>
                    <select id="helmet" value={helmet} onChange={(e) => setHelmet(e.target.value)}>
                        <option value="">Which Helmet protects our Bananer?</option>
                        <option value="scott">Scott Spartan</option>
                        <option value="troyLeeStage">Troy Lee Stage</option>
                        <option value="bluegrassLegit">Bluegrass Legit</option>
                        <option value="bluegrassLegitWhiteIris">Bluegrass Legit White Iridiscent</option>
                        <option value="rampage">Fox Rampage Azul</option>
                        <option value="rampagePro">Fox Rampage Pro Carbon</option>
                        <option value="rampageCustomIbai">Fox Rampage Custom Ibai Rider</option>
                        <option value="pocCoron">Poc Coron Air Negro</option>
                        <option value="cienStatus">100% Status Negro</option>
                        <option value="customHelmet">Custom helmet</option>
                    </select>
                </div>
                <button type="submit">Find me!</button>
            </form>

            <div className="photos-container row">
                {store.riderPhoto.map((item, index) => (
                    <div className="card d-flex col-2" key={index}>
                        <div className="rider-card">
                            <div className="rider-photo d-flex">
                                <img src={item.url} alt="photo" className="rider-photo" />
                            </div>
                            {showButtons && (
                                <div className="carousel-button">
                                    <button className="btn btn-success mt-2" onClick={() => handleAddToCart(item)}>
                                        Buy {item.price}€
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </div>
            <div className="">
                <button className="rider-button" onClick={handleNextRider}>Find another rider!</button>
            </div>

        </div>
    );
};


{/* <div id="photoCarousel" className="carousel-slide d-flex row">
                <div className="carousel-inner d-flex col-3">
                    {store.riderPhoto.map((item, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <div className="rider-photo-container d-flex">
                                <img src={item.url} alt="photo" className="rider-photo img-fluid w-100" />
                            </div>
                            <div className="carousel-caption d-none ">
                                <button className="btn btn-success mt-2" onClick={() => handleAddToCart(item)}>Add to cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}




