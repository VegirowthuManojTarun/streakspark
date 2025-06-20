// src/components/Timetable/TimeTableRow.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTrash,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoAlarmOutline,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

const TimeTableRow = ({
  task,
  onDelete,
  isMobile,
  isCompleted,
  onToggleComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleCompletion = (e) => {
    e.stopPropagation();
    // Only allow completion toggle for saved tasks
    if (task._id?.startsWith("temp_")) {
      toast.error("Please save the task first before marking it as complete");
      return;
    }
    if (typeof onToggleComplete === "function") {
      onToggleComplete();
    }
  };

  // Calculate duration in minutes
  const getDuration = () => {
    const start = task.startTime.split(":").map(Number);
    const end = task.endTime.split(":").map(Number);
    return end[0] * 60 + end[1] - (start[0] * 60 + start[1]);
  };

  // Format duration for display
  const formatDuration = () => {
    const mins = getDuration();
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  const MobileRow = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white rounded-lg border border-gray-100 p-4 
                ${isCompleted ? "bg-green-50/50" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Time Section */}
        <div className="w-[100px] flex-shrink-0">
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 text-sm">
              {task.startTime} - {task.endTime}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <IoAlarmOutline className="w-3 h-3" />
              {formatDuration()}
            </span>
          </div>
        </div>

        {/* Task Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleCompletion}
              className={`rounded-full p-1 transition-colors flex-shrink-0 mt-1
                       ${
                         isCompleted
                           ? "text-green-500 bg-green-100"
                           : "text-gray-400 bg-gray-100"
                       }`}
            >
              <IoCheckmarkCircle className="w-4 h-4" />
            </motion.button>
            <div className="flex flex-col gap-1">
              <span
                className={`font-medium text-sm break-words
                            ${
                              isCompleted
                                ? "line-through text-gray-500"
                                : "text-gray-800"
                            }`}
              >
                {task.taskName}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="w-[60px] flex justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task._id)}
            className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
          >
            <IoTrash className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const DesktopRow = () => (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`border-b border-gray-100 hover:bg-orange-50/50 transition-colors
                ${isCompleted ? "bg-green-50/50" : ""}`}
    >
      <td className="px-6 py-4 w-[200px]">
        <div className="flex items-center gap-2">
          <IoTimeOutline className="w-5 h-5 text-orange-500" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">
              {task.startTime} - {task.endTime}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <IoAlarmOutline className="w-4 h-4" />
              {formatDuration()}
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <motion.div
          className="flex items-center gap-3"
          animate={{ opacity: isCompleted ? 0.7 : 1 }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleCompletion}
            className={`rounded-full p-1 transition-colors
                     ${
                       isCompleted
                         ? "text-green-500 bg-green-100"
                         : "text-gray-400 bg-gray-100"
                     }`}
          >
            <IoCheckmarkCircle className="w-5 h-5" />
          </motion.button>
          <div className="flex flex-col">
            <span
              className={`font-medium ${
                isCompleted ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.taskName}
            </span>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-gray-500"
              >
                Click checkbox to mark as complete
              </motion.div>
            )}
          </div>
        </motion.div>
      </td>

      <td className="px-6 py-4 w-[100px]">
        <div className="flex justify-end">
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task._id)}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 
                         transition-colors flex items-center gap-1"
              >
                <IoTrash className="w-5 h-5" />
                <span className="text-sm">Delete</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );

  return isMobile ? <MobileRow /> : <DesktopRow />;
};

export default TimeTableRow;
