// TaskList.jsx
import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";
import { motion } from "framer-motion";

// In TaskList.jsx

export default function TaskList({ onEdit, searchQuery = "" }) {
  const { tasks } = useContext(TaskContext);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">
          No habits yet. Start by adding one!
        </p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10"
      >
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg">
          No habits found matching "{searchQuery}"
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your search term
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredTasks.map((task) => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
