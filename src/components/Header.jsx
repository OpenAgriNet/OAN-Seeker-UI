import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import siteLogo from "../assets/siteLogo.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // Hook for navigation

  const [open, setOpen] = useState(false);

  const handleMenuToggle = () => {
    setOpen(!open);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(11, 85, 138, 1)",
        px: 2,
        paddingLeft: "0px !imprtant",
        paddingRight: "0px !imprtant",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component="img"
          src={siteLogo}
          alt="siteLogo"
          sx={{ height: 30 }}
          onClick={() => navigate("/home")}
        />

        {/* Hamburger Menu */}
        <IconButton onClick={handleMenuToggle} color="inherit">
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* Full Width Animated Dropdown Menu */}
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
                top: "100%",
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
    </AppBar>
  );
};

export default Header;
