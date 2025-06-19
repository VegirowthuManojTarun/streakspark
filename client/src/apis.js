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
