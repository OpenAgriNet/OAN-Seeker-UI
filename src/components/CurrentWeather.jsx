import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import windIcon from "../assets/air.svg";
import cloudIcon from "../assets/weather_hail.svg";
import humidityIcon from "../assets/humidity_percentage.svg";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

// Utility function to get background gradient based on weather description
const getBackgroundGradient = (weatherDescription) => {
  const gradients = {
    "clear sky": "linear-gradient(91.45deg, #A8D8EA 5.54%, #87BDD8 97.44%)",
    "few clouds": "linear-gradient(91.45deg, #D3D3D3 5.54%, #BFBFBF 97.44%)",
    "scattered clouds": "linear-gradient(91.45deg, #BCD4E6 5.54%, #A2C3D6 97.44%)",
    "broken clouds": "linear-gradient(91.45deg, #C2C2C2 5.54%, #A8A8A8 97.44%)",
    "shower rain": "linear-gradient(91.45deg, #CCE3F2 5.54%, #ACCDE9 97.44%)",
    "rain": "linear-gradient(91.45deg, #B3CDE0 5.54%, #8BAFC8 97.44%)",
    "thunderstorm": "linear-gradient(91.45deg, #B5A8D8 5.54%, #9F8ECC 97.44%)",
    "snow": "linear-gradient(91.45deg, #E0F7FA 5.54%, #B2EBF2 97.44%)",
    "mist": "linear-gradient(91.45deg, #E4E4E4 5.54%, #CACACA 97.44%)",
    "overcast clouds": "linear-gradient(91.45deg, #B0B0B0 5.54%, #9B9B9B 97.44%)",
    "sunny": "linear-gradient(91.45deg, #FFE7A8 5.54%, #FFD66B 97.44%)",
  };
  

  return gradients[weatherDescription.toLowerCase()] || gradients["sunny"]; // Default to sunny if no match
};

const CurrentWeather = ({ widgetData }) => {
  if (!widgetData) return <Box>No data available</Box>;

  const { images, short_desc, long_desc, tags } = widgetData.descriptor;
  const weatherImageURL = images[0].url;

  const temperatureMatch = long_desc.match(/Temperature: ([\d.]+)°C/);
  const minTempMatch = long_desc.match(/Min: ([\d.]+)°C/);
  const maxTempMatch = long_desc.match(/Max: ([\d.]+)°C/);
  const humidityMatch = long_desc.match(/Humidity: (\d+)%/);
  const windSpeedMatch = long_desc.match(/Wind Speed: ([\d.]+) m\/s/);
  const minTemp = minTempMatch ? minTempMatch[1] : "N/A";
  const maxTemp = maxTempMatch ? maxTempMatch[1] : "N/A";
  const temperature = temperatureMatch ? temperatureMatch[1] : "N/A";
  const humidity = humidityMatch ? humidityMatch[1] : "N/A";
  const windSpeed = windSpeedMatch ? windSpeedMatch[1] : "N/A";

  const location =
    widgetData.tags?.[0]?.list.find(
      (tag) => tag.descriptor.code === "location"
    )?.value || "Location not available";
  const backgroundGradient = getBackgroundGradient(short_desc);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: backgroundGradient,
          color: "white",
          borderRadius: "16px",
          padding: "14px 18px",
          width: "350px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70px",
          }}
        >
          <img
            src={weatherImageURL}
            alt="Weather Condition"
            style={{ width: "60px", height: "60px" }}
          />
          <Typography
            sx={{ fontSize: "16px", fontWeight: 500, marginTop: "2px" }}
          >
            {short_desc}
          </Typography>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: "65px",
            width: "1px",
            backgroundColor: "#fff",
            margin: "20px",
          }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography
            sx={{ fontSize: "19px", fontWeight: 500, marginBottom: "2px" }}
          >
            {location}
          </Typography>
          <Typography
            sx={{
              fontSize: "34px",
              fontWeight: "bold",
              lineHeight: "1",
              margin: "0.5rem",
            }}
          >
            {temperature}°C
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
              fontSize: "12px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "50px",
              }}
            >
              <img
                src={windIcon}
                alt="Wind"
                style={{ width: "28px", height: "28px", marginBottom: "2px" }}
              />
              <Typography sx={{ fontSize: "14px" }}>
                {(parseFloat(windSpeed) * 3.6).toFixed(2)} km/h{" "}
                {/* Convert m/s to km/h */}
              </Typography>
            </Box>
            {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
            <img src={cloudIcon} alt="Clouds" style={{ width: "28px", height: "28px", marginBottom: "2px" }} />
            <Typography sx={{ fontSize: "14px" }}>Cloud Cover</Typography>  
          </Box> */}
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "50px",
              }}
            >
              <img
                src={humidityIcon}
                alt="Humidity"
                style={{ width: "28px", height: "28px", marginBottom: "2px" }}
              />
              <Typography sx={{ fontSize: "14px" }}>{humidity}%</Typography>
            </Box> */}
          </Box>
        </Box>
      </Box>
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
          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              Humidity
            </Typography>
            <Typography variant="h6" fontWeight="500" fontSize={"20px"}>
              {humidity}%
            </Typography>
          </Grid>

          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              Min Temp
            </Typography>
            <Typography variant="h6" fontWeight="500" fontSize={"20px"}>
              {minTemp}°C
            </Typography>
          </Grid>

          <Grid item xs={4} textAlign="center">
            <WbSunnyIcon sx={{ fontSize: 18, color: "gray" }} />
            <Typography variant="body2" color="text.secondary">
              Max Temp
            </Typography>
            <Typography variant="h6" fontWeight="500" fontSize={"20px"}>
              {maxTemp}°C
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CurrentWeather;
