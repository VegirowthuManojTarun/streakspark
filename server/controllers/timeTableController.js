// controllers/timeTableController.js
const { validationResult } = require("express-validator");
const TimeTable = require("../models/timeTableModel");
const { getAuth } = require("@clerk/express");

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

    if (timetable) {
      // Clear old completions
      timetable.clearOldCompletions();
      await timetable.save();

      // Transform tasks to include completion status
      const tasks = timetable.tasks.map((task) => ({
        _id: task._id,
        startTime: task.startTime,
        endTime: task.endTime,
        taskName: task.taskName,
        isCompleted: task.isCompletedToday(),
        completedAt: task.completedAt,
      }));
      res.json(tasks);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

    // Get existing timetable to preserve completion status
    const existingTimetable = await TimeTable.findOne({
      user: userId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    // Create completion status map from existing tasks
    const completionMap = new Map();
    if (existingTimetable) {
      existingTimetable.tasks.forEach((task) => {
        if (task.isCompletedToday()) {
          completionMap.set(task._id.toString(), task.completedAt);
        }
      });
    }

    // Sort and validate new tasks
    const sortedTasks = [...tasks].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );

    // Validate time ranges
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

      // Preserve completion status if task ID exists
      if (task._id && completionMap.has(task._id.toString())) {
        task.completedAt = completionMap.get(task._id.toString());
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

// Add the missing deleteTimetableTask function
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
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

const toggleTaskCompletion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId } = getAuth(req);
    const { taskId } = req.params;
    const { completed } = req.body;

    const timetable = await TimeTable.findOne({
      user: userId,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999),
      },
    });

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // Clear old completions
    timetable.clearOldCompletions();

    // Find the task to toggle
    const task = timetable.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update completion status based on request
    task.completedAt = completed ? new Date() : null;
    await timetable.save();

    // Return updated task information
    res.json({
      taskId,
      completed,
      completedAt: task.completedAt,
      isCompleted: task.isCompletedToday(),
    });
  } catch (err) {
    console.error("Error toggling task completion:", err);
    res
      .status(500)
      .json({ message: "Failed to update task completion status" });
  }
};

module.exports = {
  getTimetable,
  saveTimetable,
  deleteTimetableTask,
  toggleTaskCompletion,
};
