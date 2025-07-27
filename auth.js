require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user");
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Регистрация
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Имейлът вече съществува." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 // 1 час
      })
      .status(201)
      .json({ message: "Регистрацията е успешна!", token, email, name });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// Вход
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Невалиден имейл или парола." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Невалиден имейл или парола." });

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000
      })
      .status(200)
      .json({ message: "Успешен вход!", token, email, name: user.name });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Грешка от сървъра." });
  }
});

module.exports = router;
