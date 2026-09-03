// src/routes/verify-email.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Logo from '../components/logo'; // ✅ Removed curly braces
import api from '../services/api';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    console.log('🔍 Verification token received:', token);

    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    if (hasVerified.current) {
      console.log('⏭️ Skipping duplicate verification call');
      return;
    }
    hasVerified.current = true;

    api.post('/auth/verify-email', { token })
      .then(data => {
        if (data?.status >= 200 && data?.status < 300) {
          setStatus('success');
          setMessage(data.data?.message || 'Email verified successfully! You can now login.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data?.data?.message || 'Verification failed. Please try again.');
          // Still redirect after 3 seconds even on error (if user is already verified)
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Email verification failed:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      });
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Verify Email</h1>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-emerald-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Verifying Your Email...</h2>
              <p className="text-slate-500">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-emerald-600 mb-2">✅ Email Verified!</h2>
              <p className="text-slate-500 mb-4">{message}</p>
              <p className="text-sm text-slate-400">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-500 mb-2">❌ Verification Failed</h2>
              <p className="text-slate-500 mb-6">{message}</p>
              <div className="space-y-3">
                {/* ✅ REPLACED GHOST BUTTON WITH VISIBLE GREEN BUTTON */}
                <Link to="/login">
                  <button
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      padding: '12px 0',
                      width: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    Go to Login
                  </button>
                </Link>
                <p className="text-xs text-slate-400">
                  If your email is already verified, try logging in directly.
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}