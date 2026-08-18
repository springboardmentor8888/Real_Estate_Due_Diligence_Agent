import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("Unit Test: API Utility & HTTP Error Handling", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should attach Authorization Bearer token to request headers when token exists", async () => {
    localStorage.setItem("token", "my_secret_bearer_token");

    let capturedHeaders = null;
    global.fetch = vi.fn().mockImplementation((url, options) => {
      capturedHeaders = options.headers;
      const data = { userId: 1, name: "Test User" };
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(data)),
        json: () => Promise.resolve(data),
      });
    });

    const { userApi } = await import("../../services/api.js");
    await userApi.getById(1);

    expect(capturedHeaders).toBeDefined();
    expect(capturedHeaders["Authorization"]).toBe("Bearer my_secret_bearer_token");
    expect(capturedHeaders["Content-Type"]).toBe("application/json");
  });

  it("should handle 200 OK response cleanly", async () => {
    const mockData = [{ id: 1, propertyName: "Luxury Villa" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockData)),
      json: () => Promise.resolve(mockData),
    });

    const { propertyApi } = await import("../../services/api.js");
    const data = await propertyApi.getAll();

    expect(data).toBeDefined();
    expect(data.length).toBe(1);
    expect(data[0].propertyName).toBe("Luxury Villa");
  });

  it("should handle error responses from API requests", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: () => Promise.resolve(JSON.stringify({ message: "Invalid credentials" })),
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    const { dueDiligenceApi } = await import("../../services/api.js");
    await expect(dueDiligenceApi.processDueDiligence(1)).rejects.toThrow();
  });

  it("should handle 404 error responses safely", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: () => Promise.resolve(JSON.stringify({ message: "Property not found" })),
      json: () => Promise.resolve({ message: "Property not found" }),
    });

    const { propertyApi } = await import("../../services/api.js");
    const result = await propertyApi.getById(9999);
    expect(result).toBeNull();
  });

  it("should handle 500 Internal Server Error without crashing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: () => Promise.resolve("Server Error Page"),
      json: () => Promise.reject(new Error("HTML Error")),
    });

    const { propertyApi } = await import("../../services/api.js");
    const result = await propertyApi.getById(1);
    expect(result).toBeNull();
  });
});
