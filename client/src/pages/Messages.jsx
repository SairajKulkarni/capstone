import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
        backgroundColor: "#f0f2f5",
      }}
    >
      {!isMobile || !selectedConnection ? (
        <ConnectionsList
          selectedConnection={selectedConnection}
          setSelectedConnection={setSelectedConnection}
        />
      ) : null}
      <ChatWindow selectedConnection={selectedConnection}
      setSelectedConnection={setSelectedConnection} />
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
        width: { xs: "100%", sm: "30%" },
        height: { xs: "50vh", sm: "100%" },
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
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : connectionsError ? (
        <Typography align="center">An error occurred.</Typography>
      ) : connections.length === 0 ? (
        <Typography align="center">You have no connections yet.</Typography>
      ) : (
        <List>
          {connections.map((user) => (
            <ListItemButton
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
                secondary={onlineUsers.includes(user._id) ? "Online" : "Offline"}
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

const ChatWindow = ({ selectedConnection, setSelectedConnection }) => {
  const [chats, setChats] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const { socket } = useAuthStore();
  const isMobile = useMediaQuery("(max-width:600px)");
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
        {isMobile && selectedConnection && (
          <IconButton onClick={() => setSelectedConnection(null)}>
            <ArrowBackIcon />
          </IconButton>
        )}
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
