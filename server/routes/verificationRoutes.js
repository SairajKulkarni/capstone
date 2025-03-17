import express from "express";

import { verifyCeriticate } from "../controllers/verificationController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/verify", authenticate, verifyCeriticate);

export default router;
