import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentCheck,
  HiOutlineShieldCheck,
  HiOutlineHome,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineCheck,
} from "react-icons/hi2";

const initialNotifications = [
  {
    id: 1,
    title: "High Flood Risk Flagged",
    message: "Property at 742 Evergreen Terrace updated with High Risk rating due to updated FEMA flood maps.",
    timestamp: "10 minutes ago",
    category: "RISK",
    severity: "CRITICAL",
    read: false,
    icon: <HiOutlineExclamationTriangle className="text-red-500 text-xl" />,
    badgeBg: "bg-red-50 text-red-700 border-red-200",
  },
  {
    id: 2,
    title: "Due Diligence Report Ready",
    message: "Comprehensive Due Diligence Report for 100 Bay Street (Miami, FL) has completed generation.",
    timestamp: "1 hour ago",
    category: "REPORT",
    severity: "SUCCESS",
    read: false,
    icon: <HiOutlineDocumentCheck className="text-emerald-500 text-xl" />,
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 3,
    title: "New Security Login Detected",
    message: "Successful login to Admin Portal from IP 192.168.1.45 (San Francisco, CA).",
    timestamp: "3 hours ago",
    category: "SECURITY",
    severity: "INFO",
    read: true,
    icon: <HiOutlineShieldCheck className="text-blue-500 text-xl" />,
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 4,
    title: "Comparable Price Reduction",
    message: "Saved property at 450 Ocean Drive reduced asking price by 4.5% ($25,000).",
    timestamp: "Yesterday",
    category: "PROPERTY",
    severity: "INFO",
    read: true,
    icon: <HiOutlineHome className="text-amber-500 text-xl" />,
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 5,
    title: "System Audit Policy Updated",
    message: "Automated logging rule #104 enabled for automated risk calculation tracking.",
    timestamp: "2 days ago",
    category: "SECURITY",
    severity: "INFO",
    read: true,
    icon: <HiOutlineShieldCheck className="text-blue-500 text-xl" />,
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
];

const Alerts = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === "CRITICAL").length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "UNREAD") return !item.read;
    return item.category === activeFilter;
  });

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <div className="px-8 pt-6 pb-12 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HiOutlineBell className="text-blue-600" /> System Alerts & Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time updates on risk assessments, report availability, and account security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              unreadCount > 0
                ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
          >
            <HiOutlineCheck /> Mark All Read
          </button>

          <button
            onClick={handleClearRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <HiOutlineTrash /> Clear Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Unread Alerts</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{unreadCount}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <HiOutlineBell className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Critical Flags</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{criticalCount}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <HiOutlineExclamationTriangle className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Streamed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <HiOutlineCheckCircle className="text-2xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <HiOutlineFunnel /> Filter By:
        </span>
        {[
          { label: "All Alerts", value: "ALL" },
          { label: "Unread", value: "UNREAD" },
          { label: "Risk Flags", value: "RISK" },
          { label: "Reports", value: "REPORT" },
          { label: "Property Updates", value: "PROPERTY" },
          { label: "Security", value: "SECURITY" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeFilter === tab.value
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3 shadow-sm">
            <HiOutlineBell className="mx-auto text-4xl text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800">No Notifications Found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You are all caught up! There are no alerts matching your active filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50/40 border-blue-200 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-xs mt-0.5">
                  {item.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3
                      className={`text-base font-semibold ${
                        item.read ? "text-gray-800" : "text-gray-900 font-bold"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${item.badgeBg}`}
                    >
                      {item.category}
                    </span>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{item.message}</p>
                  <p className="text-xs text-gray-400 font-medium">{item.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {!item.read && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete Notification"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;