import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  ShieldCheck,
  Building,
  Mail,
  Calendar,
  Clock,
  Edit3,
  Camera,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Badge from "../common/Badge";
import { showToast } from "../../utils/swal";

function ProfileHeader({ profileData, onEditClick, avatarUrl, setAvatarUrl }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      showToast("Profile picture updated successfully!", "success");
    }
  };

  const getInitials = (name) => {
    if (!name) return "RC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#334155] shadow-xl relative overflow-hidden"
    >
      {/* Subtle Background Gradient Overlay */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8 relative z-10">
        {/* Avatar Container with Upload */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-2xl shadow-blue-500/25 ring-4 ring-white dark:ring-[#1E293B] overflow-hidden transition-transform duration-300 group-hover:scale-105">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(profileData.name)}</span>
            )}
          </div>

          {/* Active Status Indicator Dot */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-[#1E293B] flex items-center justify-center shadow-md" title="Active Status">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>

          {/* Avatar Upload Trigger Overlay */}
          <label className="absolute inset-0 rounded-3xl bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200">
            <Camera size={22} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {/* User Info & Details */}
        <div className="space-y-3 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              {profileData.name}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
              <ShieldCheck size={13} className="text-blue-600 dark:text-cyan-400" />
              Verified Architect
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Active Status
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-600 dark:text-[#CBD5E1] flex items-center justify-center md:justify-start gap-2">
            <span>{profileData.role}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-500 dark:text-[#94A3B8]">{profileData.organization}</span>
          </p>

          {/* Quick Meta Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-500 dark:text-[#94A3B8] pt-1">
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-[#334155]">
              <Mail size={14} className="text-blue-600 dark:text-cyan-400" />
              {profileData.email}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-[#334155]">
              <Calendar size={14} className="text-indigo-500 dark:text-indigo-400" />
              Member Since: <strong className="text-slate-700 dark:text-slate-200 font-semibold">Jan 2024</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-[#334155]">
              <Clock size={14} className="text-emerald-500 dark:text-emerald-400" />
              Last Login: <strong className="text-slate-700 dark:text-slate-200 font-semibold">Today, 02:15 PM</strong>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 pt-2 md:pt-0">
          <button
            onClick={onEditClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer transform active:scale-95"
          >
            <Edit3 size={15} />
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileHeader;
