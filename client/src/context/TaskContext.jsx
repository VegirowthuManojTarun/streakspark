import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskDone,
  fetchQuote,
} from "../apis";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { scheduleNotifications } from "../utils/notifications.js";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const [{ data: tasksData }, { data: quoteData }] = await Promise.all([
        fetchTasks(),
        fetchQuote(),
      ]);
      setTasks(tasksData);
      setQuote(quoteData);
      scheduleNotifications(tasksData);
    } catch (e) {
      toast.error("Failed to load tasks or quote");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (payload) => {
    try {
      const { data } = await createTask(payload);
      setTasks([data, ...tasks]);
      toast.success("Task created");
    } catch {
      toast.error("Error creating task");
    }
  };

  const editTask = async (id, payload) => {
    try {
      const { data } = await updateTask(id, payload);
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
      toast.success("Task updated");
    } catch {
      toast.error("Error updating task");
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Error deleting task");
    }
  };

  const checkOff = async (id) => {
    try {
      const { data } = await markTaskDone(id);
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
      toast.success("Marked done!");
    } catch {
      toast.error("Error marking done");
    }
  };

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        quote,
        loading,
        addTask,
        editTask,
        removeTask,
        checkOff,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
