import React, { useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const backgroundRef = useRef(null);
    const riderTitleRef = useRef(null);
    const photographerTitleRef = useRef(null);
    const riderImageRef = useRef(null);
    const photographerImageRef = useRef(null);

    // ✅ Validar autenticación por token
    useEffect(() => {
        if (!store.token) {
            navigate('/');
        }
    }, [store.token, navigate]);

    // ✅ IntersectionObserver para títulos
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-title');
                    } else {
                        entry.target.classList.remove('animate-title');
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (riderTitleRef.current) observer.observe(riderTitleRef.current);
        if (photographerTitleRef.current) observer.observe(photographerTitleRef.current);

        return () => {
            if (riderTitleRef.current) observer.unobserve(riderTitleRef.current);
            if (photographerTitleRef.current) observer.unobserve(photographerTitleRef.current);
        };
    }, []);

    return (
        <div className="home-container">
            {/* ✅ Sección de Imagen Completa */}
            <section className="full-image-section" ref={backgroundRef}>
                <h1>BIENVENIDO</h1>
            </section>

            {/* ✅ Sección Rider */}
            <div className="split-section">
                <div className="split-content left-content">
                    <h2 ref={photographerTitleRef} className="title">PHOTOGRAPHER</h2>
                    <p>Capturando momentos inolvidables.</p>
                </div>
                <div
                    ref={photographerImageRef}
                    className="split-image-right"
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/dflvexboa/image/upload/v1724270545/egwv0sfqe5aa0qmydqna.png')",
                    }}
                ></div>
            </div>

            {/* ✅ Sección Photographer */}
            <div className="split-section reverse">
                <div className="split-content right-content">
                    <h2 ref={riderTitleRef} className="title">RIDER</h2>
                    <p>Explora las montañas con pasión y dedicación.</p>
                </div>
                <div
                    ref={riderImageRef}
                    className="split-image"
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/dflvexboa/image/upload/v1724270545/egwv0sfqe5aa0qmydqna.png')",
                    }}
                ></div>
            </div>
        </div>
    );
};
