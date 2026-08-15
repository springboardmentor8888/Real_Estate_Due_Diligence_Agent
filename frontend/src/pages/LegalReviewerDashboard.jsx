import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaClipboardCheck,
  FaExclamationTriangle,
  FaFileAlt,
  FaCheckCircle,
  FaSearch,
  FaFolderOpen,
  FaShieldAlt,
  FaBookmark,
  FaEye,
  FaDownload,
} from "react-icons/fa";

const LegalReviewerDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    pendingReviews: 0,
    highLegalRisk: 0,
    documentsPending: 0,
    completedReviews: 0,
    pendingProperties: [],
    recentReviews: [],
    notifications: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLegalReviewerDashboard();
  }, []);

  const fetchLegalReviewerDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      /*
       * Replace this URL with your actual backend endpoint
       *
       * Example:
       * GET /api/legal-reviewer/dashboard
       */
      const response = await axios.get(
        "http://localhost:8080/api/legal-reviewer/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDashboard(response.data);
    } catch (error) {
      console.error("Failed to load Legal Reviewer dashboard:", error);

      // Keep empty data instead of showing mock data
      setDashboard({
        pendingReviews: 0,
        highLegalRisk: 0,
        documentsPending: 0,
        completedReviews: 0,
        pendingProperties: [],
        recentReviews: [],
        notifications: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Pending Reviews",
      value: dashboard.pendingReviews,
      subtitle: "Requires review",
      icon: <FaClipboardCheck />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitleColor: "text-purple-600",
    },
    {
      title: "High Legal Risk",
      value: dashboard.highLegalRisk,
      subtitle: "Immediate action",
      icon: <FaExclamationTriangle />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      subtitleColor: "text-red-600",
    },
    {
      title: "Documents Pending",
      value: dashboard.documentsPending,
      subtitle: "Verification",
      icon: <FaFileAlt />,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      subtitleColor: "text-yellow-600",
    },
    {
      title: "Completed Reviews",
      value: dashboard.completedReviews,
      subtitle: "This month",
      icon: <FaCheckCircle />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      subtitleColor: "text-green-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, Komal!</h1>

        <p className="mt-1 text-gray-500">
          Review properties and verify legal evidence.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-7">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} text-2xl`}
              >
                {stat.icon}
              </div>

              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>

                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>

                <p className={`text-sm ${stat.subtitleColor}`}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">
              Pending Legal Reviews
            </h2>

            <button
              onClick={() => navigate("/search-property")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {dashboard.pendingProperties.length === 0 ? (
            <div className="p-12 text-center">
              <FaClipboardCheck className="mx-auto text-4xl text-gray-300 mb-3" />

              <h3 className="font-semibold text-gray-700">
                No pending legal reviews
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Properties requiring your review will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-6 py-4">Property</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Risk</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.pendingProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {property.address}
                        </p>

                        <p className="text-xs text-gray-500">
                          Property ID: {property.id}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {property.location}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                          {property.risk || "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                          {property.status || "Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/property-details/${property.id}`)
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-5">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <QuickAction
              icon={<FaClipboardCheck />}
              title="Review Pending Properties"
              onClick={() => navigate("/search-property")}
            />

            <QuickAction
              icon={<FaFolderOpen />}
              title="Legal Documents"
              onClick={() => navigate("/search-property")}
            />

            <QuickAction
              icon={<FaShieldAlt />}
              title="Risk Assessment"
              onClick={() => navigate("/search-property")}
            />

            <QuickAction
              icon={<FaFileAlt />}
              title="View My Reports"
              onClick={() => navigate("/reports")}
            />

            <QuickAction
              icon={<FaBookmark />}
              title="Saved Properties"
              onClick={() => navigate("/saved-properties")}
            />
          </div>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Recent Reviews */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Legal Reviews
            </h2>

            <button
              onClick={() => navigate("/reports")}
              className="text-blue-600 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {dashboard.recentReviews.length === 0 ? (
            <div className="p-10 text-center">
              <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-3" />

              <p className="text-gray-500">No legal reviews completed yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {dashboard.recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-5"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.address}
                    </p>

                    <p className="text-sm text-gray-500">
                      Reviewed on {review.reviewedOn}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                      {review.status}
                    </span>

                    <button
                      onClick={() => navigate(`/reports/${review.propertyId}`)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>

                    <button className="text-gray-500 hover:text-blue-600">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-slate-900">
              Notifications
            </h2>

            <button
              onClick={() => navigate("/alerts")}
              className="text-blue-600 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {dashboard.notifications.length === 0 ? (
            <div className="p-10 text-center">
              <FaCheckCircle className="mx-auto text-4xl text-gray-300 mb-3" />

              <p className="text-gray-500">No new notifications.</p>
            </div>
          ) : (
            <div className="divide-y">
              {dashboard.notifications.map((notification) => (
                <div key={notification.id} className="p-5">
                  <p className="font-medium text-gray-800">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {notification.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-4 hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-blue-600">{icon}</span>

        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>

      <span className="text-gray-400">→</span>
    </button>
  );
};

export default LegalReviewerDashboard;
