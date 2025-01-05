import mongoose from "mongoose";
import "dotenv/config"
import User from "./models/User.js";

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
  {
    name: "Alice",
    username: "alice123",
    password: "securepassword123",
    score: 10,
    skills: ["React", "Node.js"],
  },
  {
    name: "Bob",
    username: "bob456",
    password: "passwordBob789",
    score: 20,
    skills: ["JavaScript", "MongoDB"],
  },
  {
    name: "Charlie",
    username: "charlie789",
    password: "CharlieSecure01",
    score: 15,
    skills: ["HTML", "CSS"],
  },
  {
    name: "Diana",
    username: "diana567",
    password: "DianaStrong456",
    score: 12,
    skills: ["Angular", "TypeScript"],
  },
  {
    name: "Edward",
    username: "edward234",
    password: "Edward_007",
    score: 25,
    skills: ["Python", "Django"],
  },
  {
    name: "Fiona",
    username: "fiona678",
    password: "FionaIsCool901",
    score: 30,
    skills: ["Java", "Spring"],
  },
  {
    name: "George",
    username: "george432",
    password: "GeorgeSafe999",
    score: 18,
    skills: ["C++", "Data Structures"],
  },
  {
    name: "Hannah",
    username: "hannah098",
    password: "HannahTech123",
    score: 22,
    skills: ["PHP", "Laravel"],
  },
  {
    name: "Irene",
    username: "irene321",
    password: "Irene@2024",
    score: 14,
    skills: ["Ruby", "Rails"],
  },
  {
    name: "Jack",
    username: "jack654",
    password: "Jack!Secure55",
    score: 27,
    skills: ["React Native", "Redux"],
  },
  {
    name: "Karen",
    username: "karen876",
    password: "KarenSuper@456",
    score: 17,
    skills: ["SQL", "Database Design"],
  },
  {
    name: "Leo",
    username: "leo123",
    password: "Leo_Pass_654",
    score: 21,
    skills: ["Kotlin", "Android Development"],
  },
  {
    name: "Mia",
    username: "mia890",
    password: "MiaCodeSecure",
    score: 16,
    skills: ["Vue.js", "JavaScript"],
  },
  {
    name: "Nathan",
    username: "nathan987",
    password: "NathanProPass",
    score: 19,
    skills: ["Swift", "iOS Development"],
  },
  {
    name: "Olivia",
    username: "olivia111",
    password: "OliviaTechLife",
    score: 13,
    skills: ["Go", "Microservices"],
  },
];

// Insert users into the database
const seedUsers = async () => {
  try {
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }
    console.log("Users inserted successfully");
    mongoose.connection.close(); // Close connection after seeding
  } catch (error) {
    console.error("Error inserting users", error);
    mongoose.connection.close();
  }
};

seedUsers();
