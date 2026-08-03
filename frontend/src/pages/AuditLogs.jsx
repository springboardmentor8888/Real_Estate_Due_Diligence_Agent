import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaSearch, FaFilter, FaShieldAlt, FaUserShield, 
  FaFileInvoice, FaExclamationTriangle, FaDownload, FaRedo 
} from "react-icons/fa";

const AuditLogs = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  // Fallback logs if API returns empty or fails
  const mockLogs = [
    {
      id: "LOG-8901",
      timestamp: "2026-08-03 14:15:22",
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
      timestamp: "2026-08-03 13:40:05",
      user: "Sameen",
      role: "ADMIN",
      ipAddress: "10.0.0.1",
      action: "UPDATE_PERMISSIONS",
      category: "SECURITY",
      severity: "CRITICAL",
      details: "Elevated user permissions for user ID #8812."
    }
  ];

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/v1/audit-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Handle both List<AuditLog> and Page<AuditLog> response formats
      const logsArray = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.content || []);

      setAuditData(logsArray.length > 0 ? logsArray : mockLogs);
    } catch (err) {
      console.warn("Backend API unavailable or error occurred:", err);
      setErrorMessage("Could not connect to Spring Boot backend. Displaying offline demo logs.");
      setAuditData(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Helper function to safely extract string display text from string OR object
  const getSafeString = (val, defaultVal = "") => {
    if (!val) return defaultVal;
    if (typeof val === "string") return val;
    if (typeof val === "object") return val.name || val.username || val.email || val.roleName || defaultVal;
    return String(val);
  };

  // Safe Filtering Logic
  const safeData = Array.isArray(auditData) ? auditData : [];
  
  const filteredLogs = safeData.filter((log) => {
    if (!log) return false;

    const userStr = getSafeString(log.user || log.userName || log.username, "System").toLowerCase();
    const detailsStr = getSafeString(log.details || log.description, "").toLowerCase();
    const actionStr = getSafeString(log.action, "").toLowerCase();
    const ipStr = getSafeString(log.ipAddress || log.ip, "").toLowerCase();

    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = 
      userStr.includes(searchLower) ||
      detailsStr.includes(searchLower) ||
      actionStr.includes(searchLower) ||
      ipStr.includes(searchLower);

    const categoryStr = getSafeString(log.category, "ALL");
    const severityStr = getSafeString(log.severity, "ALL");

    const matchesCategory = selectedCategory === "ALL" || categoryStr === selectedCategory;
    const matchesSeverity = selectedSeverity === "ALL" || severityStr === selectedSeverity;

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

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => { 
              setSearchTerm(""); 
              setSelectedCategory("ALL"); 
              setSelectedSeverity("ALL"); 
              fetchLogs();
            }} 
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm"
          >
            <FaRedo className="text-xs" /> Reset Filters
          </button>
          <button 
            type="button"
            onClick={() => alert("Exporting CSV...")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Connection Notice / Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FaShieldAlt className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Events Logged</p>
            <p className="text-xl font-bold text-gray-900">{safeData.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><FaExclamationTriangle className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Critical Alerts</p>
            <p className="text-xl font-bold text-gray-900">
              {safeData.filter(l => getSafeString(l?.severity) === "CRITICAL").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><FaFileInvoice className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Report Actions</p>
            <p className="text-xl font-bold text-gray-900">
              {safeData.filter(l => getSafeString(l?.category) === "REPORT").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><FaUserShield className="text-xl" /></div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Admin Actions</p>
            <p className="text-xl font-bold text-gray-900">
              {safeData.filter(l => getSafeString(l?.role).toUpperCase().includes("ADMIN")).length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
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

      {/* Table */}
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => {
                  const displayUser = getSafeString(log.user || log.userName || log.username, "System");
                  const displayRole = getSafeString(log.role || log.userRole, "USER");
                  const displayIp = getSafeString(log.ipAddress || log.ip, "127.0.0.1");
                  const displayAction = getSafeString(log.action, "EVENT");
                  const displaySeverity = getSafeString(log.severity, "INFO");
                  const displayDetails = getSafeString(log.details || log.description, "No details provided");
                  const displayTime = getSafeString(log.timestamp || log.createdAt, "N/A");

                  return (
                    <tr key={log.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{log.id ? `LOG-${log.id}` : `LOG-${idx + 1}`}</p>
                        <p className="text-xs text-gray-400">{displayTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{displayUser}</p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {displayRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{displayIp}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                          {displayAction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                          displaySeverity === "CRITICAL" ? "bg-rose-100 text-rose-700" :
                          displaySeverity === "WARNING" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {displaySeverity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate" title={displayDetails}>
                        {displayDetails}
                      </td>
                    </tr>
                  );
                })
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