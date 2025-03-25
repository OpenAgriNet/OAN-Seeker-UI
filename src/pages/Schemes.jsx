import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { fetchSchemes } from "../api/apiService";
import SearchBar from "../components/SearchBar";
import SchemeCard from "../components/SchemeCard";
import Loading from "../components/Loading";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 5;
const LOCAL_STORAGE_KEY = "schemesSearchQuery";

const Schemes = () => {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleSchemes, setVisibleSchemes] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedQuery = sessionStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQuery) {
      setSearchQuery(storedQuery);
    }
  }, []);

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      const data = await fetchSchemes();
      setSchemes(data);
      setLoading(false);
    };
    loadSchemes();
  }, []);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    sessionStorage.setItem(LOCAL_STORAGE_KEY, newQuery);
  };

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
            {t("schemes.discover", "Discover Schemes")}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </Grid>
          </Grid>

          {filteredSchemes.length > 0 ? (
            <Grid container spacing={2} alignItems="stretch">
              {filteredSchemes.slice(0, visibleSchemes).map((scheme) => (
                <Grid item xs={12} md={6} key={scheme.id}>
                  <SchemeCard scheme={scheme} />
                </Grid>
              ))}
            </Grid>
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
                {t("schemes.noSchemes", "No schemes found for")} "{searchQuery}
                ".
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
                display: "flex",
                alignItems: "center",
                gap: 1,
                padding: "10px 20px",
                fontWeight: "500",
                textTransform: "none",
                marginTop: "2rem",
                boxShadow: "none",
              }}
              onClick={handleLoadMore}
            >
              {t("schemes.loadMore", "Load More")}
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default Schemes;
