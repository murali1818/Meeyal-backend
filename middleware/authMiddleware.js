const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const authMiddleware = async (req, res, next) => {
  try {
    // Ensure cookies are being received
    //console.log("Cookies:", req.cookies);
    const token = req.cookies.token|| req.cookies.authToken;
    //const token = req.cookies.authToken; // Make sure the correct key is used
    if (!token) {
      return res.status(401).json({ msg: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ msg: "User not found" });
    }

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = { authMiddleware };
