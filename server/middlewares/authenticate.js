const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token is required." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticate };
