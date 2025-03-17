// Header.jsx
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
  Select,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import siteLogo from "../assets/siteLogo.png";
import { useTranslation } from "react-i18next";
import { LocationContext } from "../context/LocationContext";
import { LanguageContext } from "../context/LanguageContext";
import LocationPopup from "../components/LocationPopup";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // Use the shared location and language from context
  const { location } = useContext(LocationContext);

  // IMPORTANT: We pull out "updateLanguageFromHeader"
  const { language, updateLanguageFromHeader } = useContext(LanguageContext);

  const handleMenuToggle = () => {
    setOpen(!open);
  };

  const handleOpenLocation = () => {
    setShowLocationPopup(true);
  };

  const handleCloseLocation = () => {
    setShowLocationPopup(false);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    // Call "updateLanguageFromHeader" so the chatbot knows it was from the header
    updateLanguageFromHeader(newLanguage);
    // Optional: also update i18n here if you want immediate effect
    i18n.changeLanguage(newLanguage);
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
            {location.selectedDistrict
              ? location.selectedDistrict
              : t("header.location", "Location")}
          </Button>

          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            sx={{
              color: "white",
              borderColor: "white",
              "& .MuiSelect-icon": { color: "white" },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">हिंदी</MenuItem>
            <MenuItem value="mr">मराठी</MenuItem>
          </Select>

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

      <LocationPopup open={showLocationPopup} onClose={handleCloseLocation} />
    </AppBar>
  );
};

export default Header;