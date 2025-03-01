import axios from "axios";

const API_URL = "https://oan-schemes.tekdinext.com/content/search";

export const fetchSchemes = async (selectedDistrict) => {
  if (!selectedDistrict) return [];

  try {
    const response = await axios.post(
      API_URL,
      { locations: [selectedDistrict] },
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
  setMessages((prev) => [
    ...prev,
    { text: "Typing" + typingDots, sender: "bot" },
  ]);

  try {
    const response = await fetch(
      "https://aibot-prod.tekdinext.com/api/activitybot/v1/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJtb2JpbGVfZGV2aWNlIn0.W9cvngZh0_Y6hcGCBqS8MZOejkUxU9ptnJFji6VBHtA",
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
      }
    );

    const data = await response.json();

    setMessages((prev) => {
      const updatedMessages = prev.slice(0, -1); 
      return [
        ...updatedMessages,
        {
          text: data.output.text || "Sorry, I couldn't fetch a response.",
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
