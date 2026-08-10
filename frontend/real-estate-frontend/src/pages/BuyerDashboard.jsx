import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  AlertTriangle,
  Search,
  ArrowLeftRight,
  Download,
  Home,
  ChevronRight,
  FileDown,
  History,
  CheckCircle2,
  Activity,
  Bell,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeroHeader from "../components/dashboard/DashboardHeroHeader";
import { EnterpriseKPIGrid } from "../components/dashboard/DashboardCard";
import QuickActions from "../components/dashboard/QuickActions";
import SavedPropertiesGrid from "../components/dashboard/SavedPropertiesGrid";
import MarketInsights from "../components/dashboard/MarketInsights";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import { buyerDashboardData } from "../mock/buyerData";
import { getLiveProperties, getLiveSavedProperties } from "../services/liveStore";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

function BuyerDashboard() {
  const navigate = useNavigate();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedModalPropId, setSelectedModalPropId] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName
    ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim()
    : storedUser.name || "Rama Charan";
  const userRole = "Buyer";

  const [properties, setProperties] = useState(getLiveProperties);
  const [savedProperties, setSavedProperties] = useState(getLiveSavedProperties);

  const handleOpenReportModal = (propId = "") => {
    setSelectedModalPropId(propId);
    setReportModalOpen(true);
  };

  useEffect(() => {
    const syncLiveData = () => {
      setProperties(getLiveProperties());
      setSavedProperties(getLiveSavedProperties());
    };

    window.addEventListener("live_data_updated", syncLiveData);
    window.addEventListener("storage", syncLiveData);
    return () => {
      window.removeEventListener("live_data_updated", syncLiveData);
      window.removeEventListener("storage", syncLiveData);
    };
  }, []);

  const dynamicCards = [
    {
      id: "kpi-saved",
      title: "Saved Properties",
      value: `${savedProperties.length}`,
      trend: "+2 this week",
      isPositive: true,
      lastUpdated: "Updated 5m ago",
      iconName: "Building2",
      cardStyle: "bg-blue-50/50 dark:bg-[#1E293B] border-blue-200/80 dark:border-[#334155] border-l-4 border-l-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800",
    },
    {
      id: "kpi-generated",
      title: "Reports Generated",
      value: `${buyerDashboardData.purchasedReports.length}`,
      trend: "+1 new report",
      isPositive: true,
      lastUpdated: "Updated 12m ago",
      iconName: "FileText",
      cardStyle: "bg-emerald-50/50 dark:bg-[#1E293B] border-emerald-200/80 dark:border-[#334155] border-l-4 border-l-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800",
    },
    {
      id: "kpi-pending",
      title: "Pending Reports",
      value: "3",
      trend: "-1 resolved",
      isPositive: true,
      lastUpdated: "Updated 1h ago",
      iconName: "Clock",
      cardStyle: "bg-amber-50/50 dark:bg-[#1E293B] border-amber-200/80 dark:border-[#334155] border-l-4 border-l-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800",
    },
    {
      id: "kpi-risk",
      title: "Average Risk Score",
      value: "18 / 100",
      trend: "-3.2 pts (Low Risk)",
      isPositive: true,
      lastUpdated: "Updated 2m ago",
      iconName: "ShieldCheck",
      cardStyle: "bg-purple-50/50 dark:bg-[#1E293B] border-purple-200/80 dark:border-[#334155] border-l-4 border-l-purple-500",
      iconBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8 pb-16">
        {/* 1. HEADER & BREADCRUMB */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Buyer Portal Dashboard
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono font-bold text-[11px] border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE DATA ACTIVE
          </span>
        </div>

        {/* 2. WELCOME HERO SECTION */}
        <DashboardHeroHeader userName={userName} userRole={userRole} />

        {/* 3. STATISTICS KPI CARDS */}
        <EnterpriseKPIGrid kpiData={dynamicCards} />

        {/* 4. BUYER QUICK ACTIONS */}
        <QuickActions
          title="Buyer Quick Actions"
          subtitle="Direct workflows to query properties, run comparisons, and download reports."
          actions={buyerDashboardData.quickActions}
        />

        {/* 5. RECENT ACTIVITY STREAM */}
        <RecentActivityFeed />

        {/* 6. RECENT REPORTS & NOTIFICATIONS PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Reports (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  VERIFIED AUDIT VAULT
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <FileText size={18} className="text-emerald-600 dark:text-emerald-400" /> Recent Reports
                </h2>
              </div>
              <button
                onClick={() => navigate("/report-history")}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                View History
              </button>
            </div>

            <div className="space-y-3">
              {buyerDashboardData.purchasedReports.map((rpt) => (
                <div
                  key={rpt.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/70 dark:bg-[#0F172A]/70 flex items-center justify-between gap-4 hover:border-blue-400 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {rpt.id} • {rpt.date}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{rpt.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{rpt.property} ({rpt.city})</p>
                  </div>
                  <button
                    onClick={() => handleOpenReportModal(rpt.propertyId || "1001")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                  >
                    <FileDown size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Preview (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  SYSTEM ALERTS
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <Bell size={18} className="text-amber-600 dark:text-amber-400" /> Notifications Center
                </h2>
              </div>
              <button
                onClick={() => navigate("/notifications")}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {buyerDashboardData.notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => navigate("/notifications")}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50/70 dark:bg-[#0F172A]/70 space-y-1.5 hover:border-amber-400 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      {notif.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{notif.time}</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{notif.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. MARKET INSIGHTS SECTION */}
        <MarketInsights />

        {/* 8. SAVED PROPERTIES PREVIEW GRID */}
        <SavedPropertiesGrid />
      </div>

      {/* REPORT GENERATOR MODAL */}
      <ReportGeneratorModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        initialPropertyId={selectedModalPropId}
      />
    </MainLayout>
  );
}

export default BuyerDashboard;
