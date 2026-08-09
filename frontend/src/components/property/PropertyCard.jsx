import React from 'react';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

const PropertyCard = ({ property, onClick }) => {
  // Default fallback image if property URL fails or is empty
  const defaultImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80";

  // Handles both single string imageUrl and list of image objects
  const imageSrc = property?.imageUrl || property?.image || (property?.images?.length > 0 ? property.images[0].imageUrl : defaultImage);

  // Format Price to Indian Currency (Lakhs / Crores) or Standard USD
  const formatPrice = (val) => {
    if (!val) return "Price on Request";
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div 
      onClick={() => onClick && onClick(property)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col justify-between"
    >
      <div>
        {/* Property Image Container */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={property?.title || "Property"} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = defaultImage; // Fallback if link breaks or CORS fails
            }}
          />
          {property?.riskLevel && (
            <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${
              property.riskLevel === 'LOW' ? 'bg-emerald-500' :
              property.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              <FaShieldAlt className="inline mr-1" /> Risk Score: {property?.riskScore ?? 'N/A'}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {property?.title || property?.address || property?.street || "Property Listing"}
            </h3>
          </div>

          <p className="text-sm text-gray-500 flex items-center mb-3">
            <FaMapMarkerAlt className="mr-1 text-red-500 flex-shrink-0" />
            <span className="line-clamp-1">
              {property?.street || property?.address ? `${property.street || property.address}, ` : ''}
              {property?.city ? `${property.city}, ` : ''}
              {property?.state || ''} {property?.zipCode || ''}
            </span>
          </p>

          <p className="text-xl font-bold text-emerald-600 mb-4">
            {formatPrice(property?.price)}
          </p>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 text-gray-600 text-xs text-center">
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <FaBed /> {property?.bedrooms || 0}
              </span>
              <span className="text-gray-400">Beds</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <FaBath /> {property?.bathrooms || 0}
              </span>
              <span className="text-gray-400">Baths</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <FaRulerCombined /> {property?.squareFeet || property?.sqft || 0}
              </span>
              <span className="text-gray-400">SqFt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;