// src/components/logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      
      {/* ✅ YOUR ACTUAL LOGO IMAGE */}
      <img 
        src="/logo.png" 
        alt="RealEstate Logo" 
        className="h-10 w-auto object-contain"
        onError={(e) => {
          // If image fails to load, show the fallback
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      
      {/* Fallback Box (Only shows if logo.png fails) */}
      <div className="hidden h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
        <span className="text-white font-bold text-sm">RE</span>
      </div>

      <div>
        <span className="text-[18px] font-extrabold tracking-tight text-gray-900 block leading-none">RealEstate</span>
        <span className="text-[9px] font-medium text-emerald-600 tracking-wider">Due Diligence</span>
      </div>
    </Link>
  );
}