import { Box, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import SchemeCard from "../components/SchemeCard";

const Schemes = () => {
  return (
    <Box className="page-content">
      {/* Heading */}
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mb: 2, fontSize: "14px" }}
      >
        Discover Schemes
      </Typography>

      {/* Search Bar */}
      <SearchBar />
      <SchemeCard schemeId={1}/>
    </Box>
  );
};

export default Schemes;
