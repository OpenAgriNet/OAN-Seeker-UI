import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/siteLogo.png";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize language from localStorage (or default "en")
  const [language, setLanguage] = React.useState(
    localStorage.getItem("preferredLanguage") || "en"
  );

  const handleChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    // Change language in i18next immediately
    i18n.changeLanguage(newLanguage);
    // Save the preference in localStorage
    localStorage.setItem("preferredLanguage", newLanguage);
  };

  const handleButtonClick = () => {
    // Ensure the latest language is saved in localStorage
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
        <h1 style={{ marginBottom: "2rem" }}>
          {t("welcomeScreen.title", "AgriNet:")}
        </h1>
        <h1>
          {t(
            "welcomeScreen.subtitle",
            "An Open Network for Global Agriculture"
          )}
        </h1>
        <p
          style={{
            marginBottom: "1rem",
            fontWeight: 500,
            fontSize: "1rem",
            color: "rgba(225, 225, 225, 1)",
          }}
        >
          {t(
            "welcomeScreen.selectLanguage",
            "Select your preferred language"
          )}
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
  );
};

export default WelcomeScreen;
