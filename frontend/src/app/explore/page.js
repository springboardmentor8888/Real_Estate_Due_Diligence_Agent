"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { ShieldCheck, MapPin, BadgePercent, FileSpreadsheet, Eye } from "lucide-react";
import "./explore.css";

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const properties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai, Tamil Nadu",
      price: "₹1.2 Crore",
      type: "Villa",
      docs: 6,
      score: 98,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore, Karnataka",
      price: "₹85 Lakhs",
      type: "Apartment",
      docs: 5,
      score: 95,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    },
    {
      id: 3,
      title: "Waterfront Penthouse",
      location: "Kochi, Kerala",
      price: "₹2.4 Crore",
      type: "Apartment",
      docs: 7,
      score: 97,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    },
    {
      id: 4,
      title: "Commercial Office Space",
      location: "Hyderabad, Telangana",
      price: "₹4.8 Crore",
      type: "Commercial",
      docs: 10,
      score: 99,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    },
  ];

  const filtered = activeFilter === "All" 
    ? properties 
    : properties.filter(p => p.type === activeFilter);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="explore-page">
        <header className="explore-header">
          <h1 className="explore-title">Explore Verified Properties</h1>
          <p className="explore-subtitle">
            Browse through real estate with absolute legal compliance, cleared titles, and risk summaries.
          </p>
        </header>

        {/* Categories Tab Bar */}
        <div className="explore-filters">
          {["All", "Apartment", "Villa", "Commercial"].map((category) => (
            <button
              key={category}
              className={`filter-tab ${activeFilter === category ? "active" : ""}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Properties Layout */}
        <div className="property-grid">
          {filtered.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image-wrapper">
                <img src={property.image} alt={property.title} />
                <span className="compliance-badge">
                  <ShieldCheck size={14} />
                  {property.score}% Clear Title
                </span>
              </div>

              <div className="property-content">
                <div className="property-type-tag">{property.type}</div>
                <h2>{property.title}</h2>
                
                <p className="property-loc">
                  <MapPin size={16} />
                  {property.location}
                </p>

                <div className="property-stats">
                  <div className="stat-pill">
                    <FileSpreadsheet size={14} />
                    <span>{property.docs} Docs Scanned</span>
                  </div>
                  <div className="stat-pill">
                    <BadgePercent size={14} />
                    <span>0% Risk Flag</span>
                  </div>
                </div>

                <div className="explore-card-footer">
                  <div className="price-box">
                    <span className="price-tag">{property.price}</span>
                  </div>

                  <button className="view-btn">
                    <Eye size={16} />
                    Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}