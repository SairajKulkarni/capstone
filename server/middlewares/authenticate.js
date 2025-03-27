import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return res.status(401).json({ message: "Authorization token is required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate("certificates", "-__v -owner").select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { authenticate };
