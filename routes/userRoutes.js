import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  upload,
  uploadProfilePic, // ✅ added this import
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ make sure this file exists

const router = express.Router();

// ✅ Register User
router.post("/register", registerUser);

// ✅ Login User
router.post("/login", loginUser);

// ✅ Get User Profile (protected route)
router.get("/profile", protect, getProfile);

// ✅ Upload Profile Picture (protected route)
router.post("/upload", protect, upload.single("profilePic"), uploadProfilePic);

export default router;
