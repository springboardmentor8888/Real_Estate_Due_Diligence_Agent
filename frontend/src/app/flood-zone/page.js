"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Waves,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Droplets,
  CloudRain,
  ShieldAlert,
  ArrowUpRight,
  Download,
  FileSpreadsheet
} from "lucide-react";
import "./flood-zone.css";

export default function FloodZonePage() {
  const [selectedProperty, setSelectedProperty] = useState("prop1");

  const properties = [
    { id: "prop1", name: "Luxury Villa - Anna Nagar, Chennai", zone: "Zone X (Minimal Risk)" },
    { id: "prop2", name: "Modern Apartment - Indiranagar, Bangalore", zone: "Zone X (Minimal Risk)" },
    { id: "prop3", name: "Independent House - RS Puram, Coimbatore", zone: "Zone AE (Moderate Risk)" }
  ];

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

      <main className="flood-page">
        {/* Header */}
        <header className="flood-header">
          <div className="flood-title-area">
            <h1>Flood Risk & Hydrological Assessment</h1>
            <p>FEMA & Municipal hydrological risk analysis, flood plain zoning, and property elevation safety profile.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select
              style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.zone})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Overview Banner */}
        <section className="risk-banner">
          <div className="risk-meter-box">
            <div className="meter-circle">
              <span className="meter-score">2/10</span>
              <span className="meter-max">LOW RISK</span>
            </div>
            <div className="risk-level-badge">
              <ShieldCheck size={16} />
              Minimal Flood Risk
            </div>
          </div>

          <div className="risk-details-content">
            <div className="zone-cat-header">
              <span className="zone-tag-lg">FLOOD ZONE X</span>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                FEMA FIRM Panel #33001C0210F
              </span>
            </div>

            <h2>Zone X (500-Year Floodplain - Minimal Hazard)</h2>
            <p>
              This parcel is located in Zone X, determined to be outside the 100-year flood zone and above the 500-year principal flood level. Mandatory flood insurance coverage is NOT required for mortgage qualification.
            </p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                className="btn-primary"
                style={{ width: "auto", padding: "10px 20px", fontSize: "14px" }}
                onClick={() => alert("Downloading official Hydrological Elevation Certificate...")}
              >
                <Download size={16} /> Download Flood Certificate
              </button>
            </div>
          </div>
        </section>

        {/* Key Risk Metrics */}
        <section className="risk-metrics-grid">
          <div className="risk-metric-card">
            <span className="metric-label-sm">Flood Zone Classification</span>
            <span className="metric-val-main" style={{ color: "#2563eb" }}>Zone X</span>
            <span className="metric-desc-sm">Minimal Hazard Area</span>
          </div>

          <div className="risk-metric-card">
            <span className="metric-label-sm">Base Flood Elevation (BFE)</span>
            <span className="metric-val-main">+14.2 ft</span>
            <span className="metric-desc-sm">Above Mean Sea Level (MSL)</span>
          </div>

          <div className="risk-metric-card">
            <span className="metric-label-sm">Mandatory Insurance</span>
            <span className="metric-val-main" style={{ color: "#10b981" }}>Not Required</span>
            <span className="metric-desc-sm">Optional Voluntary Coverage</span>
          </div>

          <div className="risk-metric-card">
            <span className="metric-label-sm">Nearest Water Body</span>
            <span className="metric-val-main">2.4 km</span>
            <span className="metric-desc-sm">Cooum River Buffer Line</span>
          </div>
        </section>

        {/* Safety & Mitigation Measures + Timeline */}
        <section className="safety-grid">
          {/* Mitigation measures */}
          <div className="safety-card">
            <div className="safety-card-title">
              <ShieldCheck className="text-primary" size={22} />
              Property Resilience & Infrastructure
            </div>

            <div className="mitigation-list">
              <div className="mitigation-item">
                <CheckCircle2 className="mitigation-icon" size={18} />
                <div>
                  <div className="mitigation-title">Plinth & Foundation Elevation</div>
                  <div className="mitigation-sub">Ground level raised 3.5 ft above road level to prevent flash runoff entry.</div>
                </div>
              </div>

              <div className="mitigation-item">
                <CheckCircle2 className="mitigation-icon" size={18} />
                <div>
                  <div className="mitigation-title">Subsurface Stormwater Drainage</div>
                  <div className="mitigation-sub">Equipped with heavy-capacity storm channels connected to main municipal arterial drains.</div>
                </div>
              </div>

              <div className="mitigation-item">
                <CheckCircle2 className="mitigation-icon" size={18} />
                <div>
                  <div className="mitigation-title">Dual Sump & Backflow Valves</div>
                  <div className="mitigation-sub">Non-return sewage valves installed to prevent backflow during severe rainfall.</div>
                </div>
              </div>

              <div className="mitigation-item">
                <CheckCircle2 className="mitigation-icon" size={18} />
                <div>
                  <div className="mitigation-title">Emergency Generator Elevation</div>
                  <div className="mitigation-sub">Electrical transformers and backup diesel generators installed on 1st-floor mezzanine.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Disaster / Rain Events */}
          <div className="safety-card">
            <div className="safety-card-title">
              <CloudRain className="text-primary" size={22} />
              Historical Heavy Rainfall Impact Log
            </div>

            <div className="timeline-list">
              <div className="timeline-item">
                <span className="timeline-year">2023</span>
                <div className="timeline-info">
                  <div className="timeline-event-name">Cyclone Michaung (380mm Rainfall)</div>
                  <div className="timeline-outcome">✅ Zero structural flooding. Road cleared within 4 hours.</div>
                </div>
              </div>

              <div className="timeline-item">
                <span className="timeline-year">2021</span>
                <div className="timeline-info">
                  <div className="timeline-event-name">Monsoon Inundation Spill</div>
                  <div className="timeline-outcome">✅ Water logged on street for 2 hours; plot stayed completely dry.</div>
                </div>
              </div>

              <div className="timeline-item">
                <span className="timeline-year">2015</span>
                <div className="timeline-info">
                  <div className="timeline-event-name">Chennai Historic Deluge</div>
                  <div className="timeline-outcome">✅ No water ingress into building premises (Elevated Foundation).</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    </ProtectedRoute>
  );
}
