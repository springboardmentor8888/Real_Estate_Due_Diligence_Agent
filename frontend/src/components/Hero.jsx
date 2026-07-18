import Link from "next/link";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-background-glow"></div>
      
      <div className="hero-content">
        <div className="hero-badge-container">
          <span className="hero-badge">✨ Smart AI Due Diligence Agent</span>
        </div>
        
        <h1 className="hero-title">
          Smart Due Diligence.<br />
          <span className="hero-title-gradient">Secure Investments.</span>
        </h1>

        <p className="hero-subtitle">
          Verify property ownership, analyze legal documentation, minimize fraud risk, and make confident real estate decisions in real time.
        </p>

        <div className="hero-buttons">
          <Link href="/explore" className="hero-primary-btn">
            Explore Properties
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>

          <Link href="/contact" className="hero-secondary-btn">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}