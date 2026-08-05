import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  Bell,
  CheckCheck,
  Building2,
  Users,
  FileText,
  Clock,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Calendar,
  Check,
  X,
  UserPlus,
  Home,
  ShieldCheck,
  Eye,
  Sparkles,
  AlertOctagon,
  AlertTriangle,
  RotateCcw,
  FileUp,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { showToast, showConfirmDialog, showSuccessAlert } from "../utils/swal";

// Master Initial Mock Notifications covering all 5 requested Notification Types
const INITIAL_NOTIFICATIONS = [
  // 1. New Review Assigned
  {
    id: "NTF-901",
    type: "New Review Assigned",
    title: "New Review Assigned: Title Audit PR-1001",
    message: "Gachibowli Tech Park Phase 2 (PR-1001) title deed search assigned to your workstation.",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    timestamp: "10 mins ago",
    read: false,
    priority: "HIGH",
    iconName: "UserCheck",
  },
  // 2. Document Uploaded
  {
    id: "NTF-902",
    type: "Document Uploaded",
    title: "Document Uploaded: 30-Year Encumbrance Certificate",
    message: "Sub-Registrar Form 15 Encumbrance Certificate (EC #EC-2026-9041) uploaded for Whitefield Tech.",
    property: "Whitefield Horizon Tech Campus (PR-1003)",
    propertyId: "1003",
    timestamp: "25 mins ago",
    read: false,
    priority: "HIGH",
    iconName: "FileUp",
  },
  // 3. Ownership Updated
  {
    id: "NTF-903",
    type: "Ownership Updated",
    title: "Ownership Updated: Registered Sale Deed Transferred",
    message: "Sub-Registrar recorded owner updated to Adani Realty Institutional Fund for PR-1001.",
    property: "Gachibowli Tech Park Phase 2 (PR-1001)",
    propertyId: "1001",
    timestamp: "1 hour ago",
    read: false,
    priority: "HIGH",
    iconName: "UserCheck",
  },
  // 4. Permit Expired
  {
    id: "NTF-904",
    type: "Permit Expired",
    title: "Urgent: Municipal Renovation Permit Expired",
    message: "GHMC Renovation Permit (PMT-REN-1204) expired on 12 Feb 2025. Renewal clearance required.",
    property: "BKC Prime Commercial Hub (PR-1005)",
    propertyId: "1005",
    timestamp: "2 hours ago",
    read: false,
    priority: "CRITICAL",
    iconName: "AlertTriangle",
  },
  // 5. High Risk Property
  {
    id: "NTF-905",
    type: "High Risk Property",
    title: "High Risk Property Flagged: Civil Court Stay Order #CS-402",
    property: "Jubilee Hills Commercial Plot 36 (PR-1002)",
    propertyId: "1002",
    message: "Risk Score 68/100 FLAGGED due to High Court civil stay order alert.",
    timestamp: "4 hours ago",
    read: false,
    priority: "CRITICAL",
    iconName: "ShieldAlert",
  },
  {
    id: "NTF-906",
    type: "New Review Assigned",
    title: "New Review Assigned: Financial District Commercial Plot",
    message: "Prestige Capital due diligence clearance request assigned to legal team.",
    property: "Financial District Commercial Plot (PR-1004)",
    propertyId: "1004",
    timestamp: "Yesterday",
    read: true,
    priority: "MEDIUM",
    iconName: "UserCheck",
  },
];

function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // UNREAD BADGE COUNTER
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // FILTERED NOTIFICATIONS
  const filteredNotifications = useMemo(() => {
    return notifications.filter((ntf) => {
      const matchType =
        typeFilter === "ALL" ||
        (typeFilter === "UNREAD" && !ntf.read) ||
        ntf.type === typeFilter;

      const matchSearch =
        ntf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ntf.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ntf.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ntf.type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchType && matchSearch;
    });
  }, [notifications, typeFilter, searchQuery]);

  // ACTION: MARK READ (SINGLE)
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    showToast("Notification marked as read", "info");
  };

  // ACTION: MARK ALL READ
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read", "success");
  };

  // ACTION: DELETE (SINGLE)
  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast("Notification deleted", "info");
  };

  // ACTION: DELETE ALL
  const handleDeleteAll = () => {
    showConfirmDialog(
      "Clear All Notifications?",
      "Are you sure you want to delete all notifications from your feed?",
      "Clear All"
    ).then((res) => {
      if (res.isConfirmed) {
        setNotifications([]);
        showSuccessAlert("Notifications Cleared", "All notifications deleted from your dispatch feed.");
      }
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-amber-500 dark:text-amber-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              System Notifications & Alert Center
            </span>
          </div>

          {/* DYNAMIC UNREAD BADGE COUNTER */}
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-bold text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {unreadCount} UNREAD NOTIFICATIONS
          </span>
        </div>

        {/* HERO BANNER & BULK ACTIONS */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-bold mb-2">
              <Bell size={14} /> Dispatch & Telemetry Stream
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight flex items-center gap-2">
              🔔 Notifications Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Real-time dispatches for assigned reviews, uploaded documents, ownership updates, expired permits, and high risk properties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
              icon={CheckCheck}
              disabled={unreadCount === 0}
            >
              Mark All Read
            </Button>
            <Button
              onClick={handleDeleteAll}
              variant="danger"
              size="sm"
              icon={Trash2}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & TYPE FILTER PILLS */}
        <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications by Title, Message, Property, or Type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] font-bold text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Notification Type Filter Pills (The 5 Required Types + All & Unread) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "ALL", label: "All Feed" },
              { id: "UNREAD", label: `Unread (${unreadCount})` },
              { id: "New Review Assigned", label: "New Review" },
              { id: "Document Uploaded", label: "Doc Uploaded" },
              { id: "Ownership Updated", label: "Ownership" },
              { id: "Permit Expired", label: "Permit Expired" },
              { id: "High Risk Property", label: "High Risk" },
            ].map((tab) => {
              const active = typeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
                    active
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATIONS FEED LIST */}
        {filteredNotifications.length === 0 ? (
          <EmptyState title="No notifications found" message="No notification dispatch matches your search query or selected type filter." />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.map((ntf) => (
                <motion.div
                  key={ntf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:shadow-md ${
                    !ntf.read
                      ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80"
                      : "bg-white dark:bg-[#1E293B] border-slate-200 dark:border-[#334155]"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Unread Indicator Dot & Type Icon */}
                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      {!ntf.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" title="Unread Notification" />
                      )}
                      <div className={`p-2.5 rounded-2xl border ${
                        ntf.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800" :
                        ntf.type === "High Risk Property" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800" :
                        "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-800"
                      }`}>
                        <Bell size={18} />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                          {ntf.type} • {ntf.id}
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold">• {ntf.timestamp}</span>
                        {ntf.priority === "CRITICAL" && (
                          <Badge variant="danger">CRITICAL</Badge>
                        )}
                      </div>

                      <h3 className={`text-sm font-extrabold leading-snug ${
                        !ntf.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                      }`}>
                        {ntf.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                        {ntf.message}
                      </p>

                      <p className="text-[11px] font-bold text-slate-500 pt-1">
                        🏢 {ntf.property}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS: MARK READ & DELETE */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-[#334155]">
                    {!ntf.read && (
                      <button
                        onClick={() => handleMarkAsRead(ntf.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-cyan-300 font-bold transition-all flex items-center gap-1 cursor-pointer border border-blue-200 dark:border-blue-800"
                        title="Mark as Read"
                      >
                        <Check size={14} />
                        <span>Read</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteNotification(ntf.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer"
                      title="Delete Notification"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => navigate(`/property-details?id=${ntf.propertyId || "1001"}`)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                      title="Inspect Property Parcel"
                    >
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default NotificationCenter;
