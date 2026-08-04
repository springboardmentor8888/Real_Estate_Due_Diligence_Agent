import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Building2,
  ShieldAlert,
  TrendingUp,
  FileText,
  History,
  User,
  ClipboardList,
  Waves,
  Leaf,
  Map,
  Zap,
  Bell,
  Activity,
  Sliders,
  X,
  Plus,
  MessageSquare,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { showConfirmDialog, showToast } from "../../utils/swal";

function Sidebar({ mobileOpen, onCloseMobile, isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const navRef = React.useRef(null);

  // Restore sidebar scroll position before browser paint
  React.useLayoutEffect(() => {
    const savedPos = sessionStorage.getItem("sidebar_scroll_position");
    if (savedPos && navRef.current) {
      navRef.current.scrollTop = parseInt(savedPos, 10);
    }
  });

  const handleNavScroll = (e) => {
    if (e.target) {
      sessionStorage.setItem("sidebar_scroll_position", e.target.scrollTop.toString());
    }
  };

  // Logged-In User Details State
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return { name: "Rama Charan", role: "Buyer", email: "ramacharan@gmail.com" };
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem("user");
        if (saved) setUserData(JSON.parse(saved));
      } catch (e) { }
    };

    window.addEventListener("user_profile_updated", handleUpdate);
    return () => window.removeEventListener("user_profile_updated", handleUpdate);
  }, []);

  const userName = userData.name || (userData.firstName ? `${userData.firstName} ${userData.lastName || ""}`.trim() : "Rama Charan");
  const userRole = userData.role || "Buyer";
  const userInitials = userName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);

  // Recent Audits List
  const recentAudits = [
    { id: "1001", name: "PR-1001 Gachibowli Tech Park", path: "/due-diligence-report?id=PR-1001" },
    { id: "1002", name: "PR-1002 Cyber Towers", path: "/due-diligence-report?id=PR-1002" },
    { id: "1003", name: "PR-1003 Knowledge City", path: "/due-diligence-report?id=PR-1003" },
  ];

  const menuSections = [
    {
      title: "CORE PLATFORM",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Property Search", path: "/property-search", icon: Search },
        { name: "Property Details", path: "/property-details", icon: Building2 },
      ],
    },
    {
      title: "ANALYTICS & AUDITS",
      items: [
        { name: "Risk Assessment", path: "/risk-assessment", icon: ShieldAlert, badge: "AI Score" },
        { name: "Comparable Properties", path: "/comparable-properties", icon: TrendingUp },
        { name: "Due Diligence Report", path: "/due-diligence-report", icon: FileText, badge: "Full Audit" },
        { name: "Report History", path: "/report-history", icon: History },
      ],
    },
    {
      title: "RECORD REGISTRIES",
      items: [
        { name: "Ownership & Title", path: "/ownership", icon: User },
        { name: "Tax History & Liens", path: "/tax-history", icon: ClipboardList },
        { name: "Zoning & Land Use", path: "/zoning", icon: Building2 },
        { name: "Flood Zone Hazard", path: "/flood-zone", icon: Waves },
        { name: "Environmental Audit", path: "/environmental", icon: Leaf },
        { name: "Permit Records", path: "/permit-records", icon: Map },
        { name: "Utilities Infrastructure", path: "/utilities", icon: Zap },
      ],
    },
    {
      title: "WORKSPACE ADMIN",
      items: [
        { name: "Notifications", path: "/notifications", icon: Bell },
        { name: "Audit Logs", path: "/admin-dashboard", icon: Activity, badge: "Admin" },
        { name: "Profile & Settings", path: "/profile", icon: Sliders },
      ],
    },
  ];

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

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-[#334155] transition-all duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
          } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#334155] lg:hidden shrink-0">
          <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Navigation Menu
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>



        {/* MAIN NAVIGATION LINKS SCROLL AREA */}
        <nav
          ref={navRef}
          onScroll={handleNavScroll}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin"
        >
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <h2 className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-[#94A3B8] uppercase">
                  {section.title}
                </h2>
              )}

              <div className="space-y-1">
                {section.items.map((menu) => {
                  const Icon = menu.icon;

                  return (
                    <NavLink
                      key={menu.name}
                      to={menu.path}
                      title={isCollapsed ? menu.name : undefined}
                      onClick={() => {
                        if (navRef.current) {
                          sessionStorage.setItem("sidebar_scroll_position", navRef.current.scrollTop.toString());
                        }
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={({ isActive }) =>
                        `group relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 ${isCollapsed ? "justify-center p-3" : "justify-between px-3 py-2.5"
                        } ${isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              size={18}
                              className={`transition-colors shrink-0 ${isActive
                                  ? "text-white"
                                  : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                                }`}
                            />
                            {!isCollapsed && <span className="truncate">{menu.name}</span>}
                          </div>

                          {!isCollapsed && menu.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors shrink-0 ${isActive
                                  ? "bg-white/20 text-white border border-white/30"
                                  : "bg-blue-50 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30"
                                }`}
                            >
                              {menu.badge}
                            </span>
                          )}

                          {!isCollapsed && !menu.badge && (
                            <ChevronRight
                              size={13}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100 text-white" : "text-slate-400 dark:text-slate-500"
                                }`}
                            />
                          )}

                          {/* COLLAPSED HOVER TOOLTIP */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 border border-slate-700">
                              {menu.name}
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* BOTTOM USER PROFILE FOOTER */}
        <div className="p-3 border-t border-slate-200 dark:border-[#334155] bg-slate-50/80 dark:bg-[#0F172A] shrink-0">
          <div
            className={`flex items-center rounded-2xl hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-slate-200 dark:hover:border-[#334155] transition-all group ${isCollapsed ? "justify-center p-2" : "justify-between p-2"
              }`}
          >
            <div
              onClick={() => {
                if (onCloseMobile) onCloseMobile();
                navigate("/profile");
              }}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              title={isCollapsed ? userName : undefined}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                {userInitials}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                    {userName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {userRole}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0 ml-1"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;