import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import UserProvider from "./components/UserContext";
import "./index.css";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <UserProvider>
        <Home />
      </UserProvider>
    ),
    errorElement: <PageNotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/profile",
    element: (
      <UserProvider>
        <Profile />
      </UserProvider>
    ),
  },
  {
    path: "/messages", // Add the route for messages
    element: (
      <UserProvider>
        <Messages />
      </UserProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider maxSnack={2}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </StrictMode>
);
