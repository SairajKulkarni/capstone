import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authenticationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";

import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/verify", verificationRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
