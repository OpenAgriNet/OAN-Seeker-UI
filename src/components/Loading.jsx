import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <CircularProgress size={50} sx={{ color: "rgb(11, 85, 138)" }} />
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          color: "#000",
          marginTop: "10px",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default Loading;
