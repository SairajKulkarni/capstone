const User = require("../models/User");

// Bulk create users
const createUsersBulk = async (req, res) => {
  const { users } = req.body; // Expect an array of user objects

  try {
    const createdUsers = await User.insertMany(users);
    res
      .status(201)
      .json({ message: "Users created successfully", createdUsers });
  } catch (error) {
    console.error("Error creating users in bulk:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
TODO:
0. Add username and password field to User schema
1. Login API
  Input: username, password
  Output: logged in user's JSON object containing _id, name, score, connections, and skills
2. Sign up API
  Input: username, name, password
  Output: new user's JSON object containing _id, name, and score
3. Logout API
  Input: null
  Output: null
4. Get User Connections API and add route in Home.jsx at line 264
  Input: user id
  Output: array of JSON objects of user's connection's _id, name, and score
  Example: 
  friends = [
  { _id: "64bdf2dce1a1a2a1b1c1a001", name: "Aarav Sharma", score: 95 },
  { _id: "64bdf2dce1a1a2a1b1c1a002", name: "Vivaan Gupta", score: 82 },
  ]
5. Edit User API and add routes in Profile.jsx at line 71 and 160
  Input: user id, object containing fields changed and their new values.
  Examples:
  {
    userId: "64bdf2dce1a1a2a1b1c1a001",
    change: {
      name: "Arav Sharma",
    }
  }
    OR
  {
    userId: "64bdf2dce1a1a2a1b1c1a001",
    change: {
      skills: ["JavaScript", "React", "Node.js", "Express"],
    }
  }
  Output: null
*/

module.exports = { createUsersBulk };
