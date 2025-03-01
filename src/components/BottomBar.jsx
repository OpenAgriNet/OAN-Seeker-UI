import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import weather from "../assets/weather.svg";
import WeatherActive from "../assets/WeatherActive.svg";
import schemes from "../assets/schemes.svg";
import schemesActive from "../assets/schemesActive.svg";
import Bot from "../assets/bot.svg";
import BotActive from "../assets/activeBot.svg";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  // Update value based on the current route
  useEffect(() => {
    if (location.pathname === "/home") setValue(0);
    else if (location.pathname === "/weather") setValue(1);
    else if (location.pathname === "/schemes") setValue(2);
    else if (location.pathname === "/aibot") setValue(3);
  }, [location.pathname]);

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
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) navigate("/home");
          if (newValue === 1) navigate("/weather");
          if (newValue === 2) navigate("/schemes");
          if (newValue === 3) navigate("/aibot");
        }}
        sx={{
          "& .Mui-selected": {
            color: "rgba(11, 85, 138, 1)",
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home sx={{ color: value === 0 ? "rgba(11, 85, 138, 1)" : "gray" }} />}
          sx={{ color: value === 0 ? "rgba(11, 85, 138, 1)" : "gray" }}
        />
        <BottomNavigationAction
          label="Weather"
          icon={<img src={value === 1 ? WeatherActive : weather} alt="Weather" style={{ width: 23, height: 23 }} />}
          sx={{ color: value === 1 ? "rgba(11, 85, 138, 1)" : "gray" }}
        />
        <BottomNavigationAction
          label="Schemes"
          icon={<img src={value === 2 ? schemesActive : schemes} alt="Schemes" style={{ width: 22, height: 22, marginBottom: "3px" }} />}
          sx={{ color: value === 2 ? "rgba(11, 85, 138, 1)" : "gray" }}
        />
        <BottomNavigationAction
          label="AI Bot"
          icon={<img src={value === 3 ? BotActive : Bot} alt="AI Bot" style={{ width: 22, height: 22, marginBottom: "3px" }} />}
          sx={{ color: value === 3 ? "rgba(11, 85, 138, 1)" : "gray" }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
