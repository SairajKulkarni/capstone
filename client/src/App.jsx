import { useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useSnackbar } from "notistack";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import "./index.css";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import { CircularProgress } from "@mui/material";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    checkAuth(enqueueSnackbar);
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={user ? <Messages /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
  );
};

export default App;
