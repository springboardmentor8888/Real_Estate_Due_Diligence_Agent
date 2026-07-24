"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, FileText, LayoutDashboard, Building2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists
    setIsLoggedIn(!!getToken());
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        🏢 Diligence Agent
      </Link>

      <div className="navbar-links">
        <Link
          href="/explore"
          className={`navbar-link ${isActive("/explore") ? "navbar-link-active" : ""}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <Link
          href="/properties"
          className={`navbar-link ${isActive("/properties") ? "navbar-link-active" : ""}`}
        >
          <Building2 size={16} />
          Properties
        </Link>

        <Link
          href="/report"
          className={`navbar-link ${isActive("/report") ? "navbar-link-active" : ""}`}
        >
          <FileText size={16} />
          Reports
        </Link>

        <Link
          href="/notifications"
          className={`navbar-link navbar-bell ${isActive("/notifications") ? "navbar-link-active" : ""}`}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="navbar-notif-dot" />
        </Link>

        {!isLoggedIn ? (
          <Link href="/login" className="navbar-link">
            Login
          </Link>
        ) : (
          <>
            <button onClick={handleLogout} className="navbar-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <LogOut size={16} /> Logout
            </button>
            <Link href="/profile" className="navbar-btn">
              Profile
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}