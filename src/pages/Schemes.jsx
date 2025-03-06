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
  // const selectedDistrict = localStorage.getItem("selectedDistrict");

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      const data = await fetchSchemes();
      setSchemes(data);
      setLoading(false);
    };

    loadSchemes();
  }, []);

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
        paddingBottom: "80px",
        px: 2,
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, mt: 2, fontSize: "14px" }}
          >
            Discover Schemes
          </Typography>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {filteredSchemes.length > 0 ? (
            filteredSchemes
              .slice(0, visibleSchemes)
              .map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} />)
          ) : (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography mt={2}>
                No schemes found for "{searchQuery}".
              </Typography>
            </Box>
          )}

          {visibleSchemes < filteredSchemes.length && (
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#b2d235",
                color: "rgba(0, 0, 0, 1)",
                fontSize: "16px",
                borderRadius: "8px",
                marginTop: "20px", 
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
