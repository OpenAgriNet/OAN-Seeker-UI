import { Box, Typography, Divider } from "@mui/material";
import sunny from "../assets/sunny.png"; 
import windIcon from "../assets/air.svg";
import cloudIcon from "../assets/weather_hail.svg";
import humidityIcon from "../assets/humidity_percentage.svg";

const WeatherWidget = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(91.45deg, #916703 5.54%, #EFB223 97.44%)",
        color: "white",
        borderRadius: "16px",
        padding: "14px 18px",
        width: "350px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "70px" }}>
        <img src={sunny} alt="Sunny" style={{ width: "60px", height: "60px" }} />
        <Typography sx={{ fontSize: "16px", fontWeight: 500, marginTop: "2px" }}>Sunny</Typography>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{
          height: "65px",
          width: "1px",
          backgroundColor: "#fff",
          margin: "20px",
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ fontSize: "17px", fontWeight: 500, marginBottom: "2px" }}>
          Ratnagiri, Maharashtra
        </Typography>
        <Typography sx={{ fontSize: "34px", fontWeight: "bold", lineHeight: "1" , margin:'0.5rem'}}>32°</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
            <img src={windIcon} alt="Wind" style={{ width: "28px", height: "28px", marginBottom: "2px" }} />
            <Typography sx={{ fontSize: "14px" }}>16 km/h</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
            <img src={cloudIcon} alt="Clouds" style={{ width: "28px", height: "28px", marginBottom: "2px" }} />
            <Typography sx={{ fontSize: "14px" }}>03%</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
            <img src={humidityIcon} alt="Humidity" style={{ width: "28px", height: "28px", marginBottom: "2px" }} />
            <Typography sx={{ fontSize: "14px" }}>8%</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WeatherWidget;
