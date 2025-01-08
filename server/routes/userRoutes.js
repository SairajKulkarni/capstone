import express from "express";
import {
  connectUsers,
  getUserConnections,
  disconnectUsers,
} from "../controllers/connectionController.js";
import {
  createUsersBulk,
  editProfilePic,
  editUser,
  getUserProfile,
} from "../controllers/userController.js";
import {
  recommendUsersByInterests,
  recommendUsersByLevel,
  recommendUsersByInterestsAndLevel,
} from "../controllers/recommendationController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// POST /api/users/connect - Connect two users
router.post("/connect", authenticate, connectUsers);

// POST /api/users/recommend/interests - Recommend users by interests
router.post("/recommend/interests", authenticate, recommendUsersByInterests);

// POST /api/users/recommend/level - Recommend users by skill level
router.post("/recommend/level", authenticate, recommendUsersByLevel);

router.post(
  "/recommend/level-interest",
  authenticate,
  recommendUsersByInterestsAndLevel
);

router.post("/bulk", createUsersBulk);

router.get("/connections", authenticate, getUserConnections);

router.post("/disconnect", authenticate, disconnectUsers);

router.put("/edit", authenticate, editUser);

router.put("/editProfilePic", authenticate, editProfilePic);

router.get("/profile", authenticate, getUserProfile);

export default router;
