"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Send registration request (Backend ignores role for now, but we require it in UI)
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      alert("Registration successful! Please sign in.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div style={{ backgroundColor: "#fff1f2", color: "#be123c", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", border: "1px solid #fecdd3" }}>
              {error}
            </div>
          )}

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

            <Button text={loading ? "Creating Account..." : "Create Account"} type="submit" disabled={loading} />
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