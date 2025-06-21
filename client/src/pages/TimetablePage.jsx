// src/pages/TimetablePage.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { format, parse, isAfter, isBefore, addMinutes } from "date-fns";
import { toPng } from "html-to-image";
import {
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineSave,
  HiOutlineFire,
  HiOutlineSun,
  HiOutlineMoon,
} from "react-icons/hi";
import AddTaskModal from "../components/Timetable/AddTaskModal";
import TimeTableRow from "../components/Timetable/TimeTableRow";
import { saveTimetable, fetchTimetable, deleteTimetableTask } from "../apis";
import { AuthContext } from "../context/AuthContext";
import { useTaskCompletions } from "../hooks/useTaskCompletions";
import TimetableSkeleton from "../components/Timetable/TimetableSkeleton";
export default function TimetablePage() {
  const { getToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const tableRef = useRef(null);
  const { completions, toggleCompletion } = useTaskCompletions();

  // src/pages/TimetablePage.jsx
  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length > 0) {
      const completedTasks = tasks
        .filter((task) => task.completedAt)
        .map((task) => [task._id, true]);

      if (completedTasks.length > 0) {
        localStorage.setItem(
          "taskCompletions",
          JSON.stringify({
            date: new Date().toISOString().split("T")[0],
            completions: completedTasks,
          })
        );
      }
    }
  }, [tasks]);
  const loadTimetable = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetchTimetable(token);

      if (Array.isArray(response) && response.length > 0) {
        // Initialize completions from server response
        const initialCompletions = new Map();

        response.forEach((task) => {
          if (task.completedAt) {
            initialCompletions.set(task._id, true);
          }
        });

        // Set tasks first
        setTasks(response);

        // Update completions in the useTaskCompletions hook
        if (toggleCompletion && typeof toggleCompletion === "function") {
          response.forEach((task) => {
            if (task.completedAt) {
              toggleCompletion(task._id, true, true); // Add a skipServer parameter to avoid API calls
            }
          });
        }

        // Store in localStorage
        localStorage.setItem(
          "taskCompletions",
          JSON.stringify({
            date: new Date().toISOString().split("T")[0],
            completions: Array.from(initialCompletions.entries()),
          })
        );
      }
    } catch (error) {
      console.error("Failed to load timetable:", error);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("timetableTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    try {
      validateTimeRange(newTask.startTime, newTask.endTime);

      setTasks((prev) => {
        const updatedTasks = [
          ...prev,
          {
            ...newTask,
            _id: `temp_${Date.now()}`, // Temporary ID for new tasks
          },
        ].sort((a, b) => {
          const timeA = parse(a.startTime, "HH:mm", new Date());
          const timeB = parse(b.startTime, "HH:mm", new Date());
          return timeA.getTime() - timeB.getTime();
        });
        return updatedTasks;
      });

      setShowModal(false);
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();

      // Filter out temporary IDs before saving
      const tasksToSave = tasks.map(({ _id, ...task }) => {
        if (_id?.startsWith("temp_")) {
          return task;
        }
        return { _id, ...task };
      });

      const response = await saveTimetable(tasksToSave, token);

      // Ensure we're getting an array of tasks from the response
      if (Array.isArray(response)) {
        setTasks(response);
      } else if (Array.isArray(response?.data)) {
        setTasks(response.data);
      } else {
        throw new Error("Invalid response format from server");
      }

      localStorage.removeItem("timetableTasks");
      toast.success("Timetable saved successfully!");
    } catch (error) {
      console.error("Failed to save timetable:", error);
      toast.error(error.message || "Failed to save timetable");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteTask = async (taskId, index) => {
    try {
      const token = await getToken();
      if (taskId) {
        // If task has an ID (saved in DB), delete from server
        await deleteTimetableTask(taskId, token);
      }
      setTasks((prev) => prev.filter((_, i) => i !== index));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  const validateTimeRange = (startTime, endTime, currentTaskIndex = -1) => {
    const start = parse(startTime, "HH:mm", new Date());
    const end = parse(endTime, "HH:mm", new Date());

    // Validate end time is after start time
    if (!isAfter(end, start)) {
      throw new Error("End time must be after start time");
    }

    // Validate against 24:00 limit
    const midnight = parse("24:00", "HH:mm", new Date());
    if (isAfter(end, midnight)) {
      throw new Error("End time cannot be after midnight");
    }

    // Check for overlaps with existing tasks
    const hasOverlap = tasks.some((task, index) => {
      if (index === currentTaskIndex) return false;

      const taskStart = parse(task.startTime, "HH:mm", new Date());
      const taskEnd = parse(task.endTime, "HH:mm", new Date());

      return (
        (isAfter(start, taskStart) && isBefore(start, taskEnd)) ||
        (isAfter(end, taskStart) && isBefore(end, taskEnd)) ||
        (isBefore(start, taskStart) && isAfter(end, taskEnd))
      );
    });

    if (hasOverlap) {
      throw new Error("Time range overlaps with existing task");
    }

    return true;
  };

  const handleExport = async () => {
    try {
      if (tableRef.current) {
        const dataUrl = await toPng(tableRef.current);
        const link = document.createElement("a");
        link.download = `timetable-${format(new Date(), "yyyy-MM-dd")}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Timetable exported successfully!");
      }
    } catch (error) {
      console.error("Failed to export timetable:", error);
      toast.error("Failed to export timetable");
    }
  };
  const getNextStartTime = () => {
    if (!tasks.length) return "00:00";
    const lastTask = tasks[tasks.length - 1];
    if (!lastTask?.endTime) return "00:00";

    try {
      const lastEndTime = parse(lastTask.endTime, "HH:mm", new Date());
      return format(addMinutes(lastEndTime, 1), "HH:mm");
    } catch (error) {
      console.error("Error calculating next start time:", error);
      return "00:00";
    }
  };
  // New functions for enhanced UI
  const calculateDayProgress = () => {
    if (!tasks.length) return 0;
    const totalMinutes = tasks.reduce((acc, task) => {
      const start = parse(task.startTime, "HH:mm", new Date());
      const end = parse(task.endTime, "HH:mm", new Date());
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    return Math.min((totalMinutes / (24 * 60)) * 100, 100);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    return hour >= 17 ? "evening" : hour >= 12 ? "afternoon" : "morning";
  };

  const renderProgressBanner = () => (
    <motion.div
      className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-4 sm:p-6 text-white shadow-lg"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {getTimeOfDay() === "evening" ? (
          <HiOutlineMoon className="w-6 h-6" />
        ) : (
          <HiOutlineSun className="w-6 h-6" />
        )}
        <h2 className="text-lg sm:text-xl font-bold">
          Good {getTimeOfDay()}! Here's your day at a glance
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-white/90">Day Progress</span>
          <span className="font-semibold">
            {Math.round(calculateDayProgress())}%
          </span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${calculateDayProgress()}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-3 mb-6">
      <div className="flex items-center gap-3">
        <HiOutlineClock className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">Daily Timetable</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg 
                    flex items-center justify-center gap-2 hover:bg-gray-200 
                    transition-colors w-full sm:w-auto"
        >
          <HiOutlineDownload className="w-5 h-5" />
          <span>Export</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2.5 bg-orange-500 text-white rounded-lg 
                    flex items-center justify-center gap-2 hover:bg-orange-600 
                    transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          <HiOutlineSave className="w-5 h-5" />
          <span>{saving ? "Saving..." : "Save"}</span>
        </motion.button>
      </div>
    </div>
  );
  const renderTable = () => {
    const renderTableRow = (task, index, isMobile) => (
      <TimeTableRow
        key={task._id || index}
        task={task}
        onDelete={() => handleDeleteTask(task._id, index)}
        isMobile={isMobile}
        isCompleted={completions.get(task._id)}
        onToggleComplete={() => toggleCompletion(task._id)}
      />
    );

    return (
      <>
        {/* Mobile View */}
        <div className="sm:hidden space-y-4">
          {/* Mobile Column Headers */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2 sticky top-0 z-10">
            <div className="w-[100px] text-sm font-medium text-gray-600">
              Time
            </div>
            <div className="flex-1 text-sm font-medium text-gray-600">Task</div>
            <div className="w-[60px] text-sm font-medium text-gray-600 text-right">
              Actions
            </div>
          </div>

          {/* Mobile Tasks List */}
          <div className="space-y-3">
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task, index) => renderTableRow(task, index, true))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No tasks added yet. Click "Add Task" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-gray-600 w-[200px]">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-gray-600">Task</th>
                <th className="px-6 py-3 text-left text-gray-600 w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task, index) => renderTableRow(task, index, false))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No tasks added yet. Click "Add Task" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <TimetableSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 space-y-6"
    >
      {renderProgressBanner()}

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {renderHeader()}

        <div ref={tableRef} className="mb-6">
          {renderTable()}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          disabled={
            tasks.length > 0 && tasks[tasks.length - 1].endTime === "24:00"
          }
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 
                    text-white rounded-lg font-medium shadow-lg flex items-center 
                    justify-center gap-2 hover:from-orange-600 hover:to-orange-700 
                    transition-all disabled:opacity-50"
        >
          <HiOutlineFire className="w-5 h-5" />
          Add New Task
        </motion.button>
      </div>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTask}
        suggestedStartTime={getNextStartTime()}
      />
    </motion.div>
  );
}
