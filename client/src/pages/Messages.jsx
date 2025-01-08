import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { useAuthStore } from "../store/useAuthStore";
import UserAvatar from "../components/UserAvatar";

const Messages = () => {
  const [selectedConnection, setSelectedConnection] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        backgroundColor: "#f0f2f5",
      }}
    >
      <ConnectionsList
        selectedConnection={selectedConnection}
        setSelectedConnection={setSelectedConnection}
      />
      <ChatWindow selectedConnection={selectedConnection} />
    </Box>
  );
};

const ConnectionsList = ({ selectedConnection, setSelectedConnection }) => {
  const { onlineUsers } = useAuthStore();

  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [connectionsError, setConnectionsError] = useState(false);

  const handleUserClick = (user) => {
    setSelectedConnection(user);
  };

  useEffect(() => {
    const getConnections = async () => {
      setConnectionsLoading(true);
      setConnectionsError(false);
      try {
        const response = await axios.get("/api/users/connections", {
          withCredentials: true,
        });
        setConnections(response.data.connections);
      } catch (error) {
        console.error("Error fetching users:", error);
        setConnectionsError(true);
      } finally {
        setConnectionsLoading(false);
      }
    };
    getConnections();
  }, []);

  return (
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
      {connectionsLoading ? (
        <Box
          width="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : connectionsError ? (
        <Box
          width="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Typography> An error occurred.</Typography>
        </Box>
      ) : connections.length === 0 ? (
        <Box
          width="100%"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Typography>You have no connections yet.</Typography>
        </Box>
      ) : (
        <List>
          {connections.map((user) => (
            <ListItemButton
              disableGutters
              key={user._id}
              onClick={() => handleUserClick(user)}
              sx={{
                borderRadius: "5px",
                backgroundColor:
                  selectedConnection?._id === user._id
                    ? "#e0f7fa"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "#f1f1f1",
                },
                mb: 1,
              }}
            >
              <ListItemAvatar>
                <UserAvatar user={user} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={onlineUsers.includes(user._id) ? "Online" : ""}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Paper>
  );
};

ConnectionsList.propTypes = {
  selectedConnection: PropTypes.object,
  setSelectedConnection: PropTypes.func.isRequired,
};

const ChatWindow = ({ selectedConnection }) => {
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const { socket } = useAuthStore();

  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsError, setChatsError] = useState(false);

  const chatEndRef = useRef(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const formText = text.trim();
    if (formText === "") return;
    try {
      const newMessage = await axios.post(
        `/api/chat/send/${selectedConnection._id}`,
        { text: formText, image }
      );
      setChats((prev) => [...prev, newMessage.data.newMessage]);
      setText("");
      setImage("");
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error sending message", { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchChats = async (userId) => {
      setChatsLoading(true);
      setChatsError(false);
      try {
        const response = await axios.get(`/api/chat/${userId}`);
        setChats(response.data.messages);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatsError(true);
      } finally {
        setChatsLoading(false);
      }
    };

    if (selectedConnection) fetchChats(selectedConnection._id);

    const getNewMessages = () => {
      if (!selectedConnection) return;
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedConnection._id) return;
        setChats((prev) => [...prev, newMessage]);
      });
    };

    getNewMessages();

    return () => {
      socket.off("newMessage");
    };
  }, [selectedConnection, socket]);

  useEffect(() => {
    if (chatEndRef.current && chats)
      chatEndRef.current.scrollIntoView({ behvior: "smooth" });
  }, [chats]);

  return (
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
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          {selectedConnection
            ? `Chat with ${selectedConnection.name}`
            : "Messages"}
        </Typography>
      </Box>

      {selectedConnection ? (
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
            {chatsLoading ? (
              <Box
                width="100%"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : chatsError ? (
              <Box
                width="100%"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Typography> An error occurred.</Typography>
              </Box>
            ) : (
              <>
                <Typography align="center" mb="6px">
                  This is the start of the conversation
                </Typography>
                <hr style={{ marginBottom: "13px" }} />
                {chats.map((chat, index) => (
                  <Box
                    key={index}
                    ref={chatEndRef}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        chat.senderId === selectedConnection._id
                          ? "flex-start"
                          : "flex-end",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "70%",
                        padding: "10px",
                        borderRadius: "10px",
                        backgroundColor:
                          chat.senderId === selectedConnection._id
                            ? "#e0f7fa"
                            : "#f1f1f1",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography>{chat.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Box>
          <form
            autoComplete="off"
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              marginTop: 2,
            }}
          >
            <TextField
              autoFocus
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
              placeholder="Type your message..."
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained">
              Send
            </Button>
          </form>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary">
          Select a user to start chatting
        </Typography>
      )}
    </Box>
  );
};

ChatWindow.propTypes = {
  selectedConnection: PropTypes.object,
};

export default Messages;
