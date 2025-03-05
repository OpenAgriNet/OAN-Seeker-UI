import React, { useState, useMemo, useEffect } from "react";
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
// Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Helper function to add "st", "nd", "rd", "th"
function getDaySuffix(day) {
  // handle special case for 11th, 12th, 13th
  if (day % 100 >= 11 && day % 100 <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const NextWeekWeatherDetailPopup = ({
  open,
  onClose,
  forecast,
  allForecastData,
  initialDate, // date from NextWeekWeather
}) => {
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const [selectedDate, setSelectedDate] = useState("");

  // For clarity, let's define units for each metric
  const unitMapping = {
    temperature: "°C",
    humidity: "%",
    wind: "m/s",
  };

  // Gather unique dates from allForecastData
  const dateList = useMemo(() => {
    if (!allForecastData) return [];
    const uniqueDates = new Set();
    allForecastData.forEach((item) => {
      const nameParts = item.descriptor?.name?.split(" ");
      // e.g. "Forecast for 2025-03-06 06:00:00" => nameParts[2] = "2025-03-06"
      if (nameParts?.length >= 4 && nameParts[2]) {
        uniqueDates.add(nameParts[2]);
      }
    });
    return [...uniqueDates].sort();
  }, [allForecastData]);

  // When popup opens or initialDate changes, set the selected date
  useEffect(() => {
    if (initialDate && dateList.includes(initialDate)) {
      setSelectedDate(initialDate);
    } else if (dateList.length > 0) {
      setSelectedDate(dateList[0]);
    }
  }, [initialDate, dateList]);

  // Build chart data & daily summary for the selected date
  const { chartData, dailySummary } = useMemo(() => {
    if (!allForecastData || !selectedDate) {
      return { chartData: [], dailySummary: null };
    }

    // 1) Filter out forecasts for the selected day
    const dailyForecasts = allForecastData.filter((item) => {
      const parts = item.descriptor?.name?.split(" ");
      return parts?.[2] === selectedDate;
    });

    // 2) Build chart data from these forecasts
    const dataForChart = dailyForecasts.map((item) => {
      const nameParts = item.descriptor.name.split(" ");
      // e.g. nameParts[3] = "06:00:00"
      const timeStr = nameParts[3] || "";
      const hourMinute = timeStr.slice(0, 5); // "06:00"

      const tempTag = item.tags?.[0]?.list?.find(
        (t) => t.descriptor.code === "temperature"
      );
      const humTag = item.tags?.[0]?.list?.find(
        (t) => t.descriptor.code === "humidity"
      );
      const windTag = item.tags?.[0]?.list?.find(
        (t) => t.descriptor.code === "wind-speed"
      );

      const temperatureValue = tempTag ? parseFloat(tempTag.value) : null;
      const humidityValue = humTag ? parseFloat(humTag.value) : null;
      const windValue = windTag ? parseFloat(windTag.value) : null;

      return {
        time: hourMinute,
        temperature: temperatureValue,
        humidity: humidityValue,
        wind: windValue,
      };
    });

    // Sort by hour ascending
    dataForChart.sort((a, b) => {
      const aHour = parseInt(a.time.split(":")[0], 10);
      const bHour = parseInt(b.time.split(":")[0], 10);
      return aHour - bHour;
    });

    // 3) Compute daily summary (min/max temp, min/max humidity, max wind, etc.)
    if (dataForChart.length === 0) {
      return { chartData: [], dailySummary: null };
    }

    let minTemp = Infinity,
      maxTemp = -Infinity,
      minHum = Infinity,
      maxHum = -Infinity,
      maxWind = -Infinity;

    dataForChart.forEach((d) => {
      // Temperature
      if (d.temperature !== null) {
        if (d.temperature < minTemp) minTemp = d.temperature;
        if (d.temperature > maxTemp) maxTemp = d.temperature;
      }
      // Humidity
      if (d.humidity !== null) {
        if (d.humidity < minHum) minHum = d.humidity;
        if (d.humidity > maxHum) maxHum = d.humidity;
      }
      // Wind
      if (d.wind !== null) {
        if (d.wind > maxWind) maxWind = d.wind;
      }
    });

    // Format date to a nice readable format: e.g. "Friday, 7th March 2025"
    const dateObj = new Date(selectedDate);
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const monthName = dateObj.toLocaleDateString("en-US", { month: "long" });
    const day = dateObj.getDate();
    const suffix = getDaySuffix(day);
    const year = dateObj.getFullYear();

    const readableDate = `${weekday}, ${day}${suffix} ${monthName} ${year}`;

    // Build a more readable summary (multiple lines for clarity)
    const summary = {
      readableDate,
      minTemp: minTemp.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      minHum,
      maxHum,
      maxWind: maxWind.toFixed(1),
    };

    return { chartData: dataForChart, dailySummary: summary };
  }, [allForecastData, selectedDate]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        // This targets the Paper component inside the drawer
        "& .MuiPaper-root": {
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
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        {/* Close Button */}
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Calendar / Date Row */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            mb: 2,
          }}
        >
          {dateList.map((dateStr) => {
            const dateObj = new Date(dateStr);
            const dayName = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const monthDay = dateObj.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });
            const isActive = dateStr === selectedDate;

            return (
              <Box
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                sx={{
                  cursor: "pointer",
                  minWidth: 70,
                  textAlign: "center",
                  borderRadius: 2,
                  p: 1,
                  backgroundColor: isActive ? "#004d8a" : "#f5f5f5",
                  color: isActive ? "#fff" : "#333",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {dayName}
                </Typography>
                <Typography variant="body2">{monthDay}</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Metric Selector */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 2 }}
        >
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  tickFormatter={(value) =>
                    `${value} ${unitMapping[selectedMetric]}`
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} ${unitMapping[selectedMetric]}`,
                    name,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#004d8a"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No data available for this date.
            </Typography>
          )}
        </Box>

        {/* Farmer-Friendly Daily Summary */}
        {dailySummary && (
          <Box
            sx={{
              background:
                "linear-gradient(171.86deg, #CCE1FD -107.4%, #FAFBFE 104.96%)",
              p: 3,
              borderRadius: 5,
            }}
          >
            <Typography variant="body1">
              <Typography sx={{ mb: 1, fontWeight: 600 }}>
                Forecast for {dailySummary.readableDate}
              </Typography>
              <p>
                {" "}
                <strong>Temperature:</strong> {dailySummary.minTemp}°C –{" "}
                {dailySummary.maxTemp}°C.{" "}
              </p>
              <p>
                {" "}
                <strong>Humidity: </strong>
                {dailySummary.minHum}% – {dailySummary.maxHum}%.
              </p>
              <p>
                <strong>Wind Speed:</strong> up to {dailySummary.maxWind} m/s.
              </p>
            </Typography>
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );
};

export default NextWeekWeatherDetailPopup;
