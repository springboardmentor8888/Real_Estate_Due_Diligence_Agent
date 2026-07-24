"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Layers,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Ruler,
  ShieldCheck,
  Compass,
  MapPin,
  FileCheck,
  Maximize2
} from "lucide-react";
import "./zoning.css";

export default function ZoningPage() {
  const [selectedProperty, setSelectedProperty] = useState("prop1");

  const properties = [
    { id: "prop1", title: "Luxury Villa", location: "Anna Nagar, Chennai, TN", code: "R-2 Medium Density" },
    { id: "prop2", title: "Modern Apartment", location: "Indiranagar, Bangalore, KA", code: "C-1 Commercial Mixed" },
    { id: "prop3", title: "Independent House", location: "RS Puram, Coimbatore, TN", code: "R-1 Low Density" }
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <main className="zoning-page">
        {/* Header */}
        <header className="zoning-header">
          <div className="zoning-title-area">
            <h1>Property Zoning & Land Use Dashboard</h1>
            <p>Comprehensive analysis of municipal zoning classifications, land usage permits, and building density limits.</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="zoning-badge-header">
              <ShieldCheck size={18} />
              CMDA Verified Zoning
            </div>
            <select
              style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {p.code}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Dashboard Top Banner */}
        <section className="zoning-banner-card">
          <div className="zoning-main-info">
            <span className="zone-code-tag">ZONING CATEGORY: RES-R2-A</span>
            <h2>R-2 Medium Density Residential Zone</h2>
            <p>
              Designated for primary residential use allowing single-family houses, semi-detached villas, duplex apartments,
              and low-rise multi-family residential structures up to 4 stories (15 meters).
            </p>

            <div className="banner-meta-list">
              <div className="banner-meta-item">
                <span className="meta-label">Planning Authority</span>
                <span className="meta-val">CMDA Chennai Authority</span>
              </div>
              <div className="banner-meta-item">
                <span className="meta-label">Master Plan Revision</span>
                <span className="meta-val">Second Master Plan 2026</span>
              </div>
              <div className="banner-meta-item">
                <span className="meta-label">Parcel Identifier</span>
                <span className="meta-val">Block 14 / Survey #204</span>
              </div>
            </div>
          </div>

          <div className="banner-status-box">
            <div className="compliance-status-tag">
              <CheckCircle size={20} />
              100% Zoning Compliant
            </div>
            <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
              Existing structure and intended usage adhere strictly to municipal set-backs and density parameters.
            </p>
            <button
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                fontSize: "13px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: "var(--radius-md)"
              }}
              onClick={() => alert("Downloading official Zoning Classification Certificate PDF...")}
            >
              Download Certificate
            </button>
          </div>
        </section>

        {/* Dimensional & Density Metrics Row */}
        <section className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Max Permissible FAR</span>
            <span className="metric-value-huge">1.75</span>
            <span className="metric-sub">Floor Area Ratio Allowed</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Max Height Limit</span>
            <span className="metric-value-huge">45 ft</span>
            <span className="metric-sub">Up to 4 Storeys / Stilt + 3</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Max Ground Coverage</span>
            <span className="metric-value-huge">60%</span>
            <span className="metric-sub">Max Builtup Area of Plot</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Min Plot Area Required</span>
            <span className="metric-value-huge">2,400</span>
            <span className="metric-sub">Sq. Ft. minimum plot size</span>
          </div>
        </section>

        {/* Two-Column Detail Grid */}
        <div className="dashboard-grid">
          {/* Permitted & Restricted Usages */}
          <div className="dashboard-card">
            <div className="card-heading">
              <Building className="text-primary" size={22} />
              Permitted & Restricted Usage Rules
            </div>

            <div className="usage-list">
              <div className="usage-item permitted">
                <CheckCircle className="usage-icon" size={18} />
                <div>
                  <div className="usage-title">Primary Residential Dwelling</div>
                  <div className="usage-desc">Single-family homes, independent villas, semi-detached houses & row houses.</div>
                </div>
              </div>

              <div className="usage-item permitted">
                <CheckCircle className="usage-icon" size={18} />
                <div>
                  <div className="usage-title">Home Office & Professional Consultancy</div>
                  <div className="usage-desc">Doctor clinics, advocate chambers, or IT workspace (Max 25% of total floor space).</div>
                </div>
              </div>

              <div className="usage-item conditional">
                <AlertCircle className="usage-icon" size={18} />
                <div>
                  <div className="usage-title">Daycare / Play School (Special Permit)</div>
                  <div className="usage-desc">Allowed only with prior NOC from local zonal traffic and municipal authority.</div>
                </div>
              </div>

              <div className="usage-item prohibited">
                <XCircle className="usage-icon" size={18} />
                <div>
                  <div className="usage-title">Heavy Commercial & Industrial Activity</div>
                  <div className="usage-desc">Warehouses, manufacturing plants, auto repair garages & noisy commercial units are strictly prohibited.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Setback Requirements & Boundary Simulation */}
          <div className="dashboard-card">
            <div className="card-heading">
              <Ruler className="text-primary" size={22} />
              Mandatory Setback Requirements
            </div>

            <div className="setback-grid">
              <div className="setback-box">
                <span className="setback-label">Front Setback (Road Facing)</span>
                <span className="setback-value">20.0 ft</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Min distance from road center</span>
              </div>

              <div className="setback-box">
                <span className="setback-label">Rear Boundary Setback</span>
                <span className="setback-value">15.0 ft</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Backyard buffer requirement</span>
              </div>

              <div className="setback-box">
                <span className="setback-label">Side Setback (Left)</span>
                <span className="setback-value">10.0 ft</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Side clearance for light & air</span>
              </div>

              <div className="setback-box">
                <span className="setback-label">Side Setback (Right)</span>
                <span className="setback-value">10.0 ft</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Side clearance for drainage</span>
              </div>
            </div>

            {/* Interactive Overlay & Variance Status */}
            <div style={{ background: "var(--bg-main)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: "700", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileCheck size={16} className="text-primary" />
                Overlay District & Special Regulation
              </div>
              <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <li>Heritage Zone Clearance: Not Required (Clear of heritage sites)</li>
                <li>Coastal Regulation Zone (CRZ): Outside Restricted CRZ Tier</li>
                <li>Airport Height Clearance: Approved (Up to 60m height allowed in zone)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map Boundary Visualizer Widget */}
        <section className="map-simulation-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Compass size={22} className="text-primary" />
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Spatial GIS Zoning Boundary</h3>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>Plot Boundary Survey #204 - Anna Nagar East</span>
              </div>
            </div>
            <button
              style={{ width: "auto", padding: "8px 16px", background: "#334155", color: "#fff", fontSize: "13px", border: "1px solid #475569" }}
              onClick={() => alert("Expanding interactive GIS layer...")}
            >
              <Maximize2 size={14} style={{ marginRight: "6px" }} /> Expand GIS Map
            </button>
          </div>

          <div className="simulated-map-view">
            <div className="zone-plot-overlay">
              Plot #204 (R-2)
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>📍 Coordinates: 13.0827° N, 80.2707° E</div>
          </div>

          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#6366f1" }}></span>
              Property Parcel Boundary
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#10b981" }}></span>
              Approved Building Footprint
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#f59e0b" }}></span>
              Setback Line Clearance
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
