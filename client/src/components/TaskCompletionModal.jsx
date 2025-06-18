// TaskCompletionModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const StreakDot = ({ day, currentStreak }) => {
  const isCompleted = day <= currentStreak;
  const isToday = day === currentStreak;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`w-8 h-8 rounded-full flex items-center justify-center
          ${
            isCompleted
              ? "bg-orange-500 text-white" // All completed days including today
              : "bg-gray-100 border-2 border-gray-300" // Future days
          }`}
    >
      {isCompleted && (
        <motion.svg
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      )}
    </motion.div>
  );
};
const getWeekRange = (streak) => {
  const startDay = Math.max(streak - 3, 1);
  return Array.from({ length: 7 }, (_, i) => startDay + i);
};

const TaskCompletionModal = ({ taskName, streak, onClose }) => {
  const weekDays = getWeekRange(streak);
  return (
    <motion.div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IoClose className="w-6 h-6" />
        </motion.button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
              times: [0, 0.5, 1],
            }}
            className="text-white text-4xl"
          >
            🔥
          </motion.div>
        </motion.div>

        <div className="text-center mb">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Well done!
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            You've completed
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold text-orange-500 "
            >
                          {" "}"{taskName}"
            </motion.span>
          </motion.div>
        </div>
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-4"
          >
            <span className="text-sm text-gray-500">Your current streak</span>
            <div className="text-3xl font-bold text-orange-500">
              {streak} Days
            </div>
          </motion.div>

          <div className="flex justify-between mb-4">
            {weekDays.map((day) => (
              <div key={day} className="flex flex-col items-center">
                <StreakDot day={day} currentStreak={streak} />
                <span className="text-xs text-gray-500 mt-2 font-semibold">Day {day}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <p className="text-gray-600">Your streak is now active!</p>
          <p className="text-sm text-gray-500 font-bold mt-1">
            Keep completing "{taskName}" daily to maintain your streak
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium
                   hover:bg-orange-600 transition-colors duration-200"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default TaskCompletionModal;
