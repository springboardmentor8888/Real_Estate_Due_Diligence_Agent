import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";

describe("Unit Test: ProtectedRoute Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should show loading/redirect fallback when user is not authenticated", () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div data-testid="secret-content">Secret Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    expect(screen.queryByTestId("secret-content")).toBeNull();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render children when user is authenticated", () => {
    localStorage.setItem("token", "valid_auth_token");
    localStorage.setItem("user", JSON.stringify({ name: "Authenticated User", role: "Buyer" }));

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div data-testid="secret-content">Secret Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    expect(screen.getByTestId("secret-content")).toBeInTheDocument();
    expect(screen.getByTestId("secret-content")).toHaveTextContent("Secret Protected Content");
  });
});
