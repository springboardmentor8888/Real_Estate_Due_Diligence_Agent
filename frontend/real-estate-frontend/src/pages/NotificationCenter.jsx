import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Bell,
  CheckCheck,
  ShieldCheck,
  FileText,
  Info,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  Trash2,
  Filter,
  ArrowUpRight,
  Sparkles,
  Sliders,
} from "lucide-react";
import { getMyNotifications } from "../services/propertyService";
import { showToast } from "../utils/swal";

function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // 'ALL', 'UNREAD', 'TITLE', 'REPORT'

  // Get Logged-in User Name & Role
  const getLoggedInUser = () => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.firstName
          ? `${parsed.firstName} ${parsed.lastName || ""}`.trim()
          : parsed.name || parsed.username || "Rama Charan";
        const role = parsed.role || "Buyer";
        return { name, role };
      }
    } catch (e) { }
    return { name: "Rama Charan", role: "Buyer" };
  };

  const { name: loggedInName, role: loggedInRole } = getLoggedInUser();

  useEffect(() => {
    setLoading(true);
    getMyNotifications()
      .then((res) => {
        if (res && res.data) {
          const items = Array.isArray(res.data) ? res.data : res.data.content || [];
          if (items.length > 0) {
            setNotifications(items);
          } else {
            setNotifications(getFallbackNotifications());
          }
        } else {
          setNotifications(getFallbackNotifications());
        }
      })
      .catch((err) => {
        console.warn("Failed to load notifications:", err);
        setNotifications(getFallbackNotifications());
      })
      .finally(() => setLoading(false));
  }, []);

  const getFallbackNotifications = () => [
    {
      id: "notif-101",
      title: "Due Diligence Report Ready - Gachibowli Tech Park (PR-1001)",
      message: "Comprehensive 6-vector audit dossier has been compiled and verified by Sub-Registrar GIS Engine.",
      timestamp: "10 mins ago",
      read: false,
      category: "REPORT",
      priority: "HIGH",
      propertyId: "1001",
    },
    {
      id: "notif-102",
      title: "Sub-Registrar Title Chain Verified - PR-1002",
      message: "Nil Encumbrance Certificate (EC) confirmed across 3 historic title deeds under Registration #REG/TS/2023/8891.",
      timestamp: "1 hour ago",
      read: false,
      category: "TITLE",
      priority: "NORMAL",
      propertyId: "1002",
    },
    {
      id: "notif-103",
      title: "Municipal Property Tax Settlement Confirmed - PR-1003",
      message: "GHMC Circle 14 tax clearance receipt #TAX-HYD-2024-88903 issued. Zero outstanding dues.",
      timestamp: "3 hours ago",
      read: false,
      category: "TAX",
      priority: "NORMAL",
      propertyId: "1003",
    },
    {
      id: "notif-104",
      title: "Building Permit Occupancy Certificate Approved - PR-1004",
      message: "Department of Building Permits finalized Occupancy Certificate PMT-GHMC-2023-8814.",
      timestamp: "Yesterday",
      read: true,
      category: "PERMIT",
      priority: "NORMAL",
      propertyId: "1004",
    },
    {
      id: "notif-105",
      title: "Environmental Phase I Clearance Issued - PR-1005",
      message: "State Pollution Control Board NOC #SPCB/TS/2024/7705 approved with 0.00 ppm soil contamination.",
      timestamp: "2 days ago",
      read: true,
      category: "ENVIRONMENT",
      priority: "NORMAL",
      propertyId: "1005",
    },
  ];

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All system notifications marked as read", "success");
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotif = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast("Notification dismissed", "info");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "UNREAD") return !n.read;
    if (activeTab === "TITLE") return n.category === "TITLE";
    if (activeTab === "REPORT") return n.category === "REPORT";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category) => {
    if (category === "TITLE") return ShieldCheck;
    if (category === "REPORT") return FileText;
    if (category === "TAX") return Receipt;
    return Bell;
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Bell size={14} /> Real-Time System Feeds
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🔔 Notification & Alert Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              System feeds for {loggedInName} ({loggedInRole}) tracking title audits, tax clearances, and report triggers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleMarkAllRead}
              variant="secondary"
              size="sm"
              icon={CheckCheck}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notification KPI Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Total Notifications
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {notifications.length} Feeds
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mt-0.5">
              Live GIS Substation
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Unread Alerts
            </span>
            <h3 className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1 font-mono">
              {unreadCount} New
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Requires Review
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Auditor Session
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate">
              {loggedInName}
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mt-0.5">
              Role: {loggedInRole}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              System Feed Status
            </span>
            <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              CONNECTED
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              Sub-Registrar Live Sync
            </span>
          </div>
        </div>

        {/* Filter Tabs & Controls */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#334155] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === "ALL"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
            >
              All Feeds ({notifications.length})
            </button>

            <button
              onClick={() => setActiveTab("UNREAD")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === "UNREAD"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
            >
              Unread ({unreadCount})
            </button>

            <button
              onClick={() => setActiveTab("TITLE")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === "TITLE"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
            >
              Title Audits
            </button>

            <button
              onClick={() => setActiveTab("REPORT")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === "REPORT"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
            >
              Audit Reports
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing {filteredNotifications.length} Alerts
          </span>
        </div>

        {/* Notifications List Container */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              title="No notifications match criteria."
              message="Adjust your filter tab to view system activity alerts."
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map((n) => {
                  const IconComp = getCategoryIcon(n.category);

                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => {
                        if (n.propertyId) {
                          navigate(`/due-diligence-report?id=PR-${n.propertyId}`);
                        }
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group ${n.read
                        ? "bg-slate-50/50 dark:bg-[#0F172A]/50 border-slate-200/60 dark:border-[#334155]"
                        : "bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 shadow-xs"
                        }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${n.priority === "HIGH"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                          : "bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800"
                          }`}>
                          <IconComp size={20} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                              {n.title}
                            </h3>
                            {!n.read && (
                              <Badge variant="info" className="text-[10px] uppercase font-bold px-2 py-0.5">
                                New Alert
                              </Badge>
                            )}
                            {n.priority === "HIGH" && (
                              <span className="text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                                High Priority
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                            {n.message}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                            <span>{n.timestamp}</span>
                            {n.propertyId && (
                              <span className="text-blue-600 dark:text-cyan-400 font-bold">
                                Property PR-{n.propertyId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={(e) => handleToggleRead(n.id, e)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                          title={n.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          {n.read ? "Unread" : "Read"}
                        </button>

                        <button
                          onClick={(e) => handleDeleteNotif(n.id, e)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                          title="Dismiss Alert"
                        >
                          <Trash2 size={16} />
                        </button>

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:underline ml-1">
                          Inspect <ArrowUpRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationCenter;
