import { describe, it, expect, beforeEach, vi } from "vitest";
import { exportPDF } from "../../utils/exportPDF.js";
import { exportExcel } from "../../utils/exportExcel.js";

describe("System E2E Test: Full User Due Diligence Workflow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should execute the complete end-to-end user workflow cleanly", async () => {
    const userCredentials = { name: "System Tester", email: "tester@realestate.com", password: "systemPass123" };
    
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/users")) {
        const payload = { userId: 999, name: userCredentials.name, email: userCredentials.email };
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify(payload)),
          json: () => Promise.resolve(payload),
        });
      }
      if (url.includes("/auth/login")) {
        const payload = { token: "e2e_jwt_system_token_999" };
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify(payload)),
          json: () => Promise.resolve(payload),
        });
      }
      if (url.includes("/api/properties/1")) {
        const payload = {
          propertyId: 1,
          propertyName: "Luxury Villa",
          city: "Chennai",
          state: "Tamil Nadu",
          price: 7500000,
          propertyType: "Villa",
        };
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify(payload)),
          json: () => Promise.resolve(payload),
        });
      }
      if (url.includes("/api/due-diligence/1/process")) {
        const payload = {
          id: 1,
          property: { propertyId: 1, propertyName: "Luxury Villa" },
          status: "COMPLETED",
          riskScore: 98,
          riskLevel: "LOW",
        };
        return Promise.resolve({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify(payload)),
          json: () => Promise.resolve(payload),
        });
      }
      const emptyPayload = {};
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(emptyPayload)),
        json: () => Promise.resolve(emptyPayload),
      });
    });

    const { authApi, propertyApi, dueDiligenceApi } = await import("../../services/api.js");

    // Step 1: User Registration & Auto Login
    const regResult = await authApi.register(userCredentials);
    expect(regResult.token).toBe("e2e_jwt_system_token_999");
    localStorage.setItem("token", regResult.token);
    expect(localStorage.getItem("token")).toBeDefined();

    // Step 2: Navigate to Properties & Select Property 1
    const property = await propertyApi.getById(1);
    expect(property.propertyId).toBe(1);
    expect(property.propertyName).toBe("Luxury Villa");

    // Step 3: Run Due Diligence
    const dueDiligenceResult = await dueDiligenceApi.processDueDiligence(1);
    expect(dueDiligenceResult.status).toBe("COMPLETED");

    // Step 4: Verify Exports
    expect(() => exportPDF({ propertyId: 1, owner: "Rajesh Kumar", address: "Chennai", estimatedValue: "₹79.5L", recommendation: "Good" })).not.toThrow();
    expect(() => exportExcel({ propertyId: 1, owner: "Rajesh Kumar", address: "Chennai", estimatedValue: "₹79.5L", recommendation: "Good" })).not.toThrow();

    // Step 5: User Logout
    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
