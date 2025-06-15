const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notificationTime: { type: String, default: "08:00" }, // "HH:MM"
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastMarkedDate: { type: Date },
    history: [{ type: Date }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
