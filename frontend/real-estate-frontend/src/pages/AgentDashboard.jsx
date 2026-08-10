import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  Activity,
  Home,
  ChevronRight,
  ClipboardList,
  UserCheck,
  Search,
  Filter,
  X,
  FileText,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Bell,
  TrendingUp,
  FileDown,
  ArrowUpRight,
  MapPin,
  Flame,
  CheckSquare,
  Square,
} from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import DashboardHeroHeader from "../components/dashboard/DashboardHeroHeader";
import { KPIDashboardCards, EnterpriseKPIGrid } from "../components/dashboard/DashboardCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import ReportGeneratorModal from "../components/dashboard/ReportGeneratorModal";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { agentDashboardData } from "../mock/agentData";
import { getLiveProperties, getLiveAgentRequests } from "../services/liveStore";
import { showToast } from "../utils/swal";

function AgentDashboard() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.firstName
    ? `${storedUser.firstName} ${storedUser.lastName || ""}`.trim()
    : storedUser.name || "Ananya Rao";
  const userRole = "Real Estate Agent";

  // Live Store State Sync
  const [clientProperties, setClientProperties] = useState(getLiveProperties);
  const [assignedRequests, setAssignedRequests] = useState(getLiveAgentRequests);

  // Today's Tasks Interactive Completion State
  const [tasks, setTasks] = useState(agentDashboardData.todayTasks);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedModalPropId, setSelectedModalPropId] = useState("");

  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          showToast(`Task marked as ${nextState ? "Completed" : "Pending"}`, "info");
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleOpenReportModal = (propId = "") => {
    setSelectedModalPropId(propId);
    setReportModalOpen(true);
  };

  useEffect(() => {
    const syncLiveData = () => {
      setClientProperties(getLiveProperties());
      setAssignedRequests(getLiveAgentRequests());
    };

    window.addEventListener("live_data_updated", syncLiveData);
    window.addEventListener("storage", syncLiveData);
    return () => {
      window.removeEventListener("live_data_updated", syncLiveData);
      window.removeEventListener("storage", syncLiveData);
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        {/* 1. BREADCRUMB & LIVE STATUS HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 dark:text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <Home size={14} className="text-blue-500 dark:text-cyan-400" />
            <span>/</span>
            <span className="text-slate-900 dark:text-[#F8FAFC] font-extrabold">
              Real Estate Agent Workstation
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono font-bold text-[11px] border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AGENT PIPELINE ONLINE
          </span>
        </div>

        {/* 2. WELCOME HERO SECTION */}
        <DashboardHeroHeader userName={userName} userRole={userRole} />

        {/* 3. STATISTICS KPI CARDS (6 Reusable Cards Grid) */}
        <KPIDashboardCards />

        {/* 4. QUICK ACTIONS */}
        <QuickActions
          title="Agent Quick Workflows"
          subtitle="Manage client portfolios, schedule due diligence audits, and generate legal reports."
          actions={agentDashboardData.quickActions}
        />

        {/* 5. TODAY'S TASKS & RECENT CLIENT REQUESTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Today's Tasks (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider block">
                  DAILY AGENDA
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <ClipboardList size={18} className="text-blue-600 dark:text-cyan-400" /> Today's Tasks
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    t.completed
                      ? "bg-slate-50/50 dark:bg-[#0F172A]/50 border-slate-200 dark:border-[#334155] opacity-75"
                      : "bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-[#334155] hover:border-blue-400"
                  }`}
                >
                  <button className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-400">
                    {t.completed ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-400" />}
                  </button>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                        {t.client}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={t.priority === "HIGH" ? "danger" : "info"} className="text-[9px]">
                          {t.priority}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> {t.dueTime}
                        </span>
                      </div>
                    </div>
                    <h3 className={`text-xs font-extrabold ${t.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                      {t.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Client Requests (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  CLIENT AUDIT INQUIRIES
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <Users size={18} className="text-purple-600 dark:text-purple-400" /> Recent Client Requests
                </h2>
              </div>
              <button
                onClick={() => navigate("/agent/clients")}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                View Pipeline
              </button>
            </div>

            <div className="space-y-3">
              {agentDashboardData.assignedRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] space-y-2 hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                      {req.id} • {req.client}
                    </span>
                    <Badge variant={req.priority === "HIGH" ? "danger" : "warning"} className="text-[9px]">
                      {req.priority} PRIORITY
                    </Badge>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{req.property}</h4>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#334155] text-[11px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">{req.requestType}</span>
                    <span className="text-slate-400">Due: {req.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. RECENT REPORTS & NOTIFICATIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Recent Reports (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  AGENT REPORT VAULT
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <FileText size={18} className="text-emerald-600 dark:text-emerald-400" /> Recent Reports
                </h2>
              </div>
              <button
                onClick={() => navigate("/report-history")}
                className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Report Vault
              </button>
            </div>

            <div className="space-y-3">
              {agentDashboardData.recentReports.map((rpt) => (
                <div
                  key={rpt.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] flex items-center justify-between gap-4 hover:border-emerald-400 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {rpt.id} • {rpt.date}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{rpt.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{rpt.property} ({rpt.client})</p>
                  </div>
                  <button
                    onClick={() => handleOpenReportModal("1001")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0"
                  >
                    <FileDown size={14} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications (6 Cols) */}
          <div className="lg:col-span-6 white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  AGENT ALERTS
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <Bell size={18} className="text-amber-600 dark:text-amber-400" /> Notifications Feed
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
              {agentDashboardData.agentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => navigate("/notifications")}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] space-y-1.5 hover:border-amber-400 transition-colors cursor-pointer"
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

        {/* 7. PROPERTY PERFORMANCE SECTION */}
        <div className="white-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                PORTFOLIO VELOCITY & MARKET DEMAND
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <TrendingUp size={20} className="text-cyan-600 dark:text-cyan-400" /> Property Performance Analytics
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Updated Live • 3 Active Managed Parcels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentDashboardData.propertyPerformance.map((perf) => (
              <div
                key={perf.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] space-y-3 hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase">
                    LISTING ANALYTICS
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    {perf.marketDemand}
                  </Badge>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">
                  {perf.propertyName}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Valuation</span>
                    <strong className="text-blue-600 dark:text-cyan-400 font-extrabold text-sm">{perf.price}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Inquiries</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-bold">{perf.inquiries} Clients</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                  <span>Risk Index: <strong className="text-emerald-600">{perf.riskScore} / 100</strong></span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{perf.speed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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

export default AgentDashboard;
