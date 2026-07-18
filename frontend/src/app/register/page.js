"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Registration validation successful!");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 20px" }}>
        <div className="container" style={{ margin: 0, width: "100%", maxWidth: "450px" }}>
          <h1>Get Started</h1>
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px", fontWeight: 500 }}>
            Create an account to start verifying properties
          </p>

          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                marginBottom: "24px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "15px",
                background: "var(--bg-card)",
                outline: "none",
                transition: "var(--transition-smooth)"
              }}
              required
            >
              <option value="">Select your role</option>
              <option value="Buyer">Buyer</option>
              <option value="Agent">Real Estate Agent</option>
              <option value="Reviewer">Legal Reviewer</option>
              <option value="Bank">Financial Institution</option>
              <option value="Admin">Administrator</option>
            </select>

            <Button text="Create Account" type="submit" />
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}