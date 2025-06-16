const router = require("express").Router();
const { body } = require("express-validator");
const {
  getDailyQuote,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskDone,
  getTaskHistory,
  updateNotificationPref,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router.get("/quotes", getDailyQuote);
router.get("/", getTasks);
router.get("/:id/history", getTaskHistory);
router.get("/:id", getTaskById);
router.post(
  "/",
  body("name", "Name is required").notEmpty(),
  body("notificationTime", "Invalid time format").matches(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  ),
  createTask
);
router.put(
  "/:id",
  body("name", "Name is required").notEmpty(),
  body("notificationTime", "Invalid time format").matches(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  ),
  updateTask
);
router.delete("/:id", deleteTask);
router.patch("/:id/mark", markTaskDone);
router.patch("/:id/notification", updateNotificationPref);

module.exports = router;
