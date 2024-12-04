import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { UserContext } from "./userContextHook";
import { useLocation, useNavigate } from "react-router-dom";

const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { _id: "", name: "", score: "", skills: [], connections: [] };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    if (user._id === "") {
      navigate("/login");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.object,
};

export default UserProvider;
