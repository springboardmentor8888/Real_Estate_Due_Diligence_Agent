import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  User,
  LogOut,
  Menu,
  Shield,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import { showConfirmDialog, showToast } from "../../utils/swal";
import { useTheme } from "../../context/ThemeContext";

function Navbar({ onToggleMobileMenu }) {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    const confirmed = await showConfirmDialog({
      title: "Logout Confirmation",
      text: "Are you sure you want to log out of your workspace?",
      confirmButtonText: "Logout Now",
      cancelButtonText: "Stay Logged In",
      icon: "question",
    });

    if (confirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showToast("Logged out successfully", "info");
      navigate("/login");
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Searching properties for "${searchQuery}"`, "info");
      navigate("/property-search");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-20 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#334155] shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      {/* Left Branding & Mobile Toggle */}
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>

        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Building2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                DueDiligence<span className="text-cyan-500">AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                <Shield size={10} /> Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
              Property Verification & Due Diligence Platform
            </p>
          </div>
        </Link>
      </div>

      {/* Center Search Input */}
      <form onSubmit={handleGlobalSearch} className="hidden md:flex relative w-72 lg:w-[420px]">
        <Search className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Address, City, APN, or Owner Name... (Press Enter)"
          className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-100/80 dark:bg-[#111827] border border-slate-200 dark:border-[#334155] text-sm text-slate-800 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-[#0F172A] focus:border-blue-500 transition-all shadow-inner"
        />
        <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[11px] font-mono text-slate-400 dark:text-slate-400 bg-slate-200/70 dark:bg-[#1E293B] px-1.5 py-0.5 rounded">
          <span>⌘K</span>
        </div>
      </form>

      {/* Right User Navigation, Theme Toggle & Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Sun / Moon Light-Dark Theme Toggle Switch Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#111827]"
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Sun size={18} className="text-amber-400 animate-spin-slow" />
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon size={18} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            RC
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-tight">
              Rama Charan
            </p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Senior Diligence Architect
            </p>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;