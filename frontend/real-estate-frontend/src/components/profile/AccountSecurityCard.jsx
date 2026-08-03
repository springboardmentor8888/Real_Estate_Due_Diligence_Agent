import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Key,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Button from "../common/Button";
import { showConfirmDialog, showToast } from "../../utils/swal";

function AccountSecurityCard({
  profileData,
  handleChange,
  handleUpdateSecurity,
  loading,
}) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "MacBook Pro 16\"",
      browser: "Chrome 122.0 (macOS Sonoma)",
      location: "Austin, TX, USA",
      ip: "192.168.1.104",
      current: true,
      lastActive: "Active Now",
    },
    {
      id: "sess-2",
      device: "iPhone 15 Pro",
      browser: "Mobile Safari 17.2 (iOS)",
      location: "Austin, TX, USA",
      ip: "172.56.21.98",
      current: false,
      lastActive: "2 hours ago",
    },
    {
      id: "sess-3",
      device: "Windows Workstation",
      browser: "Edge 121.0 (Windows 11)",
      location: "Dallas, TX, USA",
      ip: "108.24.190.12",
      current: false,
      lastActive: "3 days ago",
    },
  ]);

  const handleToggle2FA = () => {
    showToast("Two-Factor Authentication is Coming Soon to Enterprise SaaS!", "info");
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleLogoutAllDevices = async () => {
    const confirmed = await showConfirmDialog({
      title: "Logout From All Devices?",
      text: "This will terminate all active sessions across all browser tabs and devices except your current session.",
      confirmButtonText: "Logout All Other Devices",
      cancelButtonText: "Cancel",
      icon: "warning",
    });

    if (confirmed) {
      setSessions((prev) => prev.filter((s) => s.current));
      showToast("Terminated all other active device sessions successfully", "success");
    }
  };

  const handleTerminateSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Terminated session successfully", "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#334155] shadow-lg space-y-8"
      id="security-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
            <Lock size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Account Security & Authentication
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
              Manage passwords, multi-factor authentication, and active security sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Verification Status */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase block">
              Email Verification
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              Verified Account ✅
            </span>
          </div>
        </div>

        {/* Password Last Updated */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase block">
              Password Status
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              Updated 14 days ago
            </span>
          </div>
        </div>

        {/* 2FA Status */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/60 dark:border-[#334155] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 dark:text-[#94A3B8] uppercase block">
                  Two-Factor (2FA)
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                  Coming Soon
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleToggle2FA}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-slate-50/60 dark:bg-[#0F172A]/60 border border-slate-200/80 dark:border-[#334155] space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
          <Key size={18} className="text-blue-600 dark:text-cyan-400" />
          Update Password Credentials
        </h3>

        <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={profileData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Save Password Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Active Sessions List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <Laptop size={18} className="text-indigo-600 dark:text-indigo-400" />
              Active Device Sessions ({sessions.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Manage and revoke active login sessions across desktop and mobile devices.
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              onClick={handleLogoutAllDevices}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <LogOut size={14} />
              Logout From All Devices
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300">
                  {sess.device.includes("iPhone") ? (
                    <Smartphone size={20} className="text-blue-500" />
                  ) : (
                    <Laptop size={20} className="text-indigo-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sess.device}
                    </h4>
                    {sess.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-0.5">
                    {sess.browser} • {sess.location} • <span className="font-mono text-[11px]">{sess.ip}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {sess.lastActive}
                </span>
                {!sess.current && (
                  <button
                    onClick={() => handleTerminateSession(sess.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default AccountSecurityCard;
