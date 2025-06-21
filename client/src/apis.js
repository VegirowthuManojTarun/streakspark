// client/src/apis.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const withAuth = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

// Each API call accepts a token argument (you get it in your component with useAuth().getToken())
export const fetchCurrentUser = (token) => API.get("/auth/me", withAuth(token));
export const fetchQuote = (token) => API.get("/tasks/quotes", withAuth(token));
export const fetchTasks = (token) => API.get("/tasks", withAuth(token));
export const createTask = (data, token) =>
  API.post("/tasks", data, withAuth(token));
export const updateTask = (id, data, token) =>
  API.put(`/tasks/${id}`, data, withAuth(token));
export const deleteTask = (id, token) =>
  API.delete(`/tasks/${id}`, withAuth(token));
export const markTaskDone = (id, token) =>
  API.patch(`/tasks/${id}/mark`, null, withAuth(token));
export const fetchTaskHistory = (id, token) =>
  API.get(`/tasks/${id}/history`, withAuth(token));
export const fetchTaskDetail = (id, token) =>
  API.get(`/tasks/${id}`, withAuth(token));
export const updateNotificationPreference = (taskId, notifyByEmail, token) =>
  API.patch(
    `/tasks/${taskId}/notification`,
    { notifyByEmail },
    withAuth(token)
  );

export const saveTimetable = (tasks, token) =>
  API.post("/timetable", { tasks }, withAuth(token));

// apis.js
export const fetchTimetable = async (token) => {
  const response = await API.get("/timetable", withAuth(token));
  return response.data; // Make sure we're returning the data property
};

export const deleteTimetableTask = (taskId, token) =>
  API.delete(`/timetable/${taskId}`, withAuth(token));

export const toggleTaskCompletion = async (taskId, completed, token) => {
  if (!taskId || typeof completed !== "boolean") {
    throw new Error("Invalid parameters for task completion toggle");
  }

  try {
    const response = await API.patch(
      `/timetable/${taskId}/completion`,
      { completed },
      withAuth(token)
    );
    return response;
  } catch (error) {
    console.error("Toggle completion API error:", error);
    throw error;
  }
};

// --- Diary API (NEW) ---

export const fetchDiaryEntryByDate = (dateStr, token) =>
  API.get(`/diary/entries?dateStr=${dateStr}`, withAuth(token));

export const createDiaryEntry = (data, token) =>
  API.post("/diary/entries", data, withAuth(token));

export const updateDiaryEntry = (id, data, token) =>
  API.put(`/diary/entries/${id}`, data, withAuth(token));

export const fetchDiaryEntryById = (id, token) =>
  API.get(`/diary/entries/${id}`, withAuth(token));

export const deleteDiaryEntry = (id, token) =>
  API.delete(`/diary/entries/${id}`, withAuth(token));

export const fetchAllDiaryEntries = (token) =>
  API.get("/diary/entries", withAuth(token));
