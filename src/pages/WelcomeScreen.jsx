import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/siteLogo.png";

// MUI imports
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  // State to hold the selected language
  const [language, setLanguage] = React.useState("en");

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="landing-page">
      {/* Dark overlay */}
      <div className="overlay" />
     

      {/* Text Container */}
      <div className="text-container">
        {/* Logo */}
        <img src={Logo} alt="Site Logo" className="logo" />

        {/* Heading */}
        <h1>
          AgriNet: <br />
          Your Farm, Our Weather, Better Harvests
        </h1>

        {/* MUI Language Dropdown (white background, small size) */}
        <p style={{marginBottom:'1rem', fontWeight:500 , fontSize:'1rem', color:''}}>Select your preferred language</p>
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          className="language-select"
          sx={{
            minWidth: 150,
            marginBottom: "20px",
            backgroundColor: "#fff",    // White background
            borderRadius: "4px",        // Rounded corners (optional)
          }}
        >
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={handleChange}
            small
            fullWidth
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="mr">Marathi</MenuItem>
          </Select>
        </FormControl>

        {/* CTA Button */}
        <button className="button" onClick={() => navigate("/weather")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
