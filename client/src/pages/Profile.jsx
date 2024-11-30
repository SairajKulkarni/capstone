import { useState, useContext } from "react";
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
import { enqueueSnackbar, useSnackbar } from "notistack";

import { skills } from "../utils/dummyData";
import { UserContext } from "../components/userContextHook";
import PropTypes from "prop-types";
import axios from "axios";

const ProfileBackgroundBox = styled(Box)({
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { user, setUser } = useContext(UserContext);

  return (
    <ProfileBackgroundBox>
      <IconButton style={{ position: "absolute", top: "30px", left: "40px" }}>
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <KeyboardBackspace fontSize="large" />
        </Link>
      </IconButton>
      {user.name ? (
        <>
          <NameSection enqueueSnackbar={enqueueSnackbar} />
          <Divider />
          <SkillsSection enqueueSnackbar={enqueueSnackbar} />
        </>
      ) : (
        <CircularProgress />
      )}
    </ProfileBackgroundBox>
  );
};

const NameSection = ({ enqueueSnackbar }) => {
  const { user, setUser } = useContext(UserContext);
  const [editingName, setEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    // Call API to edit user name
    try {
      const response = await axios.put("", {
        userId: user._id,
        changes: { name: userName },
      });
      enqueueSnackbar(`Successfully changed name.`, { variant: "success" });
      setUser({ ...user, name: userName });
    } catch (error) {
      switch (error.status) {
        case 404:
          enqueueSnackbar("User not found.", { variant: "error" });
          break;
        case 500:
          enqueueSnackbar("Error changing name.", { variant: "error" });
          break;
        default:
          enqueueSnackbar("Unknown error. Please try again later.", {
            variant: "error",
          });
          break;
      }
    } finally {
      setNameLoading(false);
    }
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

NameSection.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

const SkillsSection = ({ enqueueSnackbar }) => {
  const { user, setUser } = useContext(UserContext);

  const [userSkills, setUserSkills] = useState(user.skills);
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const handleSkillsChange = async (e) => {
    e.preventDefault();
    setSkillsLoading(true);
    // Call API to edit user
    e.preventDefault();
    setSkillsLoading(true);
    // Call API to edit user name
    try {
      const response = await axios.put("", {
        userId: user._id,
        changes: { skills: userSkills },
      });
      enqueueSnackbar(`Successfully changed skills.`, { variant: "success" });
      setUser({ ...user, skills: userSkills });
    } catch (error) {
      switch (error.status) {
        case 404:
          enqueueSnackbar("User not found.", { variant: "error" });
          break;
        case 500:
          enqueueSnackbar("Error changing sklls.", { variant: "error" });
          break;
        default:
          enqueueSnackbar("Unknown error. Please try again later.", {
            variant: "error",
          });
          break;
      }
    } finally {
      setSkillsLoading(false);
    }
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

SkillsSection.propTypes = {
  enqueueSnackbar: PropTypes.func,
};

export default Profile;
