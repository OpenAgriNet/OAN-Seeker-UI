import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SchemesDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const scheme = location.state?.scheme;
  const [openMedia, setOpenMedia] = useState(false);

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
        <Typography>
          {t("schemesDetails.noDetails", "No scheme details found.")}
        </Typography>
      </Box>
    );
  }

  // Group tags by name
  let groupedTags = {};
  if (Array.isArray(scheme.tags)) {
    groupedTags = scheme.tags.reduce((acc, tagObj) => {
      const tagName = tagObj.name;
      if (!acc[tagName]) {
        acc[tagName] = [];
      }
      if (Array.isArray(tagObj.list)) {
        acc[tagName].push(...tagObj.list);
      }
      return acc;
    }, {});
  }

  const handleOpenMedia = () => {
    setOpenMedia(true);
  };

  const handleCloseMedia = () => {
    setOpenMedia(false);
  };

  return (
    <>
      <Box pb={7}>
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: "white",
            padding: "16px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Make the entire row clickable */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
            <Typography variant="h5" fontWeight="400" fontSize={"22px"}>
              {scheme.title}
            </Typography>
          </Box>
        </Box>

        <Box className="page-content" sx={{ padding: "16px" }}>
          {/* Provider */}

          {/* Categories (bullet list) */}
          {scheme.categories && scheme.categories.length > 0 && (
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {scheme.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  variant="outlined"
                  sx={{
                    borderRadius: "15px",
                    backgroundColor: "#f3ffc3",
                    fontSize: "12px",
                    height: "26px",
                    color: "rgba(0, 0, 0, 1)",
                    border: "1px solid #0000001f",
                  }}
                />
              ))}
            </Box>
          )}

          {/* Fulfillments (bullet list) */}
          {scheme.fulfillments && scheme.fulfillments.length > 0 && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {scheme.fulfillments.map((fulfillment, index) => (
                <Chip
                  key={index}
                  label={fulfillment}
                  variant="outlined"
                  sx={{
                    borderRadius: "15px",
                    backgroundColor: "#f3ffc3",
                    fontSize: "12px",
                    height: "26px",
                    color: "rgba(0, 0, 0, 1)",
                    border: "1px solid #0000001f",
                  }}
                />
              ))}
            </Box>
          )}

          <Typography variant="body1" fontWeight="bold" sx={{ mt: 3 }}>
            {t("schemesDetails.provider", "Provider")}: {scheme.provider_name}
          </Typography>

          {/* Locations (comma-separated) */}
          {scheme.locations && scheme.locations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                {t("schemesDetails.locations", "Locations")}
              </Typography>
              <Typography
                variant="body2"
                color="rgba(67, 62, 63, 1)"
                fontSize={"14px"}
              >
                {scheme.locations.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Eligibility & Required Documents (bullet list per item) */}
          {Object.keys(groupedTags).length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">
                {t(
                  "schemesDetails.eligibilityTitle",
                  "Eligibility & Required Documents"
                )}
              </Typography>
              {Object.entries(groupedTags).map(
                ([tagName, listItems], index) => {
                  const normalizedTagName = tagName.replace(/\s+/g, "");
                  return (
                    <Box key={index} sx={{ mt: 1 }}>
                      <Typography variant="subtitle1">
                        {t(`schemesDetails.${normalizedTagName}`, tagName)}
                      </Typography>
                      <Box component="ul" sx={{ margin: 0, paddingLeft: 3 }}>
                        {listItems.map((item, idx) => (
                          <li key={idx}>
                            <Typography
                              variant="body2"
                              color="rgba(67, 62, 63, 1)"
                              fontSize="14px"
                            >
                              {`${item.name}: ${item.value}`}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          )}

          {/* Scheme Details */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              {t("schemesDetails.details", "Details")}
            </Typography>
            <Typography
              variant="body2"
              color="rgba(67, 62, 63, 1)"
              fontSize={"14px"}
              sx={{ mt: 1 }}
            >
              {scheme.long_desc}
            </Typography>
          </Box>

          {/* Document Button - Opens Media Popup */}
          {scheme.media && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                fullWidth
                variant="contained"
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
                  boxShadow: "none",
                }}
                onClick={handleOpenMedia}
                endIcon={<OpenInNewIcon />}
              >
                {t("schemesDetails.viewDocument", "View Scheme Document")}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Media Popup */}
      <Dialog
        open={openMedia}
        onClose={handleCloseMedia}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {t("schemesDetails.viewDocument", "View Scheme Document")}
          <IconButton
            aria-label="close"
            onClick={handleCloseMedia}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Use an iframe to display the media content */}
          <Box
            component="iframe"
            src={scheme.media}
            width="100%"
            height="500px"
            sx={{ border: "none" }}
            title={scheme.title}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchemesDetails;
