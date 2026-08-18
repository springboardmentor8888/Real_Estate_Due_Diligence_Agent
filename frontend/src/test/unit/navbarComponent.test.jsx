import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../../components/Navbar.jsx";
import { AuthProvider } from "../../context/AuthContext.jsx";

describe("Unit Test: Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should render brand title and navigation links when authenticated", () => {
    localStorage.setItem("token", "active_session_token");
    localStorage.setItem("user", JSON.stringify({ name: "Authenticated User", role: "Buyer" }));

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByText("Diligence Agent")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("Tax History")).toBeInTheDocument();
    expect(screen.getByText("Zoning")).toBeInTheDocument();
    expect(screen.getByText("Flood Zone")).toBeInTheDocument();
    expect(screen.getByText("Permits & Env")).toBeInTheDocument();
    expect(screen.getByText("Report History")).toBeInTheDocument();
  });

  it("should render Login and Register options for unauthenticated guests", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).toBeNull();
  });

  it("should render Profile and Logout options for authenticated Buyers", () => {
    localStorage.setItem("token", "buyer_token");
    localStorage.setItem("user", JSON.stringify({ name: "Alex Buyer", role: "Buyer" }));

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByText(/Alex Buyer/)).toBeInTheDocument();
    expect(screen.getByText(/Buyer/)).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).toBeNull();
  });

  it("should render Admin Dashboard link and Admin role badge for Admin users", () => {
    localStorage.setItem("token", "admin_token");
    localStorage.setItem("user", JSON.stringify({ name: "Admin Officer", role: "Admin", email: "admin@realestate.com" }));

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    expect(screen.getByText(/Admin Officer/)).toBeInTheDocument();
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });
});
