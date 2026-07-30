import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  FileText,
  Search,
  Filter,
  FileDown,
  Printer,
  Calendar,
  User,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import { showToast } from "../utils/swal";

function ReportHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Demo Audit Report History Archive Dataset
  const reports = [
    {
      id: "DDR-2025-8841",
      name: "Prestige Cyber Heights Full Audit",
      propertyId: "PR-1001",
      propertyName: "Prestige Cyber Heights",
      generatedDate: "28-Jul-2026",
      generatedBy: "Rama Charan",
      status: "Completed",
      variant: "success",
    },
    {
      id: "DDR-2025-8839",
      name: "Brigade Tech Park Diligence Report",
      propertyId: "CMP-201",
      propertyName: "Brigade Tech Park Tower A",
      generatedDate: "24-Jul-2026",
      generatedBy: "Rama Charan",
      status: "Completed",
      variant: "success",
    },
    {
      id: "DDR-2025-8822",
      name: "Embassy GolfLinks Title Assessment",
      propertyId: "CMP-202",
      propertyName: "Embassy GolfLinks Block C",
      generatedDate: "19-Jul-2026",
      generatedBy: "Rahul Sharma",
      status: "In Review",
      variant: "warning",
    },
    {
      id: "DDR-2025-8810",
      name: "RMZ Infinity Encumbrance Audit",
      propertyId: "CMP-203",
      propertyName: "RMZ Infinity Workspace",
      generatedDate: "12-Jul-2026",
      generatedBy: "Ananya Reddy",
      status: "Flagged Risk",
      variant: "danger",
    },
    {
      id: "DDR-2025-8790",
      name: "Bagmane World Tech Centre Verification",
      propertyId: "CMP-204",
      propertyName: "Bagmane World Tech Centre",
      generatedDate: "05-Jul-2026",
      generatedBy: "Rama Charan",
      status: "Completed",
      variant: "success",
    },
  ];

  // Filtering & Search Logic
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.generatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || r.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <FileText size={14} /> Official Due Diligence Archives
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              📚 Due Diligence Report History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Access historical audit reports, download compiled PDF & Excel statements, and review auditor sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToExcel("Report History Archive", filteredReports)}
              variant="secondary"
              size="sm"
              icon={Printer}
            >
              Export Archive CSV
            </Button>
          </div>
        </div>

        {/* Search, Filter & Controls Panel */}
        <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Report ID, Name, or Auditor..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Review">In Review</option>
                <option value="Flagged">Flagged Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report History Table */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <FileText size={20} className="text-blue-600 dark:text-cyan-400" /> Generated Report Archives
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-[#94A3B8]">
              Showing {filteredReports.length} Reports
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#334155]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-200 text-xs font-mono uppercase">
                  <th className="p-4 font-semibold">Report ID</th>
                  <th className="p-4 font-semibold">Report Name</th>
                  <th className="p-4 font-semibold">Property Name</th>
                  <th className="p-4 font-semibold">Generated Date</th>
                  <th className="p-4 font-semibold">Generated By</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#334155] bg-white dark:bg-[#0F172A] text-xs text-slate-700 dark:text-slate-200">
                {filteredReports.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-cyan-400">{rec.id}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-[#F8FAFC]">{rec.name}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{rec.propertyName}</td>
                    <td className="p-4 font-mono text-slate-500 dark:text-[#94A3B8]">{rec.generatedDate}</td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{rec.generatedBy}</td>
                    <td className="p-4">
                      <Badge variant={rec.variant}>{rec.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/due-diligence-report"
                          className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/80 transition-colors"
                          title="View Online"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => exportToPdf(rec.name, rec.propertyId)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <FileDown size={16} />
                        </button>
                        <button
                          onClick={() => exportToExcel(rec.name, [rec])}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                          title="Export Excel"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default ReportHistory;
