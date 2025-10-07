import express from "express";
import {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getHabits)
  .post(protect, addHabit);

router.route("/:id")
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

export default router;