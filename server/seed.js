const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Create an array of users to insert
const users = [
  { name: "Alice", score: 10, skills: ["React", "Node.js"] },
  { name: "Bob", score: 15, skills: ["Express", "MongoDB"] },
  { name: "Charlie", score: 12, skills: ["HTML", "CSS"] },
  { name: "Dave", score: 18, skills: ["JavaScript", "Node.js"] },
  { name: "Eve", score: 8, skills: ["Python", "Django"] },
  // Add more users here
];

// Insert users into the database
const seedUsers = async () => {
  try {
    await User.insertMany(users);
    console.log("Users inserted successfully");
    mongoose.connection.close(); // Close connection after seeding
  } catch (error) {
    console.error("Error inserting users", error);
    mongoose.connection.close();
  }
};

seedUsers();
