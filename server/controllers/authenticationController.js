const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "your_jwt_secret"; // Use a secure secret in production

// Login API
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        score: user.score,
        skills: user.skills,
        connections: user.connections,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error });
  }
};

// Sign Up API
const signup = async (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const newUser = await User.create({ username, name, password });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      score: newUser.score,
    });
  } catch (error) {
    res.status(500).json({ message: "Sign-up failed.", error });
  }
};

// Logout API
const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = { login, signup, logout };
