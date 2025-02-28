import { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
} from "@mui/material";

const states = [
  { value: "maharashtra", label: "Maharashtra" },
  { value: "karnataka", label: "Karnataka" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
];

const districts = {
  maharashtra: ["Pune", "Mumbai", "Nagpur"],
  karnataka: ["Bangalore", "Mysore", "Mangalore"],
  tamil_nadu: ["Chennai", "Coimbatore", "Madurai"],
};

const Home = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ textAlign: "left", fontSize: "14px" }}>
         State <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          select
          fullWidth
          margin="normal"
          variant="outlined"
          size="small"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          placeholder="Select State"
          sx={{ marginTop: "4px" }}
        >
          {states.map((state) => (
            <MenuItem key={state.value} value={state.value}>
              {state.label}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="h6" sx={{ textAlign: "left", fontSize: "14px" }}>
          District <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          select
          fullWidth
          margin="normal"
          variant="outlined"
          size="small"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedState}
          placeholder="Select District"
          sx={{ marginTop: "4px" }}
        >
          {(districts[selectedState] || []).map((district) => (
            <MenuItem key={district} value={district}>
              {district}
            </MenuItem>
          ))}
        </TextField>

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
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
