import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Chat, Menu as MenuIcon, Delete } from "@mui/icons-material";
import { useAuthStore } from "../store/useAuthStore";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { user, logout, setUser } = useAuthStore();
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const open = Boolean(accountAnchorEl);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 700px)");

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

  // Fetch connections when the drawer opens
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/connections", {
        withCredentials: true,
      });
      setConnections(response.data.connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    fetchConnections(); // Fetch latest connections
  };

  // Handle disconnecting a user
  const handleDisconnect = async (id) => {
    try {
      const response = await axios.post(
        "/api/users/disconnect",
        { userId1: user._id, userId2: id },
        { withCredentials: true }
      );

      // Remove the disconnected user from the list
      setConnections((prevConnections) =>
        prevConnections.filter((conn) => conn._id !== id)
      );

      // Update user store connections
      setUser((prev) => ({
        ...prev,
        connections: response.data.user1Connections,
      }));
    } catch (error) {
      console.error("Error disconnecting user:", error);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            sx={{ color: "white", mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="text"
            onClick={() => navigate("/")}
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
                sx={{ color: "white", mr: "2px" }}
                onClick={() => navigate("/messages")}
              >
                <Chat fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
          <IconButton size="large" sx={{ color: "white" }} onClick={handleOpen}>
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

      {/* Drawer for Connections in Mobile View */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Your Connections
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : connections.length > 0 ? (
            <List>
              {connections.map((conn) => (
                <ListItem
                  key={conn._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      flexGrow: 1,
                    }}
                    onClick={() => navigate(`/view/${conn._id}`)}
                  >
                    <UserAvatar user={conn} sx={{ mr: 2 }} />
                    <ListItemText
                      sx={{ ml: 2 }}
                      primary={conn.name}
                      secondary={`Score: ${conn.score}`}
                    />
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDisconnect(conn._id, conn.name)}
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No connections yet.</Typography>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
