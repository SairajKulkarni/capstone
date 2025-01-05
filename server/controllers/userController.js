import User from "../models/User.js";

// Bulk create users
export const createUsersBulk = async (req, res) => {
  const { users } = req.body; // Expect an array of user objects

  try {
    const createdUsers = await User.insertMany(users);
    res
      .status(201)
      .json({ message: "Users created successfully", createdUsers });
  } catch (error) {
    console.error("Error creating users in bulk:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId, change } = req.body; // Extract userId and changes from the request body

    if (!userId || !change) {
      return res
        .status(400)
        .json({ message: "Invalid input. userId and change are required." });
    }

    // Update the user with the provided changes
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: change },
      { new: true, runValidators: true } // Return the updated user and validate changes
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Extracted from authenticate middleware

    // Find the user by ID and populate connections
    const user = await User.findById(userId)
      .populate("connections", "name score")
      .select("-password -__v"); // Exclude password and version fields

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        score: user.score,
        skills: user.skills,
        connections: user.connections,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile.", error });
  }
};