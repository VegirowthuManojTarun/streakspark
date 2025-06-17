import React, { useState, useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./TaskForm";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskModal({ task, onClose }) {
  const { addTask, editTask } = useContext(TaskContext);
  const isEdit = Boolean(task._id);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (values) => {
    try {
      if (isEdit) {
        await editTask(task._id, values);
      } else {
        await addTask(values);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-gradient-to-br from-white/60 to-gray-100/60 backdrop-blur-sm
                   flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.08)] w-full max-w-md
                     overflow-hidden transform border border-gray-100"
        >
          {/* Modal Header with Decorative Element */}
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500"></div>
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-bold text-gray-800 flex items-center gap-3"
                >
                  {/* Icon */}
                  <span className="text-orange-500">
                    {isEdit ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    )}
                  </span>
                  {isEdit ? "Edit Habit" : "New Habit"}
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors
                           rounded-full p-2 hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </motion.button>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 mt-2 text-sm"
              >
                {isEdit
                  ? "Make changes to your existing habit"
                  : "Create a new habit to track daily"}
              </motion.p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-8 py-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <TaskForm
                initial={task}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </motion.div>
          </div>

          {/* Modal Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-8 py-4 bg-gray-50/50 border-t border-gray-100"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg
                className="w-4 h-4 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                {isEdit
                  ? "Your streak progress will be preserved"
                  : "You can set reminders to help stay on track"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
// import React, { useState, useContext, useEffect } from "react";
// import { TaskContext } from "../context/TaskContext";
// import TaskForm from "./TaskForm";

// export default function TaskModal({ task, onClose }) {
//   const { addTask, editTask } = useContext(TaskContext);
//   const isEdit = Boolean(task._id);

//   const handleSubmit = async (values) => {
//     if (isEdit) {
//       await editTask(task._id, values);
//     } else {
//       await addTask(values);
//     }
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">
//           {isEdit ? "Edit Habit" : "New Habit"}
//         </h2>
//         <TaskForm initial={task} onSubmit={handleSubmit} onCancel={onClose} />
//       </div>
//     </div>
//   );
// }
