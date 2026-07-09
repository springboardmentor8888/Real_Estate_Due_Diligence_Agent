import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";
import ResetPassword from "../pages/ResetPassword";

function AppRouter() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
}

export default AppRouter;