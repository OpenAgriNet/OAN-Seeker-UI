import { Box, Typography, IconButton, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";

const SchemesDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = location.state?.scheme; // Get scheme details

  if (!scheme) {
    return <Typography>No scheme details found.</Typography>;
  }

  return (
    <>
      {/* Back Button & Scheme Name (OUTSIDE page-content) */}
      <Box
        sx={{
          backgroundColor: "white",
          padding: "16px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="400" fontSize={'22px'}>
          {scheme.title}
        </Typography>
      </Box>

      {/* Page Content */}
      <Box className="page-content" sx={{ padding: "16px" }}>
        {/* Provider Name */}
        <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
          Provider: {scheme.provider_name}
        </Typography>

        {/* Categories */}
        {scheme.categories && scheme.categories.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Categories</Typography>
            <Typography variant="body2" color="text.secondary">
              {scheme.categories.join(", ")}
            </Typography>
          </Box>
        )}

        {/* Fulfillments */}
        {scheme.fulfillments && scheme.fulfillments.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Fulfillments</Typography>
            <Typography variant="body2" color="text.secondary">
              {scheme.fulfillments.join(", ")}
            </Typography>
          </Box>
        )}

        {/* Locations */}
        {scheme.locations && scheme.locations.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Locations</Typography>
            <Typography variant="body2" color="text.secondary">
              {scheme.locations.join(", ")}
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {scheme.tags && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Eligibility & Required Documents</Typography>

            {/* Required Documents */}
            {scheme.tags["Required documents"] && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Required Documents</Typography>
                <Typography variant="body2" color="text.secondary">
                  {scheme.tags["Required documents"].join(", ")}
                </Typography>
              </Box>
            )}

            {/* Additional Eligibility */}
            {scheme.tags["Additional eligibility"] && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Additional Eligibility</Typography>
                <Typography variant="body2" color="text.secondary">
                  {scheme.tags["Additional eligibility"]}
                </Typography>
              </Box>
            )}

            {/* Demographic Eligibility */}
            {scheme.tags["Demographic eligibility"] && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1">Demographic Eligibility</Typography>
                <Typography variant="body2" color="text.secondary">
                  {scheme.tags["Demographic eligibility"]}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Long Description */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Details</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {scheme.long_desc}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SchemesDetails;
