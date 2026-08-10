import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCompletionCard from "../components/profile/ProfileCompletionCard";
import UserStatsGrid from "../components/profile/UserStatsGrid";
import PersonalInfoCard from "../components/profile/PersonalInfoCard";
import AccountSecurityCard from "../components/profile/AccountSecurityCard";
import SavedPropertiesCard from "../components/profile/SavedPropertiesCard";
import RecentActivityTimeline from "../components/profile/RecentActivityTimeline";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import SettingsAndPreferences from "../components/profile/SettingsAndPreferences";
import DownloadsAndDangerZone from "../components/profile/DownloadsAndDangerZone";
import { showErrorAlert, showSuccessAlert } from "../utils/swal";
import {
  User,
  Shield,
  Sliders,
  Bell,
  Activity,
  Sparkles,
} from "lucide-react";

// THE 5 EXACT TABS REQUIRED FOR MY ACCOUNT
const ACCOUNT_TABS = [
  { id: "profile", label: "Profile", icon: User, desc: "Personal info, bio & account dossier" },
  { id: "security", label: "Security", icon: Shield, desc: "Password, 2FA & active sessions" },
  { id: "preferences", label: "Preferences", icon: Sliders, desc: "Theme, language & localization" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email alerts & property updates" },
  { id: "activity", label: "Activity", icon: Activity, desc: "User audit log & search timeline" },
];

function MyAccount() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const initialTabFromUrl = searchParams.get("tab");
  const isSettingsRoute = location.pathname.includes("/settings") || location.pathname.includes("/platform-settings");
  const defaultTab = isSettingsRoute ? "preferences" : "profile";
  
  const isValidTab = ACCOUNT_TABS.some((t) => t.id === initialTabFromUrl);
  const [activeTab, setActiveTab] = useState(isValidTab ? initialTabFromUrl : defaultTab);

  // Keep state synced with URL tab parameter
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && ACCOUNT_TABS.some((t) => t.id === currentTab)) {
      setActiveTab(currentTab);
    } else if ((location.pathname.includes("/settings") || location.pathname.includes("/platform-settings")) && !currentTab) {
      setActiveTab("preferences");
    }
  }, [searchParams, location]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const getInitialUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const derivedName = parsed.name || (parsed.firstName ? `${parsed.firstName} ${parsed.lastName || ""}`.trim() : null) || "Rama Charan";
        return {
          name: derivedName,
          email: parsed.email || "ramacharan@gmail.com",
          role: parsed.role || "Real Estate Agent",
          organization: parsed.organization || "Apex Due Diligence Advisors India Pvt. Ltd.",
          phone: parsed.phone || "+91 98490 12345",
          address: parsed.address || "Plot 45, Sy. No. 112/A, Financial District",
          city: parsed.city || "Hyderabad",
          state: parsed.state || "Telangana",
          country: parsed.country || "India",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };
      }
    } catch (e) {}

    return {
      name: "Rama Charan",
      email: "ramacharan@gmail.com",
      role: "Real Estate Agent",
      organization: "Apex Due Diligence Advisors India Pvt. Ltd.",
      phone: "+91 98490 12345",
      address: "Plot 45, Sy. No. 112/A, Financial District",
      city: "Hyderabad",
      state: "Telangana",
      country: "India",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  };

  const [profileData, setProfileData] = useState(getInitialUser);

  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem("user_avatar_url") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileData(getInitialUser());
    };

    window.addEventListener("user_profile_updated", handleProfileUpdate);
    return () => window.removeEventListener("user_profile_updated", handleProfileUpdate);
  }, []);

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

  // Security Credentials Update (Password Change)
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
        "Your account password and security tokens have been updated securely."
      );
    }, 600);
  };

  const handleScrollToPersonalInfo = () => {
    handleTabChange("profile");
    setTimeout(() => {
      const elem = document.getElementById("personal-info-card");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
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
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* HERO PAGE TITLE BANNER */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-2">
              <Sparkles size={14} /> Account Management Center
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              👤 My Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Unified control panel for personal profile details, password security, appearance preferences, notification toggles, and activity history.
            </p>
          </div>
        </div>

        {/* 5 MAIN NAVIGATION TABS FOR MY ACCOUNT */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-1.5 rounded-3xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
          {ACCOUNT_TABS.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-md border border-slate-200/80 dark:border-[#334155]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#1E293B]/60"
                }`}
              >
                <IconComp size={16} className={isActive ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            <ProfileHeader
              profileData={profileData}
              onEditClick={handleScrollToPersonalInfo}
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
            />

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

            <PersonalInfoCard
              profileData={profileData}
              setProfileData={setProfileData}
            />

            <SavedPropertiesCard />

            <DownloadsAndDangerZone profileData={profileData} />
          </div>
        )}

        {/* TAB 2: SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-8">
            <AccountSecurityCard
              profileData={profileData}
              handleChange={handleChange}
              handleUpdateSecurity={handleUpdateSecurity}
              loading={loading}
            />
          </div>
        )}

        {/* TAB 3: PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <div className="space-y-8">
            <SettingsAndPreferences filterSection="preferences" />
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            <SettingsAndPreferences filterSection="notifications" />
          </div>
        )}

        {/* TAB 5: ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div className="space-y-8">
            <RecentActivityFeed isFullPage={true} />
            <RecentActivityTimeline />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default MyAccount;
