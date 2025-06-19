const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { type: String, required: true }, // Clerk userId as a string
    notificationTime: { type: String, default: "20:00" }, // "HH:MM"
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastMarkedDate: { type: Date },
    history: [{ type: Date }],
    notifyByEmail: { type: Boolean, default: false }, 
    priority: {
      type: Number,
      enum: [1, 2, 3, 4, 5], // 1=Urgent … 5=None
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
