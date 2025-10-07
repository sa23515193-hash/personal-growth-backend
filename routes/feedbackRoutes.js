import express from "express";
import Feedback from "../models/Feedback.js";
const router = express.Router();

// Submit feedback
router.post("/", async (req, res) => {
  const { username, email, rating, comment } = req.body;
  try {
    const newFeedback = await Feedback.create({ username, email, rating, comment });
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback
router.get("/", async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find().sort({ date: -1 });
    res.status(200).json(allFeedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get feedback summary for homepage
router.get("/summary", async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const avgRatingObj = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = avgRatingObj[0] ? avgRatingObj[0].avgRating : 0;

    const recentFeedbacks = await Feedback.find()
      .sort({ date: -1 })
      .limit(5); // last 5 feedbacks

    res.status(200).json({
      totalFeedbacks,
      avgRating: avgRating.toFixed(1), // one decimal
      recentFeedbacks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;