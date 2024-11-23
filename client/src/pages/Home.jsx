import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  AppBar,
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
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Skeleton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { friends, skills, recommendations } from "../utils/dummyData.js";
import stringAvatar from "../utils/avatarString.js";

const HomeBox = styled(Box)({
  height: "100vh",
  width: "100vw",
});

const HomeLayoutBox = styled(Box)({
  height: "calc(100vh - 64px)",
  width: "100vw",
  background: "white",
  display: "flex",
});

const FriendsPaper = styled(Paper)({
  height: "100%",
  width: "25%",
});

const ContentBox = styled(Box)({
  height: "100%",
  width: "75%",
  padding: "20px",
  // background: "red"
});

const FriendsList = styled(List)({
  height: "90%",
  overflowY: "scroll",
});

const FriendsListItem = styled(ListItem)({
  display: "flex",
});

const RecommendationsBox = styled(Box)({
  marginTop: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  height: "80%",
  overflowY: "auto",
  // paddingTop: "150px",
});

const RecommendedUserPaper = styled(Paper)({
  display: "flex",
  flexDirection: "row",
  width: "90%",
  padding: "20px",
  // height: "200px",
});

const NavBar = () => {
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const open = Boolean(accountAnchorEl);
  const handleOpen = (e) => {
    setAccountAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAccountAnchorEl(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          sx={{ color: "white", mr: "20px" }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Skill Connect
        </Typography>
        <Box>
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
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const ConnectionsSection = () => {
  return (
    <FriendsPaper elevation={3}>
      <Typography variant="h6" align="center" padding={2}>
        Your Connections
      </Typography>
      <FriendsList>
        {friends.map((friend) => (
          <FriendsListItem key={friend._id}>
            <Avatar {...stringAvatar(friend.name)} />
            <Typography sx={{ flexGrow: 1 }}>{friend.name}</Typography>
            <Typography>{friend.score}</Typography>
          </FriendsListItem>
        ))}
      </FriendsList>
    </FriendsPaper>
  );
};

const RecommendationsForm = ({
  setRecommendationsLoading,
  setRecommendedUsers,
}) => {
  const [searchType, setSearchType] = useState("1");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleRadioChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRecommendationsLoading(true);
    // Get recommendations through API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Timeout to test loading screen
    setRecommendedUsers(recommendations);
    setRecommendationsLoading(false);
  };
  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <FormControl>
        <Box style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Typography variant="h6">Recommend By</Typography>
          <RadioGroup row value={searchType} onChange={handleRadioChange}>
            <FormControlLabel value="1" control={<Radio />} label="Interest" />
            <FormControlLabel value="2" control={<Radio />} label="Level" />
            <FormControlLabel value="3" control={<Radio />} label="Both" />
          </RadioGroup>
        </Box>
        <Box style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Autocomplete
            multiple
            freeSolo
            options={skills}
            value={selectedSkills}
            disabled={searchType === "2"}
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
  setRecommendationsLoading: PropTypes.func,
  setRecommendedUsers: PropTypes.func,
};

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);

  const addSnackbar = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  const handleConnectClick = (id, name) => {
    // Get response from API call

    // Dummy data for testing
    const statusArray = [200, 400, 404, 500];
    const status = statusArray[Math.floor(Math.random() * 4)];

    // Notifying users about the result through a snackbar queue
    switch (status) {
      case 200:
        addSnackbar(`Successfully connected with ${name}.`, "success");
        break;
      case 404:
        addSnackbar("User not found.", "error");
        break;
      case 400:
        addSnackbar(`You were already connected with ${name}`, "info");
        break;
      case 500:
        addSnackbar("Error connecting users.", "error");
        break;
      default:
        break;
    }
  };

  return (
    <HomeBox>
      {/* Navigation bar */}
      <NavBar />

      {/* Main body */}
      <HomeLayoutBox>
        {/* Side section to show user's connections */}
        <ConnectionsSection />

        {/* Main content */}
        <ContentBox>
        
          {/* Form to get user recommendations. State functions to passed to set values */}
          <RecommendationsForm
            setRecommendationsLoading={setRecommendationsLoading}
            setRecommendedUsers={setRecommendedUsers}
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
                  <Grid2 key={user._id} size={3.5}>
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
                        <Button variant="contained">View</Button>
                      </CardActions>
                    </Card>
                  </Grid2>
                ))}
            </Grid2>
          </RecommendationsBox>
        </ContentBox>
      </HomeLayoutBox>
    </HomeBox>
  );
};

export default Home;
