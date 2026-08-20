// src/routes/login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout, GoogleButton } from '../components/auth-layout';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Role → dashboard mapping (must match App.js routes)
const ROLE_DASHBOARD = {
  BUYER:          '/dashboard',
  SELLER:         '/dashboard',
  AGENT:          '/agent/dashboard',
  LEGAL_REVIEWER: '/legal/dashboard',
  BANK:           '/bank/dashboard',
};

// Shared styled input component (inline styles — immune to Tailwind purge)
function Field({ label, icon: Icon, rightSlot, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#475569' }}>
          {label}
        </label>
        {rightSlot}
      </div>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{
            position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)',
            width: '15px', height: '15px', color: focused ? '#059669' : '#94a3b8',
            pointerEvents: 'none', transition: 'color 0.2s',
          }} />
        )}
        <input
          {...inputProps}
          onFocus={e => { setFocused(true); inputProps.onFocus?.(e); }}
          onBlur={e  => { setFocused(false); inputProps.onBlur?.(e); }}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: Icon ? '34px' : '12px',
            paddingRight: inputProps.type === 'password' ? '38px' : '12px',
            paddingTop: '9px', paddingBottom: '9px',
            border: `1.5px solid ${focused ? '#059669' : '#e2e8f0'}`,
            borderRadius: '10px', fontSize: '13.5px',
            background: '#f8fafc', color: '#1e293b', outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(5,150,105,0.10)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
      </div>
    </div>
  );
}

// Password field with show/hide toggle
function PasswordField({ label, value, onChange, placeholder, rightSlot }) {
  const [show, setShow]     = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#475569' }}>
          {label}
        </label>
        {rightSlot}
      </div>
      <div style={{ position: 'relative' }}>
        <Lock style={{
          position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)',
          width: '15px', height: '15px', color: focused ? '#059669' : '#94a3b8',
          pointerEvents: 'none', transition: 'color 0.2s',
        }} />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            paddingLeft: '34px', paddingRight: '38px',
            paddingTop: '9px', paddingBottom: '9px',
            border: `1.5px solid ${focused ? '#059669' : '#e2e8f0'}`,
            borderRadius: '10px', fontSize: '13.5px',
            background: '#f8fafc', color: '#1e293b', outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(5,150,105,0.10)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
            color: '#94a3b8', display: 'flex', alignItems: 'center',
          }}
          tabIndex={-1}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email:    email.trim().toLowerCase(),
        password: password,
      });

      const data = response.data;

      // ── Normalise role (guard against legacy ADMIN ───────────────────────────
      let role = (data.role || '').toUpperCase().trim();
      if (!role || role === 'ADMIN') role = 'BUYER'; // safe fallback

      const fullName =
        data.fullName ||
        `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
        email;

      // ── Persist session in localStorage ─────────────────────────────────────
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId:   data.userId,
        fullName: fullName,
        email:    data.email || email.trim(),
        role:     role,
        active:   data.active !== undefined ? Boolean(data.active) : true,
      }));

      // ── Redirect to role-specific dashboard ──────────────────────────────────
      const destination = ROLE_DASHBOARD[role] || '/dashboard';
      window.location.href = destination;

    } catch (err) {
      console.error('Login error:', err);

      let msg = 'Sign in failed. Please check your credentials and try again.';
      if (err.response?.status === 401 || err.response?.status === 403) {
        msg = 'Incorrect email or password.';
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (!err.response) {
        msg = 'Cannot connect to server. Please make sure the backend is running.';
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your RealEstate Due Diligence account."
      footer={
        <>
          New to RealEstate?{' '}
          <Link
            to="/register"
            style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Google sign-in */}
        <GoogleButton>Sign in with Google</GoogleButton>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          or
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '10px 12px',
            fontSize: '13px', color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <Field
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {/* Password with forgot link */}
        <PasswordField
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Your password"
          rightSlot={
            <Link
              to="/forgot-password"
              style={{ fontSize: '12px', color: '#059669', fontWeight: '500', textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          }
        />

        {/* Sign in button — explicit inline styles, uses e.currentTarget not e.target */}
        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '11px 0', marginTop: '2px',
            background: loading ? '#d1fae5' : '#059669',
            color: '#ffffff', fontWeight: '700', fontSize: '14px',
            border: 'none', borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 14px rgba(5,150,105,0.30)',
            transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
            opacity: loading ? 0.75 : 1,
          }}
          onMouseOver={e => {
            if (!loading) {
              e.currentTarget.style.background  = '#047857';
              e.currentTarget.style.boxShadow   = '0 6px 20px rgba(4,120,87,0.35)';
              e.currentTarget.style.transform   = 'translateY(-1px)';
            }
          }}
          onMouseOut={e => {
            if (!loading) {
              e.currentTarget.style.background  = '#059669';
              e.currentTarget.style.boxShadow   = '0 4px 14px rgba(5,150,105,0.30)';
              e.currentTarget.style.transform   = 'translateY(0)';
            }
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                animation: 'spin 0.7s linear infinite',
              }} />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}