"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSearch,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";
import "./Hero.css";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/properties");
    }
  };

  return (
    <section className="hero">
      <div className="hero-background-glow"></div>

      <div className="hero-content">
        {/* Animated Badge */}
        <div className="hero-badge-container">
          <span className="hero-badge">
            <Sparkles size={15} style={{ display: "inline", marginRight: "6px" }} />
            Next-Gen AI Real Estate Due Diligence Agent
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title">
          Smart Due Diligence.<br />
          <span className="hero-title-gradient">Secure Real Estate Investments.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Verify property title deeds, analyze tax history, check zoning limits, evaluate flood risk, and audit environmental permits with instant AI precision.
        </p>

        {/* Hero Interactive Search Bar */}
        <form className="hero-search-form" onSubmit={handleSearch}>
          <div className="hero-search-input-wrapper">
            <Search className="hero-search-icon" size={20} />
            <input
              type="text"
              placeholder="Enter property title #, parcel PIN, or location (e.g. Chennai, Bangalore)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="hero-search-btn">
            Inspect Property <ArrowRight size={18} />
          </button>
        </form>

        {/* CTA Buttons */}
        <div className="hero-buttons">
          <Link href="/properties" className="hero-primary-btn">
            Explore Properties
            <ArrowRight size={18} />
          </Link>

          <Link href="/contact" className="hero-secondary-btn">
            Get in Touch
          </Link>
        </div>

        {/* Trust Metrics Bar */}
        <div className="hero-trust-metrics">
          <div className="trust-metric">
            <div className="metric-num">10,000+</div>
            <div className="metric-text">Verified Titles</div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-metric">
            <div className="metric-num">₹500Cr+</div>
            <div className="metric-text">Risk Mitigated</div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-metric">
            <div className="metric-num">99.8%</div>
            <div className="metric-text">Title Accuracy</div>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-metric">
            <div className="metric-num">Instant</div>
            <div className="metric-text">AI Verification</div>
          </div>
        </div>
      </div>
    </section>
  );
}