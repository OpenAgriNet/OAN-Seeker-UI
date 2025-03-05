import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import WeatherWidget from "../components/CurrentWeather";
import Loading from "../components/Loading";
import { fetchWeather } from "../api/apiService";
import NextWeekWeather from "../components/NextWeekWeather";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const location = localStorage.getItem("selectedDistrict");
      if (!location) {
        setError("No location selected");
        return;
      }
      try {
        const items = await fetchWeather(location);
        setWeatherData(items);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const getGreetingTime = (d = new Date()) => {
    const currentHour = d.getHours();
    if (currentHour < 12) return "Good morning";
    if (currentHour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (d = new Date()) => {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  if (error === "No location selected") {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <LocationOffIcon sx={{ fontSize: 80, color: "#004d8a", mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Please select your location
        </Typography>
        <Typography variant="body2">
          We need your location to provide accurate weather information. Tap on
          the <strong>Location</strong> button in the header above to get
          started.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "red", textAlign: "center", mt: 4 }}>
        Error: {error}
      </Typography>
    );
  }

  if (!weatherData) return <Loading />;

  return (
    <Box className="page-content" sx={{ paddingBottom: "80px" }}>
      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "16px" }}>
        {getGreetingTime(date)}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, fontSize: "14px" }}>
        {formatDate(date)}
      </Typography>

      <WeatherWidget widgetData={weatherData} />
      <NextWeekWeather weatherData={weatherData} />
    </Box>
  );
};

export default Weather;
