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
    // Read role from userRole, role, or parsed user object
    let rawRole = localStorage.getItem("userRole") || localStorage.getItem("role") || "";
    
    if (!rawRole) {
      try {
        const userObj = JSON.parse(localStorage.getItem("user") || "{}");
        rawRole = userObj.role || "BUYER";
      } catch (e) {
        rawRole = "BUYER";
      }
    }

    // Clean "ROLE_" prefix (e.g. "ROLE_ADMIN" -> "ADMIN")
    const cleanUserRole = String(rawRole).replace(/^ROLE_/, "").trim().toUpperCase();

    // Clean "ROLE_" prefix from allowedRoles (e.g. ["ADMIN", "ROLE_ADMIN"] -> ["ADMIN"])
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).replace(/^ROLE_/, "").trim().toUpperCase()
    );

    const hasAccess = normalizedAllowedRoles.includes(cleanUserRole);

    if (!hasAccess) {
      console.warn(`[RBAC] Access denied for role '${cleanUserRole}'. Allowed:`, normalizedAllowedRoles);
      // Unauthorized role -> redirect back to /dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 3. Authenticated & authorized -> render the requested page
  return <Outlet />;
};

export default ProtectedRoute;