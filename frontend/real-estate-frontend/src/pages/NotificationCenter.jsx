import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { Bell, CheckCheck } from "lucide-react";

function NotificationCenter() {
  const [notifications] = useState([]);

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Action Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-[#334155] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold mb-3">
              <Bell size={14} /> Real-Time System Feeds
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              🔔 Notification & Alert Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
              Track property updates, risk score adjustments, tax receipts, and report generation triggers.
            </p>
          </div>
        </div>

        {/* Notification Container / Clean Empty State */}
        <div className="white-card rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] shadow-xs">
          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications available."
              message="No active system alerts or notifications were returned by the backend."
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((n, idx) => (
                <div key={idx} className="p-3 text-xs border border-slate-200 rounded-xl">
                  {n.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default NotificationCenter;
