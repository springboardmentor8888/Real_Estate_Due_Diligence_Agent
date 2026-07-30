"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import "./report-history.css";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
} from "lucide-react";

export default function ReportHistory() {
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: "REP001",
      property: "Green Villa",
      date: "30-Jul-2026",
      status: "Completed",
    },
    {
      id: "REP002",
      property: "Lake House",
      date: "29-Jul-2026",
      status: "Pending",
    },
    {
      id: "REP003",
      property: "Sky Heights",
      date: "28-Jul-2026",
      status: "Failed",
    },
    {
      id: "REP004",
      property: "Sunshine Residency",
      date: "27-Jul-2026",
      status: "Completed",
    },
  ];

  const filteredReports = reports.filter(
    (report) =>
      report.property.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="history-container">
        <h1>Report History</h1>
<p className="report-description">
  Access, search, and review all generated due diligence reports in one place.
</p>

        <div className="search-container">
    <Search className="search-icon" size={18}/>

    <input
        type="text"
        placeholder="Search by Report ID or Property..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
    />
</div>
        <div className="stats-container">
  <div className="stat-card total">
    <FileText size={30} />
    <h2>{reports.length}</h2>
    <p>Total Reports</p>
  </div>

  <div className="stat-card completed">
    <CheckCircle size={30} />
    <h2>{reports.filter(r => r.status === "Completed").length}</h2>
    <p>Completed</p>
  </div>

  <div className="stat-card pending">
    <Clock size={30} />
    <h2>{reports.filter(r => r.status === "Pending").length}</h2>
    <p>Pending</p>
  </div>

  <div className="stat-card failed">
    <XCircle size={30} />
    <h2>{reports.filter(r => r.status === "Failed").length}</h2>
    <p>Failed</p>
  </div>
</div>

        <table className="history-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Property</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.property}</td>
                <td>{report.date}</td>
                <td>
                  <span
                    className={`status ${report.status.toLowerCase()}`}
                  >
                    {report.status}
                  </span>
                </td>
                <td>
                  <button className="view-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}