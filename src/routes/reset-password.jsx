import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth-layout';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function ResetPage() {
  return (
    <AuthLayout title="Set a new password" subtitle="Make it strong. You'll use this to sign in from now on.">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-[12px]">New password</Label>
          <Input type="password" placeholder="At least 8 characters" className="bg-foreground/[0.03]" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[12px]">Confirm password</Label>
          <Input type="password" placeholder="Confirm" className="bg-foreground/[0.03]" />
        </div>
        <Link to="/login"><Button className="mt-2 w-full rounded-lg bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90">Update password</Button></Link>
      </div>
    </AuthLayout>
  );
}