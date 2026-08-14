import { useState, useEffect } from "react";
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get("http://localhost:8080/api/notifications", { headers });
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Keep latest 4-5 items for the dashboard preview
      setNotifications(data.slice(0, 4));
    } catch (err) {
      console.error("Error fetching live notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to map backend severity/category to appropriate icons & colors
  const getNotificationIcon = (severity, category) => {
    const sev = (severity || "").toUpperCase();
    const cat = (category || "").toUpperCase();

    if (sev === "SUCCESS" || cat === "REPORT") {
      return <FaCheckCircle className="text-green-600 text-lg" />;
    }
    if (sev === "DANGER" || sev === "CRITICAL" || sev === "HIGH") {
      return <FaExclamationTriangle className="text-red-600 text-lg" />;
    }
    if (sev === "WARNING" || sev === "MEDIUM") {
      return <FaExclamationTriangle className="text-amber-500 text-lg" />;
    }
    if (cat === "PROPERTY") {
      return <FaInfoCircle className="text-blue-600 text-lg" />;
    }
    return <FaBell className="text-blue-600 text-lg" />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>

        <Link
          to="/alerts"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-sm text-gray-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">
            No new notifications.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id || item.title}
              className="flex gap-3 border-b last:border-none pb-4"
            >
              <div className="mt-1">
                {getNotificationIcon(item.severity, item.category)}
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.message}
                </p>
                {item.createdAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;