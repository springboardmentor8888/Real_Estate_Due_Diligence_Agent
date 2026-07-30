"use client";

import { exportPDF } from "../../utils/exportPDF";
import { exportExcel } from "../../utils/exportExcel";

export default function DueDiligenceReport() {
  const report = {
    propertyId: "PROP001",
    owner: "John Smith",
    address: "Hyderabad, Telangana",
    area: "2400 sq.ft",
    legalStatus: "Verified",
    floodRisk: "Low",
    financialRisk: "Medium",
    estimatedValue: "₹75,00,000",
    recommendation: "Safe to Purchase",
  };

  const comparableProperties = [
    {
      id: "CP001",
      location: "Madhapur",
      price: "₹72,00,000",
    },
    {
      id: "CP002",
      location: "Gachibowli",
      price: "₹76,50,000",
    },
    {
      id: "CP003",
      location: "Kondapur",
      price: "₹74,20,000",
    },
  ];

  return (
    <div
      style={{
        background: "#f5f7fb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#4338CA",
            marginBottom: "30px",
          }}
        >
          Due Diligence Report
        </h1>

        {/* Property Details */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🏠 Property Information</h2>

          <p>
            <b>Property ID:</b> {report.propertyId}
          </p>

          <p>
            <b>Owner:</b> {report.owner}
          </p>

          <p>
            <b>Address:</b> {report.address}
          </p>

          <p>
            <b>Area:</b> {report.area}
          </p>
        </div>

        {/* Risk Assessment */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>⚠️ Risk Assessment</h2>

          <p>✔ Legal Status : {report.legalStatus}</p>
          <p>✔ Flood Risk : {report.floodRisk}</p>
          <p>✔ Financial Risk : {report.financialRisk}</p>
        </div>

        {/* Comparable Properties */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>📊 Comparable Properties</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ background: "#4338CA", color: "white" }}>
                <th style={{ padding: "10px" }}>Property ID</th>
                <th>Location</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {comparableProperties.map((property) => (
                <tr key={property.id}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    {property.id}
                  </td>

                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    {property.location}
                  </td>

                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    {property.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Value */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>💰 Estimated Market Value</h2>

          <h1 style={{ color: "#4338CA" }}>
            {report.estimatedValue}
          </h1>
        </div>

        {/* Recommendation */}
        <div
          style={{
            background: "#E8F5E9",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <h2>✅ Recommendation</h2>

          <p>{report.recommendation}</p>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => exportPDF(report)}
            style={{
              background: "#4338CA",
              color: "white",
              padding: "15px 30px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Download PDF
          </button>

          <button
            onClick={() => exportExcel(report)}
            style={{
              background: "#4338CA",
              color: "white",
              padding: "15px 30px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              flex: 1,
            }}
          >
            Download Excel
          </button>
        </div>
      </div>
    </div>
  );
}