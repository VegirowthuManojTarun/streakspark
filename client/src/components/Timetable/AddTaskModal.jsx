// src/components/Timetable/AddTaskModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoTimeOutline,
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoSparklesOutline,
} from "react-icons/io5";

export default function AddTaskModal({
  isOpen,
  onClose,
  onAdd,
  suggestedStartTime,
}) {
  const [startTime, setStartTime] = useState(suggestedStartTime);
  const [endTime, setEndTime] = useState("");
  const [taskName, setTaskName] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Validate form as user types
  useEffect(() => {
    setIsValid(startTime && endTime && taskName.trim().length > 0);
  }, [startTime, endTime, taskName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    const task = {
      startTime,
      endTime,
      taskName: taskName.trim(),
    };

    onAdd(task);
    setTaskName("");
    setEndTime("");
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <IoSparklesOutline className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-800">
                  Plan Your Time
                </h3>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Time Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoTimeOutline className="w-4 h-4 text-orange-500" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 
                             focus:border-orange-500 focus:ring-orange-500 
                             transition-colors"
                    required
                  />
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  whileFocus="focus"
                  animate="blur"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoTimeOutline className="w-4 h-4 text-orange-500" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-200 
                             focus:border-orange-500 focus:ring-orange-500 
                             transition-colors"
                    required
                  />
                </motion.div>
              </div>

              {/* Task Name Input */}
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <IoCalendarOutline className="w-4 h-4 text-orange-500" />
                  Task Description
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="What would you like to accomplish?"
                  className="w-full rounded-lg border-2 border-gray-200 
                           focus:border-orange-500 focus:ring-orange-500 
                           transition-colors"
                  required
                />
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 
                           rounded-lg font-medium hover:bg-gray-50 
                           transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isValid}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 
                           text-white rounded-lg font-medium 
                           hover:from-orange-600 hover:to-orange-700 
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  <IoCheckmarkCircleOutline className="w-5 h-5" />
                  Add Task
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
