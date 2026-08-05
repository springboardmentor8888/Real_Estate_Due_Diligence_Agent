"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "Properties", href: "/properties" },
    { name: "Tax History", href: "/tax-history" },
    { name: "Zoning", href: "/zoning" },
    { name: "Flood Zone", href: "/flood-zone" },
    { name: "Permits & Env", href: "/permits-environmental" },
  ];

  return (
    <header className="navbar">
      <Link href="/" className="navbar-brand">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Building2 size={24} className="text-primary" />
          <span>Diligence Agent</span>
        </span>
      </Link>

      <nav className="navbar-links">
        {isAuthenticated && navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${isActive ? "active" : ""}`}
              style={{
                color: isActive ? "var(--primary)" : undefined,
                fontWeight: isActive ? "700" : "600",
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {isAuthenticated ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-light)",
                color: "var(--primary)",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <ShieldCheck size={16} />
              <span>{user?.name || "User"}</span>
            </div>

            <Link href="/profile" className="navbar-btn">
              <User size={16} style={{ marginRight: "6px" }} />
              Profile Dashboard
            </Link>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                width: "auto",
                padding: "8px 14px",
                fontSize: "14px",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                boxShadow: "none"
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="navbar-link"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <LogIn size={16} />
              Login
            </Link>

            <Link href="/register" className="navbar-btn">
              <UserPlus size={16} style={{ marginRight: "6px" }} />
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}