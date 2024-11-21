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

module.exports = { createUsersBulk };
