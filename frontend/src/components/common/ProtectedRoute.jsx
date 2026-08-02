import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectedRoute Guard Component
 * Enforces Role-Based Access Control (RBAC) on frontend routes.
 */
const ProtectedRoute = ({ allowedRoles = ["ADMIN"] }) => {
  // Read from localStorage, defaulting safely to "USER" (least privilege)
  const rawRole = localStorage.getItem("userRole") || "USER";
  const userRole = rawRole.toUpperCase();

  // Check if current user's role is permitted (normalized to uppercase)
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());
  const hasAccess = normalizedAllowedRoles.includes(userRole);

  if (!hasAccess) {
    // Redirect unauthorized users back to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;