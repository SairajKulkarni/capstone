import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSnackbar } from "notistack";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Navbar from "./Navbar";

const PrivateRoute = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkAuth(enqueueSnackbar);
  }, []);

  if (isCheckingAuth) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? (
    <>
      <Navbar /> <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
