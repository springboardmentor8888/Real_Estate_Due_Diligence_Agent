"use client";

import Navbar from "../../components/Navbar";
import SavedPropertyCard from "../../components/SavedPropertyCard";
import { User, Mail, Phone, MapPin, ShieldCheck, Edit3, LogOut, Heart } from "lucide-react";
import "./profile.css";

export default function ProfilePage() {
  const savedProperties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai, TN",
      price: "₹75,00,000",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore, KA",
      price: "₹55,00,000",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Coimbatore, TN",
      price: "₹90,00,000",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-main)" }}>
      <Navbar />

      <div className="profile-page">
        <div className="profile-layout">
          
          {/* Sidebar Panel */}
          <aside className="profile-sidebar">
            <div className="profile-header-card">
              <div className="avatar-wrapper">
                <div className="profile-avatar-placeholder">
                  <User size={48} className="placeholder-user-icon" />
                </div>
                <span className="user-verified-badge">
                  <ShieldCheck size={14} />
                </span>
              </div>

              <h2>Madhumitha</h2>
              <p className="role-tag">Real Estate Buyer</p>
              <span className="profile-status">🛡️ KYC Verified</span>
            </div>

            <div className="profile-actions-menu">
              <button className="profile-menu-btn edit-btn">
                <Edit3 size={16} />
                Edit Profile
              </button>
              <button className="profile-menu-btn logout-btn">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Details Content Panel */}
          <main className="profile-main-content">
            <section className="profile-details-card">
              <h3 className="section-title">Account Details</h3>
              
              <div className="details-grid">
                <div className="profile-detail-box">
                  <div className="detail-header">
                    <User size={16} />
                    <span>Full Name</span>
                  </div>
                  <p>Madhumitha R</p>
                </div>

                <div className="profile-detail-box">
                  <div className="detail-header">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </div>
                  <p>madhumitha@email.com</p>
                </div>

                <div className="profile-detail-box">
                  <div className="detail-header">
                    <Phone size={16} />
                    <span>Mobile Number</span>
                  </div>
                  <p>+91 98765 43210</p>
                </div>

                <div className="profile-detail-box">
                  <div className="detail-header">
                    <MapPin size={16} />
                    <span>Primary Location</span>
                  </div>
                  <p>Coimbatore, Tamil Nadu</p>
                </div>
              </div>
            </section>

            {/* Saved Listings Grid */}
            <section className="saved-listings-section">
              <div className="saved-listings-header">
                <Heart size={20} className="heart-icon" />
                <h3>Saved Listings ({savedProperties.length})</h3>
              </div>

              <div className="saved-properties-grid">
                {savedProperties.map((property) => (
                  <SavedPropertyCard
                    key={property.id}
                    image={property.image}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                  />
                ))}
              </div>
            </section>
          </main>

        </div>
      </div>
    </div>
  );
}