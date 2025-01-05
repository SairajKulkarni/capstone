import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  IconButton,
  List,
  ListItem,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
// import MenuIcon from "@mui/icons-material/Menu";
import { Delete } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { skills } from "../utils/dummyData.js";
import stringAvatar from "../utils/avatarString.js";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.js";
import Navbar from "../components/Navbar.jsx";

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
    <Box height="100vh" width="100vw">
      {/* Navigation bar */}
      <Navbar />

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
        <Box style={{ height: "100%", width: "75%", padding: "20px" }}>
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
                    <Card>
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
                        <Typography>{user.skills.join(", ")}</Typography>
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

const ConnectionsSection = () => {
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [connectionsError, setConnectionsError] = useState(false);

  const { user, setUser } = useAuthStore();

  const { enqueueSnackbar } = useSnackbar();

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

  return (
    <Paper elevation={3} style={{ height: "100%", width: "25%" }}>
      <Typography variant="h6" align="center" padding={2}>
        Your Connections
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
        <List style={{ height: "90%", overflowY: "auto" }}>
          {connections.map((conn) => (
            <ListItem key={conn._id} style={{ display: "flex", width: "100%" }}>
              <Avatar {...stringAvatar(conn.name, { mr: 3 })} />
              <Typography sx={{ flexGrow: 1 }}>{conn.name}</Typography>
              <Typography mr={2}>{conn.score}</Typography>
              <IconButton onClick={() => handleDisconnect(conn._id, conn.name)}>
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
      {/* </Box> */}
    </Paper>
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
        <Box style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Typography variant="h6">Recommend By</Typography>
          <RadioGroup row value={searchType} onChange={handleRadioChange}>
            <FormControlLabel value={0} control={<Radio />} label="Interest" />
            <FormControlLabel value={1} control={<Radio />} label="Level" />
            <FormControlLabel value={2} control={<Radio />} label="Both" />
          </RadioGroup>
        </Box>
        <Box style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
