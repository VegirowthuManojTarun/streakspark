import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StreakPage from "./pages/StreakPage";
import ErrorBoundary from "./components/ErrorBoundary";
import TimetablePage from "./pages/TimetablePage";
export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id/streak"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <StreakPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
