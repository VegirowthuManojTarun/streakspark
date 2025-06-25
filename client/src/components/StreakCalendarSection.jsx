import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskContext } from "../context/TaskContext";
import StreakCalendar from "./StreakCalendar";
import { useNavigate } from "react-router-dom";

const StreakCalendarSection = () => {
  const { quote, tasks } = useContext(TaskContext);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Add this
  // Find task with highest streak
  const highestStreakTask = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;
    return tasks.reduce(
      (highest, current) =>
        (current.streak || 0) > (highest?.streak || 0) ? current : highest,
      null
    );
  }, [tasks]);

  // Set highest streak task as default selected task
  useEffect(() => {
    if (highestStreakTask && !selectedTask) {
      setSelectedTask(highestStreakTask);
    }
  }, [highestStreakTask]);
  const handleViewAnalytics = () => {
    if (selectedTask?._id) {
      navigate(`/dashboard/${selectedTask._id}/streak`);
    }
  };
  const TaskSelector = () => {
    // Sort tasks by streak (highest to lowest)
    const sortedTasks = useMemo(() => {
      return [...(tasks || [])].sort(
        (a, b) => (b.streak || 0) - (a.streak || 0)
      );
    }, [tasks]);

    return (
      <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-gray-100">
        {/* Scroll Container */}
        <div className="relative">
          {/* Gradient Shadows for Scroll Indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrollable Task List */}
          <div className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-3 relative">
            {sortedTasks.map((task) => (
              <motion.button
                key={task._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTask(task)}
                className={`
                  flex-shrink-0 w-24 h-20 rounded-xl 
                  flex flex-col items-center justify-center gap-2 
                  border-2 transition-all duration-200
                  ${
                    selectedTask?._id === task._id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
              >
                {/* Streak Badge */}
                <div className="relative">
                  <span className="text-4xl">🔥</span>
                  <span
                    className={`
                      absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/10
                      text-sm font-bold bg-white/80 px-1 rounded-full
                      ${
                        selectedTask?._id === task._id
                          ? "text-orange-600"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {task.streak || 0}
                  </span>
                </div>
                {/* Task Name */}
                <span className="text-sm font-medium text-gray-700 px-3 truncate w-full text-center">
                  {task.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Add this new component for statistics
  const StatsSection = ({ task }) => (
    <motion.div
      variants={childVariants}
      className="hidden lg:grid grid-cols-3 gap-4 mb-6"
    >
      {[
        {
          label: "Current Streak",
          value: task?.streak || 0,
          icon: "🔥",
          color: "text-orange-500",
        },
        {
          label: "Completion Rate",
          value: `${Math.round(((task?.streak || 0) / 30) * 100)}%`,
          icon: "📊",
          color: "text-blue-500",
        },
        {
          label: "Best Streak",
          value: task?.longestStreak || 0,
          icon: "⭐",
          color: "text-yellow-500",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{stat.icon}</span>
            <span className="text-sm text-gray-600">{stat.label}</span>
          </div>
          <span className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );

  const QuoteSection = () => (
    <motion.div
      variants={childVariants}
      className="bg-white/50 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-gray-100 lg:p-5"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-start"
      >
        <span className="text-3xl text-orange-400 mr-3">❝</span>
        <div className="flex flex-col">
          <p className="text-gray-700 italic text-lg">{quote?.q}</p>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-sm mt-2"
          >
            — {quote?.a}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Info & Quote */}
        <motion.div
          variants={childVariants}
          className="flex-1 md:w-[62%] lg:w-[50%] p-5 lg:border-r border-gray-200 lg:px-10"
        >
          <div className="max-w-lg">
            {/* Header */}
            <motion.div
              variants={childVariants}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-3xl">🎯</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Streak Dashboard
                </h2>
                <p className="text-gray-600">Track your habit consistency</p>
              </div>
            </motion.div>

            <StatsSection task={selectedTask} />
            {/* Task Selector */}
            <motion.div className="mb-6">
              <TaskSelector />
            </motion.div>
            {/* Quote Section */}
            {quote && <QuoteSection />}
          </div>
        </motion.div>

        {/* Right Column - Calendar */}
        <motion.div
          variants={childVariants}
          className="md:w-[38%] lg:w-[50%] py-4 bg-white/100 flex items-center justify-center"
        >
          <StreakCalendar highestStreakTask={selectedTask} />
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        variants={childVariants}
        className="bg-white border-t border-gray-200 p-4 flex justify-between items-center"
      >
        <div className="text-gray-600 text-sm md:text-lg lg:px-4">
          Keep pushing! You're doing great! 💪
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewAnalytics}
          disabled={!selectedTask}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg
                     flex items-center gap-2 transition-colors text-sm shadow-sm"
        >
          <span className="md:hidden">Details</span>
          <span className="hidden md:inline text-lg">View Details</span>
          <span>→</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StreakCalendarSection;
