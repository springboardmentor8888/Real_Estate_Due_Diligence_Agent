import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { authService } from '../services/api';

export default function ResetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = new URLSearchParams(location.search).get('token');
    if (!token) return setError('Password reset token is missing.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmation) return setError('Passwords do not match.');

    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, password);
      navigate('/login', { replace: true, state: { message: 'Password reset successfully. Please sign in.' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-emerald/5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gradient">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-1">Make it strong.</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label className="text-[12px]">New password</Label>
            <Input type="password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[12px]">Confirm password</Label>
            <Input type="password" placeholder="Confirm" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-2 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            {loading ? 'Updating...' : 'Update password'}
          </Button>
          <Link to="/login" className="block text-center text-sm text-emerald-600 hover:underline mt-4">Back to sign in</Link>
        </form>
      </div>
    </div>
  );
}