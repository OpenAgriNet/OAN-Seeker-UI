import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LocationContext } from "../context/LocationContext"; // new import

const GIST_URL =
  "https://gist.githubusercontent.com/anubhavshrimal/4aeb195a743d0cdd1c3806c9c222ed45/raw";

const LocationPopup = ({ open, onClose, onLocationSelect }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateLocation } = useContext(LocationContext); // new

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    const storedState = sessionStorage.getItem("selectedState");
    const storedDistrict = sessionStorage.getItem("selectedDistrict");

    if (storedState) {
      setSelectedState({ value: storedState, label: storedState });
    }
    if (storedDistrict) {
      setSelectedDistrict(storedDistrict);
    }
  }, []);

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

  const handleSubmit = () => {
    if (selectedState && selectedDistrict) {
      sessionStorage.setItem("selectedState", selectedState.value);
      sessionStorage.setItem("selectedDistrict", selectedDistrict);
      updateLocation(selectedState.value, selectedDistrict); // update shared context
      if (onLocationSelect) {
        onLocationSelect(selectedDistrict);
      }
      onClose();
    }
  };

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
      <DialogTitle>
        {t("locationPopup.title", "Select Your Location")}
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="subtitle2">
            {t("locationPopup.state", "State")}{" "}
            <span style={{ color: "red" }}>*</span>
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

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            {t("locationPopup.district", "District")}{" "}
            <span style={{ color: "red" }}>*</span>
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
            backgroundColor: "#b2d235",
            color: "#000",
            textTransform: "none",
            marginTop: 2,
            boxShadow: "none",
          }}
        >
          {t("locationPopup.submit", "Submit")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPopup;
