import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const fullName = params.get('fullName');
    const userId = params.get('userId');
    const role = params.get('role');

    if (token && email && fullName) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        fullName: decodeURIComponent(fullName),
        email: decodeURIComponent(email),
        role: decodeURIComponent(role || 'BUYER'),
        userId: userId,
        active: true
      }));
      
      setTimeout(() => navigate('/dashboard', { replace: true }), 100);
    } else {
      setError('Google authentication failed. Missing required information.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <div className="text-gray-500">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <div className="text-lg font-semibold">Authenticating with Google...</div>
      </div>
    </div>
  );
}