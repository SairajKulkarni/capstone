import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
} from "../controllers/authenticationController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", authenticate, logout);
router.get("/check", authenticate, checkAuth);

export default router;
