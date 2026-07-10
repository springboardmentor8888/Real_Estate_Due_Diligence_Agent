"use client";

import Navbar from "../../components/Navbar";
import "./profile.css";

export default function ProfilePage() {
  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-card">

          <div className="profile-header">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
              alt="Property Verification"
              className="profile-image"
            />

            <h2>Madhumitha</h2>

            <p className="role">
              Real Estate Buyer
            </p>
          </div>

          <div className="profile-details">

            <div className="detail">
              <span>Name</span>
              <p>Madhumitha</p>
            </div>

            <div className="detail">
              <span>Email</span>
              <p>madhumitha@email.com</p>
            </div>

            <div className="detail">
              <span>Phone</span>
              <p>+91 9876543210</p>
            </div>

            <div className="detail">
              <span>Location</span>
              <p>Coimbatore, Tamil Nadu</p>
            </div>

          </div>

          <div className="button-group">
            <button className="edit-btn">
              Edit Profile
            </button>

            <button className="logout-btn">
              Logout
            </button>
          </div>

        </div>

        <div className="saved-properties">

          <h2>Saved Properties</h2>

          <div className="property-grid">

            <div className="property-card">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600"
                alt="Property"
              />
              <h3>Luxury Villa</h3>
              <p>Chennai</p>
              <span>₹75,00,000</span>
            </div>

            <div className="property-card">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600"
                alt="Property"
              />
              <h3>Modern Apartment</h3>
              <p>Bangalore</p>
              <span>₹55,00,000</span>
            </div>

            <div className="property-card">
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600"
                alt="Property"
              />
              <h3>Independent House</h3>
              <p>Coimbatore</p>
              <span>₹90,00,000</span>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}