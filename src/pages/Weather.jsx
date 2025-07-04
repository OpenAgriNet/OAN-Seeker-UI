import React, { useState, useEffect, useContext } from "react";
import { Box, Typography } from "@mui/material";
import WeatherWidget from "../components/CurrentWeather";
import Loading from "../components/Loading";
import { fetchWeather } from "../api/apiService";
import NextWeekWeather from "../components/NextWeekWeather";
import { useTranslation } from "react-i18next";
import { LocationContext } from "../context/LocationContext";

const Weather = () => {
  const { t } = useTranslation();
  const { location } = useContext(LocationContext);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const selectedDistrict = location.selectedDistrict;
      if (!selectedDistrict) {
        setError(t("weather.noLocation", "No location selected"));
        return;
      }
      setWeatherData(null);
      setError(null);
      try {
        const items = await fetchWeather(selectedDistrict);
        // Check if the API returns a blank response
        if (
          !items ||
          (Array.isArray(items) && items.length === 0) ||
          (typeof items === "object" && Object.keys(items).length === 0)
        ) {
          setWeatherData({});
        } else {
          setWeatherData(items);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [t, location.selectedDistrict]);

  const getGreetingTime = (d = new Date()) => {
    const currentHour = d.getHours();
    if (currentHour < 12)
      return t("weather.greeting.morning", "Good morning");
    if (currentHour < 18)
      return t("weather.greeting.afternoon", "Good afternoon");
    return t("weather.greeting.evening", "Good evening");
  };

  const formatDate = (d = new Date()) => {
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  if (error === t("weather.noLocation", "No location selected")) {
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
        <Typography variant="body1">
          {t("weather.noLocationTitle", "Please select your location")}
        </Typography>
        <Typography variant="body2">
          {t(
            "weather.noLocationDescription",
            "We need your location to provide accurate weather information. Tap on the"
          )}{" "}
          <strong>{t("weather.location", "Location")}</strong>{" "}
          {t("weather.toGetStarted", "button in the header above to get started.")}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "red", textAlign: "center", mt: 4 }} variant="body1">
        {t("error", "Error: ")} {error}
      </Typography>
    );
  }

  // If weatherData is empty, display the no-data message in a centered container.
  if (
    weatherData &&
    ((Array.isArray(weatherData) && weatherData.length === 0) ||
      (typeof weatherData === "object" && Object.keys(weatherData).length === 0))
  ) {
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
        <Typography variant="body1">
          {t("weather.noData", "No weather data available for {{location}}.", {
            location: location.selectedDistrict,
          })}
        </Typography>
      </Box>
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
