import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "./store/useAuthStore";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
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
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path=""
          element={
            <>
              <Navbar /> <Outlet />
            </>
          }
        >
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          ></Route>
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          ></Route>
          <Route
            path="/messages"
            element={user ? <Messages /> : <Navigate to="/login" />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
