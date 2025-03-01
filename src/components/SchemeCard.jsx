import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";

const SchemeCard = ({ scheme }) => {
  const navigate = useNavigate();

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
          fontWeight: "500",
        }}
      >
        Application Deadline
      </Box>

      <CardContent sx={{ mt: 1, pb: "4px !important" }}>

        <Typography variant="h6" fontWeight="500" mt={2}>
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
          ₹ {scheme.categories?.join(", ") || "Benefit Detail"}
        </Typography>


        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {scheme.fulfillments?.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              sx={{
                borderRadius: "5px",
                fontSize: "12px",
                height: "26px",
                color: "rgba(11, 85, 138, 1)",
                borderColor: "rgba(11, 85, 138, 1)",
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
              color: "#0056b3",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ArrowForwardIcon fontSize="small" />}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SchemeCard;
