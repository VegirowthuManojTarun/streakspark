import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { DiaryProvider } from "./context/DiaryContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StreakPage from "./pages/StreakPage";
import ErrorBoundary from "./components/ErrorBoundary";
import TimetablePage from "./pages/TimetablePage";
import NavBar from "./components/Navbar";
import DiaryPage from "./pages/DiaryPage";
export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App: All with GlobalNavBar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                {/* Always renders the nav on all child routes */}
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="dashboard/:id/streak" element={<StreakPage />} />
                  <Route path="timetable" element={<TimetablePage />} />
                  <Route
                    path="diary"
                    element={
                      <DiaryProvider>
                        <DiaryPage />
                      </DiaryProvider>
                    }
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
