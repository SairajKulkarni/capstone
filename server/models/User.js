const mongoose = require("mongoose");
const { serialize } = require("v8");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  skills: [{ type: String }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);

serialize;
