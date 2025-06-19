// TaskItem.jsx
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
const ToggleSwitch = ({ checked, onChange }) => (
  <motion.button
    onClick={onChange}
    className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
      ${checked ? "bg-orange-500" : "bg-gray-200"}`}
  >
    <motion.span
      layout // This helps create smooth layout transitions
      initial={false}
      animate={{
        x: checked ? 28 : 2,
      }}
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 30,
        mass: 1,
      }}
      className="absolute top-0.5 left-0 block w-6 h-6 rounded-full bg-white shadow-lg"
    />
  </motion.button>
);

// Animation variants for consistent animations
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const notificationVariants = {
  hidden: { opacity: 0, y: 10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const buttonVariants = {
  tap: { scale: 0.97 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// at top, define label  tailwind‐class map:
const PRIORITY = {
  1: { label: "Urgent", className: "bg-red-500 text-white" },
  2: { label: "High", className: "bg-orange-500 text-white" },
  3: { label: "Medium", className: "bg-yellow-300 text-black" },
  4: { label: "Low", className: "bg-green-300 text-black" },
  5: { label: "None", className: "bg-gray-200 text-black" },
};

export default function TaskItem({ task, onEdit, onComplete }) {
  const { checkOff, toggleNotification, removeTask } = useContext(TaskContext);
  const [notify, setNotify] = useState(task.notifyByEmail);
  const [priority, setPriority] = useState(task.priority ?? 5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const doneToday =
    task.lastMarkedDate &&
    format(new Date(task.lastMarkedDate), "yyyy-MM-dd") === todayStr;
  // keep local priority in sync if task prop changes
  useEffect(() => {
    setPriority(task.priority);
  }, [task.priority]);

  const handleNotifyChange = async () => {
    const newVal = !notify;
    await toggleNotification(task._id, newVal);
    setNotify(newVal);
  };

  // In TaskItem
  const handleCheckOff = async () => {
    if (doneToday) {
      return;
    }

    try {
      const updatedTask = await checkOff(task._id);
      if (updatedTask) {
        onComplete(updatedTask);
      }
    } catch (error) {
      console.error("Error marking task:", error);
    }
  };

  // In TaskList
  const handleTaskComplete = (task) => {
    console.log("TaskList received completed task:", task);
    setCompletedTask(task);
  };
  const handleDelete = async () => {
    try {
      await removeTask(task._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{task.name}</h3>
            <div className="flex items-center space-x-2">
              {(() => {
                const pr = PRIORITY[priority] || PRIORITY[5];
                return (
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${pr.className}`}
                  >
                    {pr.label}
                  </span>
                );
              })()}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center space-x-1 relative group"
              >
                {task.streak === 0 ? (
                  // Inactive Streak
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{
                      opacity: [1, 0.3, 1],
                      scale: [1, 0.95, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="text-3xl opacity-30 grayscale"
                  >
                    🔥
                  </motion.span>
                ) : (
                  // Active Streak
                  <motion.span
                    animate={{
                      rotate: [-1, 1, -1],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                    className="text-3xl text-red-500"
                  >
                    🔥
                  </motion.span>
                )}

                <motion.span
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`text-2xl font-bold ${
                    task.streak === 0 ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  {task.streak}
                </motion.span>

                {/* Enhanced Tooltips */}
                {(task.streak === 0 || !doneToday) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2
                 hidden group-hover:block whitespace-nowrap
                 text-sm bg-gray-800 text-white px-3 py-2 rounded-lg
                 shadow-lg z-20"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {task.streak === 0
                          ? "Start your streak today!"
                          : "Don't break your streak!"}
                      </span>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "easeInOut",
                        }}
                      >
                        {task.streak === 0 ? "✨" : "⚡"}
                      </motion.span>
                    </div>
                    <div
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2
                    border-4 border-transparent border-b-gray-800"
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
          {/* Priority badge + selector */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-50 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    rotate: notify ? [0, -15, 15, -10, 10, 0] : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-300 ${
                      notify ? "text-orange-500" : "text-gray-400"
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </motion.div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Reminders</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-500"
                  >
                    {notify ? "Email notifications on" : "Notifications off"}
                  </motion.span>
                </div>
              </div>

              <ToggleSwitch checked={notify} onChange={handleNotifyChange} />
            </div>

            <AnimatePresence mode="wait">
              {notify && (
                <motion.div
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-4 flex items-center space-x-2 border-t border-gray-200 pt-4"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm"
                  >
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      {task.notificationTime}
                    </span>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-orange-100 rounded-lg px-3 py-1"
                  >
                    <span className="text-xs text-orange-600 font-medium">
                      Daily
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {/* Action buttons with enhanced animations */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={handleCheckOff}
              disabled={doneToday}
              className={`px-4 py-2 rounded-lg flex-1 ${
                doneToday
                  ? "bg-gray-200 text-gray-500"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              } transition-colors duration-200`}
            >
              {doneToday ? "Completed" : "Mark"}
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => navigate(`/dashboard/${task._id}/streak`)}
              className="px-4 py-2 rounded-lg flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors duration-200"
            >
              Streak
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => onEdit(task)}
              className="px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors duration-200"
            >
              Edit
            </motion.button>
            {/* Delete Button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            itemName={task.name}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
