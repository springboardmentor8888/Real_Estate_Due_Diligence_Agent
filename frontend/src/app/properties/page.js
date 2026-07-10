"use client";

import Navbar from "../../components/Navbar";
import "./properties.css";

export default function PropertiesPage() {
  const properties = [
    {
      id: 1,
      title: "Luxury Villa",
      location: "Chennai",
      price: "₹75,00,000",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600",
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Bangalore",
      price: "₹55,00,000",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
    },
    {
      id: 3,
      title: "Independent House",
      location: "Coimbatore",
      price: "₹90,00,000",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600",
    },
    {
      id: 4,
      title: "Premium Flat",
      location: "Hyderabad",
      price: "₹68,00,000",
      image:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="properties-page">

        <h1>Available Properties</h1>

        <div className="search-bar">
          <input type="text" placeholder="Search by location..." />
          <button>Search</button>
        </div>

        <div className="property-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <img src={property.image} alt={property.title} />

              <div className="property-content">
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <span>{property.price}</span>

                <button>View Details</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}