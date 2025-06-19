// controllers/timeTableController.js
const { validationResult } = require("express-validator");
const TimeTable = require("../models/timeTableModel");
const { getAuth } = require("@clerk/express");

// controllers/timeTableController.js

const getTimetable = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const timetable = await TimeTable.findOne({
      user: userId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    // Make sure we're sending the tasks array, even if empty
    res.json(timetable?.tasks || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Save timetable
const saveTimetable = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = getAuth(req);
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: "Invalid tasks format" });
    }

    // Sort tasks by start time
    const sortedTasks = [...tasks].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    // Validate time ranges and check for overlaps
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      const nextTask = sortedTasks[i + 1];

      if (task.startTime >= task.endTime) {
        return res.status(400).json({
          message: "End time must be after start time",
        });
      }

      if (nextTask && task.endTime > nextTask.startTime) {
        return res.status(400).json({
          message: "Tasks cannot overlap",
        });
      }
    }

    // Update or create timetable
    const timetable = await TimeTable.findOneAndUpdate(
      {
        user: userId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
      },
      {
        user: userId,
        tasks: sortedTasks,
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json(timetable.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a specific task from timetable
const deleteTimetableTask = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { taskId } = req.params;

    const timetable = await TimeTable.findOneAndUpdate(
      {
        user: userId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
      },
      {
        $pull: { tasks: { _id: taskId } },
      },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.json(timetable.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTimetable,
  saveTimetable,
  deleteTimetableTask,
};
