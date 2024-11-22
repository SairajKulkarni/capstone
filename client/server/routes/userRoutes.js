const express = require("express");
const {
  connectUsers,
  getUserConnections,
  disconnectUsers,
} = require("../controllers/connectionController");
const { createUsersBulk } = require("../controllers/userController");
const {
  recommendUsersByInterests,
  recommendUsersByLevel,
  recommendUsersByInterestsAndLevel,
} = require("../controllers/recommendationController");

const router = express.Router();

// POST /api/users/connect - Connect two users
router.post("/connect", connectUsers);

// POST /api/users/recommend/interests - Recommend users by interests
router.post("/recommend/interests", recommendUsersByInterests);

// POST /api/users/recommend/level - Recommend users by skill level
router.post("/recommend/level", recommendUsersByLevel);

router.post("/recommend/level-interest", recommendUsersByInterestsAndLevel);

router.post("/bulk", createUsersBulk);

router.get("/connections/:userId", getUserConnections);

router.post("/disconnect", disconnectUsers);

module.exports = router;
