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

const LanguagePopup = ({ open, onClose, currentLanguage, onLanguageChange }) => {
  const [language, setLanguage] = useState(currentLanguage || "en");

  // Update local state when currentLanguage changes
  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSave = () => {
    localStorage.setItem("preferredLanguage", language);
    onLanguageChange(language);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Language</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} size="small">
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={handleChange}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">Hindi</MenuItem>
            <MenuItem value="mr">Marathi</MenuItem>
            {/* Add more language options here if needed */}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "rgb(178,210,53)",
            color: "rgb(0,0,0)",
            textTransform: "none",
            fontSize: "0.8rem",
            padding: "6px 12px",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LanguagePopup;
