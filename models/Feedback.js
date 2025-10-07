import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  username: String,
  email: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);