import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Bell,
  CheckCheck,
  Filter,
  FileText,
  Building2,
  ShieldCheck,
  User,
  ClipboardList,
  Map,
  Leaf,
  Clock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { showToast } from "../utils/swal";

// Base Master Notifications Data
const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-101",
    category: "REPORT",
    title: "Due Diligence Report Generated",
    message: "Comprehensive Audit Report for Prestige Cyber Heights (PR-1001) has been compiled successfully.",
    timestamp: "10 minutes ago",
    defaultRead: false,
    icon: FileText,
    link: "/due-diligence-report",
    badgeVariant: "success",
  },
  {
    id: "NOTIF-102",
    category: "RISK",
    title: "Risk Score Updated",
    message: "AI Risk Engine evaluated Prestige Cyber Heights. Overall Due Diligence Score updated to 88/100 (Low Risk).",
    timestamp: "1 hour ago",
    defaultRead: false,
    icon: ShieldCheck,
    link: "/risk-assessment",
    badgeVariant: "info",
  },
  {
    id: "NOTIF-103",
    category: "PROPERTY",
    title: "Property Registry Entry Updated",
    message: "New sub-registrar parcel valuation updated for Brigade Tech Park (CMP-201).",
    timestamp: "3 hours ago",
    defaultRead: false,
    icon: Building2,
    link: "/property-search",
    badgeVariant: "info",
  },
  {
    id: "NOTIF-104",
    category: "TAX",
    title: "Property Tax Receipt Cleared",
    message: "Municipal tax assessment for FY 2025-26 confirmed paid in full (#CH-2025-88).",
    timestamp: "Yesterday",
    defaultRead: true,
    icon: ClipboardList,
    link: "/tax-history",
    badgeVariant: "success",
  },
  {
    id: "NOTIF-105",
    category: "PERMIT",
    title: "Building Permit Approved",
    message: "Rooftop Solar PV Array permit #PMT-1024 approved and closed by Department of Building Inspection.",
    timestamp: "2 days ago",
    defaultRead: true,
    icon: Map,
    link: "/permit-records",
    badgeVariant: "success",
  },
  {
    id: "NOTIF-106",
    category: "ENVIRONMENTAL",
    title: "State Pollution Clearance Issued",
    message: "Phase I environmental site assessment completed with safe soil & AQI 22 rating.",
    timestamp: "3 days ago",
    defaultRead: true,
    icon: Leaf,
    link: "/environmental",
    badgeVariant: "success",
  },
];

const STORAGE_KEY = "real_estate_notifications_read_map";

function NotificationCenter() {
  const [filter, setFilter] = useState("ALL");
  const [readMap, setReadMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Calculate actual notification status by merging base data with readMap
  const notifications = INITIAL_NOTIFICATIONS.map((item) => {
    const isRead = readMap[item.id] !== undefined ? readMap[item.id] : item.defaultRead;
    return { ...item, read: isRead };
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id, e) => {
    if (e) e.stopPropagation();
    const updatedMap = { ...readMap, [id]: true };
    setReadMap(updatedMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
    showToast("Notification marked as read", "success");
  };

  const handleMarkAllRead = () => {
    const updatedMap = { ...readMap };
    INITIAL_NOTIFICATIONS.forEach((n) => {
      updatedMap[n.id] = true;
    });
    setReadMap(updatedMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
    showToast("All notifications permanently marked as read", "success");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    return n.category === filter;
  });

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Bell size={14} /> Real-Time System Feeds
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🔔 Notification & Alert Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Track real-time property updates, risk score adjustments, tax receipts, and report generation triggers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllRead} variant="secondary" size="sm" icon={CheckCheck}>
                Mark All as Read ({unreadCount})
              </Button>
            )}
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-[#334155]">
          {[
            { id: "ALL", label: "All Alerts" },
            { id: "UNREAD", label: `Unread (${unreadCount})` },
            { id: "REPORT", label: "Reports" },
            { id: "RISK", label: "Risk Engine" },
            { id: "PROPERTY", label: "Properties" },
            { id: "TAX", label: "Tax History" },
            { id: "PERMIT", label: "Permits" },
            { id: "ENVIRONMENTAL", label: "Environment" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === item.id
                  ? "bg-white dark:bg-[#1E293B] text-blue-600 dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-[#334155]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Notification Cards List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="white-card rounded-3xl p-12 text-center bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155]">
              <Bell className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={36} />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">No Notifications Found</h3>
              <p className="text-xs text-slate-500 dark:text-[#CBD5E1] mt-1">
                There are no active alerts matching your selected filter criteria.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const Icon = n.icon;

              return (
                <div
                  key={n.id}
                  className={`white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !n.read
                      ? "border-blue-500/60 dark:border-cyan-500/60 shadow-sm"
                      : "border-slate-200 dark:border-[#334155] opacity-85"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        !n.read
                          ? "bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800"
                          : "bg-slate-100 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#334155]"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-[#F8FAFC]">
                          {n.title}
                        </h3>
                        {!n.read ? (
                          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                            <CheckCircle2 size={12} className="text-emerald-500" /> Read
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 dark:text-[#94A3B8] pt-1 flex items-center gap-1">
                        <Clock size={12} /> {n.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 pt-2 sm:pt-0">
                    {!n.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                    <Link
                      to={n.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationCenter;
