import React from "react";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
          Welcome to ZeeCare Medical Institute | Your Trusted Healthcare Provider

ZeeCare Medical Institute is a state-of-the-art facility committed to delivering
high-quality healthcare services with compassion and expertise. Our team of
skilled professionals focuses on providing personalized care tailored to each
patient's unique needs.

At ZeeCare, we prioritize your well-being and strive to ensure a smooth and
comfortable journey toward better health and overall wellness.
          </p>
        </div>
        <div className="banner">
          <img src={imageUrl} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;