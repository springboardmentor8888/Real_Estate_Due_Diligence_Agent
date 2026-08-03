import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Users, Building2, FileText, Clock, CheckCircle2, Activity, RotateCcw } from "lucide-react";
import { showToast } from "../utils/swal";
import { getAllProperties } from "../services/propertyService";

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [propertyCount, setPropertyCount] = useState(null);

  useEffect(() => {
    getAllProperties(0, 1)
      .then((res) => {
        if (res && res.data) {
          const total = res.data.totalElements ?? (Array.isArray(res.data) ? res.data.length : null);
          setPropertyCount(total);
        }
      })
      .catch(() => setPropertyCount(null))
      .finally(() => setLoading(false));
  }, []);

  const handleRefreshAnalytics = () => {
    setLoading(true);
    getAllProperties(0, 1)
      .then((res) => {
        if (res && res.data) {
          const total = res.data.totalElements ?? (Array.isArray(res.data) ? res.data.length : null);
          setPropertyCount(total);
          showToast("Admin telemetry refreshed", "success");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Activity size={14} /> Executive Admin Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              ⚡ Platform Executive Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Monitor total registered workspace users, property parcel audits, risk distribution metrics, and system telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={handleRefreshAnalytics} variant="secondary" size="sm" icon={RotateCcw} loading={loading}>
              Refresh Telemetry
            </Button>
          </div>
        </div>

        {/* 5 Core Enterprise KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Users</p>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400">
                <Users size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">Not Available</h3>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Properties</p>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Building2 size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">
              {propertyCount !== null ? propertyCount.toString() : "Not Available"}
            </h3>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Total Reports</p>
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400">
                <FileText size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">Not Available</h3>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Pending Reviews</p>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Clock size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">Not Available</h3>
          </div>

          <div className="white-card rounded-2xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-bold uppercase text-slate-400 dark:text-[#94A3B8]">Completed Reviews</p>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] font-mono">Not Available</h3>
          </div>
        </div>

        {/* Analytics Container */}
        <div className="white-card rounded-3xl p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155]">
          <EmptyState
            title="No telemetry analytics available."
            message="No system analytics or report generation logs were returned by the backend."
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;
