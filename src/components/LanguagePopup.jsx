import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LanguagePopup = ({ open, onClose, currentLanguage, onLanguageChange }) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(currentLanguage || "en");

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSave = () => {
    // Update i18next language
    i18n.changeLanguage(language);
    // Update localStorage so that on next load the correct language is used
    localStorage.setItem("preferredLanguage", language);
    // Notify parent if needed
    onLanguageChange(language);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("languagePopup.title", "Select Language")}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} size="small">
          <InputLabel id="language-select-label">
            {t("languagePopup.label", "Language")}
          </InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={handleChange}
            label={t("languagePopup.label", "Language")}
          >
            <MenuItem value="en">{t("language.english", "English")}</MenuItem>
            <MenuItem value="hi">{t("language.hindi", "Hindi")}</MenuItem>
            <MenuItem value="mr">{t("language.marathi", "Marathi")}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#b2d235",
            color: "rgb(0,0,0)",
            textTransform: "none",
            fontSize: "0.8rem",
            padding: "6px 12px",
            boxShadow:'none'
          }}
        >
          {t("languagePopup.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguagePopup;
