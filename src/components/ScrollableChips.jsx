import { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ScrollableChips = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        Tentative Harvest Date
      </Typography>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: "8px",
          paddingBottom: "8px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {months.map((month) => (
          <Chip
            key={month}
            label={month}
            clickable
            onClick={() => setSelectedMonth(month)}
            sx={{
              backgroundColor: selectedMonth === month ? "#b0bec5" : "#e0e0e0",
              borderRadius: "6px",
              fontWeight: 500,
              fontSize: '14px'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ScrollableChips;
