import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  SwipeableDrawer,
  IconButton,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Recharts imports
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/**
 * Helper to extract date/time from an item’s tags[0].descriptor.code
 * which might be "2025-03-05" or "2025-03-05 06:00:00"
 */
function parseDateTimeFromItem(item) {
  const code = item?.tags?.[0]?.descriptor?.code; 
  if (!code) {
    return { date: null, time: null };
  }
  // Split into date and time if present
  const [dateStr, timeStr] = code.split(" ");
  return {
    date: dateStr,              // e.g. "2025-03-05"
    time: timeStr || "00:00:00" // e.g. "06:00:00" or fallback
  };
}

/**
 * Props:
 * - open: boolean (controls opening/closing of the drawer)
 * - onClose: function to close the drawer
 * - currentForecast: an object representing the current forecast (like one item from your API)
 * - allForecastData: an array of all forecast items (like the 3-hour increments) to build the chart
 */
const CurrentWeatherPopup = ({ open, onClose, currentForecast, allForecastData }) => {
  // We allow the user to pick which metric to display in the chart
  const [selectedMetric, setSelectedMetric] = useState("temperature");

  // If no forecast data is passed, just render nothing
  if (!currentForecast) {
    return null;
  }

  /**
   * Build the chart data using the date from currentForecast
   * and matching items in allForecastData.
   */
  const chartData = useMemo(() => {
    if (!allForecastData || !currentForecast) return [];

    // Extract the date from the current forecast's tags
    const { date: currentDateStr } = parseDateTimeFromItem(currentForecast);
    if (!currentDateStr) return [];

    // 1) Filter forecasts for the same date
    const dailyForecasts = allForecastData.filter((item) => {
      const { date } = parseDateTimeFromItem(item);
      return date === currentDateStr;
    });

    // 2) Convert each forecast item into chart-friendly data
    const dataForChart = dailyForecasts.map((item) => {
      // Extract date/time from the item
      const { time } = parseDateTimeFromItem(item);

      // Find the relevant tags
      const tempTag = item.tags?.[0]?.list?.find((t) => t.descriptor.code === "temperature");
      const humTag = item.tags?.[0]?.list?.find((t) => t.descriptor.code === "humidity");
      const windTag = item.tags?.[0]?.list?.find((t) => t.descriptor.code === "wind-speed");

      // Convert strings like "30.4°C" or "21%" to float
      const temperatureValue = tempTag ? parseFloat(tempTag.value) : null;
      const humidityValue = humTag ? parseFloat(humTag.value) : null;
      const windValue = windTag ? parseFloat(windTag.value) : null;

      // Keep only "HH:MM" (first 5 chars of "HH:MM:SS")
      const hourMinute = time.slice(0, 5);

      return {
        time: hourMinute,
        temperature: temperatureValue,
        humidity: humidityValue,
        wind: windValue,
      };
    });

    // 3) Sort by hour (optional)
    dataForChart.sort((a, b) => {
      const aHour = parseInt(a.time.split(":")[0], 10);
      const bHour = parseInt(b.time.split(":")[0], 10);
      return aHour - bHour;
    });

    return dataForChart;
  }, [allForecastData, currentForecast]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
      }}
    >
      <Box
        p={2}
        sx={{
          minHeight: "60vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close Button */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Title & Description */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          {currentForecast.descriptor?.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {currentForecast.descriptor?.long_desc}
        </Typography>

        {/* Metric Dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Metric:
          </Typography>
          <Select
            size="small"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <MenuItem value="temperature">Temperature</MenuItem>
            <MenuItem value="humidity">Humidity</MenuItem>
            <MenuItem value="wind">Wind Speed</MenuItem>
          </Select>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Chart Section */}
        <Box sx={{ flex: 1, mb: 2 }}>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#004d8a"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No data available for this date.
            </Typography>
          )}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default CurrentWeatherPopup;
