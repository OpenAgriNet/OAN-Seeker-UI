import React, { useState, useEffect } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";
import CloudIcon from "@mui/icons-material/Cloud";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useTranslation } from "react-i18next";

const BottomBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Set Weather as the default active tab (index 1)
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (location.pathname === "/schemes") {
      setValue(0);
    } else if (location.pathname === "/weather") {
      setValue(1);
    } else if (location.pathname === "/aibot") {
      setValue(2);
    }
    // If it's none of the above, the value remains 1 (Weather)
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/schemes");
    if (newValue === 1) navigate("/weather");
    if (newValue === 2) navigate("/aibot");
  };

  const activeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b2d235",
    width: "117px",
    height: "39px",
    gap: "6px",
    padding: "10px 20px",
    borderRadius: "8px",
    color: "#000",
  };

  const inactiveStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#fff",
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
        showLabels={false}
        sx={{
          backgroundColor: "#000",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 0,
            padding: 0,
          },
        }}
      >
        <BottomNavigationAction
          icon={
            <div style={value === 0 ? activeStyle : inactiveStyle}>
              <ArticleIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 0 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {t("bottomBar.schemes", "Schemes")}
                </span>
              )}
            </div>
          }
        />

        <BottomNavigationAction
          icon={
            <div style={value === 1 ? activeStyle : inactiveStyle}>
              <CloudIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 1 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {t("bottomBar.weather", "Weather")}
                </span>
              )}
            </div>
          }
        />

        <BottomNavigationAction
          icon={
            <div style={value === 2 ? activeStyle : inactiveStyle}>
              <SmartToyIcon sx={{ color: "inherit", fontSize: 24 }} />
              {value === 2 && (
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {t("bottomBar.chatbot", "Chatbot")}
                </span>
              )}
            </div>
          }
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
