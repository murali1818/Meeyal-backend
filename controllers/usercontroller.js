
const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, countryCode, phone, password, role } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { countryCode, phone }] });

    if (user) return res.status(400).json({ msg: "User already exists with this email or phone number" });

    const newUser = new User({ name, email, countryCode, phone, password, role });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};




// Login User
exports.loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, countryCode: user.countryCode, phone: user.phone, role: user.role },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};






  