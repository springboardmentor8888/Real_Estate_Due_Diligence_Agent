import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenValid, clearAuthData } from "../../services/authService";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    clearAuthData();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;

