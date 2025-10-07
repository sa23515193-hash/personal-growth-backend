import asyncHandler from "express-async-handler";
import Habit from "../models/habitModel.js";

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id });
  res.json(habits);
});

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const addHabit = asyncHandler(async (req, res) => {
  const { habitName, category } = req.body;

  if (!habitName) {
    res.status(400);
    throw new Error("Please enter a habit name");
  }

  const habit = await Habit.create({
    userId: req.user.id,
    habitName,
    category,
    streak: 0,
    records: [],
  });

  res.status(201).json(habit);
});

// @desc    Update habit progress (mark as completed)
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Record today’s completion
  const today = new Date().toDateString();
  const existingRecord = habit.records.find(
    (r) => new Date(r.date).toDateString() === today
  );

  if (existingRecord) {
    existingRecord.completed = true;
  } else {
    habit.records.push({ date: new Date(), completed: true });
  }

  // Update streak
  habit.streak += 1;

  const updatedHabit = await habit.save();
  res.json(updatedHabit);
});

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    res.status(404);
    throw new Error("Habit not found");
  }

  if (habit.userId.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await habit.deleteOne();
  res.json({ message: "Habit removed successfully" });
});

export { getHabits, addHabit, updateHabit, deleteHabit };