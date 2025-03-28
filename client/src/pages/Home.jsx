import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import styled from "@emotion/styled";
import { Delete } from "@mui/icons-material";

import { useSnackbar } from "notistack";
import { useAuthStore } from "../store/useAuthStore.js";
import skills from "../utils/skills";
import stringAvatar from "../utils/avatarString.js";
import UserAvatar from "../components/UserAvatar.jsx";
import { useNavigate } from "react-router-dom";

const RecommendationsBox = styled(Box)({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  height: "80%",
  overflowY: "auto",
});

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [noRecommendations, setNoRecommendations] = useState(false);

  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleConnectClick = async (id, name) => {
    // Get response from API call
    try {
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
      setRecommendedUsers((prev) =>
        prev.filter((recUser) => recUser._id !== response.data.userB._id)
      );
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
    }
  };

  return (
    <Box>
      {/* Main body */}
      <Box
        style={{
          height: "calc(100vh - 64px)",
          width: "100vw",
          display: "flex",
        }}
      >
        {/* Side section to show user's connections */}
        <ConnectionsSection />

        {/* Main content */}
        <Box
          style={{
            height: "100%",
            width: isMobile ? "100%" : "75%",
            padding: "20px",
          }}
        >
          {/* Form to get user recommendations. State functions passed to set values */}
          <RecommendationsForm
            setRecommendationsLoading={setRecommendationsLoading}
            setRecommendedUsers={setRecommendedUsers}
            setNoRecommendations={setNoRecommendations}
            enqueueSnackbar={enqueueSnackbar}
          />

          {/* Area to show recommendations for the user */}
          <RecommendationsBox>
            <Grid2 container spacing={4} justifyContent={"center"}>
              {/* Skeleton to show while loading */}
              {recommendationsLoading && (
                <>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                  <Grid2>
                    <Skeleton variant="rounded" height={250} width={300} />
                  </Grid2>
                </>
              )}

              {/* Recommendations */}
              {!recommendationsLoading &&
                recommendedUsers.length !== 0 &&
                recommendedUsers.map((user) => (
                  <Grid2 key={user._id}>
                    <Card sx={{ height: "225px", width: "250px" }}>
                      <CardHeader
                        avatar={<Avatar {...stringAvatar(user.name)} />}
                        title={
                          <Typography variant="h6" textAlign={"right"}>
                            {user.name}
                          </Typography>
                        }
                        subheader={
                          <Typography textAlign={"right"}>
                            Score: {user.score}
                          </Typography>
                        }
                      />
                      <CardContent>
                        <Typography fontSize={18} fontWeight={"bold"}>
                          Skills:
                        </Typography>
                        <Typography
                          sx={{
                            width: "223px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxHeight: "20px",
                          }}
                        >
                          {user.skills.join(", ")}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleConnectClick(user._id, user.name)
                          }
                        >
                          Connect
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/view/${user._id}`)}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid2>
                ))}
              {!recommendationsLoading && noRecommendations && (
                <Typography>No recommendations found.</Typography>
              )}
            </Grid2>
          </RecommendationsBox>
        </Box>
      </Box>
    </Box>
  );
};

const ConnectionsSection = ({ drawerOpen, toggleDrawer }) => {
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [connectionsError, setConnectionsError] = useState(false);

  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleDisconnect = async (id, name) => {
    try {
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
    }
  };

  useEffect(() => {
    const getConnections = async () => {
      setConnectionsLoading(true);
      // Get connections through an API
      if (user._id === "") {
        setConnectionsLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/users/connections", {
          withCredentials: true,
        });
        setConnections(response.data.connections);
      } catch (error) {
        console.error(error);
        setConnectionsError(true);
      } finally {
        setConnectionsLoading(false);
      }
    };
    getConnections();
  }, [user.connections]);

  const ConnectionsList = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" align="center">
        Your Connections
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
          {connections.map((conn) => (
            <ListItemButton
              key={conn._id}
              onClick={() => navigate(`/view/${conn._id}`)}
            >
              <UserAvatar user={conn} sx={{ mr: 2 }} />
              <ListItemText
                sx={{ ml: 2 }}
                primary={conn.name}
                secondary={`Score: ${conn.score}`}
              />
              <IconButton onClick={() => handleDisconnect(conn._id, conn.name)}>
                <Delete />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <>
      {/* Desktop View */}
      {!isMobile && (
        <Paper elevation={3} sx={{ height: "100%", width: "fit" }}>
          {ConnectionsList}
        </Paper>
      )}

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {ConnectionsList}
      </Drawer>
    </>
  );
};

const RecommendationsForm = ({
  setRecommendationsLoading,
  setRecommendedUsers,
  setNoRecommendations,
  enqueueSnackbar,
}) => {
  const [searchType, setSearchType] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const { user } = useAuthStore();
  const userId = user._id;

  const isMobile = useMediaQuery("(max-width: 700px)");

  const handleRadioChange = (e) => {
    setSearchType(Number(e.target.value));
    setRecommendedUsers([]);
    setNoRecommendations(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchType !== 1 && selectedSkills.length === 0) {
      enqueueSnackbar("Select skills to recommend users with.", {
        variant: "warning",
      });
      return;
    }
    setRecommendationsLoading(true);
    setNoRecommendations(false);
    setRecommendedUsers([]);

    // Get recommendations through an API
    const endPoints = [
      {
        apiUrl: "interests",
        apiBody: { userId: userId, interests: selectedSkills },
      },
      {
        apiUrl: "level",
        apiBody: { userId: userId },
      },
      {
        apiUrl: "level-interest",
        apiBody: { userId: userId, interests: selectedSkills },
      },
    ];
    try {
      const response = await axios.post(
        `/api/users/recommend/${endPoints[searchType].apiUrl}`,
        endPoints[searchType].apiBody,
        { withCredentials: true }
      );
      const unconnectedUsers = response.data.recommendedUsers.filter(
        (recUser) => !user.connections.includes(recUser._id)
      );
      if (unconnectedUsers.length === 0) {
        setNoRecommendations(true);
        return;
      } else {
        setRecommendedUsers(unconnectedUsers);
      }
    } catch (error) {
      enqueueSnackbar(
        error.response.data?.message ||
          "Some error occurred. Please try again later.",
        { variant: "error" }
      );
    } finally {
      setRecommendationsLoading(false);
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <FormControl>
        <Box
          style={{
            display: "flex",
            gap: "20px",
            alignItems: isMobile ? "auto" : "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Typography variant="h6">Recommend By</Typography>
          <RadioGroup row value={searchType} onChange={handleRadioChange}>
            <FormControlLabel value={0} control={<Radio />} label="Interest" />
            <FormControlLabel value={1} control={<Radio />} label="Level" />
            <FormControlLabel value={2} control={<Radio />} label="Both" />
          </RadioGroup>
        </Box>
        <Box
          style={{
            display: "flex",
            gap: "20px",
            alignItems: isMobile ? "auto" : "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <Autocomplete
            multiple
            freeSolo
            options={skills}
            value={selectedSkills}
            disabled={searchType === 1}
            onChange={(e, value) => setSelectedSkills(value)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Skill" />}
          />
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
        <FormHelperText>
          If skill not found, type it and press Enter to add it manually.
        </FormHelperText>
      </FormControl>
    </form>
  );
};

RecommendationsForm.propTypes = {
  userId: PropTypes.string,
  setRecommendationsLoading: PropTypes.func,
  setRecommendedUsers: PropTypes.func,
  setNoRecommendations: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
};

export default Home;
