import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="" element={<PrivateRoute />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/messages" element={<Messages />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
