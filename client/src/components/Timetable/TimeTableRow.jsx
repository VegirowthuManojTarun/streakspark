// src/components/Timetable/TimeTableRow.jsx
import React from "react";
import { motion } from "framer-motion";
import { IoTrash } from "react-icons/io5";
// components/Timetable/TimeTableRow.jsx

const TimeTableRow = ({ task, onDelete }) => {
  console.log("Task in row:", task); // For debugging

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-gray-100"
    >
      <td className="px-4 py-3 text-gray-800">
        {task.startTime} - {task.endTime}
      </td>
      <td className="px-4 py-3 text-gray-800">{task.taskName}</td>
      <td className="px-4 py-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task._id)}
          className="text-red-500 hover:text-red-600"
        >
          <IoTrash className="w-5 h-5" />
        </motion.button>
      </td>
    </motion.tr>
  );
};

export default TimeTableRow;
