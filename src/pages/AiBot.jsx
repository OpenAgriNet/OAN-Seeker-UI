import React, { useState, useRef, useEffect, useContext } from "react";
import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { sendQueryToBot, fetchWeather } from "../api/apiService";
import { LocationContext } from "../context/LocationContext";
import { LanguageContext } from "../context/LanguageContext";

// ----- Extended responses dictionary -----
const responses = {
  en: {
    welcomeMessage:
      "Hi, I’m AgriNet, your trusted assistant for all your farming needs. Please select your preferred language to get started.",
    servicePrompt: "Please select the service you need help with",
    farmingPrompt: "Ask me anything related to farming.",
    weatherConfirm: (district) =>
      `I see you are interested in weather updates. Please confirm if this is your location: <strong>${district}</strong>`,
    weatherFetch: "Great! Fetching the latest weather update for your area...",
    forecastPrompt:
      "Would you like to see a weather forecast for the next few days?",
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
    welcomeMessage:
      "नमस्ते, मैं एग्रीनेट हूं, आपकी कृषि आवश्यकताओं के लिए आपका विश्वसनीय सहायक। कृपया अपनी पसंदीदा भाषा चुनें।",
    servicePrompt: "कृपया बताएं कि आपको किस सेवा की आवश्यकता है।",
    farmingPrompt: "कृषि से संबंधित कोई भी सवाल पूछें।",
    weatherConfirm: (district) =>
      `मुझे दिख रहा है कि आप मौसम अपडेट्स में रुचि रखते हैं। कृपया पुष्टि करें कि क्या यह आपका स्थान है: <strong>${district}</strong>`,
    weatherFetch:
      "बहुत बढ़िया! आपके क्षेत्र का नवीनतम मौसम अपडेट प्राप्त किया जा रहा है...",
    forecastPrompt:
      "क्या आप आने वाले कुछ दिनों का मौसम पूर्वानुमान देखना चाहेंगे?",
    noWeatherData:
      "क्षमा करें, आपके स्थान के लिए कोई मौसम डेटा उपलब्ध नहीं है।",
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
    welcomeMessage:
      "नमस्कार, मी एग्रीनेट आहे, तुमच्या शेतीसंबंधी गरजांसाठी तुमचा विश्वासू सहायक. कृपया तुमची प्राधान्यकृत भाषा निवडा.",
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

// For the special "currently selected" message
function getCurrentlySelectedMessage(langCode) {
  // Convert code => text
  let langText = "English";
  if (langCode === "hi") langText = "हिंदी";
  if (langCode === "mr") langText = "मराठी";

  return {
    text: `Hi, I’m AgriNet, your trusted assistant.
           I see your preferred language is <strong>${langText}</strong>. If you want to change it, click one of the other buttons below. Otherwise, click <strong>Continue</strong> to proceed.`,
    sender: "bot",
    options: ["Continue", "English", "हिंदी", "मराठी"],
  };
}

// If no language in sessionStorage, ask user to pick from 3
function getNoLanguageMessage() {
  return {
    text:
      "Hi, I’m AgriNet, your trusted assistant for all your farming needs. " +
      "Please select your preferred language to get started.",
    sender: "bot",
    options: ["English", "हिंदी", "मराठी"],
  };
}

// Return the initial bot message depending on sessionStorage
function getInitialBotMessage() {
  const storedLang = sessionStorage.getItem("language");
  if (!storedLang) {
    return getNoLanguageMessage();
  } else {
    return getCurrentlySelectedMessage(storedLang);
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

// Map language button text => code
const languageMap = {
  English: "en",
  हिंदी: "hi",
  मराठी: "mr",
};

// Map code => language button text
const inverseLanguageMap = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
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
        const windTag = tags.find(
          (tag) => tag.descriptor.code === "wind-speed"
        );
        const humidityTag = tags.find(
          (tag) => tag.descriptor.code === "humidity"
        );

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
  const { language, updateLanguage } = useContext(LanguageContext);

  // This tracks if we have "confirmed" the user's language or not
  const [confirmedLang, setConfirmedLang] = useState(language);

  const [selectedService, setSelectedService] = useState("");
  const [messages, setMessages] = useState(() => {
    const stored = sessionStorage.getItem("chatHistory");
    if (stored) return JSON.parse(stored);
    // If no chat history, create initial message
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
  const [confirmedLocation, setConfirmedLocation] = useState(
    location.selectedDistrict || ""
  );

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

  // Show "Typing..." for initial
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

  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);

  // If user changes location in the header
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
          text: responses[language || "en"].weatherConfirm(
            location.selectedDistrict
          ),
          sender: "bot",
          options: [
            responses[language || "en"].optionYesLocation,
            responses[language || "en"].optionNoChangeLocation,
          ],
        });
      })();
      setConfirmedLocation(location.selectedDistrict);
      setAwaitLocationChange(false);
    }
  }, [
    awaitLocationChange,
    location.selectedDistrict,
    confirmedLocation,
    language,
  ]);

  // If user changes language from header
  // => show the "currently selected" message again (unless they've clicked "Continue" or changed again).
  useEffect(() => {
    if (language !== confirmedLang) {
      // They changed from the header
      setConfirmedLang(language);
      // Show the "currently selected" style message again
      setMessages((prev) => [...prev, getCurrentlySelectedMessage(language)]);
      setUserSubmitted(true);
    }
  }, [language, confirmedLang]);

  function simulateTypingThenAddMessage(newBotMessage, delay = 1500) {
    return new Promise((resolve) => {
      setMessages((prev) => [...prev, { text: "Typing", sender: "bot" }]);
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => prev.slice(0, -1)); // remove "Typing"
        setLoading(false);
        setMessages((prev) => [...prev, newBotMessage]);
        setUserSubmitted(true);
        resolve();
      }, delay);
    });
  }

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

      if (selectedService === "govtSchemes") {
        await simulateTypingThenAddMessage({
          text: responses[language].govtFeedbackPrompt,
          sender: "bot",
          options: [responses[language].optionGoBack],
        });
      }
    }
  }

  async function handleOptionClick(option) {
    // Remove options from the last bot message
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

    // Show user's selection
    setMessages((prev) => [...prev, { text: option, sender: "user" }]);
    setUserSubmitted(true);

    // If we are in "currently selected" flow:
    // The user might have 4 buttons: [Continue] [English] [हिंदी] [मराठी]
    if (option === "Continue") {
      // Just show the service prompt
      await simulateTypingThenAddMessage({
        text: responses[language].servicePrompt,
        sender: "bot",
        options: [
          responses[language].optionWeather,
          responses[language].optionGovtSchemes,
        ],
      });
      return;
    }
    // If user clicks the same language that is "currently selected," treat it like "Continue" if you wish.
    // Or do nothing. For now let's do the same as "Continue."
    if (option === inverseLanguageMap[language]) {
      // The user re-clicked the same language. Let's just proceed:
      await simulateTypingThenAddMessage({
        text: responses[language].servicePrompt,
        sender: "bot",
        options: [
          responses[language].optionWeather,
          responses[language].optionGovtSchemes,
        ],
      });
      return;
    }

    // If user picks one of the languages
    if (option === "English" || option === "हिंदी" || option === "मराठी") {
      const newLang = languageMap[option];
      updateLanguage(newLang);

      // Show the "Please select the service" in the new language
      await simulateTypingThenAddMessage({
        text: responses[newLang].servicePrompt,
        sender: "bot",
        options: [
          responses[newLang].optionWeather,
          responses[newLang].optionGovtSchemes,
        ],
      });
      return;
    }

    // Next is your existing logic:
    if (option === responses[language].optionGovtSchemes) {
      setSelectedService("govtSchemes");
      await simulateTypingThenAddMessage({
        text: responses[language].farmingPrompt,
        sender: "bot",
      });
      return;
    }

    if (option === responses[language].optionWeather) {
      setSelectedService("weather");
      if (!location.selectedDistrict) {
        await simulateTypingThenAddMessage({
          text: responses[language].changeLocation,
          sender: "bot",
        });
        setAwaitLocationChange(true);
        return;
      }
      await simulateTypingThenAddMessage({
        text: responses[language].weatherConfirm(location.selectedDistrict),
        sender: "bot",
        options: [
          responses[language].optionYesLocation,
          responses[language].optionNoChangeLocation,
        ],
      });
      return;
    }

    if (option === responses[language].optionYesLocation) {
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
              `🌡️ ${lbl.temperature}: ${formatValue(minTemp)} (${
                lbl.min
              }) / ${formatValue(maxTemp)} (${lbl.max})\n` +
              `💧 ${lbl.humidity}: ${formatValue(humidity)}\n` +
              `💨 ${lbl.windSpeed}: ${formatValue(windSpeed)}`;

            await simulateTypingThenAddMessage({ text: msg, sender: "bot" });
            await simulateTypingThenAddMessage({
              text: responses[language].forecastPrompt,
              sender: "bot",
              options: [
                responses[language].optionYesForecast,
                responses[language].optionNoForecast,
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
      return;
    }

    if (option === responses[language].optionNoChangeLocation) {
      await simulateTypingThenAddMessage({
        text: responses[language].changeLocation,
        sender: "bot",
      });
      setAwaitLocationChange(true);
      return;
    }

    if (option === responses[language].optionYesForecast) {
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
          text: responses[language].feedbackPrompt,
          sender: "bot",
          options: [responses[language].optionGoBack],
        });
      } else {
        await simulateTypingThenAddMessage({
          text: responses[language].noWeatherData,
          sender: "bot",
        });
      }
      return;
    }

    if (option === responses[language].optionNoForecast) {
      await simulateTypingThenAddMessage({
        text: responses[language].thankYou,
        sender: "bot",
      });
      await simulateTypingThenAddMessage({
        text: responses[language].feedbackPrompt,
        sender: "bot",
        options: [responses[language].optionGoBack],
      });
      return;
    }

    if (option === responses[language].optionGoBack) {
      setSelectedService("");
      setWeatherData(null);
      await simulateTypingThenAddMessage({
        text: responses[language].servicePrompt,
        sender: "bot",
        options: [
          responses[language].optionWeather,
          responses[language].optionGovtSchemes,
        ],
      });
      return;
    }

    // If none of the above matched
    await simulateTypingThenAddMessage({
      text: responses[language].unknownOption,
      sender: "bot",
    });
  }

  // Disabling logic
  const lastMessage = messages[messages.length - 1];
  const isLastMsgBot = lastMessage?.sender === "bot";
  const hasOptions =
    Array.isArray(lastMessage?.options) && lastMessage.options.length > 0;
  const isGovtFeedbackPrompt =
    lastMessage?.text === responses[language]?.govtFeedbackPrompt;
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
                  __html:
                    msg.text === "Typing" ? `Typing ${typingDots}` : msg.text,
                }}
              />
            </Box>

            {/* Buttons */}
            {msg.sender === "bot" && msg.options && (
              <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                {msg.options.map((opt, idx) => {
                  // highlight if the button matches the currently selected language
                  const isSelected = opt === inverseLanguageMap[language];
                  return (
                    <Button
                      key={idx}
                      variant="contained"
                      size="small"
                      onClick={() => handleOptionClick(opt)}
                      sx={{
                        border: "none",
                        backgroundColor: isSelected ? "#666666" : "#808080",
                        boxShadow: "none",
                        color: "white",
                        "&:hover": {
                          backgroundColor: isSelected ? "#666666" : "#808080",
                        },
                        textTransform: "none",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {opt}
                    </Button>
                  );
                })}
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
            disabled={selectedService === "weather" || waitingForOptions}
          />
          <IconButton
            onClick={handleSend}
            disabled={
              loading || selectedService === "weather" || waitingForOptions
            }
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
