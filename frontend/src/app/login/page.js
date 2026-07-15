"use client";
import Link from "next/link";

import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  FileCheck,
  Building2,
  ArrowRight,
} from "lucide-react";

import "./login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO:
    // Connect Spring Boot Login API here
    console.log("Login Button Clicked");
  };

  return (
    <div className="login-page">
      {/* LEFT SECTION */}

      <div className="login-left">

        <div className="overlay"></div>

        <div className="left-content">

          <div className="logo">

            <Building2 size={40} />

            <div>
              <h2>Diligence</h2>
              <p>Real Estate Due Diligence</p>
            </div>

          </div>

          <div className="hero">

            <h1>
              Smart Due Diligence.
              <br />
              <span>Secure Investments.</span>
            </h1>

            <p>
              Verify property ownership, documents,
              legal records and generate professional
              due diligence reports with confidence.
            </p>

          </div>

          <div className="features">

            <div className="feature">

              <div className="icon blue">
                <ShieldCheck />
              </div>

              <div>
                <h4>Secure & Reliable</h4>
                <p>Bank-level security for your data.</p>
              </div>

            </div>

            <div className="feature">

              <div className="icon purple">
                <FileCheck />
              </div>

              <div>
                <h4>AI Reports</h4>
                <p>Generate reports instantly.</p>
              </div>

            </div>

            <div className="feature">

              <div className="icon green">
                <Building2 />
              </div>

              <div>
                <h4>Property Analysis</h4>
                <p>Fast and accurate verification.</p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="login-right">

        <form className="login-card" onSubmit={handleSubmit}>

          <h1>Welcome Back</h1>

          <p className="subtitle">
            Login to continue to your account
          </p>

          {/* EMAIL */}

          <div className="input-group">

            <label>Email Address</label>

            <div className="input-box">

              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}


          <div className="input-group">

            <div className="password-label">
              <label>Password</label>
              <a href="#">Forgot Password?</a>
            </div>

            <div className="input-box">

              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <span
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>

            </div>

          </div>


          {/* REMEMBER */}



          {/* LOGIN */}

          <button className="login-btn">

            Login

            <ArrowRight size={18} />

          </button>

          <div className="divider">

            <span>OR</span>

          </div>

          <div className="social-login">

            <button type="button">
              Google
            </button>

            <button type="button">
              Microsoft
            </button>

          </div>
          <div className="remember">
            <label>
              <input type="checkbox" />
              Remember Me
            </label>
          </div>

         <p className="signup">
           Don't have an account?{" "}
           <Link href="/register" className="signup-link">
             Sign Up
           </Link>
         </p>
        </form>

      </div>

    </div>
  );
}