const { validationResult } = require("express-validator");
const axios = require("axios");
const Task = require("../models/taskModel");

let cachedQuote = null;
let cacheDate = null;

// Helper to check if a date is yesterday
function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

// GET /tasks/quotes
const getDailyQuote = async (req, res) => {
  try {
    const today = new Date().toDateString();
    if (cacheDate !== today) {
      const { data } = await axios.get("https://zenquotes.io/api/today");
      cachedQuote = data[0];
      cacheDate = today;
    }
    res.json(cachedQuote);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch quote", error: err.message });
  }
};

// GET /tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, notificationTime } = req.body;
    const task = await Task.create({
      name,
      user: req.userId,
      notificationTime,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /tasks/:id
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { name, notificationTime } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { name, notificationTime },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /tasks/:id/mark
const markTaskDone = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const today = new Date();
    const lastDate = task.lastMarkedDate ? new Date(task.lastMarkedDate) : null;

    if (lastDate && isYesterday(lastDate)) {
      task.streak += 1;
    } else {
      task.streak = 1;
    }

    if (task.streak > task.longestStreak) {
      task.longestStreak = task.streak;
    }

    task.lastMarkedDate = today;
    task.history.push(today);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /tasks/:id/history
const getTaskHistory = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    }).select("history");
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Sort ascending
    const history = task.history
      .map((d) => new Date(d))
      .sort((a, b) => a - b)
      .map((d) => d.toISOString());

    res.json({ history });
  } catch (err) {
    next(err);
  }
};

// NEW: update a task’s email prefs & time
const updateNotificationPref = async (req, res, next) => {
  try {
    const { notifyByEmail, notificationTime } = req.body;
    const update = { notifyByEmail };
    if (notificationTime) update.notificationTime = notificationTime;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Notification prefs updated", task });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDailyQuote,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskDone,
  getTaskHistory,
  updateNotificationPref,
};
