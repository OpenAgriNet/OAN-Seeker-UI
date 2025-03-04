import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SchemesDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = location.state?.scheme;

  if (!scheme) {
    return (
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
        <Typography>No scheme details found.</Typography>
      </Box>
    );
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
          {/* Increase the clickable area by wrapping the arrow in a Box */}
          <Box
            onClick={() => navigate(-1)}
            sx={{
              cursor: "pointer",
              padding: "8px", // Extra padding increases the clickable area
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowBackIcon />
          </Box>
          <Typography variant="h5" fontWeight="400" fontSize={"22px"}>
            {scheme.title}
          </Typography>
        </Box>

        <Box className="page-content" sx={{ padding: "16px" }}>
          <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
            Provider: {scheme.provider_name}
          </Typography>

          {scheme.categories && scheme.categories.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Categories</Typography>
              <Typography
                variant="body2"
                color="rgba(67, 62, 63, 1)"
                fontSize={"14px"}
              >
                {scheme.categories.join(", ")}
              </Typography>
            </Box>
          )}

          {scheme.fulfillments && scheme.fulfillments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Fulfillments</Typography>
              <Typography
                variant="body2"
                color="rgba(67, 62, 63, 1)"
                fontSize={"14px"}
              >
                {scheme.fulfillments.join(", ")}
              </Typography>
            </Box>
          )}

          {scheme.locations && scheme.locations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Locations</Typography>
              <Typography
                variant="body2"
                color="rgba(67, 62, 63, 1)"
                fontSize={"14px"}
              >
                {scheme.locations.join(", ")}
              </Typography>
            </Box>
          )}

          {scheme.tags && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                Eligibility & Required Documents
              </Typography>

              {scheme.tags["Required documents"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Required Documents
                  </Typography>
                  <Typography
                    variant="body2"
                    color="rgba(67, 62, 63, 1)"
                    fontSize="14px"
                  >
                    {Array.isArray(scheme.tags["Required documents"])
                      ? scheme.tags["Required documents"].join(", ")
                      : scheme.tags["Required documents"]}
                  </Typography>
                </Box>
              )}

              {scheme.tags["Additional eligibility"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Additional Eligibility
                  </Typography>
                  <Typography
                    variant="body2"
                    color="rgba(67, 62, 63, 1)"
                    fontSize={"14px"}
                  >
                    {scheme.tags["Additional eligibility"]}
                  </Typography>
                </Box>
              )}

              {scheme.tags["Demographic eligibility"] && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">
                    Demographic Eligibility
                  </Typography>
                  <Typography
                    variant="body2"
                    color="rgba(67, 62, 63, 1)"
                    fontSize={"14px"}
                  >
                    {scheme.tags["Demographic eligibility"]}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Details</Typography>
            <Typography
              variant="body2"
              color="rgba(67, 62, 63, 1)"
              fontSize={"14px"}
              sx={{ mt: 1 }}
            >
              {scheme.long_desc}
            </Typography>
          </Box>

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
