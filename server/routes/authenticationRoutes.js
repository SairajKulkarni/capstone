const express = require("express");
const {
  login,
  signup,
  logout,
} = require("../controllers/authenticationController");

const router = express.Router();

// Login route
router.post("/login", login);

// Sign-up route
router.post("/signup", signup);

// Logout route
router.post("/logout", logout);

module.exports = router;
