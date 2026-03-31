import React from "react";

const Biography = ({imageUrl}) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            We are a team of passionate developers currently working on a MERN Stack
          project in 2026. This project is under development and we are learning
          and implementing new technologies step by step.
          </p>
          <p>We are all in 2026!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
            Our goal is to build a user-friendly and efficient web application.
          We are continuously improving our skills and gaining practical
          experience while developing this project.
          </p>
          <p>We believe in learning by doing and growing every day.</p>
          <p>Coding is fun!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;