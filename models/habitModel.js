import mongoose from "mongoose";

const habitSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    habitName: {
      type: String,
      required: [true, "Please enter habit name"],
    },
    category: {
      type: String,
      enum: ["Exercise", "Study", "Diet", "Skincare", "Sleep", "Other"],
      default: "Other",
    },
    streak: {
      type: Number,
      default: 0,
    },
    records: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;