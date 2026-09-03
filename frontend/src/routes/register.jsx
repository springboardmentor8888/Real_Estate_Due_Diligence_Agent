// src/routes/register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout, GoogleButton } from '../components/auth-layout';
import { authService } from '../services/api';
import {
  Building2, Users, Scale, Briefcase, UserCheck,
  ChevronRight, ChevronLeft, Mail, Lock, User, Check
} from 'lucide-react';

// ── Role → dashboard map ───────────────────────────────────────────────────────
const ROLE_DASHBOARD = {
  BUYER:          '/dashboard',
  SELLER:         '/dashboard',
  AGENT:          '/agent/dashboard',
  LEGAL_REVIEWER: '/legal/dashboard',
  BANK:           '/bank/dashboard',
};

// ── The 5 valid roles (NO ADMIN) ───────────────────────────────────────────────
const ROLES = [
  {
    value: 'BUYER',
    label: 'Property Buyer',
    icon: Building2,
    description: 'Browse, search, and purchase properties.',
    accent: '#3b82f6',
    lightBg: '#eff6ff',
  },
  {
    value: 'SELLER',
    label: 'Property Seller',
    icon: UserCheck,
    description: 'List properties and manage inquiries.',
    accent: '#ef4444',
    lightBg: '#fef2f2',
  },
  {
    value: 'AGENT',
    label: 'Real Estate Agent',
    icon: Users,
    description: 'Represent buyers and sellers, list properties.',
    accent: '#059669',
    lightBg: '#f0fdf4',
  },
  {
    value: 'LEGAL_REVIEWER',
    label: 'Legal Reviewer',
    icon: Scale,
    description: 'Review documents and manage compliance.',
    accent: '#7c3aed',
    lightBg: '#f5f3ff',
  },
  {
    value: 'BANK',
    label: 'Bank / Lender',
    icon: Briefcase,
    description: 'Evaluate loans and manage real estate finance.',
    accent: '#d97706',
    lightBg: '#fffbeb',
  },
];

// ── Shared input field ─────────────────────────────────────────────────────────
function Field({ label, icon: Icon, ...inputProps }) {
  return (
    <div className="space-y-1">
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#475569',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '15px',
              width: '15px',
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          {...inputProps}
          style={{
            width: '100%',
            paddingLeft: Icon ? '34px' : '12px',
            paddingRight: '12px',
            paddingTop: '9px',
            paddingBottom: '9px',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '13.5px',
            background: '#f8fafc',
            color: '#1e293b',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#059669';
            e.target.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.10)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();

  const [step, setStep]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);
  const [resending, setResending]   = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const [formData, setFormData] = useState({
    fullName:        '',
    email:           '',
    password:        '',
    confirmPassword: '',
    role:            '',
  });

  const set = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  // ── Step 1 → Step 2 ──────────────────────────────────────────────────────────
  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim())
      return setError('Full name is required.');
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      return setError('Please enter a valid email address.');
    if (!formData.password || formData.password.length < 8)
      return setError('Password must be at least 8 characters.');
    if (formData.password !== formData.confirmPassword)
      return setError('Passwords do not match.');

    setStep(2);
  };

  // ── Step 2 → register + auto-login + redirect ────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.role) return setError('Please select a role to continue.');

    setLoading(true);
    setError('');

    try {
      console.log('=== REGISTRATION START ===');
      console.log('Sending registration with role:', formData.role);

      // 1. Send registration request with full details and selected role
      const regRes = await authService.register({
        fullName: formData.fullName.trim(),
        email:    formData.email.trim(),
        password: formData.password,
        role:     formData.role,
      });

      console.log('Registration response:', JSON.stringify(regRes.data));

      const data = regRes.data || {};
      let token = data.token;
      // Always prefer the role we selected in the form — backend may return it differently
      const role = (data.role || formData.role || 'BUYER').toUpperCase().trim();

      console.log('Token received from register:', !!token);
      console.log('Role resolved:', role);

      // Verification is required before login; registration does not issue a JWT.
      if (!token) {
        const userEmail = data.email || formData.email.trim();
        setRegisteredUser({
          email: userEmail,
          role: role,
          message: data.message || 'Registration successful. Check your email to verify your account before logging in.',
        });
        setError('');
        setStep(3);
        setLoading(false);
        return;
      }

      const fullName =
        data.fullName ||
        `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
        formData.fullName.trim();

      // 2. Persist authenticated session
      const userObj = {
        userId:   data.userId,
        fullName: fullName,
        email:    data.email || formData.email.trim(),
        role:     role,
        active:   true,
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));

      console.log('Saved to localStorage - user:', JSON.stringify(userObj));
      console.log('Saved to localStorage - token:', token.substring(0, 20) + '...');

      // 3. Navigate directly to selected role's dashboard
      const targetRoute = ROLE_DASHBOARD[role] || '/dashboard';
      console.log('Redirecting to:', targetRoute);
      console.log('=== REGISTRATION COMPLETE ===');

      // Use a small delay to ensure localStorage is fully written before navigation
      setTimeout(() => {
        window.location.href = targetRoute;
      }, 100);

    } catch (err) {
      console.error('Registration error:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);

      const valErrors = err.response?.data?.validationErrors;
      let errorMsg = '';
      if (valErrors && typeof valErrors === 'object') {
        errorMsg = Object.values(valErrors).join('. ');
      }
      if (!errorMsg) {
        errorMsg = err.response?.data?.message ||
                   err.response?.data?.error   ||
                   'Registration failed. Please try again.';
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = registeredUser?.email || formData.email?.trim();
    if (!targetEmail) return;
    setResending(true);
    setResendStatus('');
    try {
      await authService.resendVerification(targetEmail);
      setResendStatus('Verification link resent! Please check your inbox.');
    } catch (err) {
      setResendStatus(err.response?.data?.message || 'Could not resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // ── Shared step indicator ─────────────────────────────────────────────────────
  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      {[
        { n: 1, label: 'Your Details' },
        { n: 2, label: 'Select Role' },
        { n: 3, label: 'Verify Email' }
      ].map(({ n, label }, i) => (
        <React.Fragment key={n}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700',
              background: step >= n ? '#059669' : '#e2e8f0',
              color:      step >= n ? '#fff'    : '#94a3b8',
              transition: 'background 0.25s',
              flexShrink: 0,
            }}>
              {step > n ? <Check size={12} /> : n}
            </div>
            <span style={{
              fontSize: '12px', fontWeight: '500',
              color: step >= n ? '#059669' : '#94a3b8',
              transition: 'color 0.25s',
            }}>
              {label}
            </span>
          </div>
          {i < 2 && (
            <div style={{
              flex: 1, height: '1px', maxWidth: '36px',
              background: step > (i + 1) ? '#059669' : '#e2e8f0',
              transition: 'background 0.25s',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // ── Error banner ──────────────────────────────────────────────────────────────
  const ErrorBanner = () => error ? (
    <div style={{
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      padding: '10px 12px',
      fontSize: '13px',
      color: '#dc2626',
      marginBottom: '4px',
    }}>
      {error}
    </div>
  ) : null;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <AuthLayout
      title={
        step === 1 ? 'Create your account' :
        step === 2 ? 'Choose your role' :
        'Registration Successful'
      }
      subtitle={
        step === 1
          ? 'Start your real estate due diligence journey.'
          : step === 2
          ? `Hi ${formData.fullName.split(' ')[0] || 'there'}! Select how you'll use this platform.`
          : 'Your account has been created. Check your email to verify before signing in.'
      }
      footer={
        step === 1 ? (
          <>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#059669', fontWeight: '600' }}>
              Sign in
            </Link>
          </>
        ) : step === 2 ? (
          <button
            onClick={() => { setStep(1); setError(''); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: '13px', display: 'flex',
              alignItems: 'center', gap: '4px', padding: '0',
            }}
          >
            <ChevronLeft size={14} /> Back to details
          </button>
        ) : (
          <Link to="/login" style={{ color: '#059669', fontWeight: '600', fontSize: '13px' }}>
            Back to Sign In
          </Link>
        )
      }
    >
      <StepIndicator />

      <AnimatePresence mode="wait">

        {/* ─────────────── STEP 1: Account Details ─────────────── */}
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleNextStep}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <GoogleButton>Sign up with Google</GoogleButton>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '11px', textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#94a3b8',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              or
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <ErrorBanner />

            <Field
              label="Full Name"
              icon={User}
              type="text"
              placeholder="e.g. Ava Chen"
              value={formData.fullName}
              onChange={e => set('fullName', e.target.value)}
              required
            />

            <Field
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={e => set('email', e.target.value)}
              required
            />

            <Field
              label="Password"
              icon={Lock}
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={e => set('password', e.target.value)}
              required
              minLength={8}
            />

            <Field
              label="Confirm Password"
              icon={Lock}
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={e => set('confirmPassword', e.target.value)}
              required
            />

            {/* ── PRIMARY BUTTON — explicit inline styles to guarantee visibility ── */}
            <button
              type="submit"
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                width:          '100%',
                padding:        '11px 0',
                marginTop:      '4px',
                background:     '#059669',
                color:          '#ffffff',
                fontWeight:     '700',
                fontSize:       '14px',
                border:         'none',
                borderRadius:   '12px',
                cursor:         'pointer',
                boxShadow:      '0 4px 14px rgba(5,150,105,0.30)',
                transition:     'background 0.2s, box-shadow 0.2s, transform 0.15s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background   = '#047857';
                e.currentTarget.style.boxShadow    = '0 6px 20px rgba(4,120,87,0.35)';
                e.currentTarget.style.transform    = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background   = '#059669';
                e.currentTarget.style.boxShadow    = '0 4px 14px rgba(5,150,105,0.30)';
                e.currentTarget.style.transform    = 'translateY(0)';
              }}
            >
              Continue
              <ChevronRight size={16} />
            </button>
          </motion.form>
        )}

        {/* ─────────────── STEP 2: Role Selection ──────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <ErrorBanner />

            {ROLES.map(role => {
              const Icon     = role.icon;
              const selected = formData.role === role.value;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => set('role', role.value)}
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '12px',
                    width:         '100%',
                    textAlign:     'left',
                    padding:       '11px 14px',
                    borderRadius:  '12px',
                    border:        selected ? `2px solid ${role.accent}` : '2px solid #e2e8f0',
                    background:    selected ? role.lightBg : '#ffffff',
                    cursor:        'pointer',
                    transition:    'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                    boxShadow:     selected ? `0 2px 12px ${role.accent}22` : '0 1px 3px rgba(0,0,0,0.04)',
                    position:      'relative',
                  }}
                  onMouseOver={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = role.accent + '88';
                      e.currentTarget.style.background  = role.lightBg;
                    }
                  }}
                  onMouseOut={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background  = '#ffffff';
                    }
                  }}
                >
                  {/* Icon pill */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: role.lightBg, border: `1.5px solid ${role.accent}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={role.accent} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '13.5px', color: '#1e293b' }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
                      {role.description}
                    </div>
                  </div>

                  {/* Check badge */}
                  {selected && (
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: role.accent, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}

            {/* ── Create Account button ── */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!formData.role || loading}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                width:          '100%',
                padding:        '11px 0',
                marginTop:      '4px',
                background:     formData.role && !loading ? '#059669' : '#e2e8f0',
                color:          formData.role && !loading ? '#ffffff' : '#94a3b8',
                fontWeight:     '700',
                fontSize:       '14px',
                border:         'none',
                borderRadius:   '12px',
                cursor:         formData.role && !loading ? 'pointer' : 'not-allowed',
                boxShadow:      formData.role && !loading ? '0 4px 14px rgba(5,150,105,0.30)' : 'none',
                transition:     'background 0.2s, box-shadow 0.2s, transform 0.15s',
              }}
              onMouseOver={e => {
                if (formData.role && !loading) {
                  e.currentTarget.style.background  = '#047857';
                  e.currentTarget.style.boxShadow   = '0 6px 20px rgba(4,120,87,0.35)';
                  e.currentTarget.style.transform   = 'translateY(-1px)';
                }
              }}
              onMouseOut={e => {
                if (formData.role && !loading) {
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
                  Creating Account…
                </>
              ) : (
                <>Create Account <ChevronRight size={16} /></>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              By creating an account you agree to our Terms and Privacy Policy.
            </p>
          </motion.div>
        )}

        {/* ─────────────── STEP 3: Email Verification ─────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}
          >
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#ecfdf5', border: '2px solid #a7f3d0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#059669',
            }}>
              <Mail size={28} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                Check your inbox
              </h3>
              <p style={{ fontSize: '13.5px', color: '#475569', marginTop: '6px', marginBottom: 0 }}>
                We sent a verification link to:
              </p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#059669', marginTop: '2px', marginBottom: 0 }}>
                {registeredUser?.email || formData.email}
              </p>
            </div>

            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '12px 16px', fontSize: '12.5px', color: '#64748b', lineHeight: '1.5',
              textAlign: 'left', width: '100%', boxSizing: 'border-box'
            }}>
              <p style={{ margin: 0 }}>
                Click the link in the email to activate your account. If you don't see it within a few minutes, please check your spam folder.
              </p>
            </div>

            {resendStatus && (
              <div style={{
                background: resendStatus.includes('resent') || resendStatus.includes('sent') ? '#ecfdf5' : '#fef2f2',
                border: `1px solid ${resendStatus.includes('resent') || resendStatus.includes('sent') ? '#a7f3d0' : '#fecaca'}`,
                borderRadius: '8px', padding: '8px 12px', fontSize: '12.5px',
                color: resendStatus.includes('resent') || resendStatus.includes('sent') ? '#047857' : '#dc2626',
                width: '100%', boxSizing: 'border-box'
              }}>
                {resendStatus}
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', width: '100%', padding: '11px 0',
                background: '#059669', color: '#ffffff',
                fontWeight: '700', fontSize: '14px',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5,150,105,0.30)',
                transition: 'background 0.2s, transform 0.15s',
              }}
            >
              Proceed to Sign In <ChevronRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              style={{
                background: 'none', border: 'none', cursor: resending ? 'not-allowed' : 'pointer',
                color: '#64748b', fontSize: '12.5px', textDecoration: 'underline', padding: '4px',
              }}
            >
              {resending ? 'Sending...' : "Didn't receive the email? Resend verification link"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
}