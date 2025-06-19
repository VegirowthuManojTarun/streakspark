// src/pages/TimetablePage.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { format, parse, isAfter, isBefore, addMinutes } from "date-fns";
import { toPng } from "html-to-image";
import AddTaskModal from "../components/Timetable/AddTaskModal";
import TimeTableRow from "../components/Timetable/TimeTableRow";
import { saveTimetable, fetchTimetable, deleteTimetableTask } from "../apis";
import { AuthContext } from "../context/AuthContext";

export default function TimetablePage() {
  const { getToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const tableRef = useRef(null);
  // src/pages/TimetablePage.jsx

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetchTimetable(token);

      console.log("Timetable response:", response); // For debugging

      if (Array.isArray(response) && response.length > 0) {
        setTasks(response);
        // Clear localStorage since we have server data
        localStorage.removeItem("timetableTasks");
      } else {
        // No server data, try localStorage
        const localTasks = localStorage.getItem("timetableTasks");
        if (localTasks) {
          const parsedTasks = JSON.parse(localTasks);
          if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
            setTasks(parsedTasks);
          } else {
            setTasks([]); // Ensure empty array if no tasks
          }
        }
      }
    } catch (error) {
      console.error("Failed to load timetable:", error);
      toast.error("Failed to load timetable");
      // Fallback to localStorage
      const localTasks = localStorage.getItem("timetableTasks");
      if (localTasks) {
        try {
          const parsedTasks = JSON.parse(localTasks);
          if (Array.isArray(parsedTasks)) {
            setTasks(parsedTasks);
          }
        } catch (e) {
          console.error("Failed to parse localStorage tasks:", e);
          setTasks([]);
        }
      }
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

  // Save timetable to server
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = await getToken();
      await saveTimetable(tasks, token);
      localStorage.removeItem("timetableTasks");
      toast.success("Timetable saved successfully!");
    } catch (error) {
      console.error("Failed to save timetable:", error);
      toast.error("Failed to save timetable");
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

  const handleAddTask = (newTask) => {
    try {
      validateTimeRange(newTask.startTime, newTask.endTime);

      setTasks((prev) => {
        const updatedTasks = [...prev, newTask].sort((a, b) => {
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
    if (tasks.length === 0) return "00:00";
    const lastTask = tasks[tasks.length - 1];
    const lastEndTime = parse(lastTask.endTime, "HH:mm", new Date());
    return format(addMinutes(lastEndTime, 1), "HH:mm");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading timetable...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daily Timetable</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-500 text-white rounded-lg 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        </div>

        <div ref={tableRef} className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-gray-600">Time</th>
                <th className="px-4 py-2 text-left text-gray-600">Task</th>
                <th className="px-4 py-2 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TimeTableRow
                    key={task._id || index}
                    task={task}
                    onDelete={() => handleDeleteTask(task._id, index)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No tasks added yet. Click "Add Task" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          disabled={
            tasks.length > 0 && tasks[tasks.length - 1].endTime === "24:00"
          }
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium
                   hover:bg-orange-600 transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
        >
          Add Task
        </motion.button>
      </div>

      <AddTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddTask}
        suggestedStartTime={getNextStartTime()}
      />
    </div>
  );
}
