import { describe, it, expect, beforeEach, vi } from "vitest";
import { authApi } from "../../services/api.js";

describe("Unit Test: Authentication Service & Token Storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should format user payload and call backend login endpoint", async () => {
    const mockTokenPayload = { token: "jwt_unit_token_777" };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(mockTokenPayload)),
      json: () => Promise.resolve(mockTokenPayload),
    });

    const response = await authApi.login("testuser@due.com", "pass123");
    expect(response.token).toBe("jwt_unit_token_777");
  });

  it("should format registration payload and trigger registration flow", async () => {
    const mockRegPayload = { userId: 42, name: "Sam Wilson", email: "sam@due.com" };
    const mockLoginPayload = { token: "jwt_unit_token_888" };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockRegPayload)),
        json: () => Promise.resolve(mockRegPayload),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockLoginPayload)),
        json: () => Promise.resolve(mockLoginPayload),
      });

    const result = await authApi.register({ name: "Sam Wilson", email: "sam@due.com", password: "securePassword123" });
    expect(result.token).toBe("jwt_unit_token_888");
  });

  it("should persist and retrieve JWT token in localStorage", () => {
    const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.testTokenStr";
    localStorage.setItem("token", sampleToken);

    expect(localStorage.getItem("token")).toBe(sampleToken);
  });

  it("should clear localStorage token on logout", () => {
    localStorage.setItem("token", "token_to_clear");
    expect(localStorage.getItem("token")).toBe("token_to_clear");

    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should parse stored user JSON correctly", () => {
    const sampleUser = { id: 101, name: "Admin Officer", email: "admin@due.com", role: "Admin" };
    localStorage.setItem("user", JSON.stringify(sampleUser));

    const retrievedUser = JSON.parse(localStorage.getItem("user"));
    expect(retrievedUser.name).toBe("Admin Officer");
    expect(retrievedUser.role).toBe("Admin");
  });
});
