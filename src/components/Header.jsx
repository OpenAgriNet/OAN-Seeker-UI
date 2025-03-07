import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import siteLogo from "../assets/siteLogo.png";
import LocationPopup from "./LocationPopup";
import LanguagePopup from "../components/LanguagePopup";
import { useTranslation } from "react-i18next";
import { LocationContext } from "../context/LocationContext";
import { LanguageContext } from "../context/LanguageContext";

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  
  // Use the shared location and language from context
  const { location, updateLocation } = useContext(LocationContext);
  const { language, updateLanguage } = useContext(LanguageContext);

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

  // When a new district is selected, update the context
  const handleLocationSelect = (district) => {
    updateLocation(location.selectedState, district);
  };

  // The header now simply opens the LanguagePopup.
  // The LanguagePopup will use the context to update the language.
  const handleLanguageChange = (newLanguage) => {
    updateLanguage(newLanguage);
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
            {location.selectedDistrict ? location.selectedDistrict : t("header.location", "Location")}
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
                <ListItemText primary={t("header.aboutUs", "About Us")} />
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
                <ListItemText primary={t("header.contactUs", "Contact Us")} />
              </MenuItem>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationPopup
        open={showLocationPopup}
        onClose={handleCloseLocation}
        onLocationSelect={handleLocationSelect}
      />

      <LanguagePopup
        open={showLanguagePopup}
        onClose={handleCloseLanguage}
      />
    </AppBar>
  );
};

export default Header;
