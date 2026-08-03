import { useState, useEffect } from "react";
import StatCard from "../components/common/StatCard";
import RecentSearches from "./RecentSearches";
import QuickActions from "./QuickActions";
import Notifications from "./Notifications";
import RecentReports from "./RecentReports";
import { FaSearch, FaFileAlt, FaBookmark, FaBell } from "react-icons/fa";
import axios from "axios";

const Dashboard = () => {
  // State for logged-in user info & live stats
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    totalSearches: 0,
    reportsGenerated: 0,
    savedProperties: 0,
    alertsCount: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch user name from stored session
    const storedUser = localStorage.getItem("userName") || localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || parsed.username || storedUser);
      } catch {
        setUserName(storedUser);
      }
    }

    // 2. Fetch live metrics from Spring Boot backend
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch live properties count from PostgreSQL DB
      const propsRes = await axios.get("http://localhost:8080/api/v1/properties", { headers });
      const propsList = Array.isArray(propsRes.data)
        ? propsRes.data
        : propsRes.data?.content || [];

      setStats((prev) => ({
        ...prev,
        totalSearches: propsList.length,
        savedProperties: propsList.length,
      }));
    } catch (err) {
      console.error("Error loading dashboard stats from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 pt-5 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {userName}!
        </h1>

        <p className="mt-2 text-gray-500">
          Here's what's happening with your due diligence activities.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<FaSearch />}
          title="Total Searches"
          value={loading ? "..." : String(stats.totalSearches)}
          change="+12% this month"
          changeColor="text-green-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={<FaFileAlt />}
          title="Reports Generated"
          value={loading ? "..." : String(stats.reportsGenerated)}
          change="+8% this month"
          changeColor="text-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon={<FaBookmark />}
          title="Saved Properties"
          value={loading ? "..." : String(stats.savedProperties)}
          change="+5% this month"
          changeColor="text-green-600"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          icon={<FaBell />}
          title="Alerts"
          value={String(stats.alertsCount)}
          change="View all"
          changeColor="text-blue-600"
          iconBg="bg-red-100"
          iconColor="text-red-600"
          link="/alerts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentSearches />
        </div>

        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <RecentReports />
        </div>
        <div>
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;