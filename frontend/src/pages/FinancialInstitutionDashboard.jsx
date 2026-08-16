import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import StatCard from "../components/common/StatCard";

import {
  FaBuilding,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaSearch,
  FaBalanceScale,
  FaShieldAlt,
  FaChartPie,
  FaBell,
} from "react-icons/fa";

const FinancialInstitutionDashboard = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");

  const [stats, setStats] = useState({
    propertiesEvaluated: 0,
    underReview: 0,
    highRiskProperties: 0,
    reportsReviewed: 0,
  });

  const [recentAssessments, setRecentAssessments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    fetchDashboardData();
  }, []);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        setUserName(
          parsedUser.name ||
            parsedUser.username ||
            parsedUser.email?.split("@")[0] ||
            "User",
        );
      } else {
        const storedName = localStorage.getItem("userName");

        if (storedName) {
          setUserName(storedName);
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const response = await axios.get(
        "http://localhost:8080/api/financial-institution/dashboard",
        { headers },
      );

      const data = response.data;

      setStats({
        propertiesEvaluated: data.propertiesEvaluated ?? 0,
        underReview: data.underReview ?? 0,
        highRiskProperties: data.highRiskProperties ?? 0,
        reportsReviewed: data.reportsReviewed ?? 0,
      });

      setRecentAssessments(
        Array.isArray(data.recentAssessments) ? data.recentAssessments : [],
      );

      // Notifications are still coming from the existing endpoint
      try {
        const notificationResponse = await axios.get(
          "http://localhost:8080/api/notifications",
          { headers },
        );

        setNotifications(
          Array.isArray(notificationResponse.data)
            ? notificationResponse.data.slice(0, 3)
            : [],
        );
      } catch (error) {
        console.warn("Could not fetch notifications:", error);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error loading financial institution dashboard:", error);

      setStats({
        propertiesEvaluated: 0,
        underReview: 0,
        highRiskProperties: 0,
        reportsReviewed: 0,
      });

      setRecentAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyName = (property) => {
    return property.property || `Property #${property.propertyId}`;
  };

  const getLocation = (property) => {
    return property.location || "Location unavailable";
  };

  const getRisk = (property) => {
    const risk = String(
      property.riskLevel || property.risk || property.riskStatus || "",
    ).toUpperCase();

    if (risk.includes("HIGH")) return "High";
    if (risk.includes("MEDIUM")) return "Medium";
    if (risk.includes("LOW")) return "Low";

    return "Not Assessed";
  };

  const getStatus = (property) => {
    const status = String(
      property.status ||
        property.reviewStatus ||
        property.assessmentStatus ||
        "",
    ).toUpperCase();

    if (status.includes("APPROVED")) return "Approved";
    if (status.includes("REJECTED")) return "Rejected";
    if (status.includes("REVIEW")) return "Under Review";
    if (status.includes("PENDING")) return "Pending";

    return "Not Reviewed";
  };

  const getRiskClass = (risk) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Under Review":
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handlePropertyClick = (property) => {
    if (property.propertyId) {
      navigate(`/property-details/${property.propertyId}`);
    }
  };

  return (
    <div className="px-8 pt-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {userName}!
        </h1>

        <p className="mt-2 text-gray-500">
          Here's your financial due diligence overview.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<FaBuilding />}
          title="Properties Evaluated"
          value={loading ? "..." : String(stats.propertiesEvaluated)}
          change="Live from DB"
          changeColor="text-green-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={<FaClock />}
          title="Under Review"
          value={loading ? "..." : String(stats.underReview)}
          change="Current status"
          changeColor="text-yellow-600"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          icon={<FaExclamationTriangle />}
          title="High Risk Properties"
          value={loading ? "..." : String(stats.highRiskProperties)}
          change="Risk identified"
          changeColor="text-red-600"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

        <StatCard
          icon={<FaFileAlt />}
          title="Reports Reviewed"
          value={loading ? "..." : String(stats.reportsReviewed)}
          change="Review activity"
          changeColor="text-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Recent Assessments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Property Assessments
            </h2>

            <button
              onClick={() => navigate("/search-property")}
              className="text-blue-600 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">
              Loading assessments...
            </div>
          ) : recentAssessments.length === 0 ? (
            <div className="py-12 text-center">
              <FaBuilding className="mx-auto text-4xl text-gray-300 mb-3" />

              <h3 className="text-lg font-semibold text-gray-700">
                No property assessments yet
              </h3>

              <p className="text-gray-500 mt-1">
                Search for a property to begin financial evaluation.
              </p>

              <button
                onClick={() => navigate("/search-property")}
                className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                <FaSearch />
                Search Property
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3 pr-4">Property</th>

                    <th className="pb-3 pr-4">Location</th>

                    <th className="pb-3 pr-4">Risk</th>

                    <th className="pb-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAssessments.map((property) => {
                    const risk = getRisk(property);
                    const status = getStatus(property);

                    return (
                      <tr
                        key={property.propertyId}
                        onClick={() => handlePropertyClick(property)}
                        className="border-b last:border-0 hover:bg-gray-50 cursor-pointer transition"
                      >
                        <td className="py-4 pr-4 font-medium text-gray-800">
                          {getPropertyName(property)}
                        </td>

                        <td className="py-4 pr-4 text-gray-500 text-sm">
                          {getLocation(property)}
                        </td>

                        <td className="py-4 pr-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskClass(
                              risk,
                            )}`}
                          >
                            {risk}
                          </span>
                        </td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Risk Overview */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FaChartPie />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Risk Overview
              </h2>

              <p className="text-sm text-gray-500">
                Property risk distribution
              </p>
            </div>
          </div>

          {stats.propertiesEvaluated === 0 ? (
            <div className="py-10 text-center">
              <FaShieldAlt className="mx-auto text-4xl text-gray-300 mb-3" />

              <p className="text-gray-500">No risk data available.</p>

              <p className="text-sm text-gray-400 mt-1">
                Risk information will appear after properties are assessed.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">High Risk</span>

                  <span className="font-semibold text-red-600">
                    {stats.highRiskProperties}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${
                        (stats.highRiskProperties / stats.propertiesEvaluated) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Under Review</span>

                  <span className="font-semibold text-yellow-600">
                    {stats.underReview}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: `${
                        (stats.underReview / stats.propertiesEvaluated) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Other</span>

                  <span className="font-semibold text-green-600">
                    {Math.max(
                      0,
                      stats.propertiesEvaluated -
                        stats.highRiskProperties -
                        stats.underReview,
                    )}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        (Math.max(
                          0,
                          stats.propertiesEvaluated -
                            stats.highRiskProperties -
                            stats.underReview,
                        ) /
                          stats.propertiesEvaluated) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <FaBell />
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                Alerts & Notifications
              </h2>
            </div>

            <button
              onClick={() => navigate("/alerts")}
              className="text-blue-600 font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No new notifications.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FaBell />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {notification.title ||
                        notification.message ||
                        "New notification"}
                    </p>

                    {notification.message && notification.title && (
                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/search-property")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition text-left"
            >
              <FaSearch className="text-blue-600" />

              <div>
                <p className="font-medium text-gray-800">Search Property</p>

                <p className="text-xs text-gray-500">
                  Find a property to evaluate
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/financial-assessment")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition text-left"
            >
              <FaBalanceScale className="text-blue-600" />

              <div>
                <p className="font-medium text-gray-800">
                  Financial Assessment
                </p>

                <p className="text-xs text-gray-500">Review financial risk</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/property-comparison")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition text-left"
            >
              <FaChartPie className="text-blue-600" />

              <div>
                <p className="font-medium text-gray-800">Compare Properties</p>

                <p className="text-xs text-gray-500">
                  Compare property information
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/reports")}
              className="w-full flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 transition text-left"
            >
              <FaFileAlt className="text-blue-600" />

              <div>
                <p className="font-medium text-gray-800">View Reports</p>

                <p className="text-xs text-gray-500">
                  Review due diligence reports
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInstitutionDashboard;
