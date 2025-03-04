import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GIST_URL =
  "https://gist.githubusercontent.com/anubhavshrimal/4aeb195a743d0cdd1c3806c9c222ed45/raw";

const LocationPopup = ({ open, onClose, onLocationSelect }) => {
  const navigate = useNavigate();

  // State variables
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [data, setData] = useState({});

  // Load previous selection from localStorage (if any)
  useEffect(() => {
    const storedState = localStorage.getItem("selectedState");
    const storedDistrict = localStorage.getItem("selectedDistrict");

    if (storedState) {
      setSelectedState({ value: storedState, label: storedState });
    }
    if (storedDistrict) {
      setSelectedDistrict(storedDistrict);
    }
  }, []);

  // Fetch states from GIST
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  // Fetch districts for a selected state
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

  // Handle submit: store in localStorage, call callback, then navigate/reload.
  const handleSubmit = () => {
    if (selectedState && selectedDistrict) {
      localStorage.setItem("selectedState", selectedState.value);
      localStorage.setItem("selectedDistrict", selectedDistrict);

      // Update the parent's state via callback
      if (onLocationSelect) {
        onLocationSelect(selectedDistrict);
      }

      // Close popup
      onClose();

      // If already on /weather, force reload to re-fetch data; otherwise, navigate to /weather.
      if (window.location.pathname === "/weather") {
        window.location.reload();
      } else {
        navigate("/weather");
      }
    }
  };

  // When state changes, reset district and fetch new district list
  const handleStateChange = (_, newValue) => {
    setSelectedState(newValue);
    setSelectedDistrict(null);
    if (newValue) {
      fetchDistricts(newValue.value);
    } else {
      setDistricts([]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Select Your Location</DialogTitle>
      <DialogContent>
        {/* STATE */}
        <Box>
          <Typography variant="subtitle2">
            State <span style={{ color: "red" }}>*</span>
          </Typography>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.label}
            value={selectedState}
            onChange={handleStateChange}
            loading={loadingStates}
            renderInput={(params) => (
              <TextField
                sx={{ marginTop: "0px !important" }}
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
        </Box>

        {/* DISTRICT */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            District <span style={{ color: "red" }}>*</span>
          </Typography>
          <Autocomplete
            sx={{ marginTop: "0px" }}
            options={districts}
            getOptionLabel={(option) => option}
            value={selectedDistrict}
            onChange={(_, newValue) => setSelectedDistrict(newValue)}
            disabled={!selectedState || loadingDistricts}
            loading={loadingDistricts}
            renderInput={(params) => (
              <TextField
                sx={{ marginTop: "0px !important" }}
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
        </Box>
        <Button
       
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedState || !selectedDistrict}
          sx={{
            backgroundColor: "rgba(11, 85, 138, 1)",
            textTransform: "none",
            marginTop:2
          }}
        >
          Submit
        </Button>
      </DialogContent>
      
    </Dialog>
  );
};

export default LocationPopup;
