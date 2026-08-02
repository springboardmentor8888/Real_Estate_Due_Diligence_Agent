import StatCard from "../components/common/StatCard";
import { 
  FaUsers, 
  FaBuilding, 
  FaFileAlt, 
  FaExclamationTriangle,
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaUserCog,
  FaDownload,
  FaSync
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  // Mock data for system status
  const systemMetrics = [
    { name: "Backend Service", status: "Operational", icon: <FaServer className="text-emerald-500" /> },
    { name: "PostgreSQL Database", status: "Connected", icon: <FaDatabase className="text-emerald-500" /> },
    { name: "Due Diligence Engine", status: "99.8% Uptime", icon: <FaShieldAlt className="text-blue-500" /> },
  ];

  // Mock data for recent platform activities
  const recentActivities = [
    { id: 1, user: "Sarah Jenkins", action: "Generated Due Diligence Report", target: "Property #4092 (Grand Bay)", time: "10 mins ago", type: "Report" },
    { id: 2, user: "Michael Chen", action: "Flagged High Risk Factor", target: "Property #1029 (Oakridge)", time: "25 mins ago", type: "Alert" },
    { id: 3, user: "Admin (You)", action: "Updated System Permissions", target: "User Role: Analyst", time: "1 hour ago", type: "System" },
    { id: 4, user: "David Miller", action: "Registered New Account", target: "d.miller@investments.com", time: "2 hours ago", type: "User" },
  ];

  return (
    <div className="px-8 pt-6 pb-12 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            System overview, health diagnostics, and administrative activity tracking.
          </p>
        </div>
        
        {/* Quick System Status Pill */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-emerald-700 text-sm font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          System All Operational
        </div>
      </div>

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value="120"
          change="+10% this month"
          changeColor="text-emerald-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={<FaBuilding />}
          title="Total Properties"
          value="85"
          change="+8% this month"
          changeColor="text-emerald-600"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatCard
          icon={<FaFileAlt />}
          title="Reports Generated"
          value="45"
          change="+12% this month"
          changeColor="text-emerald-600"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <StatCard
          icon={<FaExclamationTriangle />}
          title="High Risk Properties"
          value="7"
          change="Needs attention"
          changeColor="text-rose-600"
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
        />
      </div>

      {/* 2. System Health & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaServer className="text-blue-600" /> System Diagnostics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {systemMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-3">
                <div className="text-xl mt-1">{metric.icon}</div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{metric.name}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{metric.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Management</h2>
          <div className="flex flex-col gap-3">
            <Link 
              to="/audit-logs" 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2"><FaShieldAlt className="text-gray-500" /> View Security Audit Logs</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Logs</span>
            </Link>
            <Link 
              to="/analytics" 
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <span className="flex items-center gap-2"><FaSync className="text-gray-500" /> Deep Analytics & Trends</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Analytics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Recent Platform Activity Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recent Platform Activity</h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time audit stream of user interactions</p>
          </div>
          <Link to="/audit-logs" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Activity &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Target / Entity</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{act.user}</td>
                  <td className="px-6 py-4">{act.action}</td>
                  <td className="px-6 py-4 text-gray-500">{act.target}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{act.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                      act.type === "Alert" ? "bg-red-100 text-red-700" :
                      act.type === "Report" ? "bg-amber-100 text-amber-700" :
                      act.type === "User" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {act.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;