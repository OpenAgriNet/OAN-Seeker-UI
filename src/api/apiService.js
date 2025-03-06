// apiService.js
import axios from "axios";

const WEATHER_API_URL = import.meta.env.VITE_WEATHER_API_URL;
const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL;
const AIBOT_API_URL = import.meta.env.VITE_AIBOT_API_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

const cleanResponseText = (text) => {
  const lines = text.split("\n");
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed === "[" || trimmed === "]") return false;
    if (/^```[a-zA-Z]*$/.test(trimmed)) return false;
    return true;
  });
  return filtered.join("\n").trim();
};

export const fetchWeather = async (selectedDistrict) => {
  if (!selectedDistrict) {
    throw new Error("No location selected");
  }

  try {
    const response = await axios.post(
      WEATHER_API_URL,
      { location: selectedDistrict },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data?.responses?.[0]?.message?.catalog?.providers?.[0]?.items || [];
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

export const fetchSchemes = async () => {
  try {
    const response = await axios.post(
      SEARCH_API_URL, 
      {},
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data?.data?.scheme_cache_data || [];
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
};

export const sendQueryToBot = async (
  query,
  lang,
  setMessages,
  setLoading,
  typingDots
) => {
  setLoading(true);
  setMessages((prev) => {
    if (prev.length > 0 && prev[prev.length - 1].text.startsWith("Typing")) {
      return prev;
    }
    return [
      ...prev,
      { text: "Typing" + typingDots, sender: "bot" },
    ];
  });

  try {
    const response = await fetch(AIBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`, // Use import.meta.env.VITE_*
        "x-preferred-language": lang,
      },
      body: JSON.stringify({
        input: {
          language: lang,
          text: query,
          audio: "",
          context: "kisan_sahayak",
        },
        output: { format: "text" },
      }),
    });

    const data = await response.json();

    // Clean the API response text to remove redundant code block markers
    const cleanedText = cleanResponseText(
      data.output.text || "Sorry, I couldn't fetch a response."
    );

    setMessages((prev) => {
      const updatedMessages = prev.slice(0, -1);
      return [
        ...updatedMessages,
        {
          text: cleanedText,
          sender: "bot",
        },
      ];
    });
  } catch (error) {
    setMessages((prev) => {
      const updatedMessages = prev.slice(0, -1);
      return [
        ...updatedMessages,
        { text: "An error occurred. Please try again later.", sender: "bot" },
      ];
    });
  } finally {
    setLoading(false);
  }
};
