// TaskList.jsx
import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
// At the top of TaskList.jsx
import TaskCompletionModal from "./modals/TaskCompletionModal";
export default function TaskList({
  onEdit,
  searchQuery = "",
  priorityFilter = "all",
}) {
  const { tasks } = useContext(TaskContext);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const [completedTask, setCompletedTask] = useState(null); // Add this state
  // Add this handler
  const handleTaskComplete = (task) => {
    setCompletedTask(task);
  };
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter.length === 0 || priorityFilter.includes(task.priority);
    return matchesSearch && matchesPriority;
  });

  // Separate tasks into marked and unmarked
  const { markedTasks, unmarkedTasks } = filteredTasks.reduce(
    (acc, task) => {
      const isMarked =
        task.lastMarkedDate &&
        format(new Date(task.lastMarkedDate), "yyyy-MM-dd") === todayStr;

      if (isMarked) {
        acc.markedTasks.push(task);
      } else {
        acc.unmarkedTasks.push(task);
      }
      return acc;
    },
    { markedTasks: [], unmarkedTasks: [] }
  );

  // Sort each array by priority
  const sortByPriority = (tasks) =>
    [...tasks].sort((a, b) => (a.priority ?? 5) - (b.priority ?? 5));

  const sortedMarkedTasks = sortByPriority(markedTasks);
  const sortedUnmarkedTasks = sortByPriority(unmarkedTasks);

  // Combine tasks for mobile view
  const sortedAllTasks = [...sortedUnmarkedTasks, ...sortedMarkedTasks];

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
    <>
      {/* Desktop View - Two Columns */}
      <div className="hidden md:flex gap-2 lg:gap-4  h-[calc(100vh-200px)]">
        {/* Unmarked Tasks Column */}
        <div className="w-1/2">
          <div className="bg-white rounded-t-xl p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>To Complete</span>
              <span className="bg-orange-100 text-orange-600 text-sm px-2 py-0.5 rounded-full">
                {sortedUnmarkedTasks.length}
              </span>
            </h2>
          </div>
          <div className="overflow-y-auto h-full pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pt-4"
            >
              {sortedUnmarkedTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onComplete={handleTaskComplete}
                />
              ))}
              {sortedUnmarkedTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    All tasks completed for today! 🎉
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Marked Tasks Column */}
        <div className="w-1/2">
          <div className="bg-white rounded-t-xl p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>Completed</span>
              <span className="bg-green-100 text-green-600 text-sm px-2 py-0.5 rounded-full">
                {sortedMarkedTasks.length}
              </span>
            </h2>
          </div>
          <div className="overflow-y-auto h-full pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pt-4"
            >
              {sortedMarkedTasks.map((task) => (
                <TaskItem key={task._id} task={task} onEdit={onEdit} />
              ))}
              {sortedMarkedTasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No completed tasks yet today</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile View - Single Column */}
      <div className="md:hidden space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {sortedAllTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onComplete={handleTaskComplete}
            />
          ))}
        </motion.div>
      </div>
      {/* Add the completion modal here */}
      <AnimatePresence>
        {completedTask && (
          <TaskCompletionModal
            taskName={completedTask.name}
            streak={completedTask.streak}
            onClose={() => setCompletedTask(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
