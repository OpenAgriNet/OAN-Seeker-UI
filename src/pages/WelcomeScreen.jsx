import React from "react";
import { useNavigate } from "react-router-dom";
import Sun from "../assets/Sun.svg";
import Cloud from "../assets/cloud.svg";
import Logo from "../assets/siteLogo.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* Sun and Cloud Background */}
      <img src={Sun} alt="Sun" className="sun" />
      <img src={Cloud} alt="Cloud" className="cloud" />

      {/* Text Section */}
      <div className="text-container">
        {/* Site Logo */}
        <img src={Logo} alt="Site Logo" className="logo" />
        <h1 style={{ fontSize: "40px", lineHeight: "45.6px" }}>
        <span style={{color:'rgba(11, 85, 138, 1)'}}>AgriNet: </span>Your Farm, Our Weather, Better Harvests
        </h1>
        <p>Stay ahead of the weather with our accurate forecasts</p>

        {/* CTA Button */}
        <button className="button" onClick={() => navigate("/home")}>
          Get Started
        </button>
      </div>

       {/* Circles Wrapper */}
       <div className="circle-container">
        <div className="circle outer-circle"></div>
        <div className="circle second-circle"></div>
        <div className="circle third-circle"></div>
        <div className="circle inner-circle"></div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
