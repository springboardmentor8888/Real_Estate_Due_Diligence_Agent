import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function ForgotPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-emerald/5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gradient">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[12px]">Work email</Label>
            <Input type="email" placeholder="you@company.com" />
          </div>
          <Button className="mt-2 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Send reset link
          </Button>
          <Link to="/login" className="block text-center text-sm text-emerald-600 hover:underline mt-4">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}