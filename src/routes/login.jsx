// src/routes/login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, GoogleButton } from '../components/auth-layout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { authService } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

// src/routes/login.jsx - Add this check in the login flow

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await authService.login(formData.email, formData.password);
    const { token, fullName, email, role, userId, active } = response.data;
    
    // Store auth data
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      fullName,
      email,
      role,
      userId,
      active
    }));
    
    navigate('/dashboard');
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
    
    // Check if it's a verification error
    if (errorMessage.toLowerCase().includes('verify')) {
      setError('Please verify your email before logging in. Check your inbox for the verification link.');
      // Optionally show a "Resend verification" button
    } else {
      setError(errorMessage);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Parcel workspace."
      footer={<>New to Parcel? <Link to="/register" className="text-emerald hover:underline">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GoogleButton />
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        
        {error && (
          <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
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
              className="bg-foreground/[0.03]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[12px]">Password</Label>
              <Link to="/forgot-password" className="text-[11.5px] text-emerald hover:underline">Forgot?</Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-foreground/[0.03]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-muted-foreground">
            <Checkbox
              checked={formData.remember}
              onCheckedChange={(checked) => setFormData({ ...formData, remember: checked })}
            />
            Remember me for 30 days
          </label>
          <Button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}