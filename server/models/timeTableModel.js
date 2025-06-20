// models/timeTableModel.js
const mongoose = require("mongoose");

const timeTableTaskSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  taskName: {
    type: String,
    required: true,
    trim: true,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const timeTableSchema = new mongoose.Schema({
  user: {
    type: String, // For Clerk userId
    required: true,
    index: true,
  },
  tasks: [timeTableTaskSchema],
  date: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Add method to check if task is completed today
timeTableTaskSchema.methods.isCompletedToday = function () {
  if (!this.completedAt) return false;

  const today = new Date();
  const completedDate = new Date(this.completedAt);

  return (
    completedDate.getDate() === today.getDate() &&
    completedDate.getMonth() === today.getMonth() &&
    completedDate.getFullYear() === today.getFullYear()
  );
};

// Add method to clear old completions
timeTableSchema.methods.clearOldCompletions = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  this.tasks.forEach((task) => {
    if (task.completedAt && task.completedAt < today) {
      task.completedAt = null;
    }
  });
};

module.exports = mongoose.model("TimeTable", timeTableSchema);
