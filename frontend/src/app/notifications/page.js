"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building2,
  FileText,
  ChevronRight,
  RefreshCw,
  Loader2,
  BellOff,
  Check,
} from "lucide-react";
import { apiFetch } from "../../lib/api";
import "./notifications.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Generate notifications from property + risk data
function buildNotifications(properties, reports) {
  const notifs = [];
  const base = Date.now();

  // System notification
  notifs.push({
    id: "sys-welcome",
    type: "INFO",
    title: "Welcome to Diligence Agent",
    message: "Your dashboard is live. Start analyzing properties to receive risk alerts.",
    propertyId: null,
    propertyName: null,
    ts: base - 2 * 60 * 1000,
    read: false,
  });

  properties.forEach((p, idx) => {
    const report = reports[p.propertyId];
    const offset = (idx + 1) * 8 * 60 * 1000;

    if (!report) {
      // No report yet
      notifs.push({
        id: `notif-nodd-${p.propertyId}`,
        type: "INFO",
        title: `Property #${p.propertyId} — Due Diligence Pending`,
        message: `"${p.propertyName || "Unnamed Property"}" has not been analyzed yet. Run a due diligence check to get a risk assessment.`,
        propertyId: p.propertyId,
        propertyName: p.propertyName,
        ts: base - offset,
        read: false,
      });
      return;
    }

    const flag = report.overallRiskFlag;
    if (flag === "HIGH_RISK") {
      notifs.push({
        id: `notif-hr-${p.propertyId}`,
        type: "DANGER",
        title: `⚠️ High Risk Alert — ${p.propertyName || `Property #${p.propertyId}`}`,
        message: `This property has ${report.activePublicRecordsCount} active high-severity record(s) or delinquent tax. Immediate review recommended.`,
        propertyId: p.propertyId,
        propertyName: p.propertyName,
        ts: base - offset,
        read: false,
      });
    } else if (flag === "CONCERNS_FOUND") {
      notifs.push({
        id: `notif-cf-${p.propertyId}`,
        type: "WARNING",
        title: `Concerns Detected — ${p.propertyName || `Property #${p.propertyId}`}`,
        message: `Medium-severity public records found: ${report.activePublicRecordsCount} active issue(s). Review the full report before proceeding.`,
        propertyId: p.propertyId,
        propertyName: p.propertyName,
        ts: base - offset,
        read: false,
      });
    } else {
      notifs.push({
        id: `notif-clear-${p.propertyId}`,
        type: "SUCCESS",
        title: `All Clear — ${p.propertyName || `Property #${p.propertyId}`}`,
        message: `Due diligence completed. No active liens, violations, or delinquent taxes detected.`,
        propertyId: p.propertyId,
        propertyName: p.propertyName,
        ts: base - offset,
        read: true,
      });
    }
  });

  return notifs.sort((a, b) => b.ts - a.ts);
}

const TYPE_CONFIG = {
  DANGER: {
    cls: "notif-danger",
    icon: <XCircle size={20} />,
    dotCls: "dot-danger",
  },
  WARNING: {
    cls: "notif-warning",
    icon: <AlertTriangle size={20} />,
    dotCls: "dot-warning",
  },
  SUCCESS: {
    cls: "notif-success",
    icon: <CheckCircle2 size={20} />,
    dotCls: "dot-success",
  },
  INFO: {
    cls: "notif-info",
    icon: <AlertCircle size={20} />,
    dotCls: "dot-info",
  },
};

const FILTERS = ["All", "Unread", "Alerts"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const props = await apiFetch("/api/properties");
      const propList = Array.isArray(props) ? props : [];

      // Fetch combined reports for all properties in parallel (ignore failures)
      const reportMap = {};
      await Promise.allSettled(
        propList.map(async (p) => {
          try {
            const r = await apiFetch(
              `/api/public-records/${p.propertyId}/combined-report`
            );
            reportMap[p.propertyId] = r;
          } catch (_) {
            // No report available for this property
          }
        })
      );

      setNotifications(buildNotifications(propList, reportMap));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "Unread") return !n.read;
    if (filter === "Alerts") return n.type === "DANGER" || n.type === "WARNING";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const alertCount = notifications.filter(
    (n) => n.type === "DANGER" || n.type === "WARNING"
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <Navbar />

      <div className="nf-page">
        {/* Header */}
        <div className="nf-header">
          <div className="nf-header-left">
            <div className="nf-header-icon">
              <Bell size={28} />
              {unreadCount > 0 && (
                <span className="nf-header-badge">{unreadCount}</span>
              )}
            </div>
            <div>
              <h1 className="nf-title">Notifications</h1>
              <p className="nf-subtitle">
                Risk alerts and updates for your property portfolio.
              </p>
            </div>
          </div>
          <div className="nf-header-actions">
            {unreadCount > 0 && (
              <button className="nf-mark-all-btn" onClick={markAllRead}>
                <Check size={14} />
                Mark all as read
              </button>
            )}
            <button className="nf-refresh-btn" onClick={loadData}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="nf-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`nf-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="nf-tab-count">{unreadCount}</span>
              )}
              {f === "Alerts" && alertCount > 0 && (
                <span className="nf-tab-count nf-tab-count-alert">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="nf-loading">
            <Loader2 size={32} className="spin" />
            <p>Fetching property alerts…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="nf-error">
            <AlertTriangle size={20} />
            <div>
              <strong>Could not load notifications</strong>
              <p>{error}</p>
            </div>
            <button className="nf-retry-btn" onClick={loadData}>
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="nf-empty">
            <BellOff size={48} />
            <h3>
              {filter === "Unread"
                ? "All caught up!"
                : filter === "Alerts"
                ? "No active alerts"
                : "No notifications yet"}
            </h3>
            <p>
              {filter === "Unread"
                ? "You have no unread notifications."
                : filter === "Alerts"
                ? "All properties are clear — no risk alerts at this time."
                : "Add properties and run due diligence to start receiving alerts."}
            </p>
          </div>
        )}

        {/* Notification List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="nf-list">
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG["INFO"];
              return (
                <div
                  key={n.id}
                  className={`nf-item ${cfg.cls} ${n.read ? "nf-read" : "nf-unread"}`}
                  onClick={() => markRead(n.id)}
                >
                  {/* Unread Dot */}
                  {!n.read && <span className={`nf-dot ${cfg.dotCls}`} />}

                  {/* Icon */}
                  <div className={`nf-icon-wrap ${cfg.cls}`}>{cfg.icon}</div>

                  {/* Content */}
                  <div className="nf-content">
                    <div className="nf-content-header">
                      <p className="nf-item-title">{n.title}</p>
                      <span className="nf-ts">{timeAgo(n.ts)}</span>
                    </div>
                    <p className="nf-item-msg">{n.message}</p>

                    {n.propertyId && (
                      <div className="nf-item-actions">
                        <Link
                          href={`/properties/${n.propertyId}`}
                          className="nf-action-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Building2 size={13} />
                          View Property
                          <ChevronRight size={12} />
                        </Link>
                        <Link
                          href={`/report?propertyId=${n.propertyId}`}
                          className="nf-action-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText size={13} />
                          Full Report
                          <ChevronRight size={12} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
