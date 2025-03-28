import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid2,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import UserAvatar from "../components/UserAvatar";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSnackbar } from "notistack";
import CheckIcon from "@mui/icons-material/Check";

const ViewProfileBackgroundBox = styled(Box)({
  minHeight: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  padding: "30px 0px",
});

const ViewProfile = () => {
  const [viewUser, setViewUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [connectLoading, setConnectLoading] = useState(false);

  const params = useParams();
  const { id } = params;
  const { user, setUser } = useAuthStore();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleConnect = async (id, name) => {
    // Get response from API call
    try {
      setConnectLoading(true);
      const response = await axios.post(
        "/api/users/connect",
        {
          userId1: user._id,
          userId2: id,
        },
        { withCredentials: true }
      );
      enqueueSnackbar(`Successfully connected with ${name}.`, {
        variant: "success",
      });
      setUser((prev) => {
        return {
          ...prev,
          score: response.data.userA.score,
          connections: [...prev.connections, response.data.userB._id],
        };
      });
    } catch (error) {
      switch (error.status) {
        case 404:
          enqueueSnackbar("User not found.", { variant: "error" });
          break;
        case 400:
          enqueueSnackbar(`You were already connected to ${name}`, {
            variant: "info",
          });
          break;
        case 500:
          enqueueSnackbar("Error connecting users.", { variant: "error" });
          break;
        default:
          enqueueSnackbar("Unknown error. Please try again later.", {
            variant: "error",
          });
          break;
      }
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async (id, name) => {
    try {
      setConnectLoading(true);
      const response = await axios.post(
        "/api/users/disconnect",
        {
          userId1: user._id,
          userId2: id,
        },
        { withCredentials: true }
      );
      enqueueSnackbar(`Successfully disconnected with ${name}.`, {
        variant: "success",
      });
      setUser((prev) => {
        return {
          ...prev,
          connections: response.data.user1Connections,
        };
      });
    } catch (error) {
      switch (error.status) {
        case 404:
          enqueueSnackbar("User not found.", { variant: "error" });
          break;
        case 500:
          enqueueSnackbar("Error disconnecting users.", { variant: "error" });
          break;
        default:
          enqueueSnackbar("Unknown error. Please try again later.", {
            variant: "error",
          });
          break;
      }
    } finally {
      setConnectLoading(false);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/viewProfile/${id}`, {
          withCredentials: true,
        });
        setViewUser(response.data.user);
      } catch (error) {
        console.error("Error loading profile", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, [id]);

  return (
    <ViewProfileBackgroundBox>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography>An error occurred.</Typography>
      ) : (
        <>
          <UserAvatar
            user={viewUser}
            style={{
              height: "100px",
              width: "100px",
              fontSize: "50px",
              border: "2px solid black",
            }}
          />
          <Typography fontSize="30px">{viewUser.name}</Typography>
          {user.connections.includes(viewUser._id) ? (
            <Button
              onClick={() => handleDisconnect(viewUser._id, viewUser.name)}
              variant="contained"
              color="error"
              disabled={connectLoading}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={() => handleConnect(viewUser._id, viewUser.name)}
              variant="contained"
              color="primary"
              disabled={connectLoading}
            >
              Connect
            </Button>
          )}
          <Grid2 container spacing={10} justifyContent={"center"}>
            <Box>
              <Typography fontSize="21px" mr="7px">
                Skills:
              </Typography>
              <List
                sx={{
                  overflow: "auto",
                  width: 250,
                  maxHeight: 300,
                  border: "2px solid black",
                }}
              >
                {viewUser.skills.map((skill) => (
                  <ListItem key={skill}>
                    <ListItemText>{skill}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box>
              <Typography fontSize="21px" mr="7px">
                Connections:
              </Typography>
              <List
                sx={{
                  overflow: "auto",
                  width: 250,
                  maxHeight: 300,
                  border: "2px solid black",
                }}
              >
                {viewUser.connections
                  .filter((conn) => conn._id !== user._id)
                  .map((conn) => (
                    <ListItemButton
                      key={conn._id}
                      style={{ display: "flex", width: "100%" }}
                      onClick={() => {
                        navigate(`/view/${conn._id}`);
                      }}
                    >
                      <UserAvatar user={conn} style={{ mr: 3 }} />
                      <Typography sx={{ flexGrow: 1 }}>{conn.name}</Typography>
                      <Typography mr={2}>{conn.score}</Typography>
                    </ListItemButton>
                  ))}
              </List>
            </Box>
          </Grid2>
          <Box>
            <Typography fontSize="21px" mr="7px">
              Certifications:
            </Typography>
            <List
              sx={{
                overflow: "auto",
                width: 350,
                maxHeight: 300,
                border: "2px solid black",
                padding: "10px"
              }}
            >
              {viewUser.certificates
                .filter((conn) => conn._id !== user._id)
                .map((certi) => (
                  <ListItem
                    key={certi._id}
                    sx={{ border: "2px solid black", margin: "10px 0px" }}
                  >
                    <Grid2 container spacing={1}>
                      <Grid2>
                        <Typography fontSize={"24px"} fontWeight={600}>
                          {certi.certName}
                        </Typography>
                        <Typography>{certi.organization}</Typography>
                      </Grid2>
                      <Grid2>
                        <Typography>ID: {certi.certificateId}</Typography>
                        <Box sx={{ display: "flex", gap: "20px" }}>
                          <Typography>
                            Issue Date:{" "}
                            {new Date(certi.issueDate).toLocaleDateString()}
                          </Typography>
                          {certi.expiryDate ? (
                            <Typography>
                              Expiry Date:{" "}
                              {new Date(certi.expiryDate).toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Typography>Does not expire</Typography>
                          )}
                        </Box>
                      </Grid2>
                      <Grid2>
                        {certi.isVerified && (
                          <Chip
                            label="Verified"
                            color="success"
                            icon={<CheckIcon />}
                            sx={{ fontSize: "16px" }}
                          />
                        )}
                      </Grid2>
                    </Grid2>
                  </ListItem>
                ))}
            </List>
          </Box>
        </>
      )}
    </ViewProfileBackgroundBox>
  );
};

export default ViewProfile;
