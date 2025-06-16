require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/dbConnections");

const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// --- your existing routes ---
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);
app.get("/", (req, res) => res.send("StreakSpark API is running"));

// --- new: cron job for dynamic notificationTime ---
const cron = require("node-cron");
const Task = require("./models/taskModel");
const { sendStreakEmail } = require("./utils/emailService");

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
  try {
    const tasks = await Task.find({
      notifyByEmail: true,
      notificationTime: hhmm,
    }).populate("user");

    if (!tasks.length) return;
    const byUser = tasks.reduce((acc, t) => {
      const uid = t.user._id.toString();
      if (!acc[uid]) acc[uid] = { user: t.user, tasks: [] };
      acc[uid].tasks.push(t);
      return acc;
    }, {});

    for (const uid in byUser) {
      const { user, tasks: userTasks } = byUser[uid];
      await sendStreakEmail(user, userTasks);
      console.log(`Email sent to ${user.email} at ${hhmm}`);
    }
  } catch (err) {
    console.error("Error in notification cron:", err);
  }
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
