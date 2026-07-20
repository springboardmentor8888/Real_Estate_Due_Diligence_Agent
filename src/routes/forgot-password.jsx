import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth-layout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function ForgotPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<><Link to="/login" className="text-emerald hover:underline">← Back to sign in</Link></>}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">Work email</Label>
          <Input type="email" placeholder="you@company.com" className="bg-foreground/[0.03]" />
        </div>
        <Link to="/reset-password"><Button className="mt-2 w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90">Send reset link</Button></Link>
      </div>
    </AuthLayout>
  );
}