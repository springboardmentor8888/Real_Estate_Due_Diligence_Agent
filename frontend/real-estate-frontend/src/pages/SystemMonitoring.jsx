import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import {
  Server,
  Database,
  Globe,
  HardDrive,
  Cpu,
  Activity,
  Clock,
  Code,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Radio,
  Layers,
  Sparkles,
  Download,
} from "lucide-react";
import { exportToPdf } from "../utils/exportUtils";
import { showSuccessAlert, showToast } from "../utils/swal";

function SystemMonitoring() {
  // Live Simulated Metrics State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  // Dynamic Telemetry Metrics
  const [metrics, setMetrics] = useState({
    cpuUsage: 24.5,
    memoryUsageGB: 6.4,
    memoryTotalGB: 16.0,
    memoryPercent: 40.0,
    storageUsageGB: 142.8,
    storageTotalGB: 500.0,
    storagePercent: 28.5,
    apiLatencyMs: 42,
    dbLatencyMs: 4,
    uptimeDays: 142,
    uptimeHours: 18,
    uptimeMins: 32,
    uptimePercent: 99.98,
    appVersion: "v2.4.0-enterprise",
    buildNumber: "Build 2026.08.05",
    backendStatus: "Operational",
    databaseStatus: "Operational",
    apiStatus: "Healthy",
  });

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        cpuUsage: +(Math.random() * 10 + 20).toFixed(1),
        memoryUsageGB: +(Math.random() * 0.8 + 6.0).toFixed(1),
        apiLatencyMs: Math.floor(Math.random() * 8 + 38),
        dbLatencyMs: Math.floor(Math.random() * 3 + 3),
      }));
      setIsRefreshing(false);
      setLastRefreshed("Just now");
      showToast("Live system telemetry refreshed", "success");
    }, 600);
  };

  const handleExportSystemHealth = () => {
    exportToPdf("System_Health_Telemetry_Report_2026", metrics);
    showSuccessAlert(
      "Telemetry Report Exported",
      "System health and server infrastructure telemetry PDF exported."
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16 font-mono text-xs">
        {/* HEADER BAR WITH LIVE STATUS INDICATOR */}
        <div className="glass-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Infrastructure Health & Server Telemetry
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              System Monitoring
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time server telemetry, JVM memory allocation, CPU load, PostgreSQL database cluster, and API gateway health.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefreshTelemetry}
              disabled={isRefreshing}
              className="py-2.5 px-3.5 rounded-2xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-500" : ""} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportSystemHealth}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Download size={14} />
              <span>Export Health PDF</span>
            </button>
          </div>
        </div>

        {/* 4 TOP CORE HEALTH CARDS WITH STATUS INDICATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CARD 1: BACKEND STATUS */}
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                <Server size={20} />
              </div>
              <Badge variant="success">Operational</Badge>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Backend API Gateway</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Spring Boot 3.2</h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} /> 99.98% SLA Uptime
              </span>
            </div>
          </div>

          {/* CARD 2: DATABASE STATUS */}
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Database size={20} />
              </div>
              <Badge variant="success">Operational</Badge>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Database Cluster</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">PostgreSQL 16.2</h2>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1 mt-1">
                <Zap size={12} /> {metrics.dbLatencyMs}ms Read/Write Latency
              </span>
            </div>
          </div>

          {/* CARD 3: API STATUS */}
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Globe size={20} />
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">3. REST & GraphQL API</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{metrics.apiLatencyMs} ms Response</h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-1">
                <Radio size={12} /> Zero Packet Loss
              </span>
            </div>
          </div>

          {/* CARD 4: SERVER UPTIME & VERSION */}
          <div className="white-card rounded-3xl p-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Clock size={20} />
              </div>
              <Badge variant="info">v2.4.0</Badge>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">7. Server Uptime & Version</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white mt-0.5 truncate">
                {metrics.uptimeDays}d {metrics.uptimeHours}h {metrics.uptimeMins}m
              </h2>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 block truncate">
                Build: {metrics.buildNumber}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS BARS SECTION (STORAGE, MEMORY, CPU USAGE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PROGRESS BAR 1: STORAGE USAGE */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                  <HardDrive size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">4. Storage Usage</h3>
                  <span className="text-[10px] text-slate-400">AWS S3 & Local Storage</span>
                </div>
              </div>
              <Badge variant="primary">{metrics.storagePercent}% Used</Badge>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-3 overflow-hidden border border-slate-200 dark:border-[#334155]">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.storagePercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span>{metrics.storageUsageGB} GB Used</span>
                <span>{metrics.storageTotalGB} GB Capacity</span>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR 2: MEMORY USAGE */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">5. Memory Usage</h3>
                  <span className="text-[10px] text-slate-400">JVM Heap Allocation</span>
                </div>
              </div>
              <Badge variant="info">{metrics.memoryPercent}% Used</Badge>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-3 overflow-hidden border border-slate-200 dark:border-[#334155]">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.memoryPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span>{metrics.memoryUsageGB} GB Allocated</span>
                <span>{metrics.memoryTotalGB} GB Total RAM</span>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR 3: CPU USAGE */}
          <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">6. CPU Usage</h3>
                  <span className="text-[10px] text-slate-400">8-Core Server Load</span>
                </div>
              </div>
              <Badge variant="success">{metrics.cpuUsage}% Load</Badge>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 dark:bg-[#0F172A] rounded-full h-3 overflow-hidden border border-slate-200 dark:border-[#334155]">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                <span>{metrics.cpuUsage}% Current Load</span>
                <span>8 vCPUs Dedicated</span>
              </div>
            </div>
          </div>
        </div>

        {/* APPLICATION VERSION & METADATA DETAILS CARD */}
        <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#334155] pb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Code size={18} className="text-blue-500" /> 8. Application Version & Environment Telemetry
            </h2>
            <Badge variant="primary">{metrics.appVersion}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Frontend Stack</span>
              <strong className="text-slate-900 dark:text-white mt-1 block">React 18 + Vite 8 + Tailwind</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Backend Framework</span>
              <strong className="text-slate-900 dark:text-white mt-1 block">Spring Boot 3.2.0 (Java 17)</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Database Cluster</span>
              <strong className="text-slate-900 dark:text-white mt-1 block">PostgreSQL 16.2 + Redis Cache</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Sub-Registrar Sync</span>
              <strong className="text-emerald-600 dark:text-emerald-400 mt-1 block">Connected (Live APN Stream)</strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SystemMonitoring;
