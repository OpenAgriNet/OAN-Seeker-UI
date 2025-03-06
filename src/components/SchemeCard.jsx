import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SchemeCard = ({ scheme }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewDetails = () => {
    navigate(`/schemes/details/${scheme.id}`, { state: { scheme } });
  };

  return (
    <Card
      sx={{
        border: "1px solid rgba(221, 221, 221, 1)",
        borderRadius: "12px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        maxWidth: "100%",
        position: "relative",
        marginTop: "1rem",
        cursor: "pointer",
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ padding: "10px 16px", pb: "4px !important" }}>
        <Typography variant="h6" fontWeight="500">
          {scheme.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {scheme.provider_name}
        </Typography>

        <Typography
          variant="body2"
          fontWeight="500"
          sx={{ mt: 1, display: "flex", alignItems: "center" }}
        >
          {scheme.categories?.join(", ") || t("schemesCard.benefitDetail", "Benefit Detail")}
        </Typography>

        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {scheme.fulfillments?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              sx={{
                borderRadius: "15px",
                backgroundColor:'#f3ffc3',
                fontSize: "12px",
                height: "26px",
                color: "rgba(0, 0, 0, 1)",
                border: "1px solid #0000001f",
              }}
            />
          ))}
        </Box>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {scheme.short_desc}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            onClick={handleViewDetails}
            sx={{
              color: "rgba(0, 0, 0, 1)",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ArrowForwardIcon fontSize="small" />}
          >
            {t("schemesCard.viewDetails", "View Details")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SchemeCard;
