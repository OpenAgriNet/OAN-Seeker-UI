import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// Import both sendQueryToBot and fetchWeather
import { sendQueryToBot, fetchWeather } from "../api/apiService";

// Helper to get ordinal suffix for dates (e.g., 7th, 1st, etc.)
const getOrdinalSuffix = (i) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
};

// Format a date string (YYYY-MM-DD) into "7th March 2025"
const formatDateOrdinal = (dateString) => {
  const date = new Date(dateString);
  const day = getOrdinalSuffix(date.getDate());
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Group forecast items by date (extracted from the "name" field)
const groupForecastByDate = (forecastItems) => {
  const grouped = {};
  forecastItems.forEach((item) => {
    // Expecting item.descriptor.name to be like "Forecast for 2025-03-07 03:00:00"
    const namePart = item.descriptor.name.split("Forecast for ")[1];
    const [datePart, timePart] = namePart.split(" ");
    if (!grouped[datePart]) {
      grouped[datePart] = [];
    }
    grouped[datePart].push({ time: timePart, item });
  });
  // Sort forecasts within each date by time
  for (let date in grouped) {
    grouped[date].sort((a, b) => a.time.localeCompare(b.time));
  }
  return grouped;
};

// Format the grouped forecast data into a nice multiline string with emojis
const formatForecastData = (forecastItems) => {
  const grouped = groupForecastByDate(forecastItems);
  let result = "";
  // Sort the dates
  const dates = Object.keys(grouped).sort();
  dates.forEach((date) => {
    result += `${formatDateOrdinal(date)}\n\n`;
    grouped[date].forEach((entry) => {
      const { time, item } = entry;
      // Format the time into a simpler format. E.g., "03:00:00" becomes "3 AM"
      const hour = parseInt(time.split(":")[0], 10);
      const formattedTime =
        hour === 0
          ? "12 AM"
          : hour === 12
          ? "12 PM"
          : hour < 12
          ? `${hour} AM`
          : `${hour - 12} PM`;

      // Extract forecast details from the tags if available
      const tags = item.tags && item.tags[0] && item.tags[0].list;
      let temperature = "N/A";
      let windSpeed = "N/A";
      let humidity = "N/A";
      if (tags) {
        const tempTag =
          tags.find((tag) => tag.descriptor.code === "temperature") ||
          tags.find((tag) => tag.descriptor.code === "min-temp"); // fallback
        const windTag = tags.find(
          (tag) => tag.descriptor.code === "wind-speed"
        );
        const humidityTag = tags.find(
          (tag) => tag.descriptor.code === "humidity"
        );
        if (tempTag) temperature = tempTag.value;
        if (windTag) windSpeed = windTag.value;
        if (humidityTag) humidity = humidityTag.value;
      }
      result += `Forecast data for: ${formattedTime}\n`;
      result += `1. Temperature: ${temperature} 🌡️\n`;
      result += `2. Wind Speed: ${windSpeed} 💨\n`;
      result += `3. Humidity: ${humidity} 💧\n\n`;
    });
    result += "\n";
  });
  return result;
};

const AiBot = () => {
  const languageMap = {
    English: "en",
    Hindi: "hi",
    Marathi: "mr",
  };

  const [messages, setMessages] = useState([
    {
      text: "Hi, I’m AgriNet, your trusted assistant for all your farming needs. Please select your preferred language to get started.",
      sender: "bot",
      options: ["English", "Hindi", "Marathi"],
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [userSubmitted, setUserSubmitted] = useState(false);
  // New state: store the complete weather data response so we can show forecasts later
  const [weatherData, setWeatherData] = useState(null);

  const messagesEndRef = useRef(null);

  // Animate the "Typing..." dots when loading
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTypingDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
    } else {
      setTypingDots("");
    }
    return () => clearInterval(interval);
  }, [loading]);

  // On initial load, show the welcome message with a typing delay (runs only once)
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      const originalMessage = messages[0];
      setMessages([{ text: "Typing", sender: "bot" }]);
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setMessages([originalMessage]);
        setUserSubmitted(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Always scroll to bottom whenever new messages are added
  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);
  const simulateTypingThenAddMessage = (newBotMessage, delay = 1500) => {
    return new Promise((resolve) => {
      setMessages((prev) => [...prev, { text: "Typing", sender: "bot" }]);
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        setMessages((prev) => [...prev, newBotMessage]);
        setUserSubmitted(true);
        resolve();
      }, delay);
    });
  };

  // Sends the user-typed query to your AI Bot
  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setUserSubmitted(true);
      const userQuery = input;
      setInput("");
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].text === "Typing") {
          return prev;
        }
        return [...prev, { text: "Typing", sender: "bot" }];
      });
      setLoading(true);
      await sendQueryToBot(
        userQuery,
        language,
        setMessages,
        setLoading,
        typingDots
      );
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].text === "Typing") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setLoading(false);
    }
  };

  // Handles a user clicking on one of the bot's "option" buttons
  const handleOptionClick = async (option) => {
    // Remove options from the last message
    setMessages((prev) => {
      const newMessages = [...prev];
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].options) {
          newMessages[i] = { ...newMessages[i], options: null };
          break;
        }
      }
      return newMessages;
    });
    setMessages((prev) => [...prev, { text: option, sender: "user" }]);
    setUserSubmitted(true);

    if (!language) {
      const selectedLangCode = languageMap[option] || "en";
      setLanguage(selectedLangCode);
      await simulateTypingThenAddMessage({
        text: "Please select the service you need help with",
        sender: "bot",
        options: ["Weather", "Government Schemes"],
      });
    } else if (option === "Government Schemes") {
      await simulateTypingThenAddMessage({
        text: "Ask me anything related to farming.",
        sender: "bot",
      });
    } else if (option === "Weather") {
      const selectedDistrict =
        sessionStorage.getItem("selectedDistrict") || "your location";
      await simulateTypingThenAddMessage({
        text: `I see you are interested in weather updates. Please confirm if this is your location: ${selectedDistrict}`,
        sender: "bot",
        options: [
          "Yes, this is my location",
          "No, I want to change my location",
        ],
      });
    } else if (option === "Yes, this is my location") {
      await simulateTypingThenAddMessage({
        text: "Great! Fetching the latest weather update for your area...",
        sender: "bot",
      });
      setTimeout(async () => {
        try {
          const selectedDistrict =
            sessionStorage.getItem("selectedDistrict") || "your location";
          const weatherItems = await fetchWeather(selectedDistrict);
          setWeatherData(weatherItems);
          if (weatherItems && weatherItems.length > 0) {
            const currentWeather = weatherItems[0];
            // Instead of just showing the short description,
            // we can build a more detailed message for the current weather.
            // Here we extract values from the tags (if available).
            const tags =
              currentWeather.tags &&
              currentWeather.tags[0] &&
              currentWeather.tags[0].list;
            const location = tags
              ? tags.find((tag) => tag.descriptor.code === "location")?.value
              : "N/A";
            const minTemp = tags
              ? tags.find((tag) => tag.descriptor.code === "min-temp")?.value
              : "N/A";
            const maxTemp = tags
              ? tags.find((tag) => tag.descriptor.code === "max-temp")?.value
              : "N/A";
            const humidity = tags
              ? tags.find((tag) => tag.descriptor.code === "humidity")?.value
              : "N/A";
            const windSpeed = tags
              ? tags.find((tag) => tag.descriptor.code === "wind-speed")?.value
              : "N/A";

            const currentWeatherMsg =
              `Current Weather for ${location}:\n` +
              `🌡️ Temperature: ${minTemp} (Min) / ${maxTemp} (Max)\n` +
              `💧 Humidity: ${humidity}\n` +
              `💨 Wind Speed: ${windSpeed}`;

            await simulateTypingThenAddMessage({
              text: currentWeatherMsg,
              sender: "bot",
            });

            // Then ask if the user wants a forecast
            await simulateTypingThenAddMessage({
              text: "Would you like to see a weather forecast for the next few days?",
              sender: "bot",
              options: [
                "Yes, show forecast for 5 days",
                "No, that’s all for now",
              ],
            });
          } else {
            await simulateTypingThenAddMessage({
              text: "Sorry, no weather data available for your location.",
              sender: "bot",
            });
          }
        } catch (error) {
          await simulateTypingThenAddMessage({
            text: "Sorry, there was an error fetching the weather data.",
            sender: "bot",
          });
        }
      }, 1500);
    } else if (option === "No, I want to change my location") {
      await simulateTypingThenAddMessage({
        text: "Sure! Please type in the new location you'd like to set.",
        sender: "bot",
      });
    }
    // Forecast options handling:
    else if (option === "Yes, show forecast for 5 days") {
      if (weatherData) {
        // Get all forecast items (assumed to be from index 1 onward)
        const forecastItems = weatherData.slice(1);
        // Group by date and then take the first 5 distinct dates
        const grouped = groupForecastByDate(forecastItems);
        const dates = Object.keys(grouped).sort();
        const first5Dates = dates.slice(0, 5);
        // Filter forecast items to only include those in the first 5 dates
        const filteredForecast = forecastItems.filter((item) => {
          const namePart = item.descriptor.name.split("Forecast for ")[1];
          const datePart = namePart.split(" ")[0];
          return first5Dates.includes(datePart);
        });
        const formattedForecast = formatForecastData(filteredForecast);
        await simulateTypingThenAddMessage({
          text: formattedForecast,
          sender: "bot",
        });
      } else {
        await simulateTypingThenAddMessage({
          text: "Weather data is not available. Please try again.",
          sender: "bot",
        });
      }
    }  else if (option === "No, that’s all for now") {
      await simulateTypingThenAddMessage({
        text: "Thank you so much for conversing with AgriNet. 🌾.",
        sender: "bot",
      });
    } else {
      await simulateTypingThenAddMessage({
        text: "I'm not sure how to handle that option yet.",
        sender: "bot",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: 2,
          backgroundColor: "#f5f5f5",
          fontWeight: "400",
          fontSize: "22px",
        }}
      >
        AI Chatbot
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          marginBottom: "160px",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.sender === "bot" ? "flex-start" : "flex-end",
            }}
          >
            {/* Chat Bubble */}
            <Box
              sx={{
                padding: 1.5,
                borderRadius: 2,
                marginBottom: msg.options ? 1 : 2,
                backgroundColor:
                  msg.sender === "bot"
                    ? "rgba(242, 248, 222, 1)"
                    : "rgba(240, 240, 240, 1)",
                alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                position: "relative",
                borderTopLeftRadius: msg.sender === "bot" ? 0 : 10,
                borderTopRightRadius: msg.sender === "bot" ? 10 : 0,
                paddingLeft: 2,
                paddingRight: 2,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-line",
                direction: "auto",
                textAlign: "start",
                display: "inline-block",
                maxWidth: "90%",
              }}
            >
              {/* Bubble "arrow" styling */}
              <Box
                sx={{
                  position: "absolute",
                  top: "0px",
                  left: msg.sender === "bot" ? "-10px" : "auto",
                  right: msg.sender === "user" ? "-10px" : "auto",
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth:
                    msg.sender === "bot"
                      ? "10px 10px 10px 0"
                      : "10px 0 10px 10px",
                  borderColor:
                    msg.sender === "bot"
                      ? "transparent rgba(242, 248, 222, 1) transparent transparent"
                      : "transparent transparent transparent rgba(240, 240, 240, 1)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  direction: "ltr",
                  textAlign: "left",
                }}
              >
                {msg.text === "Typing" ? `Typing ${typingDots}` : msg.text}
              </Typography>
            </Box>

            {/* Option Buttons */}
            {msg.sender === "bot" && msg.options && (
              <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                {msg.options.map((opt, idx) => (
                  <Button
                    key={idx}
                    variant="contained"
                    size="small"
                    onClick={() => handleOptionClick(opt)}
                    sx={{
                      border: "none",
                      backgroundColor: "#808080",
                      boxShadow: "none",
                      color: "white",
                      "&:hover": { backgroundColor: "#808080" },
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 2,
          borderTop: "1px solid #ccc",
          position: "fixed",
          bottom: "50px",
          backgroundColor: "white",
          zIndex: 1000,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#f8f8ff",
            borderRadius: "50px",
            padding: "5px 10px",
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your query"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading}
            sx={{
              backgroundColor: "black",
              color: "white",
              opacity: loading ? 0.5 : 1,
              "&:hover": { backgroundColor: "black" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AiBot;
