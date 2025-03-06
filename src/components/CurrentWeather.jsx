import React, { useState } from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import windIcon from "../assets/air.svg";
import humidityIcon from "../assets/humidity.svg";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CurrentWeatherPopup from "./CurrentWeatherPopup";
import { useTranslation } from "react-i18next";
import { useReadableDay } from "./useReadableDay"; // Import our custom hook

const getBackgroundGradient = (weatherDescription) => {
  const gradients = {
    "clear sky": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    "few clouds": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    "scattered clouds": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    "broken clouds": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    "shower rain": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    rain: "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    thunderstorm: "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    snow: "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    mist: "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    "overcast clouds": "linear-gradient(180deg, #42A0F0 0%, #FFF3B0 100%)",
    sunny: "linear-gradient(180deg, #DDA15E 0%, #FFF3B0 100%)"
  };
  return gradients[weatherDescription.toLowerCase()] || gradients["sunny"];
};

const CurrentWeather = ({ widgetData, allForecastData }) => {
  const { t } = useTranslation();
  const getReadableDay = useReadableDay();
  const [openPopup, setOpenPopup] = useState(false);

  if (!widgetData) return <Box>{t("currentWeather.noData", "No data available")}</Box>;
  
  const currentForecast = widgetData;
  const { images, short_desc, long_desc } = widgetData[0].descriptor;
  const weatherImageURL = images?.[0]?.url;

  // Extract weather details from long_desc
  const temperatureMatch = long_desc.match(/Temperature: ([\d.]+)°C/);
  const minTempMatch = long_desc.match(/Min: ([\d.]+)°C/);
  const maxTempMatch = long_desc.match(/Max: ([\d.]+)°C/);
  const humidityMatch = long_desc.match(/Humidity: (\d+)%/);
  const windSpeedMatch = long_desc.match(/Wind Speed: ([\d.]+) m\/s/);

  const wholeTemperature = temperatureMatch ? parseInt(temperatureMatch[1]) : "N/A";
  const wholeMinTemp = minTempMatch ? parseInt(minTempMatch[1]) : "N/A";
  const wholeMaxTemp = maxTempMatch ? parseInt(maxTempMatch[1]) : "N/A";
  const wholeWindSpeed = windSpeedMatch ? Math.trunc(parseFloat(windSpeedMatch[1]) * 3.6) : "N/A";
  const humidity = humidityMatch ? humidityMatch[1] : "N/A";

  const formattedLongDesc = long_desc
    .replace(/Temperature: ([\d.]+)°C/, (_, num) => `Temperature: ${parseInt(parseFloat(num))}°C`)
    .replace(/Min: ([\d.]+)°C/, (_, num) => `Min: ${parseInt(parseFloat(num))}°C`)
    .replace(/Max: ([\d.]+)°C/, (_, num) => `Max: ${parseInt(parseFloat(num))}°C`)
    .replace(/Wind Speed: ([\d.]+) m\/s/, (_, num) => `Wind Speed: ${Math.trunc(parseFloat(num))} m/s`);

  // Assume widgetData[0] has a forecastDate field; if not, adjust accordingly.
  const forecastDate = widgetData[0].forecastDate || new Date().toISOString();
  const translatedDay = getReadableDay(forecastDate);

  // Get location from tags if available
  const locationName = widgetData[0].tags?.[0]?.list.find(
    (tag) => tag.descriptor?.code === "location"
  )?.value || t("currentWeather.noLocation", "Location not available");

  const backgroundGradient = getBackgroundGradient(short_desc);

  return (
    <>
      <Box
        onClick={() => setOpenPopup(true)}
        sx={{
          display: "flex",
          alignItems: "center",
          background: backgroundGradient,
          color: "white",
          borderRadius: "16px",
          padding: "14px 18px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          cursor: "pointer"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "70px" }}>
          <img src={weatherImageURL} alt="Weather Condition" style={{ width: "60px", height: "60px" }} />
          <Typography sx={{ fontSize: "15px", fontWeight: 500, marginTop: "2px", color:'rgba(73, 74, 75, 1)' }}>
            {short_desc}
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ height: "65px", width: "1px", backgroundColor: "#fff", margin: "20px" }} />

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ fontSize: "19px", fontWeight: 500, marginBottom: "2px", color:'rgba(73, 74, 75, 1)' }}>
            {locationName}
          </Typography>
          <Typography sx={{ fontSize: "34px", fontWeight: "bold", lineHeight: "1", margin: "0.5rem", color:'rgba(73, 74, 75, 1)' }}>
            {wholeTemperature}°C
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", color:'rgba(73, 74, 75, 1)' }}>
            {translatedDay}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px", color:'rgba(73, 74, 75, 1)' }}>
            {formattedLongDesc}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f7e6c4", borderRadius: "12px", padding: "12px", mt: 3 }}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={humidityIcon} alt="Humidity Icon" style={{ width: "28px", height: "28px", marginRight: "8px" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">{t("currentWeather.humidity", "Humidity")}</Typography>
                <Typography variant="h6" fontWeight="500" fontSize={"20px"}>
                  {humidity}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img src={windIcon} alt="Wind Icon" style={{ width: "28px", height: "28px", marginRight: "8px" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">{t("currentWeather.wind", "Wind")}</Typography>
                <Typography variant="h6" fontWeight="500" fontSize={"20px"}>
                  {wholeWindSpeed} km/h
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CurrentWeatherPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        currentForecast={currentForecast}
        allForecastData={allForecastData}
      />

    </>
  );
};

export default CurrentWeather;
