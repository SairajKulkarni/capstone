import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { useSnackbar } from "notistack";
import { useAuthStore } from "../store/useAuthStore";
import PasswordField from "../components/PasswordField";
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

const LoginForm = styled("form")({
  width: "30vw",
  height: "75vh",
  backgroundColor: "white",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "4vh",
  padding: "10px",
});

const Login = () => {
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username.trim(), password.trim(), setLoading);

    if (result.success) navigate("/");
    else {
      switch (result.error.status) {
        case 400:
          enqueueSnackbar("All fields are required", { variant: "warning" });
          break;
        case 401:
          enqueueSnackbar("Invalid username or password", { variant: "error" });
          setError(true);
          break;
        default:
          enqueueSnackbar("Error signing in. Please try again later", {
            variant: "error",
          });
          break;
      }
    }
  };

  return (
    <BackgroundBox>
      <LoginForm autoComplete="off" onSubmit={handleSubmit}>
        <img src={Logo} alt="logo" />
        <Typography>Login</Typography>
        <FormControl error={error} sx={{ width: "60%" }}>
          <TextField
            autoFocus
            required
            label={"Username"}
            value={username}
            error={error}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl error={error} sx={{ width: "60%" }}>
          <PasswordField
            label={"Password"}
            value={password}
            error={error}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <FormHelperText>
              Invalid username or password. Please try again.
            </FormHelperText>
          )}
        </FormControl>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button type="submit" variant="contained">
            Login
          </Button>
        )}
        <Typography fontSize={15}>
          Don&#39;t have an account? Click <Link to={"/signup"}>here</Link> to
          sign up instead.
        </Typography>
      </LoginForm>
    </BackgroundBox>
  );
};

export default Login;
