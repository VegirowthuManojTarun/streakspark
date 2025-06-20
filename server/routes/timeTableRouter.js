// routes/timeTableRouter.js
const router = require("express").Router();
const { body, param } = require("express-validator");
const { requireAuth } = require("@clerk/express");
const {
  getTimetable,
  saveTimetable,
  deleteTimetableTask,
  toggleTaskCompletion,
} = require("../controllers/timeTableController");

// Protect all routes
router.use(requireAuth());

// Validation middleware for tasks
const validateTasks = [
  body("tasks").isArray(),
  body("tasks.*.startTime")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid start time format"),
  body("tasks.*.endTime")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid end time format"),
  body("tasks.*.taskName")
    .trim()
    .notEmpty()
    .withMessage("Task name is required"),
];

// Validation middleware for task ID
const validateTaskId = [
  param("taskId").isMongoId().withMessage("Invalid task ID format"),
];

// Validation middleware for completion toggle
const validateCompletion = [
  param("taskId").isMongoId().withMessage("Invalid task ID format"),
  body("completed")
    .isBoolean()
    .withMessage("Completed status must be a boolean value"),
];

// Routes
router.get("/", getTimetable);
router.post("/", validateTasks, saveTimetable);
router.delete("/:taskId", validateTaskId, deleteTimetableTask);
router.patch("/:taskId/completion", validateCompletion, toggleTaskCompletion);

module.exports = router;
