import { AppBar, Toolbar, Box } from "@mui/material";
import siteLogo from "../assets/siteLogo.png";

const Header = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(11, 85, 138, 1)",
        px: 2,
        boxShadow:
          "0px 3px 3px -2px rgb(255 255 255 / 20%), 0px 3px 4px 0px rgb(255 217 217 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-start" }}>
        {/* Logo */}
        <Box component="img" src={siteLogo} alt="siteLogo" sx={{ height: 30 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
