import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCompletionCard from "../components/profile/ProfileCompletionCard";
import UserStatsGrid from "../components/profile/UserStatsGrid";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import AccountSecurityCard from "../components/profile/AccountSecurityCard";
import SavedPropertiesCard from "../components/profile/SavedPropertiesCard";
import RecentActivityTimeline from "../components/profile/RecentActivityTimeline";
import SettingsAndPreferences from "../components/profile/SettingsAndPreferences";
import DownloadsAndDangerZone from "../components/profile/DownloadsAndDangerZone";
import { showErrorAlert, showSuccessAlert } from "../utils/swal";
import {
  User,
  Shield,
  Sliders,
  Bookmark,
  History,
  Download,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

function Profile() {
  // Initialize Profile Data from localStorage if present, else enterprise defaults
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return {
          name: parsed.name || parsed.username || "Rama Charan",
          email: parsed.email || "ramacharan@enterprise.com",
          role: parsed.role || "Senior Diligence Architect",
          organization: parsed.organization || "Global Real Estate Capital Inc",
          phone: parsed.phone || "+1 (555) 234-5678",
          address: parsed.address || "100 Enterprise Way, Suite 500",
          city: parsed.city || "Austin",
          state: parsed.state || "TX",
          country: parsed.country || "United States",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      }
    } catch (e) {
      // Fallback
    }
    return {
      name: "Rama Charan",
      email: "ramacharan@enterprise.com",
      role: "Senior Diligence Architect",
      organization: "Global Real Estate Capital Inc",
      phone: "+1 (555) 234-5678",
      address: "100 Enterprise Way, Suite 500",
      city: "Austin",
      state: "TX",
      country: "United States",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  });

  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem("user_avatar_url") || null;
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (avatarUrl) {
      localStorage.setItem("user_avatar_url", avatarUrl);
    }
  }, [avatarUrl]);

  // Handle Input Changes for Security Form & Profile
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Security Credentials Update (PRESERVES EXACT EXISTING FUNCTIONALITY & VALIDATION)
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

  // Scroll smoothly to personal info section
  const handleScrollToPersonalInfo = () => {
    setActiveTab("all");
    const elem = document.getElementById("personal-info-card");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculate profile completion score
  const calculateCompletion = () => {
    let score = 0;
    if (profileData.name) score += 20;
    if (profileData.email) score += 20;
    if (profileData.organization) score += 15;
    if (profileData.phone) score += 15;
    if (profileData.address) score += 15;
    if (profileData.city && profileData.state) score += 15;
    return score;
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Navigation Tabs for Quick Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80 dark:border-[#334155]">
          {[
            { id: "all", label: "Overview Dashboard", icon: Sparkles },
            { id: "personal", label: "Personal Info", icon: User },
            { id: "security", label: "Security & Sessions", icon: Shield },
            { id: "portfolio", label: "Saved Properties & Activity", icon: Bookmark },
            { id: "settings", label: "Settings & Preferences", icon: Sliders },
            { id: "danger", label: "Downloads & Danger Zone", icon: Download },
          ].map((tab) => {
            const IconC = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
              >
                <IconC size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: ALL / OVERVIEW MODE */}
        {(activeTab === "all" || activeTab === "personal") && (
          <>
            {/* 1. PROFILE HEADER */}
            <ProfileHeader
              profileData={profileData}
              onEditClick={handleScrollToPersonalInfo}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
            />

            {/* 4. PROFILE COMPLETION & 5. USER STATISTICS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1 flex flex-col justify-between">
                <ProfileCompletionCard
                  completionPercentage={calculateCompletion()}
                  onCompleteClick={handleScrollToPersonalInfo}
                />
              </div>
              <div className="lg:col-span-2">
                <UserStatsGrid />
              </div>
            </div>

            {/* 2. PERSONAL INFORMATION */}
            <PersonalInfoCard
              profileData={profileData}
              setProfileData={setProfileData}
            />
          </>
        )}

        {(activeTab === "all" || activeTab === "security") && (
          /* 3. ACCOUNT SECURITY */
          <AccountSecurityCard
            profileData={profileData}
            handleChange={handleChange}
            handleUpdateSecurity={handleUpdateSecurity}
            loading={loading}
          />
        )}

        {(activeTab === "all" || activeTab === "portfolio") && (
          <>
            {/* 7. SAVED PROPERTIES */}
            <SavedPropertiesCard />

            {/* 6. RECENT ACTIVITY TIMELINE */}
            <RecentActivityTimeline />
          </>
        )}

        {(activeTab === "all" || activeTab === "settings") && (
          /* 8, 9, 10. NOTIFICATION, APPEARANCE, AND ACCOUNT PREFERENCES */
          <SettingsAndPreferences />
        )}

        {(activeTab === "all" || activeTab === "danger") && (
          /* 11 & 12. DOWNLOADS AND DANGER ZONE */
          <DownloadsAndDangerZone profileData={profileData} />
        )}
      </div>
    </MainLayout>
  );
}

export default Profile;