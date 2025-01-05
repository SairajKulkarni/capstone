import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate(); // Used for navigation

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/connections", {withCredentials: true}); // Replace with your backend endpoint
        setUsers(response.data.connections);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch chats for the selected user
  const fetchChats = async (userId) => {
    try {
      const response = await axios.get(`/api/chat/${userId}`); // Replace with your backend endpoint
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchChats(user._id); // Replace `id` with your user identifier key
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Left Pane: User List */}
      <Paper
        sx={{
          width: "25%",
          height: "100%",
          overflowY: "auto",
          borderRight: "1px solid #ddd",
          padding: 2,
        }}
        elevation={1}
      >
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List>
          {users.map((user) => (
            <ListItem
              key={user._id} // Replace `id` with your user identifier key
              // button
              onClick={() => handleUserClick(user)}
              sx={{
                borderRadius: "5px",
                backgroundColor: selectedUser?.id === user.id ? "#e0f7fa" : "transparent",
                "&:hover": {
                  backgroundColor: "#f1f1f1",
                },
                mb: 1,
              }}
            >
              <ListItemText primary={user.name} /> {/* Replace `name` with your user name field */}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Pane: Chat Window */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {/* Back Arrow */}
          <IconButton
            onClick={() => navigate("/")} // Redirect to Home page
            sx={{
              marginRight: 2,
              backgroundColor: "#e0e0e0",
              "&:hover": { backgroundColor: "#d6d6d6" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            {selectedUser ? `Chat with ${selectedUser.name}` : "Messages"}
          </Typography>
        </Box>

        {selectedUser ? (
          <>
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: "#ffffff",
                padding: 2,
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              {chats.map((chat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: chat.sender === selectedUser.id ? "flex-start" : "flex-end",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor: chat.sender === selectedUser.id ? "#f1f1f1" : "#daf8cb",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    {chat.message}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                mt: 2,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="primary">
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="textSecondary">
            Select a user to start chatting
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Messages;
