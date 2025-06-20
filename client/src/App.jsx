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
import GlobalNavBar from "./components/GlobalNavbar";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
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
                <GlobalNavBar />
                {/* Always renders the nav on all child routes */}
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="dashboard/:id/streak" element={<StreakPage />} />
                  <Route path="timetable" element={<TimetablePage />} />
                  {/* ...other protected children */}
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
// export default function App() {
//   return (
//     <>
//       <Toaster position="top-center" />
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/dashboard/:id/streak"
//           element={
//             <ProtectedRoute>
//               <ErrorBoundary>
//                 <StreakPage />
//               </ErrorBoundary>
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/timetable" element={<TimetablePage />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </>
//   );
// }
