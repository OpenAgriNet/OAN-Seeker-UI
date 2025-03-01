import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import SchemeCard from "../components/SchemeCard";
import Loading from "../components/Loading"; // ✅ Import Loading component

const API_URL = "https://oan-schemes.tekdinext.com/content/search";
const ITEMS_PER_PAGE = 5; // Show 5 schemes initially

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSchemes, setVisibleSchemes] = useState(ITEMS_PER_PAGE);
  const selectedDistrict = localStorage.getItem("selectedDistrict");

  useEffect(() => {
    if (!selectedDistrict) {
      setLoading(false);
      return;
    }

    const fetchSchemes = async () => {
      try {
        const response = await axios.post(
          API_URL,
          { locations: [selectedDistrict] },
          { headers: { "Content-Type": "application/json" } }
        );

        const schemeData = response.data?.data?.scheme_cache_data || [];
        setSchemes(schemeData);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [selectedDistrict]);

  const handleLoadMore = () => {
    setVisibleSchemes((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <Box
      className="page-content"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        paddingBottom: "120px",
        px: 2,
      }}
    >
      {/* Show Loading Component */}
      {loading ? (
        <Loading /> // ✅ Using the separate Loading component
      ) : (
        <>
          {/* Heading */}
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt:2, fontSize: "14px" }}>
            Discover Schemes in {selectedDistrict}
          </Typography>

          {/* Search Bar */}
          <SearchBar />

          {schemes.length > 0 ? (
            schemes.slice(0, visibleSchemes).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))
          ) : (
            <Typography>No schemes available for {selectedDistrict}.</Typography>
          )}

          {/* Load More Button (Only if more schemes exist) */}
          {visibleSchemes < schemes.length && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0056b3",
                color: "white",
                fontSize: "16px",
                borderRadius: "8px",
                display: "block",
                margin: "20px auto",
                width: "200px",
              }}
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default Schemes;
