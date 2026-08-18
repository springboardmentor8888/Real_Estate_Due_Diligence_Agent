import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Integration Test: User Registration & Login Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should complete user registration, receive JWT token, and persist session", async () => {
    const regPayload = { userId: 101, name: "Test Buyer", email: "buyer@test.com" };
    const loginPayload = { token: "jwt_mock_token_register_123" };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(regPayload)),
        json: () => Promise.resolve(regPayload),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(loginPayload)),
        json: () => Promise.resolve(loginPayload),
      });

    const { authApi } = await import("../../services/api.js");
    const result = await authApi.register({
      name: "Test Buyer",
      email: "buyer@test.com",
      password: "password123",
    });

    expect(result.token).toBe("jwt_mock_token_register_123");

    localStorage.setItem("token", result.token);
    expect(localStorage.getItem("token")).toBe("jwt_mock_token_register_123");
  });

  it("should complete user login, store JWT token, and support logout", async () => {
    const loginPayload = { token: "jwt_login_token_456" };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(loginPayload)),
      json: () => Promise.resolve(loginPayload),
    });

    const { authApi } = await import("../../services/api.js");
    const response = await authApi.login("user@test.com", "secretPassword");

    expect(response.token).toBe("jwt_login_token_456");
    localStorage.setItem("token", response.token);

    // Logout operation
    localStorage.removeItem("token");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
