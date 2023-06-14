import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/Users.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    const newUser = await result.save();

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, "test", {
      expiresIn: "6h",
    });

    res.status(200).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingUser.id, isAdmin: existingUser.isAdmin },
      "test",
      { expiresIn: "6h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
