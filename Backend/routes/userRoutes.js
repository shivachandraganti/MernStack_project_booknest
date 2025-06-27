const express = require("express");
const router = express.Router();  // ✅ THIS LINE WAS MISSING

const auth = require("../middleware/auth"); // if you’re using token-based protection
const User = require("../db/User");

// Example: Get current user info
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
