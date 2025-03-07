import React, { useState, useRef, useEffect, useContext } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendQueryToBot, fetchWeather } from "../api/apiService";
import { LocationContext } from "../context/LocationContext";

// ----- Extended responses dictionary (including new keys for welcome, feedback, etc.) -----
const responses = {
  en: {
    welcomeMessage: "Hi, I’m AgriNet, your trusted assistant for all your farming needs. Please select your preferred language to get started.",
    servicePrompt: "Please select the service you need help with",
    farmingPrompt: "Ask me anything related to farming.",
    weatherConfirm: (district) =>
      `I see you are interested in weather updates. Please confirm if this is your location: <strong>${district}</strong>`,
    weatherFetch: "Great! Fetching the latest weather update for your area...",
    forecastPrompt: "Would you like to see a weather forecast for the next few days?",
    noWeatherData: "Sorry, no weather data available for your location.",
    errorWeather: "Sorry, there was an error fetching the weather data.",
    changeLocation: "Please select your preferred location from the Header..",
    unknownOption: "I'm not sure how to handle that option yet.",
    thankYou: "Thank you so much for conversing with AgriNet. 🌾.",
    feedbackPrompt: "Let me know if you need anything else.",
    // Options
    optionWeather: "Weather",
    optionGovtSchemes: "Government Schemes",
    optionYesLocation: "Yes, this is my location",
    optionNoChangeLocation: "No, I want to change my location",
    optionYesForecast: "Yes, show forecast for 5 days",
    optionNoForecast: "No, that’s all for now",
    optionGiveFeedback: "Give Feedback",
    optionGoBack: "Go Back to Main Menu"
  },
  hi: {
    welcomeMessage: "नमस्ते, मैं एग्रीनेट हूं, आपकी कृषि आवश्यकताओं के लिए आपका विश्वसनीय सहायक। कृपया अपनी पसंदीदा भाषा चुनें।",
    servicePrompt: "कृपया बताएं कि आपको किस सेवा की आवश्यकता है।",
    farmingPrompt: "कृषि से संबंधित कोई भी सवाल पूछें।",
    weatherConfirm: (district) =>
      `मुझे दिख रहा है कि आप मौसम अपडेट्स में रुचि रखते हैं। कृपया पुष्टि करें कि क्या यह आपका स्थान है: <strong>${district}</strong>`,
    weatherFetch: "बहुत बढ़िया! आपके क्षेत्र का नवीनतम मौसम अपडेट प्राप्त किया जा रहा है...",
    forecastPrompt: "क्या आप आने वाले कुछ दिनों का मौसम पूर्वानुमान देखना चाहेंगे?",
    noWeatherData: "क्षमा करें, आपके स्थान के लिए कोई मौसम डेटा उपलब्ध नहीं है।",
    errorWeather: "क्षमा करें, मौसम डेटा प्राप्त करने में त्रुटि हुई।",
    changeLocation: "कृपया हेडर से अपना पसंदीदा स्थान चुनें।",
    unknownOption: "मुझे अभी तक यह विकल्प संभालने का तरीका नहीं पता है।",
    thankYou: "एग्रीनेट के साथ बातचीत करने के लिए आपका बहुत धन्यवाद।",
    feedbackPrompt: "अगर आपको कुछ और चाहिए तो बताएं।",
    // Options
    optionWeather: "मौसम",
    optionGovtSchemes: "सरकारी योजनाएँ",
    optionYesLocation: "हाँ, यही मेरा स्थान है",
    optionNoChangeLocation: "नहीं, मैं अपना स्थान बदलना चाहता हूँ",
    optionYesForecast: "हाँ, अगले 5 दिनों का पूर्वानुमान दिखाएँ",
    optionNoForecast: "नहीं, बस इतना ही",
    optionGiveFeedback: "प्रतिक्रिया दें",
    optionGoBack: "मुख्य मेनू पर वापस जाएँ"
  },
  mr: {
    welcomeMessage: "नमस्कार, मी एग्रीनेट आहे, तुमच्या शेतीसंबंधी गरजांसाठी तुमचा विश्वासू सहायक. कृपया तुमची प्राधान्यकृत भाषा निवडा.",
    servicePrompt: "कृपया आपल्याला कोणत्या सेवेमध्ये मदत हवी आहे ते निवडा.",
    farmingPrompt: "कृषीशी संबंधित काहीही प्रश्न विचारा.",
    weatherConfirm: (district) =>
      `मला दिसतेय की तुम्ही हवामानाच्या अपडेट्समध्ये रस घेत आहात. कृपया पुष्टी करा की हा तुमचा स्थान आहे: <strong>${district}</strong>`,
    weatherFetch: "खूप छान! तुमच्या भागाचे ताजे हवामान अपडेट मिळवत आहे...",
    forecastPrompt: "पुढील काही दिवसांचे हवामान पूर्वानुमान पाहायचे आहे का?",
    noWeatherData: "क्षमस्व, तुमच्या स्थानासाठी हवामान डेटा उपलब्ध नाही.",
    errorWeather: "क्षमस्व, हवामान डेटा मिळवण्यात त्रुटी आली आहे.",
    changeLocation: "कृपया हेडरमधून तुमचा आवडता स्थान निवडा.",
    unknownOption: "मला अजून कळलेलं नाही की हा पर्याय कसा हाताळायचा.",
    thankYou: "एग्रीनेटशी बोलल्याबद्दल तुमचे मनापासून आभार.",
    feedbackPrompt: "जर तुम्हाला आणखी काही हवे असल्यास कळवा.",
    // Options
    optionWeather: "हवामान",
    optionGovtSchemes: "सरकारी योजना",
    optionYesLocation: "होय, हेच माझं स्थान आहे",
    optionNoChangeLocation: "नाही, मला माझं स्थान बदलायचं आहे",
    optionYesForecast: "होय, पुढील 5 दिवसांचं पूर्वानुमान दाखवा",
    optionNoForecast: "नाही, सध्या इतकंच",
    optionGiveFeedback: "प्रतिक्रिया द्या",
    optionGoBack: "मुख्य मेनूमध्ये परत जा"
  }
};
// -----------------------------------------------------------------------------

// Weather labels for current weather display
const weatherLabels = {
  en: {
    currentWeatherFor: "Current Weather for",
    temperature: "Temperature",
    min: "Min",
    max: "Max",
    humidity: "Humidity",
    windSpeed: "Wind Speed"
  },
  hi: {
    currentWeatherFor: " का वर्तमान मौसम",
    temperature: "तापमान",
    min: "न्यूनतम",
    max: "अधिकतम",
    humidity: "नमी",
    windSpeed: "हवा की गति"
  },
  mr: {
    currentWeatherFor: " साठी सध्याचे हवामान",
    temperature: "तापमान",
    min: "किमान",
    max: "कमाल",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याची गती"
  }
};

// Helper function to round numeric values while preserving units (like °C, m/s)
const formatValue = (val) => {
  if (typeof val === "string") {
    const match = val.match(/^([\d.]+)(.*)$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[2] || "";
      return Math.round(num) + unit;
    }
  }
  const num = parseFloat(val);
  return isNaN(num) ? val : Math.round(num);
};

// Format a date string into "7th March 2025"
const formatDateOrdinal = (dateString) => {
  const date = new Date(dateString);
  const day = formatValue(date.getDate());
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Group forecast items by date
const groupForecastByDate = (forecastItems) => {
  const grouped = {};
  forecastItems.forEach((item) => {
    const namePart = item.descriptor.name.split("Forecast for ")[1];
    const [datePart, timePart] = namePart.split(" ");
    if (!grouped[datePart]) {
      grouped[datePart] = [];
    }
    grouped[datePart].push({ time: timePart, item });
  });
  for (let date in grouped) {
    grouped[date].sort((a, b) => a.time.localeCompare(b.time));
  }
  return grouped;
};

// Updated formatForecastData to accept a language parameter, add icons, bold headers, and round numbers
const formatForecastData = (forecastItems, lang = "en") => {
  const forecastLabels = {
    en: {
      forecastFor: "Forecast data for",
      temperature: "Temperature",
      windSpeed: "Wind Speed",
      humidity: "Humidity"
    },
    hi: {
      forecastFor: " के लिए मौसम पूर्वानुमान",
      temperature: "तापमान",
      windSpeed: "हवा की गति",
      humidity: "नमी"
    },
    mr: {
      forecastFor: " साठी हवामान पूर्वानुमान",
      temperature: "तापमान",
      windSpeed: "वाऱ्याची गती",
      humidity: "आर्द्रता"
    }
  };
  const labels = forecastLabels[lang] || forecastLabels.en;
  const grouped = groupForecastByDate(forecastItems);
  let result = "";
  const dates = Object.keys(grouped).sort();
  dates.forEach((date) => {
    result += `<strong>${formatDateOrdinal(date)}</strong>\n\n`;
    grouped[date].forEach((entry) => {
      const { time, item } = entry;
      const hour = parseInt(time.split(":")[0], 10);
      const formattedTime =
        hour === 0
          ? "12 AM"
          : hour === 12
          ? "12 PM"
          : hour < 12
          ? `${hour} AM`
          : `${hour - 12} PM`;
      const forecastHeader =
        lang === "en"
          ? `${labels.forecastFor} ${formattedTime}:`
          : `${formattedTime}${labels.forecastFor}:`;
      // Bold forecast header and add a calendar icon
      result += `<strong>📅 ${forecastHeader}</strong>\n`;
      const tags = item.tags && item.tags[0] && item.tags[0].list;
      let temperature = "N/A",
        windSpeed = "N/A",
        humidity = "N/A";
      if (tags) {
        const tempTag =
          tags.find((tag) => tag.descriptor.code === "temperature") ||
          tags.find((tag) => tag.descriptor.code === "min-temp");
        const windTag = tags.find((tag) => tag.descriptor.code === "wind-speed");
        const humidityTag = tags.find((tag) => tag.descriptor.code === "humidity");
        if (tempTag) temperature = formatValue(tempTag.value);
        if (windTag) windSpeed = formatValue(windTag.value);
        if (humidityTag) humidity = formatValue(humidityTag.value);
      }
      result += `1. 🌡️ ${labels.temperature}: ${temperature}\n`;
      result += `2. 💨 ${labels.windSpeed}: ${windSpeed}\n`;
      result += `3. 💧 ${labels.humidity}: ${humidity}\n\n`;
    });
    result += "\n";
  });
  return result;
};

const AiBot = () => {
  // Consume location context for updated location values
  const { location } = useContext(LocationContext);
  // languageMap maps the initial option text to language codes
  const languageMap = {
    English: "en",
    "हिंदी": "hi",
    "मराठी": "mr"
  };

  // New state to track the selected service
  const [selectedService, setSelectedService] = useState("");
  
  const [messages, setMessages] = useState([
    {
      text: responses.en.welcomeMessage,
      sender: "bot",
      options: ["English", "हिंदी", "मराठी"],
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [userSubmitted, setUserSubmitted] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [awaitLocationChange, setAwaitLocationChange] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(location.selectedDistrict || "");

  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);

  useEffect(() => {
    if (
      awaitLocationChange &&
      location.selectedDistrict &&
      location.selectedDistrict !== confirmedLocation
    ) {
      setMessages((prev) => [
        ...prev,
        { text: location.selectedDistrict, sender: "user" },
      ]);
      (async () => {
        await simulateTypingThenAddMessage({
          text: responses[language || "en"].weatherConfirm(location.selectedDistrict),
          sender: "bot",
          options: [
            responses[language || "en"].optionYesLocation,
            responses[language || "en"].optionNoChangeLocation
          ],
        });
      })();
      setConfirmedLocation(location.selectedDistrict);
      setAwaitLocationChange(false);
    }
  }, [awaitLocationChange, location.selectedDistrict, confirmedLocation, language]);

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
      await sendQueryToBot(userQuery, language, setMessages, setLoading, typingDots);
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].text === "Typing") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setLoading(false);
    }
  };

  const handleOptionClick = async (option) => {
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
        text: responses[selectedLangCode].servicePrompt,
        sender: "bot",
        options: [
          responses[selectedLangCode].optionWeather,
          responses[selectedLangCode].optionGovtSchemes
        ],
      });
    } else if (option === responses[language].optionGovtSchemes) {
      setSelectedService("govtSchemes");
      await simulateTypingThenAddMessage({
        text: responses[language].farmingPrompt,
        sender: "bot",
      });
    } else if (option === responses[language].optionWeather) {
      setSelectedService("weather");
      const selectedDistrict = location.selectedDistrict || "your location";
      await simulateTypingThenAddMessage({
        text: responses[language].weatherConfirm(selectedDistrict),
        sender: "bot",
        options: [
          responses[language].optionYesLocation,
          responses[language].optionNoChangeLocation
        ],
      });
    } else if (option === responses[language].optionYesLocation) {
      setConfirmedLocation(location.selectedDistrict);
      await simulateTypingThenAddMessage({
        text: responses[language].weatherFetch,
        sender: "bot",
      });
      setTimeout(async () => {
        try {
          const selectedDistrict = location.selectedDistrict || "your location";
          const weatherItems = await fetchWeather(selectedDistrict);
          setWeatherData(weatherItems);
          if (weatherItems && weatherItems.length > 0) {
            const currentWeather = weatherItems[0];
            const tags =
              currentWeather.tags &&
              currentWeather.tags[0] &&
              currentWeather.tags[0].list;
            const loc = tags
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
            const labels = weatherLabels[language] || weatherLabels.en;
            const weatherMsgPrefix =
              language === "en"
                ? `<strong>${labels.currentWeatherFor} ${loc}:</strong>`
                : `<strong>${loc}${labels.currentWeatherFor}:</strong>`;
            const currentWeatherMsg =
              `${weatherMsgPrefix}\n` +
              `🌡️ ${labels.temperature}: ${formatValue(minTemp)} (${labels.min}) / ${formatValue(maxTemp)} (${labels.max})\n` +
              `💧 ${labels.humidity}: ${formatValue(humidity)}\n` +
              `💨 ${labels.windSpeed}: ${formatValue(windSpeed)}`;
            await simulateTypingThenAddMessage({
              text: currentWeatherMsg,
              sender: "bot",
            });
            await simulateTypingThenAddMessage({
              text: responses[language].forecastPrompt,
              sender: "bot",
              options: [
                responses[language].optionYesForecast,
                responses[language].optionNoForecast
              ],
            });
          } else {
            await simulateTypingThenAddMessage({
              text: responses[language].noWeatherData,
              sender: "bot",
            });
          }
        } catch (error) {
          await simulateTypingThenAddMessage({
            text: responses[language].errorWeather,
            sender: "bot",
          });
        }
      }, 1500);
    } else if (option === responses[language].optionNoChangeLocation) {
      await simulateTypingThenAddMessage({
        text: responses[language].changeLocation,
        sender: "bot",
      });
      setAwaitLocationChange(true);
    } else if (option === responses[language].optionYesForecast) {
      if (weatherData) {
        const forecastItems = weatherData.slice(1);
        const dates = Object.keys(groupForecastByDate(forecastItems)).sort();
        const first5Dates = dates.slice(0, 5);
        const filteredForecast = forecastItems.filter((item) => {
          const namePart = item.descriptor.name.split("Forecast for ")[1];
          const datePart = namePart.split(" ")[0];
          return first5Dates.includes(datePart);
        });
        const formattedForecast = formatForecastData(filteredForecast, language);
        await simulateTypingThenAddMessage({
          text: formattedForecast,
          sender: "bot",
        });
        // NEW: After forecast delivery, prompt feedback message.
        await simulateTypingThenAddMessage({
          text: responses[language].feedbackPrompt,
          sender: "bot",
          options: [
            responses[language].optionGiveFeedback,
            responses[language].optionGoBack
          ],
        });
      } else {
        await simulateTypingThenAddMessage({
          text: responses[language].noWeatherData,
          sender: "bot",
        });
      }
    } else if (option === responses[language].optionNoForecast) {
      // When user selects "No, that's all for now", display thank you and feedback prompt
      await simulateTypingThenAddMessage({
        text: responses[language].thankYou,
        sender: "bot",
      });
      await simulateTypingThenAddMessage({
        text: responses[language].feedbackPrompt,
        sender: "bot",
        options: [
          responses[language].optionGiveFeedback,
          responses[language].optionGoBack
        ],
      });
    } else if (option === responses[language].optionGiveFeedback) {
      await simulateTypingThenAddMessage({
        text: "Thank you for your feedback. How else can I assist you?",
        sender: "bot",
      });
      await simulateTypingThenAddMessage({
        text: responses[language].feedbackPrompt,
        sender: "bot",
        options: [
          responses[language].optionGiveFeedback,
          responses[language].optionGoBack
        ],
      });
    } else if (option === responses[language].optionGoBack) {
      // Reset conversation: show welcome message with language options
      setSelectedService("");
      setWeatherData(null);
      setLanguage("");
      await simulateTypingThenAddMessage({
        text: responses["en"].welcomeMessage, // Default welcome in English; update as needed.
        sender: "bot",
        options: ["English", "हिंदी", "मराठी"]
      });
    } else {
      await simulateTypingThenAddMessage({
        text: responses[language].unknownOption,
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
        AgriNet Chatbot
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
                dangerouslySetInnerHTML={{
                  __html: msg.text === "Typing" ? `Typing ${typingDots}` : msg.text,
                }}
              />
            </Box>
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
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: "500",
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
            disabled={selectedService === "weather"}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || selectedService === "weather"}
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
