require("dotenv").config();
const express = require("express");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");
const path = require("path");

require("./config/dbConnections");

const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");
const timeTableRouter = require("./routes/timeTableRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://streakspark.netlify.app",
];

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static(path.join(__dirname, "/dist")));
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/timetable", timeTableRouter);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to StreakSpark" });
});

//client rendering
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"));
});

//////////////////////////////////////////////////////////////////////
// === Robust, safe Gmail/Nodemailer Cron Job for Streak Emails === //
//////////////////////////////////////////////////////////////////////
const cron = require("node-cron");
const Task = require("./models/taskModel");
const { clerkClient } = require("@clerk/express");
const { sendStreakEmail } = require("./utils/sendStreakEmail");

// Runs every minute (adjust for your actual needs)
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
  try {
    // Find tasks that need notifications right now
    const tasks = await Task.find({
      notifyByEmail: true,
      notificationTime: hhmm,
    });
    if (!tasks.length) return;

    // Group tasks by Clerk userId
    const byUser = tasks.reduce((acc, t) => {
      const uid = t.user;
      if (!acc[uid]) acc[uid] = [];
      acc[uid].push(t);
      return acc;
    }, {});

    // Email each user their grouped streak summary
    for (const userId in byUser) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        const { emailAddresses, fullName, username } = clerkUser;
        const user = {
          email: emailAddresses?.[0]?.emailAddress,
          name: fullName || username || "User",
        };
        const wasSent = await sendStreakEmail(user, byUser[userId]);
        if (wasSent) {
          console.log(`✅ Email sent to ${user.email} at ${hhmm}`);
        } else {
          console.error(`❌ Email failed for user: ${user.email} at ${hhmm}`);
        }
      } catch (innerErr) {
        // log but don't interrupt others!
        console.error("Failed notification to userId", userId, innerErr);
      }
    }
  } catch (err) {
    console.error("Error in notification cron:", err);
  }
});
//////////////////////////////////////////////////////////////////////

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// require("dotenv").config();
// const express = require("express");
// const { clerkMiddleware } = require("@clerk/express");
// const cors = require("cors");
// require("./config/dbConnections");

// const authRouter = require("./routes/authRouter");
// const taskRouter = require("./routes/taskRouter");
// const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// const app = express();
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://streakspark.netlify.app",
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(clerkMiddleware());

// app.use("/api/auth", authRouter);
// app.use("/api/tasks", taskRouter);

// app.get("/", (req, res) =>
//   res.send({
//     activeStatus: true,
//     error: false,
//   })
// );

// // >>>> The cron job for notification emails has been removed! <<<<

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );

// // require("dotenv").config();
// // const express = require("express");
// // const { clerkMiddleware } = require("@clerk/express");
// // const cors = require("cors");
// // require("./config/dbConnections");

// // const authRouter = require("./routes/authRouter");
// // const taskRouter = require("./routes/taskRouter");
// // const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// // const app = express();
// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://streakspark.netlify.app",
// // ];

// // app.use(
// //   cors({
// //     origin: allowedOrigins,
// //     credentials: true,
// //   })
// // );

// // app.use(express.json());
// // app.use(clerkMiddleware()); // Clerk: Needs to be before all routes

// // app.use("/api/auth", authRouter);
// // app.use("/api/tasks", taskRouter);

// // app.get("/", (req, res) =>
// //   res.send({
// //     activeStatus: true,
// //     error: false,
// //   })
// // );

// // // --- new: cron job for dynamic notificationTime ---
// // const cron = require("node-cron");
// // const Task = require("./models/taskModel");
// // const { sendStreakEmail } = require("./utils/emailService");

// // cron.schedule("* * * * *", async () => {
// //   const now = new Date();
// //   const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"
// //   try {
// //     const tasks = await Task.find({
// //       notifyByEmail: true,
// //       notificationTime: hhmm,
// //     }).populate("user");

// //     if (!tasks.length) return;
// //     const byUser = tasks.reduce((acc, t) => {
// //       const uid = t.user._id.toString();
// //       if (!acc[uid]) acc[uid] = { user: t.user, tasks: [] };
// //       acc[uid].tasks.push(t);
// //       return acc;
// //     }, {});

// //     for (const uid in byUser) {
// //       const { user, tasks: userTasks } = byUser[uid];
// //       await sendStreakEmail(user, userTasks);
// //       console.log(`Email sent to ${user.email} at ${hhmm}`);
// //     }
// //   } catch (err) {
// //     console.error("Error in notification cron:", err);
// //   }
// // });

// // // Error handlers
// // app.use(notFound);
// // app.use(errorHandler);

// // const PORT = process.env.PORT || 8080;
// // app.listen(PORT, () =>
// //   console.log(`🚀 Server running on http://localhost:${PORT}`)
// // );
