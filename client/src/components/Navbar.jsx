import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { AccountCircle, Chat } from "@mui/icons-material";

const Navbar = () => {
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const open = Boolean(accountAnchorEl);

  const navigate = useNavigate();

  const handleOpen = (e) => {
    setAccountAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAccountAnchorEl(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Skill Connect
        </Typography>

        <Box>
          <IconButton
            size="large"
            edge="end"
            sx={{ color: "white", mr: "2" }}
            onClick={() => navigate("/messages")}
          >
            <Chat fontSize="large" />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            sx={{ color: "white" }}
            onClick={handleOpen}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
        </Box>
        <Menu anchorEl={accountAnchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
