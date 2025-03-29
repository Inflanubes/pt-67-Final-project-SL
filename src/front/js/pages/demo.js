// ContentSection.js
import React, { useEffect, useState, useRef } from "react";
import "../../styles/contentSection.css";

export const Demo = () => {
  const [scrollY, setScrollY] = useState(0);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "section1", text: "Sección 1", image: "https://res.cloudinary.com/dflvexboa/image/upload/v1724270545/egwv0sfqe5aa0qmydqna.png" },
    { id: "section2", text: "Sección 2", image: "https://res.cloudinary.com/dflvexboa/image/upload/v1724270545/egwv0sfqe5aa0qmydqna.png" },
    { id: "section3", text: "Sección 3", image: "https://res.cloudinary.com/dflvexboa/image/upload/v1724270545/egwv0sfqe5aa0qmydqna.png" },
  ];

  return (
    <main>

      {sections.map((section, index) => (
        <div key={section.id} className="content-section">
          <div
            className="background"
            style={{
              backgroundImage: `url(${section.image})`,
              transform: `translateY(${(scrollY - index * window.innerHeight) * 0.2}px)`
            }}
          ></div>
          <div className={`text-box ${index % 2 === 0 ? "left" : "right"}`}>
            <h2>{section.text}</h2>
          </div>
        </div>
      ))}
    </main>
  );
};


  export default Demo;