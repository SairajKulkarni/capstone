import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id", authenticate, getMessages);
router.post("/send/:id", authenticate, sendMessage)

export default router;
