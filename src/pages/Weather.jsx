import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import WeatherWidget from "../components/WeatherWidget";
import Loading from "../components/Loading";
import { fetchWeather } from "../api/apiService";
import NextWeekWeather from "../components/NextWeekWeather";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [widgetData, setWidgetData] = useState(null);
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
        setWidgetData(items[0]);
        console.log("First item in weatherData:", items[0]);
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

  if (error) return <Typography>Error: {error}</Typography>;
  // Uncomment Loading component if you need a loading state
  // if (!widgetData) return <Loading />;

  return (
    <Box className="page-content" sx={{ paddingBottom: "80px",}}>
      <Typography variant="h5" fontWeight="bold" sx={{ fontSize: "16px" }}>
        {getGreetingTime(date)}
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, fontSize: "14px" }}>
        {formatDate(date)}
      </Typography>

      <WeatherWidget widgetData={widgetData} />

      <NextWeekWeather weatherData={weatherData} />
    </Box>
  );
};

export default Weather;
