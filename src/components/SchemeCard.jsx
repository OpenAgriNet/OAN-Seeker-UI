import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SchemeCard = ({ schemeId  }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/schemes/details/${schemeId}`);
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
      }}
    >
      {/* Application Deadline Label (Positioned to the Right) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "#914c1b",
          color: "white",
          padding: "4px 10px",
          borderRadius: "0px 10px ",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        Application Deadline
      </Box>

      <CardContent sx={{ mt: 1, pb: "4px !important" }}>
        {/* Scheme Name */}
        <Typography variant="h6" fontWeight="bold">
          Scheme Name
        </Typography>

        {/* Scheme Provider */}
        <Typography variant="body2" color="text.secondary">
          Scheme Provider
        </Typography>

        {/* Benefit Detail with ₹ Symbol */}
        <Typography
          variant="body2"
          fontWeight="500"
          sx={{ mt: 1, display: "flex", alignItems: "center" }}
        >
          ₹ Benefit Detail
        </Typography>

        {/* Labels (Aligned Horizontally) */}
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="Label 1"
            variant="outlined"
            sx={{
              borderRadius: "5px",
              fontSize: "12px",
              height: "26px",
              color: "rgba(11, 85, 138, 1)",
              borderColor: "rgba(11, 85, 138, 1)",
            }}
          />
          <Chip
            label="Label 2"
            variant="outlined"
            sx={{
              borderRadius: "5px",
              fontSize: "12px",
              height: "26px",
              color: "rgba(11, 85, 138, 1)",
              borderColor: "rgba(11, 85, 138, 1)",
            }}
          />
          <Chip
            label="Label 3"
            variant="outlined"
            sx={{
              borderRadius: "5px",
              fontSize: "12px",
              height: "26px",
              color: "rgba(11, 85, 138, 1)",
              borderColor: "rgba(11, 85, 138, 1)",
            }}
          />
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Lorem ipsum dolor sit amet consectetur. A felis ut ullamcorper augue
          feugiat at nisi id. Pharetra sit at risus natoque vel habitasse. Nisl
          nunc curabitur sit id tortor faucibus vel fermentum.
        </Typography>

        {/* Centered View Details Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            onClick={handleViewDetails} // Navigate on click
            sx={{
              color: "#0056b3",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SchemeCard;
