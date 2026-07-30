import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  ClipboardList,
  Building2,
  Waves,
  Leaf,
  Map,
  Zap,
  ShieldAlert,
  TrendingUp,
  Bell,
  History,
  Activity,
  X,
  ChevronRight,
} from "lucide-react";

function Sidebar({ mobileOpen, onCloseMobile }) {
  const menuSections = [
    {
      title: "OVERVIEW & SEARCH",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Property Search", path: "/property-search", icon: Search },
        { name: "Property Details", path: "/property-details", icon: FileText, badge: "Flagship" },
      ],
    },
    {
      title: "ANALYTICS & REPORTS",
      items: [
        { name: "Risk Assessment", path: "/risk-assessment", icon: ShieldAlert, badge: "AI Matrix" },
        { name: "Comparable Properties", path: "/comparable-properties", icon: TrendingUp },
        { name: "Due Diligence Report", path: "/due-diligence-report", icon: FileText, badge: "Full Audit" },
        { name: "Report History", path: "/report-history", icon: History },
        { name: "Notifications", path: "/notifications", icon: Bell, badge: "Live" },
        { name: "Admin Dashboard", path: "/admin-dashboard", icon: Activity, badge: "Executive" },
      ],
    },
    {
      title: "LEGAL & TAX DILIGENCE",
      items: [
        { name: "Ownership", path: "/ownership", icon: User },
        { name: "Tax History", path: "/tax-history", icon: ClipboardList },
        { name: "Zoning", path: "/zoning", icon: Building2 },
      ],
    },
    {
      title: "RISK & ENVIRONMENT",
      items: [
        { name: "Flood Zone", path: "/flood-zone", icon: Waves },
        { name: "Environmental", path: "/environmental", icon: Leaf },
        { name: "Permit Records", path: "/permit-records", icon: Map },
        { name: "Utilities", path: "/utilities", icon: Zap },
      ],
    },
    {
      title: "ACCOUNT & SETTINGS",
      items: [
        { name: "Profile", path: "/profile", icon: User },
      ],
    },
  ];

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
        className={`fixed left-0 top-20 z-40 w-72 h-[calc(100vh-80px)] bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 shadow-xl flex flex-col border-r border-slate-200 dark:border-[#334155] transition-colors duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-[#334155] lg:hidden">
          <span className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Navigation Menu
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h2 className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-500 dark:text-[#94A3B8] uppercase">
                {section.title}
              </h2>

              <div className="space-y-1">
                {section.items.map((menu) => {
                  const Icon = menu.icon;

                  return (
                    <NavLink
                      key={menu.name}
                      to={menu.path}
                      onClick={() => onCloseMobile && onCloseMobile()}
                      className={({ isActive }) =>
                        `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 border-l-4 border-cyan-400 font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:translate-x-1"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              size={18}
                              className={`transition-colors shrink-0 ${
                                isActive
                                  ? "text-white"
                                  : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                              }`}
                            />
                            <span className="truncate">{menu.name}</span>
                          </div>

                          {menu.badge ? (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                                isActive
                                  ? "bg-white/20 text-white border border-white/30"
                                  : "bg-blue-50 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30"
                              }`}
                            >
                              {menu.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              size={14}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                isActive ? "opacity-100 text-white" : "text-slate-400 dark:text-slate-500"
                              }`}
                            />
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
      </aside>
    </>
  );
}

export default Sidebar;