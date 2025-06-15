import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Attach JWT on every request
API.interceptors.request.use((config) => {
  const token = Cookies.get("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const googleAuth = (code) => API.get(`/auth/google?code=${code}`);

export const fetchCurrentUser = () => API.get("/auth/me");

export const fetchQuote = () => API.get("/tasks/quotes");

export const fetchTasks = () => API.get("/tasks");

export const createTask = (data) => API.post("/tasks", data);

export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export const markTaskDone = (id) => API.patch(`/tasks/${id}/mark`);

export const fetchTaskHistory = (id) => API.get(`/tasks/${id}/history`);

export const fetchTaskDetail = (id) => API.get(`/tasks/${id}`);
