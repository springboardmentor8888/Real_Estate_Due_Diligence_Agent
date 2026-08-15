import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const normalizeRole = (role) => {
  if (!role) return "";

  let value = String(role).trim();

  // Remove quotes if the role was stored as a JSON string
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      value = JSON.parse(value);
    } catch {
      value = value.replace(/^"|"$/g, "");
    }
  }

  return value
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

const ProtectedRoute = ({ allowedRoles }) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // No role restriction
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  let storedUser = {};

  try {
    storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    storedUser = {};
  }

  const rawRole =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    storedUser.role ||
    "";

  const userRole = normalizeRole(rawRole);

  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  const hasAccess = normalizedAllowedRoles.includes(userRole);

  console.log("[RBAC CHECK]", {
    rawRole,
    userRole,
    normalizedAllowedRoles,
    hasAccess,
  });

  if (!hasAccess) {
    console.warn(
      `[RBAC] Access denied for role '${userRole}'. Allowed:`,
      normalizedAllowedRoles,
    );

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
