import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout } = useAuthStore();

  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const open = Boolean(accountAnchorEl);

  const navigate = useNavigate();
  const location = useLocation();

  const handleOpen = (e) => {
    setAccountAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAccountAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Skill Connect
        </Typography>
        <Box>
          {location.pathname !== "/messages" && (
            <IconButton
              size="large"
              edge="end"
              sx={{ color: "white", mr: "2px" }}
              onClick={() => navigate("/messages")}
            >
              <Chat fontSize="large" />
            </IconButton>
          )}
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
          {location.pathname !== "/profile" ? (
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem>
          ) : (
            <Box
              style={{
                padding: "7px",
                backgroundColor: "ActiveBorder",
                textAlign: "center",
              }}
            >
              <Typography>Profile</Typography>
            </Box>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
