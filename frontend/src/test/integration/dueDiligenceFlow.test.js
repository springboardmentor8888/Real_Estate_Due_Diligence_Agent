import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Integration Test: Due Diligence Processing Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute due diligence process for Property 1 (Low Risk)", async () => {
    const mockReport = {
      id: 1,
      property: { propertyId: 1, propertyName: "Luxury Villa" },
      status: "COMPLETED",
      reportUrl: "/reports/rep-1.pdf",
      riskScore: 98,
      riskLevel: "LOW",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReport)),
      json: () => Promise.resolve(mockReport),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    const response = await dueDiligenceApi.processDueDiligence(1);

    expect(response.status).toBe("COMPLETED");
    expect(response.property.propertyName).toBe("Luxury Villa");
  });

  it("should execute due diligence process for Property 4 (High Risk)", async () => {
    const mockReport = {
      id: 4,
      property: { propertyId: 4, propertyName: "Premium Flat" },
      status: "COMPLETED",
      reportUrl: "/reports/rep-4.pdf",
      riskScore: 32,
      riskLevel: "HIGH_RISK",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockReport)),
      json: () => Promise.resolve(mockReport),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    const response = await dueDiligenceApi.processDueDiligence(4);

    expect(response.status).toBe("COMPLETED");
    expect(response.property.propertyName).toBe("Premium Flat");
  });
});
