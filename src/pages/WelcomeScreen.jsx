import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/siteLogo.png";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, updateLanguage } = useContext(LanguageContext);

  const handleChange = (event) => {
    const newLanguage = event.target.value;
    updateLanguage(newLanguage);
  };

  const handleButtonClick = () => {
    const selectedDistrict = sessionStorage.getItem("selectedDistrict");
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
      <h1 style={{ marginBottom: "2rem"}}>
        {t("welcomeScreen.title", "AgriNet:")}
      </h1>
      <h2 >
        {t("welcomeScreen.subtitle", "An Open Network for Global Agriculture")}
      </h2>
      <p
        style={{
          marginTop:'3rem',
          marginBottom: "1rem",
          fontWeight: 500,
          fontSize: "1rem",
          color: "rgba(225, 225, 225, 1)",
        }}
      >
        {t("welcomeScreen.selectLanguage", "Select your preferred language")}
      </p>
  
      {/* Wrap dropdown and button in a single row container */}
      <div className="language-button-row">
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
          >
            <MenuItem value="en">{t("language.english", "English")}</MenuItem>
            <MenuItem value="hi">{t("language.hindi", "Hindi")}</MenuItem>
            <MenuItem value="mr">{t("language.marathi", "Marathi")}</MenuItem>
          </Select>
        </FormControl>
  
        <button className="button" onClick={handleButtonClick}>
          {t("welcomeScreen.getStarted", "Get Started")}
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default WelcomeScreen;
