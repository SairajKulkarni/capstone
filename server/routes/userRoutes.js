const express = require("express");
const {
  connectUsers,
  getUserConnections,
  disconnectUsers,
} = require("../controllers/connectionController");
const {
  createUsersBulk,
  editUser,
  getUserProfile,
} = require("../controllers/userController");
const {
  recommendUsersByInterests,
  recommendUsersByLevel,
  recommendUsersByInterestsAndLevel,
} = require("../controllers/recommendationController");
const { authenticate } = require("../middlewares/authenticate");

const router = express.Router();

// POST /api/users/connect - Connect two users
router.post("/connect", connectUsers);

// POST /api/users/recommend/interests - Recommend users by interests
router.post("/recommend/interests", recommendUsersByInterests);

// POST /api/users/recommend/level - Recommend users by skill level
router.post("/recommend/level", recommendUsersByLevel);

router.post("/recommend/level-interest", recommendUsersByInterestsAndLevel);

router.post("/bulk", createUsersBulk);

router.post("/connections", getUserConnections);

router.post("/disconnect", disconnectUsers);

router.put("/edit", editUser);

router.get("/profile", authenticate, getUserProfile);

module.exports = router;
