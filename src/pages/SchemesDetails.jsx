import { Box, Typography, IconButton, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const SchemesDetails = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ padding: "16px" }}>
      {/* Back Button & Scheme Name */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, padding: "0px !important" }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          Scheme Name
        </Typography>
      </Box>

      {/* Benefit Section */}
      <Typography variant="h6"  sx={{ mt: 2 }}>
        Benefit
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.secondary",
          mt: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 1 }}>
          ₹
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detail
        </Typography>
      </Box>

      {/* Details Section */}
      <Typography variant="h6"  sx={{ mt: 3 }}>
        Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Lorem ipsum dolor sit amet consectetur. Turpis habitasse risus porttitor
        sed maecenas. Dictum convallis sit enim id. Curabitur praesent
        scelerisque consectetur natoque aliquet pellentesque orci enim. Gravida
        tincidunt consectetur rhoncus molestie a pellentesque vestibulum.
      </Typography>
    </Container>
  );
};

export default SchemesDetails;
