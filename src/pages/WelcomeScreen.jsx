import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/siteLogo.png";

// MUI imports
import { FormControl, Select, MenuItem } from "@mui/material";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  // State to hold the selected language
  const [language, setLanguage] = React.useState("en");

  const handleChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    // Update localStorage whenever the dropdown value changes
    localStorage.setItem("preferredLanguage", newLanguage);
  };

  // Handle button click based on whether selectedDistrict exists in localStorage
  const handleButtonClick = () => {
    // Update the language preference again before navigation
    localStorage.setItem("preferredLanguage", language);
    const selectedDistrict = localStorage.getItem("selectedDistrict");
    if (selectedDistrict) {
      navigate("/weather");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="landing-page">
      <div className="overlay" />
      <div className="text-container">
        <img src={Logo} alt="Site Logo" className="logo" />
        <h1 style={{ marginBottom: "2rem" }}>AgriNet:</h1>
        <h1>An Open Network for Global Agriculture</h1>
        <p
          style={{
            marginBottom: "1rem",
            fontWeight: 500,
            fontSize: "1rem",
            color: "rgba(225, 225, 225, 1)",
          }}
        >
          Select your preferred language
        </p>
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          className="language-select"
          sx={{
            minWidth: 150,
            marginBottom: "20px",
            backgroundColor: "#fff",
            borderRadius: "4px",
          }}
        >
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="mr">Marathi</MenuItem>
          </Select>
        </FormControl>

        {/* CTA Button */}
        <button className="button" onClick={handleButtonClick}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
