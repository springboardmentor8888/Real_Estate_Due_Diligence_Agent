"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import "./audit-logs.css";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  CalendarClock,
  Search,
} from "lucide-react";

export default function AuditLogs() {
  const [search, setSearch] = useState("");

  const logs = [
    {
      id: "LOG001",
      user: "Admin",
      action: "Generated Report",
      module: "Reports",
      timestamp: "05-Aug-2026 10:30 AM",
      status: "Success",
    },
    {
      id: "LOG002",
      user: "John",
      action: "Login",
      module: "Authentication",
      timestamp: "05-Aug-2026 10:45 AM",
      status: "Success",
    },
    {
      id: "LOG003",
      user: "Admin",
      action: "Deleted Property",
      module: "Property",
      timestamp: "05-Aug-2026 11:15 AM",
      status: "Failed",
    },
    {
      id: "LOG004",
      user: "Sarah",
      action: "Updated Profile",
      module: "User Management",
      timestamp: "05-Aug-2026 11:40 AM",
      status: "Success",
    },
    {
      id: "LOG005",
      user: "Michael",
      action: "Failed Login Attempt",
      module: "Authentication",
      timestamp: "05-Aug-2026 12:05 PM",
      status: "Failed",
    },
    {
      id: "LOG006",
      user: "Admin",
      action: "Exported Data",
      module: "Reports",
      timestamp: "05-Aug-2026 12:30 PM",
      status: "Warning",
    },
    {
      id: "LOG007",
      user: "John",
      action: "Added New Property",
      module: "Property",
      timestamp: "05-Aug-2026 01:10 PM",
      status: "Success",
    },
    {
      id: "LOG008",
      user: "Sarah",
      action: "Changed Password",
      module: "Authentication",
      timestamp: "05-Aug-2026 01:45 PM",
      status: "Success",
    },
    {
      id: "LOG009",
      user: "Admin",
      action: "Permission Denied",
      module: "Access Control",
      timestamp: "05-Aug-2026 02:20 PM",
      status: "Warning",
    },
    {
      id: "LOG010",
      user: "Michael",
      action: "Deleted Report",
      module: "Reports",
      timestamp: "05-Aug-2026 03:00 PM",
      status: "Failed",
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
  );

  const today = "05-Aug-2026";
  const todaysLogsCount = logs.filter((log) =>
    log.timestamp.startsWith(today)
  ).length;

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="audit-container">
        <h1>Audit Logs</h1>
        <p className="audit-description">
          Monitor and review all user activities and system events for
          security and compliance.
        </p>

        <div className="search-container">
          <Search className="search-icon" size={18} />

          <input
            type="text"
            placeholder="Search by Log ID, User, or Action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
        </div>

        <div className="stats-container">
          <div className="stat-card total">
            <ClipboardList size={30} />
            <h2>{logs.length}</h2>
            <p>Total Logs</p>
          </div>

          <div className="stat-card success">
            <CheckCircle size={30} />
            <h2>{logs.filter((l) => l.status === "Success").length}</h2>
            <p>Successful Events</p>
          </div>

          <div className="stat-card failed">
            <XCircle size={30} />
            <h2>{logs.filter((l) => l.status === "Failed").length}</h2>
            <p>Failed Events</p>
          </div>

          <div className="stat-card today">
            <CalendarClock size={30} />
            <h2>{todaysLogsCount}</h2>
            <p>Today&apos;s Logs</p>
          </div>
        </div>

        <table className="audit-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Timestamp</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.module}</td>
                <td>{log.timestamp}</td>
                <td>
                  <span className={`status ${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}