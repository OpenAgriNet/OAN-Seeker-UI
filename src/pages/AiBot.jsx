import { Box, TextField, IconButton, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useRef, useEffect } from "react";
import { sendQueryToBot } from "../api/apiService";

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
      const originalMessage = messages[0]; // Keep the original
      // Temporarily replace it with "Typing..."
      setMessages([{ text: "Typing", sender: "bot" }]);
      setLoading(true);

      const timer = setTimeout(() => {
        // After the delay, restore the original welcome message
        setLoading(false);
        setMessages([originalMessage]);
        setUserSubmitted(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll to bottom whenever new messages are added
  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);

  /**
   * Helper to simulate "Typing..." before adding a new bot message.
   *  - Adds a temporary "Typing" message
   *  - Waits for `delay` ms
   *  - Removes the "Typing" message and adds the real bot message
   */
  const simulateTypingThenAddMessage = (newBotMessage, delay = 1500) => {
    // 1) Add a "Typing" placeholder
    setMessages((prev) => [...prev, { text: "Typing", sender: "bot" }]);
    setLoading(true);

    setTimeout(() => {
      // 2) Remove the "Typing" message
      setMessages((prev) => prev.slice(0, -1));
      setLoading(false);

      // 3) Add the actual bot message
      setMessages((prev) => [...prev, newBotMessage]);
      setUserSubmitted(true);
    }, delay);
  };

  // Handles sending user-typed queries
  const handleSend = async () => {
    if (input.trim()) {
      // Add the user’s message
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setUserSubmitted(true);

      const userQuery = input;
      setInput("");

      // Show "Typing..." once, unless it’s already at the end
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].text === "Typing") {
          // If the last message is already "Typing", do nothing
          return prev;
        }
        return [...prev, { text: "Typing", sender: "bot" }];
      });
      setLoading(true);

      // Call the API
      await sendQueryToBot(
        userQuery,
        language,
        setMessages,
        setLoading,
        typingDots
      );

      // After the API call finishes, remove the "Typing" placeholder
      setMessages((prev) => {
        // Remove the last message if it's still "Typing"
        if (prev.length && prev[prev.length - 1].text === "Typing") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      setLoading(false);
    }
  };

  // Handles a user clicking on one of the bot’s “tabs” (options)
  const handleOptionClick = (option) => {
    // 1) Remove the options from the last message that had them
    //    so they disappear once the user selects.
    setMessages((prev) => {
      const newMessages = [...prev];
      // Find the last message that still has an 'options' array
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].options) {
          newMessages[i] = { ...newMessages[i], options: null };
          break;
        }
      }
      return newMessages;
    });

    // 2) Proceed with your existing logic
    if (!language) {
      // If language is not yet selected, this click is for language
      const selectedLangCode = languageMap[option] || "en";
      setLanguage(selectedLangCode);

      // Show user’s selection in chat
      setMessages((prev) => [...prev, { text: option, sender: "user" }]);
      setUserSubmitted(true);

      // Next bot message: "Please select the service..."
      simulateTypingThenAddMessage({
        text: "Please select the service you need help with",
        sender: "bot",
        options: ["Weather", "Government Schemes"],
      });
    } else {
      // If language was already selected, this click is for the service
      setMessages((prev) => [...prev, { text: option, sender: "user" }]);
      setUserSubmitted(true);

      if (option === "Government Schemes") {
        simulateTypingThenAddMessage({
          text: "Ask me anything related to farming.",
          sender: "bot",
        });
      } else {

        const selectedDistrict = localStorage.getItem("selectedDistrict") || "your location";
        
        simulateTypingThenAddMessage({
          text: `I see you are interested in weather updates. Please confirm if this is your location: ${selectedDistrict}`,
          sender: "bot",
          options: ["Yes, this is my location", "No, I want to change my location"],
        });
      }
      
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
            {/* Chat bubble */}
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
              {/* The chat bubble 'arrow' styling */}
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

            {/* Render "tabs" (buttons) if this bot message has options, BELOW the bubble */}
            {msg.sender === "bot" && msg.options && (
              <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
                {msg.options.map((option, idx) => (
                  <Button
                    key={idx}
                    variant="contained"
                    size="small"
                    onClick={() => handleOptionClick(option)}
                    sx={{
                      border: "none",
                      backgroundColor: "#808080",
                      boxShadow: "none",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#808080",
                      },
                      
                    }}
                  >
                    {option}
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
