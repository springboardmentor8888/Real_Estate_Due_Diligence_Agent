// src/components/auth-layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import { resolveBackendBaseUrl } from '../services/api';

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-slate-50">

      {/* ── Left panel: real-estate hero ── */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
          alt="Premium Real Estate"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/25 to-black/10" />

        {/* Logo */}
        <div className="absolute top-6 left-6 z-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="RealEstate Due Diligence"
              className="h-11 w-11 object-contain"
              onError={e => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback logo when /logo.png is missing */}
            <div
              className="hidden h-11 w-11 rounded-xl items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
            >
              <span className="text-white font-bold text-sm">RE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white drop-shadow-md">RealEstate</span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase drop-shadow-md">
                Due Diligence
              </span>
            </div>
          </Link>
        </div>

        {/* Quote / stats */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
          <div className="space-y-5">
            <blockquote className="max-w-md text-2xl font-medium leading-snug text-white drop-shadow-md">
              "This platform compressed a two-week diligence workflow into an afternoon. It's changed how we underwrite."
            </blockquote>
            <div className="text-sm text-white/90 drop-shadow-md">
              Marcus Levine — Managing Director, Blackstone RE
            </div>
            <div className="flex gap-6 pt-2 text-[11px] uppercase tracking-wider text-white/80 drop-shadow-md">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> 3.2M Properties
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> SOC 2 Type II
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> $84B AUM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          {/* Mobile-only logo (shown when left panel is hidden) */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <img
              src="/logo.png"
              alt="RealEstate Due Diligence"
              className="h-8 w-8 object-contain"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="text-base font-bold text-slate-900">RealEstate</div>
              <div className="text-[9px] text-emerald-600 font-semibold tracking-widest uppercase">
                Due Diligence
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-emerald-600 mb-1">{title}</h1>
          <p className="text-sm text-slate-500 mb-7">{subtitle}</p>

          <div className="space-y-5">{children}</div>

          {footer && (
            <div className="mt-6 text-center text-[13px] text-slate-500">{footer}</div>
          )}

          <div className="mt-6 text-center text-[11px] text-slate-400">
            <Link to="/" className="hover:text-slate-600 transition-colors">← Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function GoogleButton({ children = 'Continue with Google' }) {
  const backendUrl = resolveBackendBaseUrl();

  return (
    <button
      type="button"
      onClick={() => { window.location.href = `${backendUrl}/oauth2/authorization/google?prompt=select_account`; }}
      style={{
        display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center',
        gap: '8px', padding: '10px 16px', borderRadius: '10px',
        border: '1px solid #e2e8f0', background: '#ffffff',
        fontSize: '13.5px', fontWeight: '500', color: '#374151',
        cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
      onMouseOut={e  => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.6L19 4c-1.9-1.7-4.3-2.7-7-2.7C7.3 1.3 3.3 4 1.4 8L4.7 10.5C5.7 7.3 8.6 5 12 5z"/>
        <path fill="#4285F4" d="M23 12.3c0-.9-.1-1.6-.2-2.3H12v4.4h6.2c-.3 1.6-1.3 3-2.7 3.8l3.2 2.5c1.9-1.7 4.3-4.6 4.3-8.4z"/>
        <path fill="#FBBC05" d="M4.7 13.5c-.2-.7-.4-1.5-.4-2.5s.2-1.8.4-2.5L1.4 6C.5 7.5 0 9.7 0 12s.5 4.5 1.4 6l3.3-2.5z"/>
        <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-3.4 0-6.3-2.3-7.3-5.5L1.4 16C3.3 20 7.3 23 12 23z"/>
      </svg>
      {children}
    </button>
  );
}