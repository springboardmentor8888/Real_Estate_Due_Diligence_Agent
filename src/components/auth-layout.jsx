import React from 'react';
import { Link } from 'react-router-dom';  // Add this import
import { motion } from "framer-motion";
import { Logo } from "./logo";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";


import { useNavigate } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=85" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <Logo />
          <div className="space-y-6">
            <blockquote className="max-w-md text-xl font-medium leading-snug text-foreground">
              "Parcel compressed a two-week diligence workflow into an afternoon. It's changed how we underwrite."
            </blockquote>
            <div className="text-sm text-muted-foreground">Marcus Levine — Managing Director, Blackstone RE</div>
            <div className="flex gap-6 pt-4 text-[11px] uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> 3.2M Properties</div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC 2 Type II</div>
              <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> $84B AUM</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-screen items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-2xl font-semibold tracking-tight text-gradient">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-[13px] text-muted-foreground">{footer}</div>}
          <div className="mt-8 text-center text-[11px] text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// src/components/auth-layout.jsx
export function GoogleButton({ children = "Continue with Google" }) {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth2 endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <button 
      onClick={handleGoogleLogin}
      className="glass flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.6L19 4c-1.9-1.7-4.3-2.7-7-2.7C7.3 1.3 3.3 4 1.4 8L4.7 10.5C5.7 7.3 8.6 5 12 5z" />
        <path fill="#4285F4" d="M23 12.3c0-.9-.1-1.6-.2-2.3H12v4.4h6.2c-.3 1.6-1.3 3-2.7 3.8l3.2 2.5c1.9-1.7 4.3-4.6 4.3-8.4z" />
        <path fill="#FBBC05" d="M4.7 13.5c-.2-.7-.4-1.5-.4-2.5s.2-1.8.4-2.5L1.4 6C.5 7.5 0 9.7 0 12s.5 4.5 1.4 6l3.3-2.5z" />
        <path fill="#34A853" d="M12 23c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-3.4 0-6.3-2.3-7.3-5.5L1.4 16C3.3 20 7.3 23 12 23z" />
      </svg>
      {children}
    </button>
  );
}