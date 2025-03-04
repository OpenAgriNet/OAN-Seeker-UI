import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import siteLogo from "../assets/siteLogo.png";
import { useLocationContext } from "../LocationContext"; // import the context
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

const GIST_URL =
  "https://gist.githubusercontent.com/anubhavshrimal/4aeb195a743d0cdd1c3806c9c222ed45/raw";

const Header = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);

  // Pull location from context
  const { location, updateLocation } = useLocationContext();

  // For state/district data fetching
  const [data, setData] = useState({});
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // For the user's selection in the dialog
  const [selectedState, setSelectedState] = useState(location.state || "");
  const [selectedDistrict, setSelectedDistrict] = useState(location.district || "");

  // Fetch all states once
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(GIST_URL);
        const jsonData = response.data;
        setData(jsonData);

        const stateList = Object.keys(jsonData).map((stateName) => ({
          value: stateName,
          label: stateName,
        }));

        setStates(stateList);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // When user selects a new state, load the districts
  const fetchDistricts = (stateName) => {
    setLoadingDistricts(true);
    try {
      const stateDistricts = data[stateName] || [];
      setDistricts(stateDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  // If user had a saved state in context, load the matching districts
  useEffect(() => {
    if (location.state) {
      fetchDistricts(location.state);
    }
  }, [location.state]);

  // Toggle hamburger menu
  const handleMenuToggle = () => {
    setOpenMenu(!openMenu);
  };

  // Submit the new location
  const handleSubmitLocation = () => {
    if (selectedState && selectedDistrict) {
      updateLocation(selectedState, selectedDistrict);
      setOpenLocationDialog(false);

      // Optional: navigate to weather if you want
      // navigate("/weather");
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "rgba(11, 85, 138, 1)", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box
          component="img"
          src={siteLogo}
          alt="siteLogo"
          sx={{ height: 30 }}
          onClick={() => navigate("/home")}
        />

        {/* Location Button */}
        <IconButton onClick={() => setOpenLocationDialog(true)} color="inherit">
          <LocationOnIcon />
        </IconButton>

        {/* Hamburger Menu */}
        <IconButton onClick={handleMenuToggle} color="inherit">
          {openMenu ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      {/* AnimatePresence for the Menu */}
      <AnimatePresence>
        {openMenu && (
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
              <MenuItem sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About Us" />
              </MenuItem>
              <MenuItem sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <AlternateEmailIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Us" />
              </MenuItem>
              <MenuItem sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <ContactSupportIcon />
                </ListItemIcon>
                <ListItemText primary="Terms & Conditions" />
              </MenuItem>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog for selecting location */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)}>
        <DialogTitle>Select Location</DialogTitle>
        <DialogContent sx={{ width: "300px" }}>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            State <span style={{ color: "red" }}>*</span>
          </Typography>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.label}
            value={
              selectedState
                ? { value: selectedState, label: selectedState }
                : null
            }
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedState(newValue.value);
                setSelectedDistrict("");
                fetchDistricts(newValue.value);
              } else {
                setSelectedState("");
                setDistricts([]);
              }
            }}
            loading={loadingStates}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingStates ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            District <span style={{ color: "red" }}>*</span>
          </Typography>
          <Autocomplete
            options={districts}
            getOptionLabel={(option) => option}
            value={selectedDistrict || null}
            onChange={(_, newValue) => setSelectedDistrict(newValue || "")}
            disabled={!selectedState || loadingDistricts}
            loading={loadingDistricts}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingDistricts ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, backgroundColor: "rgba(11, 85, 138, 1)" }}
            onClick={handleSubmitLocation}
            disabled={!selectedState || !selectedDistrict}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
