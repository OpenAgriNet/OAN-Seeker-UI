import {
  Box,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useRef, useEffect } from "react";
import { sendQueryToBot } from "../api/apiService";

const AiBot = () => {
  const [messages, setMessages] = useState([
    {
      text:
        "Welcome to OAN AI Assistant! I am here to assist you with understanding and applying for various government schemes that support your agricultural activities and provide financial security.\n\n" +
        "Here are a few examples of what you can ask:\n\n" +
        "1. What are the benefits of the Pradhan Mantri Fasal Bima Yojana (PMFBY)?\n" +
        "2. How can I register for the PM Kisan Samman Nidhi Yojana?\n" +
        "3. What are the eligibility criteria for the PM Kisan Maandhan Yojana?\n" +
        "4. What types of crop risks are covered under PMFBY?\n\n" +
        "Feel free to ask about any of these schemes to get detailed information and guidance tailored to your needs.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [typingDots, setTypingDots] = useState("");
  const [userSubmitted, setUserSubmitted] = useState(false);

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

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setUserSubmitted(true);
      const userQuery = input;
      setInput("");
      await sendQueryToBot(
        userQuery,
        language,
        setMessages,
        setLoading,
        typingDots
      );
    }
  };

  useEffect(() => {
    if (userSubmitted && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUserSubmitted(false);
    }
  }, [messages, userSubmitted]);

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
        Schemes Chatbot
      </Box>
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
              padding: 1.5,
              borderRadius: 2,
              marginBottom: 2,
              backgroundColor:
                msg.sender === "bot"
                  ? "rgba(204, 234, 255, 1)"
                  : "rgba(209, 209, 209, 1)",
              alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
              position: "relative",
              borderTopLeftRadius: msg.sender === "bot" ? 0 : 10,
              borderTopRightRadius: msg.sender === "bot" ? 10 : 0,
              paddingLeft: msg.sender === "bot" ? 2 : 2.5,
              paddingRight: msg.sender === "bot" ? 2.5 : 2,
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-line",
              direction: "auto",
              textAlign: "start",
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
                    ? "transparent rgba(204, 234, 255, 1) transparent transparent"
                    : "transparent transparent transparent rgba(209, 209, 209, 1)",
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
        ))}
        <div ref={messagesEndRef} />
      </Box>
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
            border: "1px solid #ccc",
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
            color="primary"
            onClick={handleSend}
            disabled={loading}
            sx={{ opacity: loading ? 0.5 : 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ marginTop: 1, borderRadius: "10px" }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="bn">Bengali</MenuItem>
          <MenuItem value="gu">Gujarati</MenuItem>
          <MenuItem value="hi">Hindi</MenuItem>
          <MenuItem value="kn">Kannada</MenuItem>
          <MenuItem value="ml">Malayalam</MenuItem>
          <MenuItem value="mr">Marathi</MenuItem>
          <MenuItem value="or">Odia</MenuItem>
          <MenuItem value="pa">Punjabi</MenuItem>
          <MenuItem value="ta">Tamil</MenuItem>
          <MenuItem value="te">Telugu</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default AiBot;
