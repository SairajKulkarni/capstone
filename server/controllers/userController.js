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

const editUser = async (req, res) => {
  try {
    const { userId, change } = req.body; // Extract userId and changes from the request body

    if (!userId || !change) {
      return res
        .status(400)
        .json({ message: "Invalid input. userId and change are required." });
    }

    // Update the user with the provided changes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: change },
      { new: true, runValidators: true } // Return the updated user and validate changes
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from authenticate middleware

    // Find the user by ID and populate connections
    const user = await User.findById(userId)
      .populate("connections", "name score")
      .select("-password -__v"); // Exclude password and version fields

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        score: user.score,
        skills: user.skills,
        connections: user.connections,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile.", error });
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

module.exports = { createUsersBulk, editUser, getUserProfile };
