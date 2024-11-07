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
                        <option value="santa_Cruz">Santa Cruz</option>
                        <option value="kona">Kona</option>
                    </select>
                </div>
                <div className='tag-container'>
                    <label htmlFor="helmet">Helmet:</label>
                    <select id="helmet" value={helmet} onChange={(e) => setHelmet(e.target.value)}>
                        <option value="">Which Helmet protects our Bananer?</option>
                        <option value="scott">Scott</option>
                        <option value="troyLee">TroyLee</option>
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




