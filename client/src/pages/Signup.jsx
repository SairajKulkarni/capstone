import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import PasswordField from "../components/PasswordField";

import validatePassword from "../utils/validatePassword.js";
import Logo from "../assets/network-icon-1897-Windows.ico";

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
  gap: "4vh",
});

const Signup = () => {
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }
    // Logic to call signup API
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
              Please make sure to make your password
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
        <FormControl error={confirmPasswordError} sx={{ width: "60%" }}>
          <PasswordField
            label={"Confirm Password"}
            value={confirmPassword}
            error={confirmPasswordError}
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
        <Button type="submit" variant="contained">
          Login
        </Button>
        <Typography fontSize={15}>
          Already have an account? Click <Link to={"/login"}>here</Link> to
          login instead.
        </Typography>
      </SignupForm>
    </BackgroundBox>
  );
};

export default Signup;
