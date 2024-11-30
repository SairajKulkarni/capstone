import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { UserContext } from "./userContextHook";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    score: "",
    skills: [],
    connections: [],
  });

  useEffect(() => {
    setUser({
      _id: "648fa12c9f1b2a001a5e6b36",
      name: "Anita Sharma",
      score: 92,
      skills: ["HTML", "CSS", "JavaScript", "React", "MongoDB", "Express"],
      connections: ["648fa12c9f1b2a001a5e6b37", "648fa12c9f1b2a001a5e6b38"],
    });
  }, []);
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
