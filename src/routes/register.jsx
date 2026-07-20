// src/routes/register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, GoogleButton } from '../components/auth-layout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // <-- ADD THIS LINE
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'BUYER',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('Sending registration data:', formData);
      
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      console.log('Registration response:', response.data);
      
      setSuccess(true);
      setError('');
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        role: 'BUYER',
      });
      
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      // Get error message from response
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If registration is successful, show verification message
  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a verification link"
        footer={
          <>
            <Link to="/login" className="text-emerald hover:underline">Back to login</Link>
          </>
        }
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-muted-foreground">
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Please check your inbox and click the link to verify your email address.
              <br />
              The link will expire in 24 hours.
            </p>
          </div>
          <div className="pt-4 border-t">
            <button
              onClick={async () => {
                try {
                  await authService.resendVerification(formData.email);
                  alert('A new verification link has been sent!');
                } catch (err) {
                  alert('Failed to resend verification email. Please try again.');
                }
              }}
              className="text-sm text-emerald hover:underline"
            >
              Didn't receive the email? Click here to resend
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start your 14-day free trial. No credit card required."
      footer={<>Already have an account? <Link to="/login" className="text-emerald hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GoogleButton>Sign up with Google</GoogleButton>
        
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        
        {error && (
          <div className="rounded-lg bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[12px]">Full name</Label>
              <Input
                placeholder="Ava Chen"
                className="bg-foreground/[0.03]"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px]">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="bg-foreground/[0.03]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="LEGAL_REVIEWER">Legal Reviewer</SelectItem>
                  <SelectItem value="BANK">Bank</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-[12px]">Work email</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              className="bg-foreground/[0.03]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-[12px]">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 8 characters"
              className="bg-foreground/[0.03]"
              required
              minLength={8}
            />
          </div>
          
          <Button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create workspace'}
          </Button>
          
          <p className="text-[11px] text-muted-foreground">
            By continuing you agree to our <a href="#" className="underline hover:text-foreground" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#" className="underline hover:text-foreground" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}