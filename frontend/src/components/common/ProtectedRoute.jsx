import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute Guard Component
 * Enforces Authentication & Role-Based Access Control (RBAC) on frontend routes.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  // 1. If not logged in, redirect straight to /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If specific allowedRoles are passed (e.g. allowedRoles={["ADMIN"]}), check user role
  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = localStorage.getItem("userRole") || "USER";
    const userRole = rawRole.toUpperCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());

    const hasAccess = normalizedAllowedRoles.includes(userRole);

    if (!hasAccess) {
      // Unauthorized role -> redirect back to /dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Authenticated & authorized -> render the requested page
  return <Outlet />;
};

export default ProtectedRoute;