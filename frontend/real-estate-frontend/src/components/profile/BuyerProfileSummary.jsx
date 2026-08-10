import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Award,
  Star,
  FileText,
  Clock,
  Eye,
  Edit3,
  ShieldCheck,
  Building2,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { getLiveSavedProperties } from "../../services/liveStore";
import { showToast } from "../../utils/swal";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

function BuyerProfileSummary() {
  const navigate = useNavigate();

  // Get user profile data from localStorage
  const getStoredUser = () => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.firstName
          ? `${parsed.firstName} ${parsed.lastName || ""}`.trim()
          : parsed.name || parsed.username || "Rama Charan";
        const email = parsed.email || "ramacharan@gmail.com";
        const membership = parsed.membership || "Enterprise Tier Pro";
        return { name, email, membership, role: parsed.role || "Buyer" };
      }
    } catch (e) {}
    return {
      name: "Rama Charan",
      email: "ramacharan@gmail.com",
      membership: "Enterprise Tier Pro",
      role: "Buyer",
    };
  };

  const [user, setUser] = useState(getStoredUser);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const savedCount = (getLiveSavedProperties() || []).length || 6;
  const reportsCount = 14;
  const lastLogin = "Today at 08:30 PM";

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = {
        ...existing,
        name: editName,
        firstName: editName.split(" ")[0] || editName,
        lastName: editName.split(" ").slice(1).join(" ") || "",
        email: editEmail,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(getStoredUser());
      window.dispatchEvent(new Event("user_profile_updated"));
      showToast("Profile details updated successfully!", "success");
      setEditModalOpen(false);
    } catch (err) {
      showToast("Failed to save profile changes", "error");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#334155]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
            <User size={14} /> Buyer Account Dossier
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            👤 Buyer Profile Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
            Account membership tier, active due diligence metrics, and security authentication status.
          </p>
        </div>

        {/* Buttons: View Profile & Edit Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={() => navigate("/profile")} variant="secondary" size="sm" icon={Eye}>
            View Profile
          </Button>

          <Button onClick={() => setEditModalOpen(true)} variant="primary" size="sm" icon={Edit3}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info Row */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 p-6 rounded-2xl bg-slate-50/80 dark:bg-[#0F172A]/80 border border-slate-200/80 dark:border-[#334155]">
        {/* Profile Picture & User Info */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative shrink-0">
            <img
              src={DEFAULT_AVATAR}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-blue-500 shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A]" title="Online Session Active" />
          </div>

          <div className="space-y-1.5 font-mono">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                {user.role}
              </span>
              <Badge variant="success">Verified Account</Badge>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {user.name}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 justify-center sm:justify-start">
              <Mail size={13} className="text-blue-500 shrink-0" />
              <span>{user.email}</span>
            </p>

            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5 justify-center sm:justify-start">
              <Award size={13} className="shrink-0" />
              <span>Membership: {user.membership}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Metric Badges Grid (Saved Props, Reports, Last Login) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto text-xs font-mono">
          {/* Saved Properties */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center sm:justify-start gap-1">
              <Star size={12} className="text-amber-500" /> Saved Properties
            </span>
            <strong className="text-lg font-extrabold text-blue-600 dark:text-cyan-400 block">
              {savedCount} Saved
            </strong>
          </div>

          {/* Reports Generated */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center sm:justify-start gap-1">
              <FileText size={12} className="text-emerald-500" /> Reports Generated
            </span>
            <strong className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {reportsCount} Reports
            </strong>
          </div>

          {/* Last Login */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center sm:justify-start gap-1">
              <Clock size={12} className="text-purple-500" /> Last Login
            </span>
            <strong className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {lastLogin}
            </strong>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {editModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#334155] p-6 sm:p-8 max-w-md w-full space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-bold shrink-0">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      Edit Buyer Profile
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">
                      Update account display details
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-900 dark:text-slate-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#334155] flex items-center justify-end gap-3">
                  <Button type="button" onClick={() => setEditModalOpen(false)} variant="secondary" size="sm">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={Save}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BuyerProfileSummary;
