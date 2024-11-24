import { useState, useEffect, createContext, useContext } from "react";
import { Done, Edit, KeyboardBackspace } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import stringAvatar from "../utils/avatarString";
import { useSnackbar } from "notistack";

import { skills } from "../utils/dummyData";

const ProfileBackgroundBox = styled(Box)({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const UserContext = createContext();

const useUser = () => useContext(UserContext);

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState();
  // const [userLoading, setUserLoading] = useState(false); May be used later depending on API

  useEffect(() => {
    // Likely, fetch user from local storage. If not that, get details through an API
    setUser({
      _id: "648fa12c9f1b2a001a5e6b36",
      name: "Anita Sharma",
      score: 92,
      skills: ["HTML", "CSS", "JavaScript", "React", "MongoDB", "Express"],
      connections: ["648fa12c9f1b2a001a5e6b37", "648fa12c9f1b2a001a5e6b38"],
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, enqueueSnackbar }}>
      <ProfileBackgroundBox>
        <IconButton style={{ position: "absolute", top: "30px", left: "40px" }}>
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <KeyboardBackspace fontSize="large" />
          </Link>
        </IconButton>
        {user ? (
          <>
            <NameSection />
            <Divider />
            <SkillsSection />
          </>
        ) : (
          <CircularProgress />
        )}
      </ProfileBackgroundBox>
    </UserContext.Provider>
  );
};

const NameSection = () => {
  const { user, setUser, enqueueSnackbar } = useUser();
  const [editingName, setEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    // Call API to edit user
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Timeout to test loading screen
    // Dummy data for testing
    const statusArray = [200, 404, 500];
    const status = statusArray[Math.floor(Math.random() * 3)];

    // Notifying users about the result through a snackbar queue
    switch (status) {
      case 200:
        enqueueSnackbar(`Successfully changed name.`, { variant: "success" });
        setUser({ ...user, name: userName });
        setEditingName(false);
        break;
      case 404:
        enqueueSnackbar("User not found.", { variant: "error" });
        break;
      case 500:
        enqueueSnackbar("Error changing name.", { variant: "error" });
        break;
      default:
        break;
    }
    setNameLoading(false);
  };

  return (
    <>
      <Avatar
        {...stringAvatar(user.name, {
          height: "100px",
          width: "100px",
          fontSize: "50px",
        })}
      />
      {editingName ? (
        <form
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          onSubmit={handleNameChange}
        >
          <TextField
            autoComplete="off"
            disabled={nameLoading}
            label="Edit name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {nameLoading ? (
            <CircularProgress />
          ) : (
            <IconButton type="submit" style={{ height: "50px" }}>
              <Done fontSize="large" />
            </IconButton>
          )}
        </form>
      ) : (
        <Box style={{ display: "flex", alignItems: "center" }}>
          <Typography fontSize="50px">{user.name}</Typography>
          <IconButton
            style={{ height: "50px" }}
            onClick={() => setEditingName(true)}
          >
            <Edit fontSize="large" />
          </IconButton>
        </Box>
      )}
      <Typography fontSize="25px">Score: {user.score}</Typography>
    </>
  );
};

const SkillsSection = () => {
  const { user, setUser, enqueueSnackbar } = useUser();

  const [userSkills, setUserSkills] = useState(user.skills);
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const handleSkillsChange = async (e) => {
    e.preventDefault();
    setSkillsLoading(true);
    // Call API to edit user
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Timeout to test loading screen
    // Dummy data for testing
    const statusArray = [200, 404, 500];
    const status = statusArray[Math.floor(Math.random() * 3)];

    // Notifying users about the result through a snackbar queue
    switch (status) {
      case 200:
        enqueueSnackbar(`Successfully changed skills.`, { variant: "success" });
        setUser({ ...user, skills: userSkills });
        setEditingSkills(false);
        break;
      case 404:
        enqueueSnackbar("User not found.", { variant: "error" });
        break;
      case 500:
        enqueueSnackbar("Error changing skills.", { variant: "error" });
        break;
      default:
        break;
    }
    setSkillsLoading(false);
  };

  return (
    <form
      style={{
        width: "80%",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
      }}
      onSubmit={handleSkillsChange}
    >
      <Typography>Your skills:</Typography>
      <Autocomplete
        multiple
        freeSolo
        readOnly={!editingSkills}
        disabled={skillsLoading}
        fullWidth
        options={[...new Set([...userSkills, ...skills])]}
        value={userSkills}
        onChange={(e, value) => setUserSkills(value)}
        renderInput={(params) => <TextField {...params} label="Skills" />}
      />
      {editingSkills ? (
        skillsLoading ? (
          <CircularProgress />
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Done />}
              type="submit"
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setEditingSkills(false);
                setUserSkills(user.skills);
              }}
            >
              Cancel
            </Button>
          </Stack>
        )
      ) : (
        <Box>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setEditingSkills(true)}
          >
            Edit
          </Button>
        </Box>
      )}
    </form>
  );
};

export default Profile;
