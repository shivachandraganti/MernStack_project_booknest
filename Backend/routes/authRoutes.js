const express = require("express");
const router = express.Router();
const User = require("../db/User"); // ✅ Import the model
const bcrypt = require("bcryptjs");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
     console.log("🚨 Register route hit");
    console.log("Received bode:",req.body);
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save(); // ✅ Save user to MongoDB

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
