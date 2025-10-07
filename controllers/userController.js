import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Habit from "../models/habitModel.js"; // ⚠️ Make sure this file exists!

// ✅ Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed });

  if (!user) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// ✅ Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// ✅ Get User Profile (Protected)
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// 🔥 Multer setup for profile picture uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// ✅ Profile with Stats
export const getProfileWithStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  const habits = await Habit.find({ userId: req.user.id });

  const totalHabits = habits.length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  res.json({
    name: user.name,
    email: user.email,
    profilePic: user.profilePic,
    totalHabits,
    totalStreak,
  });
});

// ✅ Upload Profile Picture
export const uploadProfilePic = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  user.profilePic = `/uploads/${req.file.filename}`;
  await user.save();

  res.json({
    message: "Profile picture updated successfully",
    profilePic: user.profilePic,
  });
});
