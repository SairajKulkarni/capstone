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
import ViewProfile from "./pages/ViewProfile";

const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <Box
        style={{
          height: "100vh",
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
            user ? (
              <>
                <Navbar /> <Outlet />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/view/:id" element={<ViewProfile />}></Route>
          <Route path="/messages" element={<Messages />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
