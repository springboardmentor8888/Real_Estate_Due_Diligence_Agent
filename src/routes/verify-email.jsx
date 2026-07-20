// src/routes/verify-email.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Logo } from '../components/logo';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // Prevent duplicate verification

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    console.log('🔍 Verification token received:', token);

    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    // Prevent duplicate verification calls
    if (hasVerified.current) {
      console.log('⏭️ Skipping duplicate verification call');
      return;
    }
    hasVerified.current = true;

    // Call backend verification endpoint
    const verifyUrl = `http://localhost:8080/api/auth/verify?token=${token}`;
    console.log('📡 Calling verification URL:', verifyUrl);

    fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('📥 Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('📊 Response data:', data);
        
        if (data && data.success === true) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully! You can now login.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data?.message || 'Verification failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('❌ Fetch error details:', error);
        setStatus('error');
        setMessage('Failed to connect to verification server.');
      });
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-emerald/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <h1 className="text-2xl font-semibold text-gradient mt-4">Email Verification</h1>
        </div>

        <div className="glass rounded-2xl p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-emerald animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Verifying Your Email...</h2>
              <p className="text-muted-foreground">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-emerald mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-emerald mb-2">✅ Email Verified!</h2>
              <p className="text-muted-foreground mb-4">{message}</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-destructive mb-2">❌ Verification Failed</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90">
                    Go to Login
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
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