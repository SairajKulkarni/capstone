const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authenticationRoutes");

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
