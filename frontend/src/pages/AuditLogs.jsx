import { useState, useEffect } from "react";
import { getAuditLogs } from "../services/dueDiligenceService";
import {
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaUserShield,
  FaFileInvoice,
  FaExclamationTriangle,
  FaDownload,
  FaRedo,
} from "react-icons/fa";

const AuditLogs = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const logsArray = await getAuditLogs();

      setAuditData(logsArray);
    } catch (err) {
      console.error("Failed to load audit logs:", err);

      setErrorMessage(
        "Could not load audit logs from the Spring Boot backend.",
      );

      setAuditData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getSafeString = (val, defaultVal = "") => {
    if (!val) return defaultVal;
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return (
        val.name || val.username || val.email || val.roleName || defaultVal
      );
    return String(val);
  };

  const safeData = Array.isArray(auditData) ? auditData : [];

  const filteredLogs = safeData.filter((log) => {
    if (!log) return false;

    const userStr = getSafeString(
      log.username || log.user || log.userName,
      "System",
    ).toLowerCase();
    const detailsStr = getSafeString(
      log.description || log.reportName || log.apiEndpoint,
      "",
    ).toLowerCase();
    const actionStr = getSafeString(log.action, "").toLowerCase();
    const endpointStr = getSafeString(
      log.apiEndpoint || log.ipAddress || log.ip,
      "",
    ).toLowerCase();

    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      userStr.includes(searchLower) ||
      detailsStr.includes(searchLower) ||
      actionStr.includes(searchLower) ||
      endpointStr.includes(searchLower);

    const moduleStr = getSafeString(
      log.module || log.category,
      "ALL",
    ).toUpperCase();
    const actionVal = getSafeString(log.action, "ALL").toUpperCase();

    const matchesModule =
      selectedModule === "ALL" || moduleStr === selectedModule;
    const matchesAction =
      selectedAction === "ALL" || actionVal.includes(selectedAction);

    return matchesSearch && matchesModule && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = [
      "Log ID",
      "Timestamp",
      "User",
      "Role",
      "API / Location",
      "Action",
      "Module",
      "Details",
    ];
    const rows = filteredLogs.map((log) => [
      getSafeString(log.id, "N/A"),
      getSafeString(log.createdAt || log.timestamp, "N/A"),
      getSafeString(log.username || log.user, "System"),
      getSafeString(log.role || "USER"),
      getSafeString(log.apiEndpoint || log.ipAddress || "N/A"),
      getSafeString(log.action, "EVENT"),
      getSafeString(log.module || log.category, "N/A"),
      `"${getSafeString(log.details || log.reportName || log.description, "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-8 pt-6 pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaShieldAlt className="text-blue-600" /> System Audit Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Immutable audit trail tracking all user actions, property changes,
            and system activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedModule("ALL");
              setSelectedAction("ALL");
              fetchLogs();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer"
          >
            <FaRedo className="text-xs" /> Reset Filters
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Connection Banner */}
      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaShieldAlt className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Total Events Logged
            </p>
            <p className="text-xl font-bold text-gray-900">{safeData.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Critical / Delete Events
            </p>
            <p className="text-xl font-bold text-gray-900">
              {
                safeData.filter((l) =>
                  getSafeString(l?.action).toUpperCase().includes("DELETE"),
                ).length
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FaFileInvoice className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">
              Property Modules
            </p>
            <p className="text-xl font-bold text-gray-900">
              {
                safeData.filter((l) =>
                  getSafeString(l?.module).toUpperCase().includes("PROPERTY"),
                ).length
              }
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FaUserShield className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">User Actions</p>
            <p className="text-xl font-bold text-gray-900">
              {
                safeData.filter((l) =>
                  ["AUTH", "USER"].includes(
                    getSafeString(l?.module).toUpperCase(),
                  ),
                ).length
              }
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
            placeholder="Search by user, endpoint, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400 text-xs" />
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">All Modules</option>
              <option value="AUTH">Auth</option>
              <option value="USER">User</option>
              <option value="PROPERTY">Property</option>
              <option value="REPORT">Report</option>
              <option value="DASHBOARD">Dashboard</option>
              <option value="NOTIFICATION">Notification</option>
              <option value="AUDIT">Audit</option>
            </select>
          </div>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="REGISTER">REGISTER</option>
            <option value="SEARCH_PROPERTY">SEARCH PROPERTY</option>
            <option value="VIEW_PROPERTY">VIEW PROPERTY</option>
            <option value="SAVE_PROPERTY">SAVE PROPERTY</option>
            <option value="UPDATE_PROPERTY">UPDATE PROPERTY</option>
            <option value="DELETE_PROPERTY">DELETE PROPERTY</option>
            <option value="COMPARE_PROPERTIES">COMPARE PROPERTIES</option>
            <option value="GENERATE_REPORT">GENERATE REPORT</option>
            <option value="DOWNLOAD_REPORT">DOWNLOAD REPORT</option>
            <option value="API_REQUEST">API REQUEST</option>
            <option value="API_RESPONSE">API RESPONSE</option>
            <option value="UPDATE_PROFILE">UPDATE PROFILE</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Log ID & Time</th>
                <th className="px-6 py-3 font-medium">Username</th>
                <th className="px-6 py-3 font-medium">API Endpoint / Route</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Module</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    Loading logs...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => {
                  const displayUser = getSafeString(
                    log.username || log.user,
                    "System",
                  );
                  const displayEndpoint = getSafeString(
                    log.apiEndpoint || log.ipAddress,
                    "N/A",
                  );
                  const displayAction = getSafeString(log.action, "EVENT");
                  const displayModule = getSafeString(
                    log.module || log.category,
                    "GENERAL",
                  );
                  const displayDetails = getSafeString(
                    log.description || log.reportName || log.entityName,
                    "No extra details",
                  );
                  const displayTime = getSafeString(
                    log.createdAt || log.timestamp,
                    "N/A",
                  );

                  const rawId = getSafeString(log.id, String(idx + 1));
                  const displayLogId = rawId.startsWith("LOG-")
                    ? rawId
                    : `LOG-${rawId}`;

                  return (
                    <tr
                      key={log.id || idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {displayLogId}
                        </p>
                        <p className="text-xs text-gray-400">{displayTime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {displayUser}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {displayEndpoint}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                          {displayAction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-700">
                          {displayModule}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-xs text-gray-600 max-w-xs truncate"
                        title={displayDetails}
                      >
                        {displayDetails}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
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
