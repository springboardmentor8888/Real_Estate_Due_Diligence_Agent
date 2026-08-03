import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Edit2,
  Save,
  X,
  Check,
  Building2,
  Navigation,
} from "lucide-react";
import Button from "../common/Button";
import { showToast, showSuccessAlert } from "../../utils/swal";

function PersonalInfoCard({ profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profileData.name ? profileData.name.split(" ")[0] || "Rama" : "Rama",
    lastName: profileData.name ? profileData.name.split(" ").slice(1).join(" ") || "Charan" : "Charan",
    email: profileData.email || "ramacharan@enterprise.com",
    phone: profileData.phone || "+1 (555) 234-5678",
    company: profileData.organization || "Global Real Estate Capital Inc",
    address: profileData.address || "100 Enterprise Way, Suite 500",
    city: profileData.city || "Austin",
    state: profileData.state || "TX",
    country: profileData.country || "United States",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    
    setProfileData((prev) => ({
      ...prev,
      name: fullName,
      email: formData.email,
      organization: formData.company,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
    }));

    setIsEditing(false);
    showSuccessAlert("Profile Updated", "Your personal details have been saved successfully.");
  };

  const handleCancel = () => {
    // Reset to current profile state
    setFormData({
      firstName: profileData.name ? profileData.name.split(" ")[0] || "Rama" : "Rama",
      lastName: profileData.name ? profileData.name.split(" ").slice(1).join(" ") || "Charan" : "Charan",
      email: profileData.email || "ramacharan@enterprise.com",
      phone: profileData.phone || "+1 (555) 234-5678",
      company: profileData.organization || "Global Real Estate Capital Inc",
      address: profileData.address || "100 Enterprise Way, Suite 500",
      city: profileData.city || "Austin",
      state: profileData.state || "TX",
      country: profileData.country || "United States",
    });
    setIsEditing(false);
    showToast("Edits cancelled", "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-[#334155] shadow-lg relative"
      id="personal-info-card"
    >
      {/* Card Header & Controls */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80 dark:border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/40">
            <User size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC]">
              Personal Information
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-[#94A3B8]">
              Manage your personal and contact details across the platform.
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-800 dark:text-[#F8FAFC] font-bold text-xs border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
          >
            <Edit2 size={14} className="text-blue-600 dark:text-cyan-400" />
            Edit Info
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-[#CBD5E1] font-semibold text-xs border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Content Form or Read-Only Display */}
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <User size={13} className="text-blue-500" />
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <User size={13} className="text-blue-500" />
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.lastName}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Mail size={13} className="text-indigo-500" />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {formData.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Phone size={13} className="text-emerald-500" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.phone}
              </p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Building2 size={13} className="text-cyan-500" />
              Company Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {formData.company}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-500" />
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {formData.address}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Navigation size={13} className="text-rose-500" />
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.city}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Globe size={13} className="text-purple-500" />
              State
            </label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.state}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-[#94A3B8] uppercase mb-2 flex items-center gap-1.5">
              <Globe size={13} className="text-blue-500" />
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            ) : (
              <p className="p-3 rounded-xl bg-slate-50/70 dark:bg-[#0F172A]/70 border border-slate-200/50 dark:border-[#334155]/50 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {formData.country}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-[#334155]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-[#CBD5E1] font-bold text-xs border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
            >
              Save Personal Info
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
}

export default PersonalInfoCard;
