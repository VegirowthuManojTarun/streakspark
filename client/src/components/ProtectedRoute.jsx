// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthLoadingSkeleton from "./skeletons/AuthLoadingSkeleton";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <AuthLoadingSkeleton />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
