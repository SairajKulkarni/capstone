import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import { Chat, WorkspacePremium } from "@mui/icons-material";

import { useAuthStore } from "../store/useAuthStore";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { user, logout } = useAuthStore();

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
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="text"
            onClick={() => {
              navigate("/");
            }}
            sx={{ color: "white" }}
          >
            Skill Connect
          </Button>
        </Box>
        <Box>
          {location.pathname !== "/messages" && (
            <Tooltip title="Messages">
              <IconButton
                size="large"
                edge="end"
                sx={{ color: "white", mr: "2px" }}
                onClick={() => navigate("/messages")}
              >
                <Chat fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton
            size="large"
            edge="end"
            sx={{ color: "white" }}
            onClick={handleOpen}
          >
            <UserAvatar user={user} />
          </IconButton>
        </Box>
        <Menu anchorEl={accountAnchorEl} open={open} onClose={handleClose}>
          {location.pathname !== "/profile" && (
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
