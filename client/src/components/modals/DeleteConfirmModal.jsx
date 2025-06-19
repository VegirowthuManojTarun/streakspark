// components/DeleteConfirmModal.jsx
import React from "react";
import { motion } from "framer-motion";

const DeleteConfirmModal = ({ onConfirm, onCancel, itemName = "item" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl"
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className="text-red-500 mb-4"
      >
        <svg
          className="w-12 h-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
        Delete Habit
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        Are you sure you want to delete "{itemName}"? This action cannot be
        undone.
      </p>
      <div className="flex justify-end space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 
                     transition-colors duration-200 flex-1"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
                     transition-colors duration-200 flex-1"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

export default DeleteConfirmModal;
