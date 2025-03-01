import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchSchemes } from "../api/apiService"; 
import SearchBar from "../components/SearchBar";
import SchemeCard from "../components/SchemeCard";
import Loading from "../components/Loading"; 

const ITEMS_PER_PAGE = 5;

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSchemes, setVisibleSchemes] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState(""); 
  const selectedDistrict = localStorage.getItem("selectedDistrict");

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      const data = await fetchSchemes(selectedDistrict);
      setSchemes(data);
      setLoading(false);
    };

    loadSchemes();
  }, [selectedDistrict]);

  const handleLoadMore = () => {
    setVisibleSchemes((prev) => prev + ITEMS_PER_PAGE);
  };

  const filteredSchemes = schemes.filter((scheme) =>
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

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
      {loading ? (
        <Loading /> 
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, mt:2, fontSize: "14px" }}>
            Discover Schemes in {selectedDistrict}
          </Typography>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {filteredSchemes.length > 0 ? (
            filteredSchemes.slice(0, visibleSchemes).map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))
          ) : (
            <Typography mt={2}>No schemes found for "{searchQuery}".</Typography>
          )}

          {visibleSchemes < filteredSchemes.length && (
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
