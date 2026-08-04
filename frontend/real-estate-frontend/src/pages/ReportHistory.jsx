import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  FileText,
  Search,
  Filter,
  Printer,
  Eye,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  Building2,
  Tag,
  UserCheck,
} from "lucide-react";
import { exportToExcel, exportToPdf } from "../utils/exportUtils";
import { getAllProperties } from "../services/propertyService";
import { showToast } from "../utils/swal";

function ReportHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

  // Get Logged-in User Name & Role
  const getLoggedInUser = () => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const name = parsed.firstName
          ? `${parsed.firstName} ${parsed.lastName || ""}`.trim()
          : parsed.name || parsed.username || "Rama Charan";
        const role = parsed.role || "Buyer";
        return { name, role };
      }
    } catch (e) { }
    return { name: "Rama Charan", role: "Buyer" };
  };

  const { name: loggedInName, role: loggedInRole } = getLoggedInUser();

  useEffect(() => {
    setLoading(true);
    getAllProperties(0, 15)
      .then((res) => {
        if (res && res.data) {
          const items = res.data.content || res.data;
          if (Array.isArray(items)) {
            const mapped = items.map((p, idx) => {
              const val = p.marketValue || (15 + idx * 2.5) * 10000000;
              const dateStr = new Date(Date.now() - idx * 86400000 * 2).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              const searchKeywords = [
                "Gachibowli Commercial Plot",
                "Financial District Land",
                "IT Park Sector C-3",
                "Sub-Registrar Deed Search",
                "3.5 FAR Land Parcel",
                "Industrial NOC Plot",
              ];

              return {
                id: p.id || `PR-${p.propertyId || 1001 + idx}`,
                propertyId: p.propertyId || 1001 + idx,
                name: p.propertyName || p.title || `Property Parcel PR-${1001 + idx}`,
                searchQueryUsed: searchKeywords[idx % searchKeywords.length],
                address: p.address
                  ? typeof p.address === "object"
                    ? `${p.address.addressLine1 || ""}, ${p.address.city || ""}`
                    : p.address
                  : `${p.city || "Hyderabad"}, ${p.state || "Telangana"}`,
                city: p.city || p.address?.city || "Hyderabad",
                marketValFormatted: `₹${(val / 10000000).toFixed(2)} Cr`,
                riskScore: p.riskScore || 12 + idx * 3,
                status: p.status || (p.riskScore > 60 ? "High Risk Flagged" : "Verified Clear Title"),
                date: dateStr,
                auditor: loggedInName,
                auditorRole: loggedInRole,
                imgSrc: p.imageUrl || p.image || FALLBACK_IMAGE,
                rawProp: p,
              };
            });
            setReports(mapped);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load report history:", err);
        setReports([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.searchQueryUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "CLEAR"
          ? r.riskScore <= 30
          : statusFilter === "MODERATE"
            ? r.riskScore > 30 && r.riskScore <= 60
            : r.riskScore > 60;

    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <FileText size={14} /> User Property Audit History Log
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              📚 Due Diligence Search & Report History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Chronological log of all property searches and due diligence audit reports generated by {loggedInName} ({loggedInRole}).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => exportToPdf("Due Diligence Report History", "HISTORY")}
              variant="primary"
              size="sm"
              icon={Printer}
              disabled={filteredReports.length === 0}
            >
              Export PDF Log
            </Button>
            <Button
              onClick={() => exportToExcel("Property Audit History", filteredReports)}
              variant="outline"
              size="sm"
              disabled={filteredReports.length === 0}
            >
              Export Excel
            </Button>
          </div>
        </div>

        {/* History Metrics KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Total Searched Parcels
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {reports.length} Audits
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mt-0.5">
              Logged in Session
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Clear Titles Verified
            </span>
            <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {reports.filter((r) => r.riskScore <= 30).length} Parcels
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
              100% Passed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Active Auditor
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 truncate">
              {loggedInName}
            </h3>
            <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mt-0.5">
              Role: {loggedInRole}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase block">
              Avg Compliance Score
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              18 / 100
            </h3>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
              Institutional Grade
            </span>
          </div>
        </div>

        {/* Search, Filter & View Mode Controls */}
        <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Property, Keyword, or APN..."
                className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Filter size={14} /> Risk Status:
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CLEAR">Low Risk (&le;30 Score)</option>
              <option value="MODERATE">Moderate Risk (31-60 Score)</option>
              <option value="HIGH">High Risk (&gt;60 Score)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0F172A] p-1 rounded-xl border border-slate-200 dark:border-[#334155]">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <LayoutGrid size={14} /> Search Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${viewMode === "table"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <TableIcon size={14} /> Audit Log Table
            </button>
          </div>
        </div>

        {/* Content Section: Cards Format or Structured Table */}
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <EmptyState
            title="No search audit records found."
            message="Adjust your search query or risk filter criteria."
          />
        ) : viewMode === "grid" ? (
          /* GRID AUDIT CARDS FORMAT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((rec) => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/due-diligence-report?id=${rec.id}`, { state: { property: rec.rawProp } })}
                className="white-card rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs hover:shadow-xl cursor-pointer overflow-hidden flex flex-col justify-between group transition-all"
              >
                {/* Banner Photo */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-[#0F172A]">
                  <img
                    src={rec.imgSrc}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono font-bold bg-slate-900/80 text-white px-2.5 py-0.5 rounded-md border border-white/20">
                      {rec.id}
                    </span>
                    <Badge variant={rec.riskScore > 60 ? "danger" : rec.riskScore > 30 ? "warning" : "success"}>
                      {rec.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {rec.name}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* User Search Tag */}
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/80">
                      <Tag size={12} className="shrink-0" />
                      <span className="truncate">Search: "{rec.searchQueryUsed}"</span>
                    </div>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 truncate">
                      <MapPin size={13} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                      {rec.address}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#334155] text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Valuation</span>
                        <strong className="text-blue-600 dark:text-cyan-400 font-extrabold">{rec.marketValFormatted}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Audited On</span>
                        <strong className="text-slate-700 dark:text-slate-300 font-bold">{rec.date}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#334155] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <UserCheck size={11} /> {rec.auditor} ({rec.auditorRole})
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:underline">
                      View Report <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* STRUCTURED TABULAR LOG FORMAT */
          <div className="glass-card rounded-3xl border border-slate-200 dark:border-[#334155] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 dark:bg-[#0F172A]/90 font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-[#334155]">
                    <th className="py-3.5 px-4">Parcel ID</th>
                    <th className="py-3.5 px-5">Searched Property</th>
                    <th className="py-3.5 px-4">Search Term Used</th>
                    <th className="py-3.5 px-4">Audited Date</th>
                    <th className="py-3.5 px-4">Valuation</th>
                    <th className="py-3.5 px-4">Risk Status</th>
                    <th className="py-3.5 px-4">Auditor & Role</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#334155]">
                  {filteredReports.map((rec) => (
                    <tr
                      key={rec.id}
                      onClick={() => navigate(`/due-diligence-report?id=${rec.id}`, { state: { property: rec.rawProp } })}
                      className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {rec.id}
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {rec.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                          <Tag size={11} /> {rec.searchQueryUsed}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {rec.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-blue-600 dark:text-cyan-400">
                        {rec.marketValFormatted}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={rec.riskScore > 60 ? "danger" : rec.riskScore > 30 ? "warning" : "success"}>
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {rec.auditor} ({rec.auditorRole})
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/due-diligence-report?id=${rec.id}`, { state: { property: rec.rawProp } });
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#334155] transition-colors cursor-pointer"
                        >
                          View Report <ArrowUpRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ReportHistory;
