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
  // Task Selection Dropdown
  const TaskSelector = () => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 
                     flex items-center justify-between shadow-sm hover:border-gray-300
                     transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Selected Task:</span>
          <span className="font-medium text-gray-800">
            {selectedTask?.name || "Select a task"}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 
                       ${isDropdownOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border 
                         border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {tasks?.map((task) => (
              <motion.button
                key={task.id}
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                onClick={() => {
                  setSelectedTask(task);
                  setIsDropdownOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between
                             ${
                               selectedTask?.id === task.id
                                 ? "bg-orange-50 text-orange-600"
                                 : "text-gray-700"
                             }
                             ${
                               task.id === highestStreakTask?.id
                                 ? "font-medium"
                                 : ""
                             }
                             hover:bg-gray-50 transition-colors duration-150`}
              >
                <div className="flex items-center gap-2">
                  <span>{task.name}</span>
                  {task.id === highestStreakTask?.id && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Highest Streak
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-sm">
                  <span className="text-orange-500">🔥</span>
                  {task.streak || 0}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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

  const QuoteSection = () => (
    <motion.div
      variants={childVariants}
      className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100"
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
      className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Info & Quote */}
        <motion.div
          variants={childVariants}
          className="flex-1 p-8 lg:border-r border-gray-200"
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

            {/* Task Selector */}
            <motion.div variants={childVariants} className="mb-6">
              <TaskSelector />
            </motion.div>

            {/* Legend & Info */}
            <motion.div
              variants={childVariants}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-gray-800 font-medium mb-3">
                Track Your Progress
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-orange-500"
                  >
                    🔥
                  </motion.span>
                  <span>Completed Days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="opacity-50">🔥</span>
                  <span>Missed Days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-orange-500">◯</span>
                  <span>Current Day</span>
                </div>
              </div>
            </motion.div>

            {/* Quote Section */}
            {quote && <QuoteSection />}
          </div>
        </motion.div>

        {/* Right Column - Calendar */}
        <motion.div
          variants={childVariants}
          className="lg:w-1/2 p-6 bg-white/50"
        >
          <StreakCalendar highestStreakTask={selectedTask} />
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        variants={childVariants}
        className="bg-white border-t border-gray-200 p-4 flex justify-between items-center"
      >
        <div className="text-gray-600 text-sm">
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
          <span>View Detailed Analytics</span>
          <span>→</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StreakCalendarSection;
