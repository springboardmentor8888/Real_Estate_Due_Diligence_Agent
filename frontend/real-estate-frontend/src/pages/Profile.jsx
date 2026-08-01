import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  User,
  Shield,
  Key,
  Mail,
  Building,
  CheckCircle2,
  Lock,
  Save,
  Award,
  History,
} from "lucide-react";
import { showSuccessAlert, showErrorAlert, showToast } from "../utils/swal";

function Profile() {
  const [profileData, setProfileData] = useState({
    name: "Rama Charan",
    email: "ramacharan@enterprise.com",
    role: "Senior Diligence Architect",
    organization: "Global Real Estate Capital Inc",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSecurity = (e) => {
    e.preventDefault();

    if (!profileData.newPassword) {
      showErrorAlert("Password Required", "Please enter a new password.");
      return;
    }

    if (profileData.newPassword.length < 8) {
      showErrorAlert("Weak Password", "New password must be at least 8 characters long.");
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      showErrorAlert("Password Mismatch", "New passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showSuccessAlert(
        "Security Credentials Updated",
        "Your account password and 2FA keys have been updated securely."
      );
    }, 600);
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto">
        {/* Profile Header Hero */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
            RC
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">{profileData.name}</h1>
              <Badge variant="success">Active Auditor</Badge>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-[#CBD5E1]">{profileData.role}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500 dark:text-[#94A3B8] pt-1">
              <span className="flex items-center gap-1">
                <Mail size={14} className="text-blue-600 dark:text-cyan-400" /> {profileData.email}
              </span>
              <span className="flex items-center gap-1">
                <Building size={14} className="text-cyan-600 dark:text-cyan-400" /> {profileData.organization}
              </span>
            </div>
          </div>
        </div>

        {/* Auditor Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400 dark:text-[#94A3B8]">Total Audits Performed</p>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono mt-2">1,240</h3>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mt-3">+18% this month</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400 dark:text-[#94A3B8]">Clear Titles Verified</p>
            <h3 className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono mt-2">980</h3>
            <span className="text-xs text-slate-400 dark:text-[#94A3B8] font-medium block mt-3">High confidence score</span>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-[#334155] hover-lift">
            <p className="text-xs font-mono uppercase font-bold text-slate-400 dark:text-[#94A3B8]">Security Clearance</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mt-2">Level 4 (Admin)</h3>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold block mt-3">Master Key Granted</span>
          </div>
        </div>

        {/* Security Settings Form */}
        <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#334155] shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] mb-6 flex items-center gap-2">
            <Lock size={20} className="text-blue-600 dark:text-cyan-400" /> Security & Credentials Management
          </h2>

          <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-2xl">
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
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
              className="mt-2"
            >
              Save Password Changes
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;