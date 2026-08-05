"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  FileCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Building,
  TreePine,
  Search,
  Check,
  FileText,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import "./permits.css";

export default function PermitsEnvironmentalPage() {
  const [activeTab, setActiveTab] = useState("permits");
  const [selectedProperty, setSelectedProperty] = useState("prop1");
  const [searchTerm, setSearchTerm] = useState("");

  const properties = [
    { id: "prop1", name: "Luxury Villa - Anna Nagar, Chennai" },
    { id: "prop2", name: "Modern Apartment - Indiranagar, Bangalore" },
    { id: "prop3", name: "Independent House - RS Puram, Coimbatore" }
  ];

  const permits = [
    {
      id: "PER-2023-8810",
      type: "Building & Structural Plan Approval",
      authority: "CMDA Chennai Corporation",
      status: "approved",
      issueDate: "2023-01-15",
      approvalDate: "2023-02-28",
      contractor: "Apex Structural Engineers Pvt Ltd",
      inspector: "S. Murugan (Senior Municipal Officer)",
      notes: "Complete structural drawings and load calculation approved."
    },
    {
      id: "PER-2023-9204",
      type: "Electrical Wiring & Load Clearance",
      authority: "TANGEDCO Electricity Board",
      status: "approved",
      issueDate: "2023-03-10",
      approvalDate: "2023-03-22",
      contractor: "ElectroTech Solutions",
      inspector: "K. Raman (TANGEDCO Electrical Inspector)",
      notes: "3-Phase 15kW transformer load connection passed safety test."
    },
    {
      id: "PER-2023-9551",
      type: "Sanitary & Water Connection Permit",
      authority: "CMWSSB Water Board",
      status: "approved",
      issueDate: "2023-04-05",
      approvalDate: "2023-04-18",
      contractor: "HydroFlow Plumbing Services",
      inspector: "M. Anitha (Water Inspector)",
      notes: "Sewer main hookup and rainwater harvesting pit verified."
    },
    {
      id: "PER-2023-9980",
      type: "Fire Safety No Objection Certificate (NOC)",
      authority: "Tamil Nadu Fire & Rescue Dept",
      status: "approved",
      issueDate: "2023-05-12",
      approvalDate: "2023-05-25",
      contractor: "SafeGuard Fire Protection",
      inspector: "R. Chief Officer Vijay",
      notes: "Fire hydrants, smoke detectors and emergency escape route verified."
    },
    {
      id: "PER-2023-9999",
      type: "Completion & Occupancy Certificate (CC)",
      authority: "Greater Chennai Corporation",
      status: "approved",
      issueDate: "2023-06-01",
      approvalDate: "2023-06-15",
      contractor: "Apex Structural Engineers",
      inspector: "Joint Municipal Inspection Committee",
      notes: "Final building completion certificate granted. Ready for occupancy."
    }
  ];

  const filteredPermits = permits.filter((p) =>
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
        <Navbar />

      <main className="permits-page">
        {/* Header */}
        <header className="permits-header">
          <div className="permits-title-area">
            <h1>Building Permits & Environmental Diligence</h1>
            <p>Verification of municipal construction permits, occupancy certificates, and Phase I Environmental Site Assessments (ESA).</p>
          </div>

          <div>
            <select
              style={{ padding: "10px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600" }}
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Stats Row */}
        <section className="permits-stats-grid">
          <div className="pstat-card">
            <div className="pstat-icon green">
              <FileCheck size={24} />
            </div>
            <div>
              <div className="pstat-title">Building Permits</div>
              <div className="pstat-val">5 / 5 Approved</div>
            </div>
          </div>

          <div className="pstat-card">
            <div className="pstat-icon blue">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="pstat-title">Occupancy Certificate</div>
              <div className="pstat-val" style={{ color: "#10b981" }}>Granted</div>
            </div>
          </div>

          <div className="pstat-card">
            <div className="pstat-icon purple">
              <TreePine size={24} />
            </div>
            <div>
              <div className="pstat-title">Phase I ESA Assessment</div>
              <div className="pstat-val" style={{ fontSize: "20px" }}>No Contamination</div>
            </div>
          </div>

          <div className="pstat-card">
            <div className="pstat-icon amber">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="pstat-title">Environmental Risk</div>
              <div className="pstat-val" style={{ color: "#10b981" }}>Low Risk (A+)</div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "permits" ? "active" : ""}`}
            onClick={() => setActiveTab("permits")}
          >
            <Building size={18} /> Building Permits (5)
          </button>
          <button
            className={`tab-btn ${activeTab === "environmental" ? "active" : ""}`}
            onClick={() => setActiveTab("environmental")}
          >
            <TreePine size={18} /> Environmental Risk & ESA Analysis
          </button>
        </div>

        {/* Tab 1: Building Permits */}
        {activeTab === "permits" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="tax-controls-bar">
              <div className="tax-search-box">
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search permits by name, authority or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>
                Showing {filteredPermits.length} municipal permits
              </div>
            </div>

            <div className="table-container">
              <table className="tax-table">
                <thead>
                  <tr>
                    <th>Permit ID</th>
                    <th>Permit Description</th>
                    <th>Approval Authority</th>
                    <th>Status</th>
                    <th>Approval Date</th>
                    <th>Contractor / Architect</th>
                    <th>Inspection Result</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPermits.map((permit) => (
                    <tr key={permit.id}>
                      <td className="year-cell" style={{ fontSize: "14px" }}>{permit.id}</td>
                      <td>
                        <div style={{ fontWeight: "700" }}>{permit.type}</div>
                        <div className="sub-text">Issue Date: {permit.issueDate}</div>
                      </td>
                      <td>{permit.authority}</td>
                      <td>
                        <span className={`permit-badge ${permit.status}`}>
                          <CheckCircle2 size={12} />
                          {permit.status}
                        </span>
                      </td>
                      <td>{permit.approvalDate}</td>
                      <td>{permit.contractor}</td>
                      <td>
                        <div style={{ fontSize: "13px", color: "#059669", fontWeight: "500" }}>
                          {permit.notes}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Environmental Analysis */}
        {activeTab === "environmental" && (
          <div className="env-grid">
            <div className="env-card">
              <div className="env-card-header">
                <TreePine className="text-primary" size={22} />
                Phase I Environmental Site Audit (ESA)
              </div>

              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                Conducted in accordance with ASTM E1527-21 standards to assess Recognized Environmental Conditions (RECs), historical land contamination, and soil toxicity.
              </p>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Soil & Heavy Metal Contamination</div>
                  <div className="env-item-sub">Tested for Lead, Arsenic & Hydrocarbons</div>
                </div>
                <span className="env-status-pill pass">PASSED (CLEAN)</span>
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Radon Gas Concentration</div>
                  <div className="env-item-sub">Measured 0.8 pCi/L (EPA Safe Limit &lt; 4.0)</div>
                </div>
                <span className="env-status-pill pass">PASSED (SAFE)</span>
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Lead Paint & Asbestos Hazard</div>
                  <div className="env-item-sub">Full building material lab audit completed</div>
                </div>
                <span className="env-status-pill pass">100% CLEAR</span>
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Underground Storage Tanks (UST)</div>
                  <div className="env-item-sub">No abandoned fuel/chemical tanks detected</div>
                </div>
                <span className="env-status-pill pass">NOT PRESENT</span>
              </div>
            </div>

            <div className="env-card">
              <div className="env-card-header">
                <ShieldAlert className="text-primary" size={22} />
                Proximity to Environmental Risk Sites
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Hazardous Industrial Waste Disposal</div>
                  <div className="env-item-sub">Nearest industrial zone located 8.5 km East</div>
                </div>
                <span className="env-status-pill clear">SAFE BUFFER</span>
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Groundwater Quality Assessment</div>
                  <div className="env-item-sub">TDS Level: 280 ppm (Potable / Clear)</div>
                </div>
                <span className="env-status-pill pass">EXCELLENT</span>
              </div>

              <div className="env-item-row">
                <div>
                  <div className="env-item-label">Ecological Wetland Buffer Zone</div>
                  <div className="env-item-sub">Outside protected sanctuary boundaries</div>
                </div>
                <span className="env-status-pill clear">CLEAR</span>
              </div>

              <div style={{ marginTop: "12px" }}>
                <button
                  className="btn-primary"
                  onClick={() => alert("Downloading Environmental Site Assessment (ESA) Audit Report PDF...")}
                >
                  <Download size={16} /> Download Full ESA Audit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
}
