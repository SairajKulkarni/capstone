import User from "../models/User.js";

export const recommendUsersByInterests = async (req, res) => {
  const { userId, interests } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users with similar interests
    const recommendedUsers = await User.find({
      skills: { $in: interests },
      _id: { $ne: userId }, // Exclude current user
    });

    return res.json({ recommendedUsers: recommendedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const recommendUsersByLevel = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users with similar scores (within a range of 10 points)
    const recommendedUsers = await User.find({
      score: { $gte: user.score - 5, $lte: user.score + 5 },
      _id: { $ne: userId }, // Exclude current user
    });

    return res.json({ recommendedUsers: recommendedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const recommendUsersByInterestsAndLevel = async (req, res) => {
  try {
    const { userId, interests } = req.body;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find users with matching skills and within score range (+/- 10)
    const recommendedUsers = await User.find({
      _id: { $ne: userId }, // Exclude current user
      skills: { $in: interests }, // Match skills
      score: { $gte: currentUser.score - 10, $lte: currentUser.score + 10 }, // Match within score range
    });

    return res.json({ recommendedUsers: recommendedUsers });
  } catch (error) {
    res.status(500).json({ message: "Error recommending users", error });
  }
};
