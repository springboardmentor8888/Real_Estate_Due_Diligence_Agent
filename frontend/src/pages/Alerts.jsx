import { useEffect, useState } from "react";
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

const API_URL = "http://localhost:8080/api/notifications";

const Alerts = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load notifications (${response.status})`
        );
      }

      const data = await response.json();

      setNotifications(data);
    } catch (err) {
      console.error("Notification loading error:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================================
  // NOTIFICATION UI HELPERS
  // =====================================================

  const getNotificationIcon = (category, severity) => {
    if (severity === "CRITICAL") {
      return (
        <HiOutlineExclamationTriangle className="text-red-500 text-xl" />
      );
    }

    switch (category) {
      case "REPORT":
        return (
          <HiOutlineDocumentCheck className="text-emerald-500 text-xl" />
        );

      case "SECURITY":
        return (
          <HiOutlineShieldCheck className="text-blue-500 text-xl" />
        );

      case "PROPERTY":
        return (
          <HiOutlineHome className="text-amber-500 text-xl" />
        );

      case "RISK":
        return (
          <HiOutlineExclamationTriangle className="text-red-500 text-xl" />
        );

      default:
        return (
          <HiOutlineBell className="text-blue-500 text-xl" />
        );
    }
  };

  const getBadgeClass = (category, severity) => {
    if (severity === "CRITICAL") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    switch (category) {
      case "REPORT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "SECURITY":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "PROPERTY":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "RISK":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatTimestamp = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return createdAt;
    }

    const now = new Date();

    const difference =
      Math.floor((now.getTime() - date.getTime()) / 1000);

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      const minutes = Math.floor(difference / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    if (difference < 86400) {
      const hours = Math.floor(difference / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (difference < 172800) {
      return "Yesterday";
    }

    if (difference < 604800) {
      const days = Math.floor(difference / 86400);
      return `${days} days ago`;
    }

    return date.toLocaleDateString();
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const unreadCount =
    notifications.filter((n) => !n.read).length;

  const criticalCount =
    notifications.filter(
      (n) => n.severity === "CRITICAL"
    ).length;

  // =====================================================
  // FILTER
  // =====================================================

  const filteredNotifications =
    notifications.filter((item) => {
      if (activeFilter === "ALL") {
        return true;
      }

      if (activeFilter === "UNREAD") {
        return !item.read;
      }

      return item.category === activeFilter;
    });

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to mark notification as read (${response.status})`
        );
      }

      const updatedNotification =
        await response.json();

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? updatedNotification
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Mark notification as read error:",
        err
      );

      setError(
        err.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/read-all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to mark all notifications as read (${response.status})`
        );
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Mark all notifications as read error:",
        err
      );

      setError(
        err.message ||
          "Failed to mark all notifications as read."
      );
    }
  };

  // =====================================================
  // DELETE ONE
  // =====================================================

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete notification (${response.status})`
        );
      }

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete notification error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete notification."
      );
    }
  };

  // =====================================================
  // CLEAR READ
  // =====================================================

  const handleClearRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/read`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to clear read notifications (${response.status})`
        );
      }

      setNotifications((prev) =>
        prev.filter(
          (notification) => !notification.read
        )
      );
    } catch (err) {
      console.error(
        "Clear read notifications error:",
        err
      );

      setError(
        err.message ||
          "Failed to clear read notifications."
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="px-8 pt-6 pb-12 space-y-8 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <HiOutlineBell className="text-blue-600" />
            System Alerts & Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Real-time updates on risk assessments, report
            availability, and account security.
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
            <HiOutlineCheck />
            Mark All Read
          </button>

          <button
            onClick={handleClearRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <HiOutlineTrash />
            Clear Read
          </button>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Unread Alerts
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {unreadCount}
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <HiOutlineBell className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Critical Flags
            </p>

            <p className="text-2xl font-bold text-red-600 mt-1">
              {criticalCount}
            </p>
          </div>

          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <HiOutlineExclamationTriangle className="text-2xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Total Streamed
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-1">
              {notifications.length}
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <HiOutlineCheckCircle className="text-2xl" />
          </div>
        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">

        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 flex items-center gap-1">
          <HiOutlineFunnel />
          Filter By:
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
            onClick={() =>
              setActiveFilter(tab.value)
            }
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

      {/* NOTIFICATIONS */}

      <div className="space-y-4">

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <HiOutlineBell className="mx-auto text-4xl text-gray-300 animate-pulse" />

            <h3 className="text-lg font-semibold text-gray-800 mt-3">
              Loading Notifications...
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Fetching your latest alerts.
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (

          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3 shadow-sm">

            <HiOutlineBell className="mx-auto text-4xl text-gray-300" />

            <h3 className="text-lg font-semibold text-gray-800">
              No Notifications Found
            </h3>

            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You are all caught up! There are no alerts
              matching your active filter.
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
                  {getNotificationIcon(
                    item.category,
                    item.severity
                  )}
                </div>

                <div className="space-y-1">

                  <div className="flex items-center gap-3 flex-wrap">

                    <h3
                      className={`text-base font-semibold ${
                        item.read
                          ? "text-gray-800"
                          : "text-gray-900 font-bold"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getBadgeClass(
                        item.category,
                        item.severity
                      )}`}
                    >
                      {item.category}
                    </span>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}

                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.message}
                  </p>

                  <p className="text-xs text-gray-400 font-medium">
                    {formatTimestamp(item.createdAt)}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2 self-end md:self-center">

                {!item.read && (
                  <button
                    onClick={() =>
                      handleMarkAsRead(item.id)
                    }
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100/80 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
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