"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Hash,
  Building2,
  ArrowLeft,
  Play,
  RefreshCw,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { apiFetch } from "../../../lib/api";
import "./property-details.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  HIGH: { cls: "severity-high", icon: <XCircle size={14} />, label: "High" },
  MEDIUM: { cls: "severity-medium", icon: <AlertTriangle size={14} />, label: "Medium" },
  LOW: { cls: "severity-low", icon: <AlertCircle size={14} />, label: "Low" },
};

const RISK_CONFIG = {
  HIGH_RISK: { cls: "risk-high", label: "High Risk", icon: <XCircle size={16} /> },
  CONCERNS_FOUND: { cls: "risk-medium", label: "Concerns Found", icon: <AlertTriangle size={16} /> },
  LOW: { cls: "risk-low", label: "Low Risk", icon: <CheckCircle2 size={16} /> },
  CLEAR: { cls: "risk-low", label: "Clear", icon: <CheckCircle2 size={16} /> },
};

const DD_STATUS_CONFIG = {
  NOT_STARTED: { cls: "status-pending", label: "Not Started", icon: <Clock size={14} /> },
  IN_PROGRESS: { cls: "status-inprogress", label: "In Progress", icon: <Loader2 size={14} className="spin" /> },
  COMPLETED: { cls: "status-done", label: "Completed", icon: <CheckCircle2 size={14} /> },
  FAILED: { cls: "status-failed", label: "Failed", icon: <XCircle size={14} /> },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [ownership, setOwnership] = useState([]);
  const [publicRecords, setPublicRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ddRunning, setDdRunning] = useState(false);
  const [ddResult, setDdResult] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [propInfo, ownershipData, pubData] = await Promise.all([
        apiFetch(`/api/property-information/${id}`),
        apiFetch(`/api/public-records/${id}/ownership`),
        apiFetch(`/api/public-records/${id}/records`),
      ]);
      setProperty(propInfo);
      setOwnership(Array.isArray(ownershipData) ? ownershipData : []);
      setPublicRecords(Array.isArray(pubData) ? pubData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const runDueDiligence = async () => {
    setDdRunning(true);
    setDdResult(null);
    try {
      const result = await apiFetch(`/api/due-diligence/${id}/process`, {
        method: "POST",
      });
      setDdResult({ success: true, status: result.status });
      // Refresh property info to get updated status
      const updated = await apiFetch(`/api/property-information/${id}`);
      setProperty(updated);
    } catch (err) {
      setDdResult({ success: false, message: err.message });
    } finally {
      setDdRunning(false);
    }
  };

  const riskCfg = RISK_CONFIG[property?.riskLevel] || RISK_CONFIG["CLEAR"];
  const ddCfg = DD_STATUS_CONFIG[property?.dueDiligenceStatus] || DD_STATUS_CONFIG["NOT_STARTED"];

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
        <Navbar />
        <div className="pd-loading">
          <div className="pd-loading-spinner" />
          <p>Loading property details…</p>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
        <Navbar />
        <div className="pd-error-page">
          <AlertTriangle size={48} style={{ color: "var(--danger)" }} />
          <h2>Failed to load property</h2>
          <p>{error}</p>
          <div className="pd-error-actions">
            <button className="pd-retry-btn" onClick={loadData}>
              <RefreshCw size={16} /> Retry
            </button>
            <Link href="/explore" className="pd-back-link">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="pd-page">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link href="/explore" className="pd-breadcrumb-link">
            Dashboard
          </Link>
          <ChevronRight size={14} />
          <span>Property #{id}</span>
        </nav>

        {/* Hero Header */}
        <div className="pd-hero">
          <div className="pd-hero-left">
            <div className="pd-hero-icon">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="pd-hero-title">
                {property?.propertyName || `Property #${id}`}
              </h1>
              <p className="pd-hero-address">
                <MapPin size={16} />
                {[property?.address, property?.city, property?.state, property?.zipCode]
                  .filter(Boolean)
                  .join(", ") || "Address not available"}
              </p>
              <div className="pd-hero-chips">
                <span className="pd-chip pd-chip-type">
                  {property?.propertyType || "Property"}
                </span>
                <span className={`pd-chip ${riskCfg.cls}`}>
                  {riskCfg.icon}
                  {riskCfg.label}
                  {property?.riskScore != null && ` (Score: ${property.riskScore})`}
                </span>
                <span className={`pd-chip ${ddCfg.cls}`}>
                  {ddCfg.icon}
                  {ddCfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Run Due Diligence Button */}
          <div className="pd-hero-actions">
            <button
              className="pd-dd-btn"
              onClick={runDueDiligence}
              disabled={ddRunning}
            >
              {ddRunning ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={18} />
                  Run Due Diligence
                </>
              )}
            </button>
            {ddResult && (
              <div
                className={`pd-dd-result ${
                  ddResult.success ? "dd-success" : "dd-failure"
                }`}
              >
                {ddResult.success ? (
                  <>
                    <CheckCircle2 size={14} />
                    Completed — Status: {ddResult.status}
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    {ddResult.message}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pd-content-grid">
          {/* ── Ownership History ─────────────────────────────────────────── */}
          <section className="pd-card pd-full-width">
            <div className="pd-card-header">
              <User size={20} />
              <h2>Ownership History</h2>
              <span className="pd-badge">{ownership.length}</span>
            </div>

            {ownership.length === 0 ? (
              <div className="pd-empty-section">
                <p>No ownership records found.</p>
              </div>
            ) : (
              <div className="pd-table-wrapper">
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>Owner Name</th>
                      <th>Type</th>
                      <th>Acquired</th>
                      <th>Released</th>
                      <th>Purchase Price</th>
                      <th>Deed Ref</th>
                      <th>Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ownership.map((rec, idx) => (
                      <tr key={idx} className={rec.currentOwner ? "row-current" : ""}>
                        <td className="td-name">
                          <User size={14} />
                          {rec.ownerName || "—"}
                        </td>
                        <td>
                          <span className="td-tag">{rec.ownerType || "—"}</span>
                        </td>
                        <td>{formatDate(rec.acquisitionDate)}</td>
                        <td>{rec.releaseDate ? formatDate(rec.releaseDate) : "Present"}</td>
                        <td>
                          {rec.purchasePrice != null
                            ? `$${rec.purchasePrice.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="td-mono">{rec.deedReference || "—"}</td>
                        <td>
                          {rec.currentOwner ? (
                            <span className="current-badge">
                              <CheckCircle2 size={12} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Public Records ────────────────────────────────────────────── */}
          <section className="pd-card pd-full-width">
            <div className="pd-card-header">
              <FileText size={20} />
              <h2>Public Records</h2>
              <span className="pd-badge">{publicRecords.length}</span>
            </div>

            {publicRecords.length === 0 ? (
              <div className="pd-empty-section">
                <p>No public records found.</p>
              </div>
            ) : (
              <div className="pd-table-wrapper">
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Filed</th>
                      <th>Resolved</th>
                      <th>Authority</th>
                      <th>Ref #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicRecords.map((rec, idx) => {
                      const sev =
                        SEVERITY_CONFIG[rec.severity?.toUpperCase()] ||
                        SEVERITY_CONFIG["LOW"];
                      return (
                        <tr key={idx}>
                          <td>
                            <span className="td-tag">{rec.recordType || "—"}</span>
                          </td>
                          <td className="td-title">{rec.title || rec.description || "—"}</td>
                          <td>
                            <span className={`severity-badge ${sev.cls}`}>
                              {sev.icon}
                              {sev.label}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-chip ${
                                rec.status === "ACTIVE"
                                  ? "chip-active"
                                  : "chip-resolved"
                              }`}
                            >
                              {rec.status || "—"}
                            </span>
                          </td>
                          <td>{formatDate(rec.filingDate)}</td>
                          <td>{rec.resolutionDate ? formatDate(rec.resolutionDate) : "—"}</td>
                          <td>{rec.authority || "—"}</td>
                          <td className="td-mono">{rec.referenceNumber || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Property Meta ─────────────────────────────────────────────── */}
          <section className="pd-card">
            <div className="pd-card-header">
              <Hash size={20} />
              <h2>Property Details</h2>
            </div>
            <div className="pd-meta-grid">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Property ID</span>
                <span className="pd-meta-value">#{property?.propertyId}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Owner Name</span>
                <span className="pd-meta-value">{property?.ownerName || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Type</span>
                <span className="pd-meta-value">{property?.propertyType || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">ZIP Code</span>
                <span className="pd-meta-value">{property?.zipCode || "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Risk Score</span>
                <span className="pd-meta-value">{property?.riskScore ?? "—"}</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Added On</span>
                <span className="pd-meta-value">
                  {property?.createdDate ? formatDate(property.createdDate) : "—"}
                </span>
              </div>
            </div>
          </section>

          {/* ── Quick Links ───────────────────────────────────────────────── */}
          <section className="pd-card">
            <div className="pd-card-header">
              <Calendar size={20} />
              <h2>More Actions</h2>
            </div>
            <div className="pd-action-links">
              <Link href={`/report?propertyId=${id}`} className="pd-action-link">
                <FileText size={16} />
                View Full Report
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
              <Link href="/notifications" className="pd-action-link">
                <AlertCircle size={16} />
                View Notifications
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
              <Link href="/explore" className="pd-action-link">
                <ArrowLeft size={16} />
                Back to Dashboard
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
