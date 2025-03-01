import { Box, Typography, IconButton, Container, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // Import icon

const SchemesDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = location.state?.scheme; // Get scheme details

  if (!scheme) {
    return <Typography>No scheme details found.</Typography>;
  }

  return (
    <>
      <Box pb={7}>
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
          <Typography variant="h5" fontWeight="400" fontSize={"22px"}>
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
              <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                {scheme.categories.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Fulfillments */}
          {scheme.fulfillments && scheme.fulfillments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Fulfillments</Typography>
              <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                {scheme.fulfillments.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Locations */}
          {scheme.locations && scheme.locations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Locations</Typography>
              <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                {scheme.locations.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {scheme.tags && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                Eligibility & Required Documents
              </Typography>

              {/* Required Documents */}
              {scheme.tags["Required documents"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Required Documents
                  </Typography>
                  <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                    {scheme.tags["Required documents"].join(", ")}
                  </Typography>
                </Box>
              )}

              {/* Additional Eligibility */}
              {scheme.tags["Additional eligibility"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Additional Eligibility
                  </Typography>
                  <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                    {scheme.tags["Additional eligibility"]}
                  </Typography>
                </Box>
              )}

              {/* Demographic Eligibility */}
              {scheme.tags["Demographic eligibility"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Demographic Eligibility
                  </Typography>
                  <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'}>
                    {scheme.tags["Demographic eligibility"]}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Long Description */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Details</Typography>
            <Typography variant="body2" color="rgba(67, 62, 63, 1)" fontSize={'14px'} sx={{ mt: 1 }}>
              {scheme.long_desc}
            </Typography>
          </Box>

          {/* Media Download Button */}
          {scheme.media && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgba(11, 85, 138, 1)",
                  color: "white",
                  fontSize: "16px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "10px 20px",
                }}
                href={scheme.media}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
              >
                View Scheme Document
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default SchemesDetails;
