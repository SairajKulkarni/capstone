const User = require("../models/User");

const connectUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    const userA = await User.findById(userId1);
    const userB = await User.findById(userId2);

    if (!userA || !userB) {
      return res.status(404).json({ message: "Users not found" });
    }

    // Ensure both users are not already connected
    if (
      userA.connections.includes(userId2) ||
      userB.connections.includes(userId1)
    ) {
      return res.status(400).json({ message: "Users are already connected" });
    }

    // Add each other to the connections
    userA.connections.push(userId2);
    userB.connections.push(userId1);

    // Calculate the score difference and rewards
    const scoreA = userA.score;
    const scoreB = userB.score;

    if (scoreA < scoreB) {
      // User A has the lower score, they get 20% of the capped difference
      const diff = scoreB - scoreA;
      const cappedDiff = Math.min(diff, 10);
      const rewardForA = cappedDiff * 0.2;

      userA.score += rewardForA;
      userB.score += 5; // Flat reward for higher score user
    } else if (scoreA > scoreB) {
      // User B has the lower score
      const diff = scoreA - scoreB;
      const cappedDiff = Math.min(diff, 10);
      const rewardForB = cappedDiff * 0.2;

      userB.score += rewardForB;
      userA.score += 5; // Flat reward for higher score user
    } else {
      // If scores are equal, both users get an equal reward
      userA.score += 5;
      userB.score += 5;
    }

    await userA.save();
    await userB.save();

    res
      .status(200)
      .json({ message: "Users connected successfully", userA, userB });
  } catch (error) {
    res.status(500).json({ message: "Error connecting users", error });
  }
};

const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.body;
    // Find the user by their ID
    const user = await User.findById(userId).populate(
      "connections",
      "name score skills"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map connections to include only _id, name, and score
    const connections = user.connections.map((connection) => ({
      _id: connection._id,
      name: connection.name,
      score: connection.score,
    }));

    // Return the filtered connections
    res.status(200).json({
      connections,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user connections", error });
  }
};

// Disconnect two users
const disconnectUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    // Find both users
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Remove user2 from user1's connections
    user1.connections = user1.connections.filter(
      (connection) => connection.toString() !== userId2
    );

    // Remove user1 from user2's connections
    user2.connections = user2.connections.filter(
      (connection) => connection.toString() !== userId1
    );

    // Save the changes to both users
    await user1.save();
    await user2.save();

    res.status(200).json({
      message: "Users successfully disconnected",
      user1Connections: user1.connections,
      user2Connections: user2.connections,
    });
  } catch (error) {
    res.status(500).json({ message: "Error disconnecting users", error });
  }
};

module.exports = { connectUsers, getUserConnections, disconnectUsers };
