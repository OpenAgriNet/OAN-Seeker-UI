import React from "react";
import { Box, Typography } from "@mui/material";

const NextWeekWeather = ({ weatherData }) => {
  if (!weatherData || weatherData.length === 0) return null;

  // Assume the first item is current weather.
  const currentWeather = weatherData[0];
  const currentDate = currentWeather?.tags?.[0]?.descriptor?.code; // e.g. "2025-03-03"

  // Filter out current weather and any forecasts for the current date.
  const forecastItems = weatherData.filter(item => {
    if (!item.descriptor.name.startsWith("Forecast")) return false;
    const parts = item.descriptor.name.split(" ");
    if (parts.length < 4) return false;
    const forecastDate = parts[2]; // "YYYY-MM-DD"
    return forecastDate !== currentDate;
  });

  // Group forecasts by day
  const groupedForecasts = forecastItems.reduce((acc, forecast) => {
    const parts = forecast.descriptor.name.split(" ");
    const forecastDate = parts[2]; // "YYYY-MM-DD"
    if (!acc[forecastDate]) {
      acc[forecastDate] = [];
    }
    acc[forecastDate].push(forecast);
    return acc;
  }, {});

  // Get forecast dates sorted in ascending order.
  const forecastDates = Object.keys(groupedForecasts).sort();

  // For each day, pick one representative forecast.
  // Here we choose the forecast whose time is closest to noon.
  const dailyForecasts = forecastDates.map(dateKey => {
    const forecasts = groupedForecasts[dateKey];
    let selectedForecast = forecasts[0];
    let minDiff = Number.MAX_VALUE;
    forecasts.forEach(forecast => {
      const parts = forecast.descriptor.name.split(" ");
      const timeStr = parts[3]; 
      const hour = parseInt(timeStr.split(":")[0]);
      const diff = Math.abs(hour - 12); 
      if (diff < minDiff) {
        minDiff = diff;
        selectedForecast = forecast;
      }
    });
    return { date: dateKey, forecast: selectedForecast };
  });

  return (
    <Box
      sx={{
        border: "1px solid #f7e6c4",
        borderRadius: "12px",
        padding: "16px",
        mt: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontSize: "14px" }} fontWeight={500}>
        Next 7 days
      </Typography>

      {dailyForecasts.map((item, index) => {
        // Extract the temperature from the forecast tags.
        const temperatureObj = item.forecast.tags?.[0]?.list.find(
          t => t.descriptor.code === "temperature"
        );
        const temperature = temperatureObj ? temperatureObj.value : item.forecast.descriptor.short_desc;

        // Parse the forecast date string into a Date object.
        const dateObj = new Date(item.date);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        const formattedDate = dateObj.toLocaleDateString("en-US", { day: "numeric", month: "short" });
        // Get the weather icon URL from the forecast.
        const iconUrl = item.forecast.descriptor.images?.[0]?.url;

        return (
          <Box key={index} sx={{ display: "flex", alignItems: "center", py: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background:
                  "linear-gradient(179.04deg, #D2E2F6 -245.76%, #FCFDFE 132.78%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              {iconUrl && (
                <img
                  src={iconUrl}
                  alt={item.forecast.descriptor.short_desc}
                  style={{ width: "40px", height: "40px" }}
                />
              )}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  marginRight: 3,
                }}
              >
                {temperature}
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "14px", color: "#555" }}>
                {dayName} {formattedDate}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default NextWeekWeather;
