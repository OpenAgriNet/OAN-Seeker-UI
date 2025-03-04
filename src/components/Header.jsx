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
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import siteLogo from "../assets/siteLogo.png";
import LocationPopup from "./LocationPopup";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

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

  // Callback to update district when user selects a location in the popup
  const handleLocationSelect = (district) => {
    setSelectedDistrict(district);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        backgroundColor: "rgba(11, 85, 138, 1)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo */}
        <Box
          component="img"
          src={siteLogo}
          alt="siteLogo"
          sx={{ height: 30, cursor: "pointer" }}
          onClick={() => navigate("/home")}
        />

        {/* Right: Location button and Hamburger Menu */}
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
                top: "56px", // Adjust if necessary based on AppBar height
                left: 0,
                width: "100%",
                backgroundColor: "white",
                boxShadow: 2,
                color: "black",
                textAlign: "left",
                py: 2,
              }}
            >
              <MenuItem
                onClick={handleMenuToggle}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </MenuItem>
              <MenuItem
                onClick={handleMenuToggle}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <AlternateEmailIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Us" />
              </MenuItem>
              <MenuItem
                onClick={handleMenuToggle}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <ContactSupportIcon />
                </ListItemIcon>
                <ListItemText primary="Terms & Conditions" />
              </MenuItem>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pass the onLocationSelect callback */}
      <LocationPopup
        open={showLocationPopup}
        onClose={handleCloseLocation}
        onLocationSelect={handleLocationSelect}
      />
    </AppBar>
  );
};

export default Header;
