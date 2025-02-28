import { Box, TextField, IconButton, Typography, MenuItem, Select } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState, useRef, useEffect } from "react";

const AiBot = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "I'm here to help!", sender: "bot" }]);
      }, 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        border: "1px solid #ccc",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Header */}
      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", fontWeight: "bold" }}>Schemes Chatbot</Box>
      
      {/* Messages */}
      <Box sx={{ flexGrow: 1, padding: 2, overflowY: "auto", display: "flex", flexDirection: "column", marginBottom: "60px" }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              maxWidth: "75%",
              padding: 1.5,
              borderRadius: 2,
              marginBottom: 2,
              backgroundColor: msg.sender === "bot" ? "rgba(204, 234, 255, 1)" : "rgba(209, 209, 209, 1)",
              alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
              position: "relative",
              borderTopLeftRadius: msg.sender === "bot" ? 0 : 10,
              borderTopRightRadius: msg.sender === "bot" ? 10 : 0,
              paddingLeft: msg.sender === "bot" ? 2 : 2.5,
              paddingRight: msg.sender === "bot" ? 2.5 : 2,
              wordBreak: "break-word",
              overflowWrap: "break-word",
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
                borderWidth: msg.sender === "bot" ? "10px 10px 10px 0" : "10px 0 10px 10px",
                borderColor: msg.sender === "bot" ? "transparent rgba(204, 234, 255, 1) transparent transparent" : "transparent transparent transparent rgba(209, 209, 209, 1)",
              }}
            />
            <Typography variant="body2" sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}>{msg.text}</Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Input Box with Language Selection */}
      <Box sx={{ display: "flex", flexDirection: "column", padding: 2, borderTop: "1px solid #ccc", position: "fixed", bottom: "50px", backgroundColor: "white", zIndex: 1000, width: "100%", maxWidth: 400 }}>
        <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#f8f8ff", borderRadius: "50px", padding: "5px 10px", border:'1px solid rgba(244, 244, 244, 1)' }}>
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
          <IconButton color="primary" onClick={handleSend}>
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
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
          <MenuItem value="Spanish">Spanish</MenuItem>
        </Select>
      </Box>
    </Box>
  );
};

export default AiBot;