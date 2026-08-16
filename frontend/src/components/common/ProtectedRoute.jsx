import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const role =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    user.role ||
    "";

  return String(role)
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

const normalizeRole = (role) => {
  if (!role) return "";

  return String(role)
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const ProtectedRoute = ({ allowedRoles }) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

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

  console.log("========== RBAC DEBUG ==========");
  console.log("rawRole:", JSON.stringify(rawRole));
  console.log("userRole:", JSON.stringify(userRole));
  console.log(
    "allowedRoles:",
    normalizedAllowedRoles.map((r) => JSON.stringify(r)),
  );
  console.log("MATCH:", hasAccess);
  console.log("================================");

  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
