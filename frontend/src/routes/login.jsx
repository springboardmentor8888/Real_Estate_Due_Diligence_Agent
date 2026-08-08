// src/routes/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, GoogleButton } from '../components/auth-layout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔐 Login attempt for:', email);
      
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password
      });
      
      console.log('✅ Login response:', response.data);
      
      const data = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        userId: data.userId,
        active: data.active
      }));
      
      console.log('👤 User role:', data.role);
      
      if (data.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMessage = 'Login failed. Please try again.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      // ✅ FIX: Title is now Emerald Green
      title={<span style={{ color: '#10b981' }}>Welcome back</span>}
      subtitle="Sign in to your Parcel workspace."
      footer={<>New to Parcel? <Link to="/register" style={{ color: '#10b981' }} className="hover:underline">Create an account</Link></>}
      // ✅ FIX: Added the Real Estate Logo here
      logo={
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="RealEstate" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">RealEstate</span>
            <span className="text-[10px] text-emerald-400 font-medium">Due Diligence</span>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GoogleButton />
        
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[12px]">Work email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[12px]">Password</Label>
              <Link to="/forgot-password" style={{ color: '#10b981' }} className="hover:underline">Forgot?</Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-gray-50 border-gray-200 focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
            <Checkbox
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked)}
            />
            Remember me for 30 days
          </label>
          
          {/* ✅ FIX: REPLACED GHOST BUTTON WITH VISIBLE GREEN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 'bold',
              width: '100%',
              padding: '12px 0',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out',
              marginTop: '16px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}