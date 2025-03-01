import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const GIST_URL =
  "https://gist.githubusercontent.com/anubhavshrimal/4aeb195a743d0cdd1c3806c9c222ed45/raw";

const Home = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [data, setData] = useState({});

  const navigate = useNavigate(); // ✅ Initialize navigate

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
      localStorage.setItem("selectedState", selectedState.value);
      localStorage.setItem("selectedDistrict", selectedDistrict);
      navigate("/schemes"); // ✅ Redirect user to "/schemes"
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ textAlign: "left", fontSize: "14px" }}>
          State <span style={{ color: "red" }}>*</span>
        </Typography>
        <Autocomplete
          options={states}
          getOptionLabel={(option) => option.label}
          value={selectedState}
          onChange={(_, newValue) => {
            setSelectedState(newValue);
            setSelectedDistrict(null);
            if (newValue) fetchDistricts(newValue.value);
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
                    {loadingStates ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Typography variant="h6" sx={{ textAlign: "left", fontSize: "14px" }}>
          District <span style={{ color: "red" }}>*</span>
        </Typography>
        <Autocomplete
          options={districts}
          getOptionLabel={(option) => option}
          value={selectedDistrict}
          onChange={(_, newValue) => setSelectedDistrict(newValue)}
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
                    {loadingDistricts ? <CircularProgress color="inherit" size={20} /> : null}
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
          sx={{
            mt: 2,
            backgroundColor: "rgba(11, 85, 138, 1)",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
          }}
          onClick={handleSubmit}
          disabled={!selectedState || !selectedDistrict}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
