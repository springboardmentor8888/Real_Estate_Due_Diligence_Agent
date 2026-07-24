"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Building2,
  DollarSign,
  Calendar,
  User,
  LayoutGrid,
  List
} from "lucide-react";
import "./tax-history.css";

export default function TaxHistoryPage() {
  const [selectedProperty, setSelectedProperty] = useState("prop1");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");

  // Mock property tax dataset
  const taxRecords = [
    {
      id: "TX-2025-001",
      year: "2025",
      taxAmount: "₹42,500",
      assessedValue: "₹85,00,000",
      status: "paid",
      owner: "Madhumitha R",
      dueDate: "2025-03-31",
      paidDate: "2025-02-14",
      receiptNo: "RCP-2025-98421",
      discountPenalty: "- ₹1,250 (Early Bird Rebate)",
      breakdown: {
        municipalTax: "₹28,000",
        educationCess: "₹4,500",
        waterSewer: "₹6,000",
        garbageFee: "₹4,000"
      }
    },
    {
      id: "TX-2024-002",
      year: "2024",
      taxAmount: "₹39,800",
      assessedValue: "₹79,60,000",
      status: "paid",
      owner: "Madhumitha R",
      dueDate: "2024-03-31",
      paidDate: "2024-03-10",
      receiptNo: "RCP-2024-77192",
      discountPenalty: "₹0",
      breakdown: {
        municipalTax: "₹26,000",
        educationCess: "₹4,200",
        waterSewer: "₹5,800",
        garbageFee: "₹3,800"
      }
    },
    {
      id: "TX-2023-003",
      year: "2023",
      taxAmount: "₹37,200",
      assessedValue: "₹74,40,000",
      status: "paid",
      owner: "Madhumitha R & Suresh K",
      dueDate: "2023-03-31",
      paidDate: "2023-03-25",
      receiptNo: "RCP-2023-55104",
      discountPenalty: "₹0",
      breakdown: {
        municipalTax: "₹24,500",
        educationCess: "₹3,900",
        waterSewer: "₹5,300",
        garbageFee: "₹3,500"
      }
    },
    {
      id: "TX-2022-004",
      year: "2022",
      taxAmount: "₹35,000",
      assessedValue: "₹70,00,000",
      status: "paid",
      owner: "Suresh K",
      dueDate: "2022-03-31",
      paidDate: "2022-03-28",
      receiptNo: "RCP-2022-31099",
      discountPenalty: "₹0",
      breakdown: {
        municipalTax: "₹23,000",
        educationCess: "₹3,700",
        waterSewer: "₹5,000",
        garbageFee: "₹3,300"
      }
    },
    {
      id: "TX-2021-005",
      year: "2021",
      taxAmount: "₹33,500",
      assessedValue: "₹67,00,000",
      status: "paid",
      owner: "Suresh K",
      dueDate: "2021-03-31",
      paidDate: "2021-03-30",
      receiptNo: "RCP-2021-12001",
      discountPenalty: "₹0",
      breakdown: {
        municipalTax: "₹22,000",
        educationCess: "₹3,500",
        waterSewer: "₹4,800",
        garbageFee: "₹3,200"
      }
    }
  ];

  const properties = [
    { id: "prop1", name: "Luxury Villa - Plot 42, Anna Nagar, Chennai", idNum: "PID-CHN-88210" },
    { id: "prop2", name: "Modern Apartment - Indiranagar, Bangalore", idNum: "PID-BLR-40192" },
    { id: "prop3", name: "Independent House - RS Puram, Coimbatore", idNum: "PID-CBE-11048" }
  ];

  // Filtering records
  const filteredRecords = taxRecords.filter((rec) => {
    const matchesSearch =
      rec.year.includes(searchTerm) ||
      rec.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPaid = taxRecords
    .filter((r) => r.status === "paid")
    .reduce((acc, r) => acc + parseInt(r.taxAmount.replace(/[^0-9]/g, "")), 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <main className="tax-page">
        {/* Header section */}
        <header className="tax-header">
          <div className="tax-header-info">
            <h1>Property Tax History</h1>
            <p>Complete historical property assessment records, payment confirmations, and tax compliance due diligence.</p>
          </div>

          <div className="property-selector-box">
            <Building2 size={20} className="text-primary" />
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.idNum})
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Cumulative Tax Paid</div>
              <div className="stat-value">₹{totalPaid.toLocaleString()}</div>
              <div className="stat-desc">5 Years Recorded</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Tax Compliance Status</div>
              <div className="stat-value" style={{ color: "#10b981" }}>100% Clear</div>
              <div className="stat-desc">Zero Outstanding Dues</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper amber">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Latest Assessment Value</div>
              <div className="stat-value">₹85,00,000</div>
              <div className="stat-desc">FY 2024 - 2025</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Municipal Assessment Authority</div>
              <div className="stat-value" style={{ fontSize: "18px" }}>Greater Chennai Corp</div>
              <div className="stat-desc">Zone 08 - Circle 102</div>
            </div>
          </div>
        </section>

        {/* Controls Bar */}
        <div className="tax-controls-bar">
          <div className="tax-search-box">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by year, owner or receipt #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Filter size={16} color="var(--text-muted)" />
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Status:</span>
            </div>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <div className="view-toggle-btns">
              <button
                className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <List size={16} /> Table
              </button>
              <button
                className={`toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Card View"
              >
                <LayoutGrid size={16} /> Cards
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="table-container">
            {filteredRecords.length > 0 ? (
              <table className="tax-table">
                <thead>
                  <tr>
                    <th>Tax Year</th>
                    <th>Assessment Value</th>
                    <th>Annual Tax Amount</th>
                    <th>Payment Status</th>
                    <th>Property Owner</th>
                    <th>Receipt Ref</th>
                    <th>Paid Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td className="year-cell">FY {rec.year}</td>
                      <td>{rec.assessedValue}</td>
                      <td className="amount-cell">{rec.taxAmount}</td>
                      <td>
                        <span className={`tax-badge ${rec.status}`}>
                          {rec.status === "paid" && <CheckCircle2 size={12} />}
                          {rec.status === "pending" && <Clock size={12} />}
                          {rec.status === "overdue" && <AlertTriangle size={12} />}
                          {rec.status}
                        </span>
                      </td>
                      <td className="owner-cell">
                        <div>{rec.owner}</div>
                        <div className="sub-text">Assessed Registered Owner</div>
                      </td>
                      <td>
                        <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{rec.receiptNo}</span>
                      </td>
                      <td>
                        <div>{rec.paidDate}</div>
                        <div className="sub-text">Due: {rec.dueDate}</div>
                      </td>
                      <td>
                        <button
                          className="action-btn-sm"
                          onClick={() => alert(`Downloading official Tax Receipt ${rec.receiptNo}...`)}
                        >
                          <Download size={14} style={{ marginRight: "4px" }} />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-records">
                <h3>No tax records matching criteria</h3>
                <p>Try adjusting your search query or filter options.</p>
              </div>
            )}
          </div>
        ) : (
          /* Cards View */
          <div className="cards-grid">
            {filteredRecords.map((rec) => (
              <div key={rec.id} className="tax-card">
                <div className="card-top">
                  <span className="card-year">FY {rec.year}</span>
                  <span className={`tax-badge ${rec.status}`}>
                    {rec.status === "paid" && <CheckCircle2 size={12} />}
                    {rec.status}
                  </span>
                </div>

                <div className="card-body">
                  <div>
                    <div className="card-label">Tax Amount Paid</div>
                    <div className="card-amount-large">{rec.taxAmount}</div>
                  </div>

                  <div className="card-row">
                    <span className="card-label">Assessed Property Value</span>
                    <span className="card-val">{rec.assessedValue}</span>
                  </div>

                  <div className="card-row">
                    <span className="card-label">Recorded Owner</span>
                    <span className="card-val">{rec.owner}</span>
                  </div>

                  <div className="card-row">
                    <span className="card-label">Receipt Number</span>
                    <span className="card-val" style={{ fontFamily: "monospace" }}>{rec.receiptNo}</span>
                  </div>

                  <div className="card-row">
                    <span className="card-label">Payment Date</span>
                    <span className="card-val">{rec.paidDate}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Rebate/Adjustments: {rec.discountPenalty}
                  </span>
                  <button
                    className="action-btn-sm"
                    onClick={() => alert(`Downloading official Tax Receipt ${rec.receiptNo}...`)}
                  >
                    <Download size={14} style={{ marginRight: "4px" }} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
