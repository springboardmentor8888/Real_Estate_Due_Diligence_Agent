// src/routes/oauth2-callback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const fullName = params.get('fullName');
    const userId = params.get('userId');
    const role = params.get('role');
    const picture = params.get('picture');

    console.log('OAuth Callback Received:', { token, email, fullName, userId, role });

    if (token && email && fullName) {
      // Store user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        fullName: decodeURIComponent(fullName),
        email: decodeURIComponent(email),
        role: decodeURIComponent(role || 'BUYER'),
        userId: userId,
        picture: picture ? decodeURIComponent(picture) : null,
        active: true
      }));
      
      console.log('User data stored, redirecting to dashboard...');
      
      // Small delay to ensure storage is complete
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } else {
      console.error('Missing required OAuth parameters:', { token, email, fullName });
      setError('Google authentication failed. Missing required information.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <div className="text-muted-foreground">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald mx-auto mb-4"></div>
        <div className="text-lg font-semibold">Authenticating with Google...</div>
        <div className="text-muted-foreground mt-2">Please wait</div>
      </div>
    </div>
  );
}