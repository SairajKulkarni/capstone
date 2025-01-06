import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";

import PasswordField from "../components/PasswordField";

import validatePassword from "../utils/validatePassword.js";
import Logo from "../assets/network-icon-1897-Windows.ico";
import axios from "axios";
import { useSnackbar } from "notistack";

const BackgroundBox = styled(Box)({
  width: "100vw",
  height: "100vh",
  background:
    "url(https://images.unsplash.com/photo-1666725257093-e2f1eebf4f5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SignupForm = styled("form")({
  width: "30vw",
  minHeight: "75vh",
  backgroundColor: "white",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
});

const Signup = () => {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    setLoading(true);
    // Logic to call signup API
    try {
      const response = await axios.post(
        "/api/auth/signup",
        {
          username: username,
          name: name,
          password: password,
        },
        { withCredentials: true }
      );
      enqueueSnackbar("Sign up successful. You can login now", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      switch (error.status) {
        case 400:
          enqueueSnackbar("All fields are required", { variant: "warning" });
          break;
        case 409:
          enqueueSnackbar("Username already exists", { variant: "error" });
          setUsernameError(true);
          break;
        default:
          enqueueSnackbar("Error signing up. Please try again later", {
            variant: "error",
          });
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundBox>
      <SignupForm autoComplete="off" onSubmit={handleSubmit}>
        <img src={Logo} alt="logo" />
        <Typography>Sign Up</Typography>
        <FormControl error={usernameError} sx={{ width: "60%" }}>
          <TextField
            autoFocus
            required
            label={"Enter Username"}
            value={username}
            error={usernameError}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && (
            <FormHelperText>Username already exists.</FormHelperText>
          )}
        </FormControl>
        <FormControl sx={{ width: "60%" }}>
          <TextField
            required
            label={"Enter Name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl
          error={passwordError || confirmPasswordError}
          sx={{ width: "60%" }}
        >
          <PasswordField
            label={"Enter Password"}
            value={password}
            error={passwordError || confirmPasswordError}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
              setConfirmPasswordError(false);
            }}
          />
          {confirmPasswordError && (
            <FormHelperText>
              Passwords don&#39;t match. Please check.
            </FormHelperText>
          )}
          {passwordError && (
            <FormHelperText>
              Please make sure your password
              <ul>
                <li>Is at least eight characters long</li>
                <li>Has at least one small letter</li>
                <li>Has at least one capital letter</li>
                <li>Has at least one number</li>
                <li>Has at least one special character (#, @, or &)</li>
              </ul>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          error={passwordError || confirmPasswordError}
          sx={{ width: "60%" }}
        >
          <PasswordField
            label={"Confirm Password"}
            value={confirmPassword}
            error={passwordError || confirmPasswordError}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(false);
            }}
          />
          {confirmPasswordError && (
            <FormHelperText>
              Passwords don&#39;t match. Please check.
            </FormHelperText>
          )}
        </FormControl>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained">
            Sign up
          </Button>
        )}
        <Typography fontSize={15}>
          Already have an account? Click <Link to={"/login"}>here</Link> to
          login instead.
        </Typography>
      </SignupForm>
    </BackgroundBox>
  );
};

export default Signup;
