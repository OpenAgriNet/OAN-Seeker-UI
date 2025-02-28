import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "720px",
        minWidth: "200px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <TextField
        fullWidth
        placeholder="Search By Name"
        variant="outlined"
        InputProps={{
          sx: {
            backgroundColor: "rgba(233, 231, 239, 1)",
            borderRadius: "28px",
            height: "50px",
            paddingRight: "15px",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" }, 
          },
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "#5f5f5f" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
