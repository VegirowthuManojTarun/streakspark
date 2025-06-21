import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskDone,
  fetchQuote,
  updateNotificationPreference,
} from "../apis";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { scheduleNotifications } from "../utils/notifications.js";

const TASK_CACHE_LS_KEY = "tasksCacheV1";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user, getToken } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load tasks (with caching)
  const loadTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setQuote(null);
      setLoading(false);
      localStorage.removeItem(TASK_CACHE_LS_KEY);
      return;
    }
    setLoading(true);
    try {
      // Attempt fetch
      const token = await getToken();
      const [{ data: tasksData }, { data: quoteData }] = await Promise.all([
        fetchTasks(token),
        fetchQuote(token),
      ]);
      setTasks(tasksData);
      setQuote(quoteData);
      scheduleNotifications(tasksData);
      localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(tasksData));
    } catch (e) {
      // Fallback to local cache
      toast.error("Failed to load tasks or quote from server, using cache.");
      const cached = localStorage.getItem(TASK_CACHE_LS_KEY);
      if (cached) {
        try {
          setTasks(JSON.parse(cached));
        } catch {
          setTasks([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, getToken]);

  // On login: hydrate from cache and background refresh
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    // local first
    const cached = localStorage.getItem(TASK_CACHE_LS_KEY);
    if (cached) {
      try {
        setTasks(JSON.parse(cached));
      } catch {
        setTasks([]);
      }
    }
    // always refresh from server + quote
    loadTasks();
    // eslint-disable-next-line
  }, [user]);

  // --- CRUD operations (with sync to cache) ---

  const addTask = async (payload) => {
    try {
      const token = await getToken();
      const { data } = await createTask(payload, token);
      setTasks((tasks) => {
        const newTasks = [data, ...tasks];
        localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(newTasks));
        return newTasks;
      });
      toast.success("Task created");
      return data;
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Task already exists");
      } else toast.error("Error creating task");
    }
  };

  const editTask = async (id, payload) => {
    try {
      const token = await getToken();
      const { data } = await updateTask(id, payload, token);
      setTasks((tasks) => {
        const newTasks = tasks.map((t) => (t._id === id ? data : t));
        localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(newTasks));
        return newTasks;
      });
      toast.success("Task updated");
    } catch {
      toast.error("Error updating task");
    }
  };

  const removeTask = async (id) => {
    try {
      const token = await getToken();
      await deleteTask(id, token);
      setTasks((tasks) => {
        const newTasks = tasks.filter((t) => t._id !== id);
        localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(newTasks));
        return newTasks;
      });
      toast.success("Task deleted");
    } catch {
      toast.error("Error deleting task");
    }
  };

  const checkOff = async (id) => {
    try {
      const token = await getToken();
      const { data } = await markTaskDone(id, token);
      setTasks((tasks) => {
        const newTasks = tasks.map((t) => (t._id === id ? data : t));
        localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(newTasks));
        return newTasks;
      });
      return data;
    } catch (error) {
      toast.error("Error marking done");
      throw error;
    }
  };

  const toggleNotification = async (taskId, notify) => {
    try {
      const token = await getToken();
      const { data } = await updateNotificationPreference(
        taskId,
        notify,
        token
      );
      setTasks((tasks) => {
        const newTasks = tasks.map((t) => (t._id === taskId ? data.task : t));
        localStorage.setItem(TASK_CACHE_LS_KEY, JSON.stringify(newTasks));
        return newTasks;
      });
      toast.success("Notification preference updated");
    } catch {
      toast.error("Error updating notification preference");
    }
  };

  // Utility: force refresh from server and clear cache
  const clearTaskCacheAndReload = async () => {
    localStorage.removeItem(TASK_CACHE_LS_KEY);
    await loadTasks();
  };

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
        toggleNotification,
        loadTasks,
        clearTaskCacheAndReload,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// // client/src/context/TaskContext.jsx
// import React, { createContext, useState, useEffect, useContext } from "react";
// import {
//   fetchTasks,
//   createTask,
//   updateTask,
//   deleteTask,
//   markTaskDone,
//   fetchQuote,
//   updateNotificationPreference,
// } from "../apis";
// import { AuthContext } from "./AuthContext";
// import { toast } from "react-toastify";
// import { scheduleNotifications } from "../utils/notifications.js";

// export const TaskContext = createContext();

// export const TaskProvider = ({ children }) => {
//   const { user, getToken } = useContext(AuthContext); // <--- getToken from context!
//   const [tasks, setTasks] = useState([]);
//   const [quote, setQuote] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const loadTasks = async () => {
//     if (!user) {
//       setTasks([]);
//       setQuote(null);
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     try {
//       const token = await getToken();
//       const [{ data: tasksData }, { data: quoteData }] = await Promise.all([
//         fetchTasks(token),
//         fetchQuote(token),
//       ]);
//       setTasks(tasksData);
//       setQuote(quoteData);
//       scheduleNotifications(tasksData);
//     } catch (e) {
//       toast.error("Failed to load tasks or quote");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTask = async (payload) => {
//     try {
//       const token = await getToken();
//       const { data } = await createTask(payload, token);
//       setTasks([data, ...tasks]);
//       toast.success("Task created");
//       return data;
//     } catch (err) {
//       if (err.response && err.response.status === 409) {
//         toast.error("Task already exists");
//       } else toast.error("Error creating task");
//     }
//   };

//   const editTask = async (id, payload) => {
//     try {
//       const token = await getToken();
//       const { data } = await updateTask(id, payload, token);
//       setTasks(tasks.map((t) => (t._id === id ? data : t)));
//       toast.success("Task updated");
//     } catch {
//       toast.error("Error updating task");
//     }
//   };

//   const removeTask = async (id) => {
//     try {
//       const token = await getToken();
//       await deleteTask(id, token);
//       setTasks(tasks.filter((t) => t._id !== id));
//       toast.success("Task deleted");
//     } catch {
//       toast.error("Error deleting task");
//     }
//   };

//   const checkOff = async (id) => {
//     try {
//       const token = await getToken();
//       const { data } = await markTaskDone(id, token);
//       setTasks(tasks.map((t) => (t._id === id ? data : t)));
//       return data;
//     } catch (error) {
//       toast.error("Error marking done");
//       throw error;
//     }
//   };

//   const toggleNotification = async (taskId, notify) => {
//     try {
//       const token = await getToken();
//       const { data } = await updateNotificationPreference(
//         taskId,
//         notify,
//         token
//       );
//       setTasks(tasks.map((t) => (t._id === taskId ? data.task : t)));
//       toast.success("Notification preference updated");
//     } catch {
//       toast.error("Error updating notification preference");
//     }
//   };

//   useEffect(() => {
//     if (user) loadTasks();
//   }, [user]);

//   return (
//     <TaskContext.Provider
//       value={{
//         tasks,
//         quote,
//         loading,
//         addTask,
//         editTask,
//         removeTask,
//         checkOff,
//         toggleNotification,
//       }}
//     >
//       {children}
//     </TaskContext.Provider>
//   );
// };
