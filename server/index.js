require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/dbConnections"); // Connect to MongoDB

const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

// Base route
app.get("/", (req, res) => res.send("StreakSpark API is running"));

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
