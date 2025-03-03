import React from "react";
import { Box, Typography, SwipeableDrawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const WeatherDetailPopup = ({ open, onClose, forecast }) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
    >
      <Box p={2} sx={{ height: "50vh", overflow: "auto" }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {forecast && (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {forecast.descriptor.name}
            </Typography>
            <Typography variant="body1">
              {forecast.descriptor.long_desc}
            </Typography>
            {/* You can add more detailed info here */}
          </>
        )}
      </Box>
    </SwipeableDrawer>
  );
};

export default WeatherDetailPopup;
