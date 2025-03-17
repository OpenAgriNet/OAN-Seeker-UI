import React, { useState, useRef, useEffect, useContext } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendQueryToBot, fetchWeather } from "../api/apiService";
import { LocationContext } from "../context/LocationContext";
import { LanguageContext } from "../context/LanguageContext";

// Extended responses dictionary
const responses = {
  en: {
    welcomeMessage: "Hi, I’m AgriNet, your trusted assistant.",
    confirmLanguage: (langText) =>
      `I see your preferred language is <strong>${langText}</strong>.<br/>Please confirm if this is your language?`,
    servicePrompt: "Please select the service you need help with",
    optionYesLang: "Yes, this is my Language",
    optionNoLang: "No, I want to change my language",
    changeLanguage: "Please select your preferred language from the Header..",

    // The rest of your existing keys:
    farmingPrompt: "Ask me anything related to farming.",
    weatherConfirm: (district) =>
      `I see you are interested in weather updates. Please confirm if this is your location: <strong>${district}</strong>`,
    weatherFetch: "Great! Fetching the latest weather update for your area...",
    forecastPrompt: "Would you like to see a weather forecast for the next few days?",
    noWeatherData: "Sorry, no weather data available for your location.",
    errorWeather: "Sorry, there was an error fetching the weather data.",
    changeLocation: "Please select your preferred location from the Header..",
    unknownOption: "I'm not sure how to handle that option yet.",
    thankYou: "Thank you so much for conversing with AgriNet 🌾",
    feedbackPrompt: "Let me know if you need anything else.",
    govtFeedbackPrompt:
      "Let me know if you need anything else, or to change services or language click on below option, otherwise continue asking queries.",
    optionWeather: "Weather",
    optionGovtSchemes: "Government Schemes",
    optionYesLocation: "Yes, this is my location",
    optionNoChangeLocation: "No, I want to change my location",
    optionYesForecast: "Yes, show forecast for 5 days",
    optionNoForecast: "No, that’s all for now",
    optionGoBack: "Go Back to Main Menu",
  },

  hi: {
    welcomeMessage: "नमस्ते, मैं एग्रीनेट हूं, आपकी कृषि आवश्यकताओं के लिए आपका विश्वसनीय सहायक।",
    confirmLanguage: (langText) =>
      `मैं देख रहा हूँ कि आपकी पसंदीदा भाषा <strong>${langText}</strong> है।<br/>क्या यह आपकी भाषा है?`,
    servicePrompt: "कृपया बताएं कि आपको किस सेवा की आवश्यकता है।",
    optionYesLang: "हाँ, यही मेरी भाषा है",
    optionNoLang: "नहीं, मैं अपनी भाषा बदलना चाहता हूँ",
    changeLanguage: "कृपया हेडर से अपनी पसंदीदा भाषा चुनें..",

    // The rest of your existing keys:
    farmingPrompt: "कृषि से संबंधित कोई भी सवाल पूछें।",
    weatherConfirm: (district) =>
      `मुझे दिख रहा है कि आप मौसम अपडेट्स में रुचि रखते हैं। कृपया पुष्टि करें कि क्या यह आपका स्थान है: <strong>${district}</strong>`,
    weatherFetch: "बहुत बढ़िया! आपके क्षेत्र का नवीनतम मौसम अपडेट प्राप्त किया जा रहा है...",
    forecastPrompt: "क्या आप आने वाले कुछ दिनों का मौसम पूर्वानुमान देखना चाहेंगे?",
    noWeatherData: "क्षमा करें, आपके स्थान के लिए कोई मौसम डेटा उपलब्ध नहीं है।",
    errorWeather: "क्षमा करें, मौसम डेटा प्राप्त करने में त्रुटि हुई।",
    changeLocation: "कृपया हेडर से अपना पसंदीदा स्थान चुनें।",
    unknownOption: "मुझे अभी तक यह विकल्प संभालने का तरीका नहीं पता है।",
    thankYou: "एग्रीनेट के साथ बातचीत करने के लिए आपका बहुत धन्यवाद। 🌾",
    feedbackPrompt: "अगर आपको कुछ और चाहिए तो बताएं।",
    govtFeedbackPrompt:
      "क्या आपको और मदद चाहिए या सेवा या भाषा बदलनी है? नीचे दिए गए बटन पर क्लिक करें, या अपने सवाल पूछते रहें।",
    optionWeather: "मौसम",
    optionGovtSchemes: "सरकारी योजनाएँ",
    optionYesLocation: "हाँ, यही मेरा स्थान है",
    optionNoChangeLocation: "नहीं, मैं अपना स्थान बदलना चाहता हूँ",
    optionYesForecast: "हाँ, अगले 5 दिनों का पूर्वानुमान दिखाएँ",
    optionNoForecast: "नहीं, बस इतना ही",
    optionGoBack: "मुख्य मेनू पर वापस जाएँ",
  },

  mr: {
    welcomeMessage: "नमस्कार, मी एग्रीनेट आहे, तुमच्या शेतीसंबंधी गरजांसाठी तुमचा विश्वासू सहायक.",
    confirmLanguage: (langText) =>
      `मला दिसते की तुमची आवडती भाषा <strong>${langText}</strong> आहे.<br/>कृपया पुष्टी करा की ही तुमची भाषा आहे का?`,
    servicePrompt: "कृपया तुम्हाला कोणत्या सेवेमध्ये मदत हवी आहे ते निवडा.",
    optionYesLang: "होय, ही माझी भाषा आहे",
    optionNoLang: "नाही, मला माझी भाषा बदलायची आहे",
    changeLanguage: "कृपया हेडरमधून तुमची आवडती भाषा निवडा..",

    // The rest of your existing keys:
    farmingPrompt: "कृषीशी संबंधित काहीही प्रश्न विचारा.",
    weatherConfirm: (district) =>
      `मला दिसतेय की तुम्ही हवामानाच्या अपडेट्समध्ये रस घेत आहात. कृपया पुष्टी करा की हा तुमचा स्थान आहे: <strong>${district}</strong>`,
    weatherFetch: "खूप छान! तुमच्या भागाचे ताजे हवामान अपडेट मिळवत आहे...",
    forecastPrompt: "पुढील काही दिवसांचे हवामान पूर्वानुमान पाहायचे आहे का?",
    noWeatherData: "क्षमस्व, तुमच्या स्थानासाठी हवामान डेटा उपलब्ध नाही.",
    errorWeather: "क्षमस्व, हवामान डेटा मिळवण्यात त्रुटी आली आहे.",
    changeLocation: "कृपया हेडरमधून तुमचा आवडता स्थान निवडा.",
    unknownOption: "मला अजून कळलेलं नाही की हा पर्याय कसा हाताळायचा.",
    thankYou: "एग्रीनेटशी बोलल्याबद्दल तुमचे मनापासून आभार 🌾",
    feedbackPrompt: "जर तुम्हाला आणखी काही हवे असल्यास कळवा.",
    govtFeedbackPrompt:
      "आपल्याला अधिक मदतीची गरज आहे का किंवा सेवा/भाषा बदलायची आहे का? खालील बटणावर टॅप करा किंवा आपले प्रश्न विचारत रहा.",
    optionWeather: "हवामान",
    optionGovtSchemes: "सरकारी योजना",
    optionYesLocation: "होय, हेच माझं स्थान आहे",
    optionNoChangeLocation: "नाही, मला माझं स्थान बदलायचं आहे",
    optionYesForecast: "होय, पुढील 5 दिवसांचं पूर्वानुमान दाखवा",
    optionNoForecast: "नाही, सध्या इतकंच",
    optionGoBack: "मुख्य मेनूमध्ये परत जा",
  },
};

// Convert language code => display text
function getLangDisplay(langCode) {
  if (langCode === "hi") return "हिंदी";
  if (langCode === "mr") return "मराठी";
  return "English";
}

// Return the initial "confirm your language" message
function getInitialLanguageConfirmation(langCode) {
  const r = responses[langCode] || responses.en;
  const display = getLangDisplay(langCode);
  return {
    text: `${r.welcomeMessage}<br/>${r.confirmLanguage(display)}`,
    sender: "bot",
    options: [r.optionYesLang, r.optionNoLang],
  };
}

// Decide the initial bot message
function getInitialBotMessage() {
  const storedLang = sessionStorage.getItem("language");
  if (!storedLang) {
    // If no stored language, default to "en"
    sessionStorage.setItem("language", "en");
    return getInitialLanguageConfirmation("en");
  } else {
    // Show the "confirm language" message in the stored language
    return getInitialLanguageConfirmation(storedLang);
  }
}

// Weather label details
const weatherLabels = {
  en: {
    currentWeatherFor: "Current Weather for",
    temperature: "Temperature",
    min: "Min",
    max: "Max",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
  },
  hi: {
    currentWeatherFor: " का वर्तमान मौसम",
    temperature: "तापमान",
    min: "न्यूनतम",
    max: "अधिकतम",
    humidity: "नमी",
    windSpeed: "हवा की गति",
  },
  mr: {
    currentWeatherFor: " साठी सध्याचे हवामान",
    temperature: "तापमान",
    min: "किमान",
    max: "कमाल",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याची गती",
  },
};

function formatValue(val) {
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
}

function formatDateOrdinal(dateString) {
  const date = new Date(dateString);
  const day = formatValue(date.getDate());
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function groupForecastByDate(forecastItems) {
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
}

function formatForecastData(forecastItems, lang = "en") {
  const forecastLabels = {
    en: {
      forecastFor: "Forecast data for",
      temperature: "Temperature",
      windSpeed: "Wind Speed",
      humidity: "Humidity",
    },
    hi: {
      forecastFor: " के लिए मौसम पूर्वानुमान",
      temperature: "तापमान",
      windSpeed: "हवा की गति",
      humidity: "नमी",
    },
    mr: {
      forecastFor: " साठी हवामान पूर्वानुमान",
      temperature: "तापमान",
      windSpeed: "वाऱ्याची गती",
      humidity: "आर्द्रता",
    },
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
}

function AiBot() {
  const { location } = useContext(LocationContext);
  const { language, updateLanguage, headerChange } = useContext(LanguageContext);

  const [confirmedLang, setConfirmedLang] = useState(language);
  const [selectedService, setSelectedService] = useState("");

  const [messages, setMessages] = useState(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (stored) return JSON.parse(stored);
    return [getInitialBotMessage()];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const [userSubmitted, setUserSubmitted] = useState(false);

  // Weather
  const [weatherData, setWeatherData] = useState(null);

  // Location
  const [awaitLocationChange, setAwaitLocationChange] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(location.selectedDistrict || "");

  // If user is asked to pick language from the header
  const [awaitLanguageChange, setAwaitLanguageChange] = useState(false);

  const messagesEndRef = useRef(null);

  // Save chat history
  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // "Typing..." effect
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

  // Show "Typing..." for the initial message
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === "bot") {
      const original = messages[0];
      setMessages([{ text: "Typing", sender: "bot" }]);
      setLoading(true);
      const t = setTimeout(() => {
        setLoading(false);
        setMessages([original]);
        setUserSubmitted(true);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);

  // If user changes location from the header
  useEffect(() => {
    if (
      awaitLocationChange &&
      location.selectedDistrict &&
      location.selectedDistrict !== confirmedLocation
    ) {
      setMessages((prev) => [...prev, { text: location.selectedDistrict, sender: "user" }]);
      (async () => {
        const r = responses[language] || responses.en;
        await simulateTypingThenAddMessage({
          text: r.weatherConfirm(location.selectedDistrict),
          sender: "bot",
          options: [r.optionYesLocation, r.optionNoChangeLocation],
        });
      })();
      setConfirmedLocation(location.selectedDistrict);
      setAwaitLocationChange(false);
    }
  }, [awaitLocationChange, location.selectedDistrict, confirmedLocation, language]);

  // If user changes language from the header:
  // Show user-side message with just the new language name
  // Then show the confirm-language bot message with typing effect
  useEffect(() => {
    if (headerChange && language !== confirmedLang) {
      (async () => {
        // 1) Add a user-side message with the new language name
        setMessages((prev) => [
          ...prev,
          { text: getLangDisplay(language), sender: "user" },
        ]);
        setUserSubmitted(true);

        // 2) Then show the bot "confirm language" with typing effect
        await simulateTypingThenAddMessage(getInitialLanguageConfirmation(language));
        setConfirmedLang(language);
      })();
    }
  }, [headerChange, language, confirmedLang]);

  function simulateTypingThenAddMessage(newBotMessage, delay = 1500) {
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
  }

  // Handle user text input
  async function handleSend() {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setUserSubmitted(true);
      const userQuery = input;
      setInput("");

      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].text === "Typing") return prev;
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

      // If user is in govtSchemes
      const r = responses[language] || responses.en;
      if (selectedService === "govtSchemes") {
        await simulateTypingThenAddMessage({
          text: r.govtFeedbackPrompt,
          sender: "bot",
          options: [r.optionGoBack],
        });
      }
    }
  }

  // Handle user clicking a bot button
  async function handleOptionClick(option) {
    // Remove old options
    setMessages((prev) => {
      const newMsgs = [...prev];
      for (let i = newMsgs.length - 1; i >= 0; i--) {
        if (newMsgs[i].options) {
          newMsgs[i] = { ...newMsgs[i], options: null };
          break;
        }
      }
      return newMsgs;
    });

    setMessages((prev) => [...prev, { text: option, sender: "user" }]);
    setUserSubmitted(true);

    const r = responses[language] || responses.en;

    // If user clicks "Yes, this is my Language"
    if (option === r.optionYesLang) {
      // Show the "servicePrompt" + 2 service options
      await simulateTypingThenAddMessage({
        text: r.servicePrompt,
        sender: "bot",
        options: [r.optionWeather, r.optionGovtSchemes],
      });
      return;
    }

    // If user clicks "No, I want to change my language"
    if (option === r.optionNoLang) {
      await simulateTypingThenAddMessage({
        text: r.changeLanguage,
        sender: "bot",
      });
      setAwaitLanguageChange(true);
      return;
    }

    // Next: existing logic for "optionWeather", "optionGovtSchemes", etc.
    if (option === r.optionGovtSchemes) {
      setSelectedService("govtSchemes");
      await simulateTypingThenAddMessage({
        text: r.farmingPrompt,
        sender: "bot",
      });
      return;
    }

    if (option === r.optionWeather) {
      setSelectedService("weather");
      if (!location.selectedDistrict) {
        await simulateTypingThenAddMessage({
          text: r.changeLocation,
          sender: "bot",
        });
        setAwaitLocationChange(true);
        return;
      }
      await simulateTypingThenAddMessage({
        text: r.weatherConfirm(location.selectedDistrict),
        sender: "bot",
        options: [r.optionYesLocation, r.optionNoChangeLocation],
      });
      return;
    }

    if (option === r.optionYesLocation) {
      setConfirmedLocation(location.selectedDistrict);
      await simulateTypingThenAddMessage({
        text: r.weatherFetch,
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
              currentWeather.tags && currentWeather.tags[0] && currentWeather.tags[0].list;

            const loc = tags
              ? tags.find((t) => t.descriptor.code === "Location")?.value
              : "N/A";
            const minTemp = tags
              ? tags.find((t) => t.descriptor.code === "Min-Temp")?.value
              : "N/A";
            const maxTemp = tags
              ? tags.find((t) => t.descriptor.code === "Max-Temp")?.value
              : "N/A";
            const humidity = tags
              ? tags.find((t) => t.descriptor.code === "Humidity")?.value
              : "N/A";
            const windSpeed = tags
              ? tags.find((t) => t.descriptor.code === "Wind-Speed")?.value
              : "N/A";

            const lbl = weatherLabels[language] || weatherLabels.en;
            const prefix =
              language === "en"
                ? `<strong>${lbl.currentWeatherFor} ${loc}:</strong>`
                : `<strong>${loc}${lbl.currentWeatherFor}:</strong>`;

            const msg =
              `${prefix}\n` +
              `🌡️ ${lbl.temperature}: ${formatValue(minTemp)} (${lbl.min}) / ${formatValue(maxTemp)} (${lbl.max})\n` +
              `💧 ${lbl.humidity}: ${formatValue(humidity)}\n` +
              `💨 ${lbl.windSpeed}: ${formatValue(windSpeed)}`;

            await simulateTypingThenAddMessage({ text: msg, sender: "bot" });
            await simulateTypingThenAddMessage({
              text: r.forecastPrompt,
              sender: "bot",
              options: [r.optionYesForecast, r.optionNoForecast],
            });
          } else {
            await simulateTypingThenAddMessage({
              text: r.noWeatherData,
              sender: "bot",
            });
          }
        } catch (error) {
          await simulateTypingThenAddMessage({
            text: r.errorWeather,
            sender: "bot",
          });
        }
      }, 1500);
      return;
    }

    if (option === r.optionNoChangeLocation) {
      await simulateTypingThenAddMessage({
        text: r.changeLocation,
        sender: "bot",
      });
      setAwaitLocationChange(true);
      return;
    }

    if (option === r.optionYesForecast) {
      if (weatherData) {
        const forecastItems = weatherData.slice(1);
        const dates = Object.keys(groupForecastByDate(forecastItems)).sort();
        const first5Dates = dates.slice(0, 5);
        const filtered = forecastItems.filter((it) => {
          const namePart = it.descriptor.name.split("Forecast for ")[1];
          const datePart = namePart.split(" ")[0];
          return first5Dates.includes(datePart);
        });
        const formatted = formatForecastData(filtered, language);
        await simulateTypingThenAddMessage({ text: formatted, sender: "bot" });
        await simulateTypingThenAddMessage({
          text: r.feedbackPrompt,
          sender: "bot",
          options: [r.optionGoBack],
        });
      } else {
        await simulateTypingThenAddMessage({
          text: r.noWeatherData,
          sender: "bot",
        });
      }
      return;
    }

    if (option === r.optionNoForecast) {
      await simulateTypingThenAddMessage({
        text: r.thankYou,
        sender: "bot",
      });
      await simulateTypingThenAddMessage({
        text: r.feedbackPrompt,
        sender: "bot",
        options: [r.optionGoBack],
      });
      return;
    }

    if (option === r.optionGoBack) {
      setSelectedService("");
      setWeatherData(null);
      await simulateTypingThenAddMessage({
        text: r.servicePrompt,
        sender: "bot",
        options: [r.optionWeather, r.optionGovtSchemes],
      });
      return;
    }

    // If none matched
    await simulateTypingThenAddMessage({
      text: r.unknownOption,
      sender: "bot",
    });
  }

  // Possibly disable input if waiting for user to pick location or language
  const lastMessage = messages[messages.length - 1];
  const isLastMsgBot = lastMessage?.sender === "bot";
  const hasOptions = Array.isArray(lastMessage?.options) && lastMessage.options.length > 0;
  const isGovtFeedbackPrompt =
    lastMessage?.text === (responses[language] || responses.en).govtFeedbackPrompt;
  const waitingForOptions = isLastMsgBot && hasOptions && !isGovtFeedbackPrompt;

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
              {/* Arrow */}
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

            {/* Buttons */}
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
                      "&:hover": {
                        backgroundColor: "#666666",
                      },
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

      {/* Input */}
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
            disabled={loading || waitingForOptions || awaitLanguageChange || awaitLocationChange}
          />
          <IconButton
            onClick={handleSend}
            disabled={loading || waitingForOptions || awaitLanguageChange}
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
}

export default AiBot;
