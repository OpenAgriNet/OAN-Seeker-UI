import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GTranslateIcon from "@mui/icons-material/GTranslate"; // New language icon

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import siteLogo from "../assets/siteLogo.png";
import LocationPopup from "./LocationPopup";
import LanguagePopup from "../components/LanguagePopup"; // Import the new popup

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false); // For language popup
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [language, setLanguage] = useState("en");

  // On mount, load district from localStorage (if available)
  useEffect(() => {
    const storedDistrict = localStorage.getItem("selectedDistrict");
    if (storedDistrict) {
      setSelectedDistrict(storedDistrict);
    }
  }, []);

  const handleMenuToggle = () => {
    setOpen(!open);
  };

  const handleOpenLocation = () => {
    setShowLocationPopup(true);
  };

  const handleCloseLocation = () => {
    setShowLocationPopup(false);
  };

  const handleOpenLanguage = () => {
    setShowLanguagePopup(true);
  };

  const handleCloseLanguage = () => {
    setShowLanguagePopup(false);
  };

  // Callback to update district when user selects a location in the popup
  const handleLocationSelect = (district) => {
    setSelectedDistrict(district);
  };

  // Callback to update language when user selects a new language
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Optionally, save the language preference in localStorage or context
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        backgroundColor: "#000",
        boxShadow: "none",
        color: "white",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          component="img"
          src={siteLogo}
          alt="siteLogo"
          sx={{ height: 30, cursor: "pointer" }}
          onClick={() => navigate("/weather")}
        />

        {/* Right: Location button, Language Icon, and Hamburger Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={handleOpenLocation}
            startIcon={<LocationOnIcon />}
            sx={{
              textTransform: "none",
              fontSize: "16px",
              mr: 1,
            }}
          >
            {selectedDistrict ? selectedDistrict : "Location"}
          </Button>

          <IconButton onClick={handleOpenLanguage} color="inherit" sx={{ mr: 1 }}>
            <GTranslateIcon />
          </IconButton>

          <IconButton onClick={handleMenuToggle} color="inherit">
            {open ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "56px",
                left: 0,
                width: "100%",
                backgroundColor: "#000000de",
                boxShadow: 2,
                color: "white",
                textAlign: "left",
                py: 2,
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuToggle();
                  navigate("/aboutus");
                }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuToggle();
                  navigate("/contactus");
                }}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                  <AlternateEmailIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Us" />
              </MenuItem>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Popup */}
      <LocationPopup
        open={showLocationPopup}
        onClose={handleCloseLocation}
        onLocationSelect={handleLocationSelect}
      />

      {/* Language Selection Popup */}
      <LanguagePopup
        open={showLanguagePopup}
        onClose={handleCloseLanguage}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
      />
    </AppBar>
  );
};

export default Header;
