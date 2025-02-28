import { Box, Typography, Grid } from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";
import WbSunnyIcon from "@mui/icons-material/WbSunny"; // Sun icon

const Weather = () => {
  return (
    <Box className="page-content">
      {/* Greeting Message */}
      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "14px" }}>
        Good morning
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, fontSize: "14px" }}>
        Thu, 31 Oct
      </Typography>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Weather Info Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #f7e6c4",
          borderRadius: "12px",
          padding: "12px",
          mt: 3,
        }}
      >
        <Grid container spacing={2} justifyContent="space-between">
          {/* UV Index */}
          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              UV Index
            </Typography>
            <Typography variant="h6" fontWeight="bold">7 High</Typography>
          </Grid>

          {/* Humidity */}
          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              Humidity
            </Typography>
            <Typography variant="h6" fontWeight="bold">61%</Typography>
          </Grid>

          {/* Precipitation */}
          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              Precipitation
            </Typography>
            <Typography variant="h6" fontWeight="bold">4mm</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Weather;
