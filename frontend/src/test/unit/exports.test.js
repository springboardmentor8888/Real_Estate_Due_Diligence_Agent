import { describe, it, expect, vi } from "vitest";
import { exportPDF } from "../../utils/exportPDF.js";
import { exportExcel } from "../../utils/exportExcel.js";

describe("Unit Test: PDF & Excel Export Utilities", () => {
  const sampleReportData = {
    propertyId: "PROP001",
    owner: "Rajesh Kumar",
    address: "44 Beach Road, Chennai",
    area: "3,200 sq.ft",
    legalStatus: "Verified Title",
    floodRisk: "Low Risk (Zone X)",
    financialRisk: "Clean Title",
    estimatedValue: "₹79.5 Lakhs",
    recommendation: "Priced below fair market value",
  };

  it("should generate PDF document cleanly", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(() => exportPDF(sampleReportData)).not.toThrow();
    spy.mockRestore();
  });

  it("should generate Excel spreadsheet cleanly", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(() => exportExcel(sampleReportData)).not.toThrow();
    spy.mockRestore();
  });
});
