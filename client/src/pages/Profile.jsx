import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";

import styled from "@emotion/styled";
import { Close, Done, Edit, KeyboardBackspace } from "@mui/icons-material";
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

import { useSnackbar } from "notistack";
import { useAuthStore } from "../store/useAuthStore";
import { skills } from "../utils/dummyData";
import stringAvatar from "../utils/avatarString";

const ProfileBackgroundBox = styled(Box)({
  height: "calc(100vh - 64px)",
  // width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthStore();

  const navigate = useNavigate();

  return (
    <ProfileBackgroundBox>
      <IconButton
        onClick={() => navigate("/")}
        style={{ position: "absolute", top: "80px", left: "40px" }}
      >
        <KeyboardBackspace fontSize="large" />
      </IconButton>

      <NameSection enqueueSnackbar={enqueueSnackbar} />
      <Divider />
      <SkillsSection enqueueSnackbar={enqueueSnackbar} />
    </ProfileBackgroundBox>
  );
};

const NameSection = ({ enqueueSnackbar }) => {
  const { user, setUser } = useAuthStore();
  const [editingName, setEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [userName, setUserName] = useState(user.name);

  const handleNameChange = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    // Call API to edit user name
    try {
      const response = await axios.put(
        "/api/users/edit",
        {
          userId: user._id,
          change: { name: userName },
        },
        { withCredentials: true }
      );
      enqueueSnackbar(`Successfully changed name.`, { variant: "success" });
      setUser((prev) => {
        return {
          ...prev,
          name: userName,
        };
      });
      setEditingName(false);
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
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
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
            <Box>
              <IconButton type="submit" style={{ height: "50px" }}>
                <Done fontSize="large" />
              </IconButton>
              <IconButton
                onClick={() => {
                  setEditingName(false);
                  setUserName(user.name);
                }}
                style={{ height: "50px" }}
              >
                <Close fontSize="large" />
              </IconButton>
            </Box>
          )}
        </form>
      ) : (
        <Box style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
  const { user, setUser } = useAuthStore();
  const [userSkills, setUserSkills] = useState(user.skills);
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const handleSkillsChange = async (e) => {
    e.preventDefault();
    setSkillsLoading(true);
    try {
      const response = await axios.put(
        "/api/users/edit",
        {
          userId: user._id,
          change: { skills: userSkills },
        },
        { withCredentials: true }
      );
      enqueueSnackbar(`Successfully changed skills.`, { variant: "success" });
      setUser((prev) => {
        return { ...prev, skills: userSkills };
      });
      setEditingSkills(false);
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
        disabled={skillsLoading || (!editingSkills && userSkills.length === 0)}
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
