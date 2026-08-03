import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Sparkles,
  Search,
  LockKeyhole,
  FileText,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { loginUser } from "../services/authService";
import { showErrorAlert, showSuccessAlert, showToast } from "../utils/swal";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [loginData, setLoginData] = useState({
    email: "ramacharan@enterprise.com",
    password: "Password123!",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email) {
      showErrorAlert("Email Required", "Please enter your email address.");
      return;
    }

    if (!loginData.email.includes("@")) {
      showErrorAlert("Invalid Email", "Please enter a valid email address format.");
      return;
    }

    if (!loginData.password) {
      showErrorAlert("Password Required", "Please enter your password.");
      return;
    }

    if (loginData.password.length < 6) {
      showErrorAlert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        showToast("Signed in successfully", "success");
        navigate("/dashboard");
      } else {
        showErrorAlert("Login Failed", "Server did not return a valid authentication token.");
      }
    } catch (error) {
      console.warn("Backend login error:", error);
      const isNetworkError =
        !error.response ||
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        (error.message && error.message.toLowerCase().includes("network error"));

      if (isNetworkError) {
        showErrorAlert(
          "Backend Unavailable",
          "Backend server is unavailable. Please start the server and try again."
        );
      } else if (error.response?.status === 401) {
        showErrorAlert("Invalid Credentials", "Email or password is incorrect.");
      } else {
        const serverMsg = error.response?.data?.message || error.response?.data?.error || "Login request failed. Please try again.";
        showErrorAlert("Login Error", serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    {
      title: "Property Intelligence",
      description: "Comprehensive land registry & title chain records",
      icon: Building2,
      iconBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Secure Authentication",
      description: "Role-based access control & encrypted sessions",
      icon: LockKeyhole,
      iconBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
    {
      title: "AI-Powered Due Diligence",
      description: "Automated risk analysis & zoning compliance checks",
      icon: Sparkles,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Fast Property Search",
      description: "Instant APN, survey number & location queries",
      icon: Search,
      iconBg: "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/80 via-purple-50/50 via-emerald-50/40 to-amber-50/60 dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#1E293B] text-slate-900 dark:text-[#F8FAFC] overflow-hidden px-4 py-12 transition-colors duration-250">
      {/* Subtle Blueprint Grid Pattern */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-60 pointer-events-none" />

      {/* Top Right Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-white/80 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#273449] transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
      >
        {isDark ? (
          <>
            <Sun size={16} className="text-amber-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon size={16} className="text-blue-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* Multi-color Ambient Blurred Gradient Blobs */}
      <div className="absolute -top-16 -right-16 w-[36rem] h-[36rem] bg-blue-200/40 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute -bottom-20 -left-20 w-[34rem] h-[34rem] bg-purple-200/40 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Modern Feature Showcase Panel */}
        <div className="lg:col-span-7 space-y-6 text-left hidden lg:block pr-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E293B] text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-[#334155] text-xs font-semibold shadow-xs backdrop-blur-md">
            <Shield size={14} className="text-blue-600 dark:text-cyan-400" /> Enterprise Real Estate Intelligence
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Next-Generation Land & <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-cyan-300 dark:to-purple-400 bg-clip-text text-transparent">
              Property Due Diligence
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-lg">
            Access verified land registry title records, municipal tax histories, zoning regulations, and environmental risk metrics through a secure workspace.
          </p>

          {/* 4 Feature Highlight Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/90 dark:bg-[#1E293B] border border-slate-200/90 dark:border-[#334155] shadow-xs hover:shadow-md transition-all duration-200 backdrop-blur-md cursor-default group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${card.iconBg} group-hover:scale-105 transition-transform shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">{card.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{card.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white/95 dark:bg-[#111827]/95 rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-2xl dark:shadow-blue-950/40 border border-slate-200/90 dark:border-[#334155] backdrop-blur-xl transition-colors duration-250">
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md mb-3">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your registered credentials to access your portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 text-blue-600 dark:text-blue-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#CBD5E1] uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 text-purple-600 dark:text-purple-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
              >
                <span>Sign In</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#334155] text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an enterprise account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;