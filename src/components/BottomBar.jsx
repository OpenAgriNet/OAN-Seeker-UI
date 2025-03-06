import React, { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

// MUI Icons
import ArticleIcon from "@mui/icons-material/Article";   // Schemes
import CloudIcon from "@mui/icons-material/Cloud";       // Weather
import SmartToyIcon from "@mui/icons-material/SmartToy"; // AI Bot

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  // Keep tab value in sync with current route
  useEffect(() => {
    if (location.pathname === "/schemes") setValue(0);
    else if (location.pathname === "/weather") setValue(1);
    else if (location.pathname === "/aibot") setValue(2);
  }, [location.pathname]);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/schemes");
    if (newValue === 1) navigate("/weather");
    if (newValue === 2) navigate("/aibot");
  };

  // Styles for the active green rectangle
  const activeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(178,210,53,1)",
    width: "117px",
    height: "39px",
    gap: "6px",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "#000", // Icon and text color when active
  };

  // Styles for the inactive icon
  const inactiveStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#fff", // Icon color when inactive
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={false} // We'll manually render text for the active tab
        sx={{
          backgroundColor: "#000",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0, // Remove extra spacing around icons
            padding: 0,
          },
        }}
      >
        {/* Schemes */}
        <BottomNavigationAction
          icon={
            <div style={value === 0 ? activeStyle : inactiveStyle}>
              <ArticleIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 0 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>Schemes</span>
              )}
            </div>
          }
        />

        {/* Weather */}
        <BottomNavigationAction
          icon={
            <div style={value === 1 ? activeStyle : inactiveStyle}>
              <CloudIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 1 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>Weather</span>
              )}
            </div>
          }
        />

        {/* AI Bot */}
        <BottomNavigationAction
          icon={
            <div style={value === 2 ? activeStyle : inactiveStyle}>
              <SmartToyIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 2 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>Chatbot</span>
              )}
            </div>
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
