// src/components/auth-layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, TrendingUp } from 'lucide-react';

export function AuthLayout({ children, title, subtitle, footer, logo }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* LEFT SIDE - Premium Dark Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        
        {/* ✅ BOLD, DARK REAL ESTATE IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Modern City Skyscraper"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-900/40" />
        
        {/* Logo */}
        <div className="absolute top-8 left-8 z-10">
          {logo ? (
            logo
          ) : (
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-white" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">RealEstate</span>
                <span className="text-[10px] text-emerald-400 font-medium">Due Diligence</span>
              </div>
            </div>
          )}
        </div>

        {/* Quote and Stats */}
        <div className="absolute bottom-10 left-10 right-10 z-10 text-white max-w-lg">
          <blockquote className="text-2xl font-medium leading-snug text-white">
            "Parcel compressed a two-week diligence workflow into an afternoon. It's changed how we underwrite."
          </blockquote>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
            <span className="font-semibold text-white">Marcus Levine</span>
            <span className="text-white/40">—</span>
            <span className="text-white/70">Managing Director, Blackstone RE</span>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-white/60 border-t border-white/10 pt-6">
            <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> 3.2M PROPERTIES</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC 2 TYPE II</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> $84B AUM</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="mx-auto w-full max-w-sm">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          )}
          <div className="mt-8 space-y-6">
            {children}
          </div>
          {footer && (
            <div className="mt-6 text-center text-sm text-slate-500">
              {footer}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}