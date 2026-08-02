import { useState } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaShieldAlt, 
  FaUserShield, 
  FaFileInvoice, 
  FaExclamationTriangle,
  FaDownload,
  FaRedo
} from "react-icons/fa";

const AuditLogs = () => {
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  // Mock Audit Log Data (Structures match Spring Boot Audit Entity)
  const auditData = [
    {
      id: "LOG-8901",
      timestamp: "2026-08-02 14:15:22",
      user: "Sarah Jenkins",
      role: "ANALYST",
      ipAddress: "192.168.1.45",
      action: "GENERATE_REPORT",
      category: "REPORT",
      severity: "INFO",
      details: "Generated comprehensive due diligence report for Property #4092."
    },
    {
      id: "LOG-8902",
      timestamp: "2026-08-02 13:40:05",
      user: "Michael Chen",
      role: "INVESTOR",
      ipAddress: "172.16.0.12",
      action: "HIGH_RISK_FLAG",
      category: "PROPERTY",
      severity: "WARNING",
      details: "Flagged title risk discrepancy on Property #1029."
    },
    {
      id: "LOG-8903",
      timestamp: "2026-08-02 12:10:18",
      user: "Sameen (Admin)",
      role: "ADMIN",
      ipAddress: "10.0.0.1",
      action: "UPDATE_PERMISSIONS",
      category: "SECURITY",
      severity: "CRITICAL",
      details: "Elevated user permissions for user ID #8812."
    },
    {
      id: "LOG-8904",
      timestamp: "2026-08-02 11:05:00",
      user: "David Miller",
      role: "INVESTOR",
      ipAddress: "192.168.2.89",
      action: "USER_LOGIN",
      category: "AUTH",
      severity: "INFO",
      details: "User successfully authenticated via 2FA."
    },
    {
      id: "LOG-8905",
      timestamp: "2026-08-02 09:30:41",
      user: "Unknown",
      role: "GUEST",
      ipAddress: "185.220.101.5",
      action: "FAILED_LOGIN",
      category: "SECURITY",
      severity: "CRITICAL",
      details: "3 consecutive failed login attempts detected."
    }
  ];

  // Filtering Logic
  const filteredLogs = auditData.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesCategory = selectedCategory === "ALL" || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === "ALL" || log.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <div className="px-8 pt-6 pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaShieldAlt className="text-blue-600" /> System Audit Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Immutable audit trail tracking all user actions, security events, and system modifications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("ALL"); setSelectedSeverity("ALL"); }} 
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
          >
            <FaRedo className="text-xs" /> Reset Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaShieldAlt className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Events Logged</p>
            <p className="text-xl font-bold text-gray-900">{auditData.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><FaExclamationTriangle className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Critical Alerts</p>
            <p className="text-xl font-bold text-gray-900">
              {auditData.filter(l => l.severity === "CRITICAL").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FaFileInvoice className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Report Actions</p>
            <p className="text-xl font-bold text-gray-900">
              {auditData.filter(l => l.category === "REPORT").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><FaUserShield className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Admin Actions</p>
            <p className="text-xl font-bold text-gray-900">
              {auditData.filter(l => l.role === "ADMIN").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, IP address, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 text-xs" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="AUTH">Authentication</option>
              <option value="PROPERTY">Property</option>
              <option value="REPORT">Report</option>
              <option value="SECURITY">Security</option>
            </select>
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Log ID & Time</th>
                <th className="px-6 py-3 font-medium">User & Role</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Action Event</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{log.id}</p>
                      <p className="text-xs text-gray-400">{log.timestamp}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{log.user}</p>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.ipAddress}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                        log.severity === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                        log.severity === "WARNING" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                    No audit logs matching your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;