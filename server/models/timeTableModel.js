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

module.exports = mongoose.model("TimeTable", timeTableSchema);
