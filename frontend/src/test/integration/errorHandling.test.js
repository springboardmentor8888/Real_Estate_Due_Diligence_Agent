import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Integration Test: Frontend Error Handling & Resiliency", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle network failure gracefully without crashing", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const { dueDiligenceApi } = await import("../../services/api.js");
    await expect(dueDiligenceApi.processDueDiligence(1)).rejects.toThrow("Failed to fetch");
  });

  it("should handle 401 Unauthorized error response cleanly", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: () => Promise.resolve(JSON.stringify({ message: "JWT token expired" })),
      json: () => Promise.resolve({ message: "JWT token expired" }),
    });

    const { userApi } = await import("../../services/api.js");
    await expect(userApi.getById(1)).rejects.toThrow("JWT token expired");
  });

  it("should handle 403 Forbidden error response cleanly", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      text: () => Promise.resolve(JSON.stringify({ message: "Admin role required" })),
      json: () => Promise.resolve({ message: "Admin role required" }),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    await expect(dueDiligenceApi.getAdminAnalytics()).rejects.toThrow("Admin role required");
  });
});
