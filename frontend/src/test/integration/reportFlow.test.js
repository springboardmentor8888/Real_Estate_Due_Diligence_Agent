import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Integration Test: Report History & Admin Analytics Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should retrieve full due diligence report history list", async () => {
    const mockReports = [
      { id: 1, reportId: "REP-001", propertyId: 1, propertyName: "Luxury Villa", status: "COMPLETED", riskScore: 98, riskLevel: "LOW" },
      { id: 4, reportId: "REP-004", propertyId: 4, propertyName: "Premium Flat", status: "COMPLETED", riskScore: 32, riskLevel: "HIGH_RISK" },
    ];

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReports)),
      json: () => Promise.resolve(mockReports),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    const reports = await dueDiligenceApi.getAllReports();

    expect(reports).toHaveLength(2);
    expect(reports[0].reportId).toBe("REP-001");
    expect(reports[1].riskScore).toBe(32);
  });

  it("should retrieve administrative analytics data", async () => {
    const mockAnalytics = {
      totalProperties: 4,
      completedDueDiligence: 4,
      pendingDueDiligence: 0,
      highRiskProperties: 1,
      mediumRiskProperties: 1,
      lowRiskProperties: 2,
      totalReports: 4,
      totalUsers: 3,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockAnalytics)),
      json: () => Promise.resolve(mockAnalytics),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    const analytics = await dueDiligenceApi.getAdminAnalytics();

    expect(analytics.totalProperties).toBe(4);
    expect(analytics.highRiskProperties).toBe(1);
    expect(analytics.lowRiskProperties).toBe(2);
  });
});
