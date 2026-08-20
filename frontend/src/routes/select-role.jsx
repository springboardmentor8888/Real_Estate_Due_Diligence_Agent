import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, Scale, Briefcase, UserCheck, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ROLES = [
  { value: 'BUYER', label: 'Property Buyer', icon: Building2, description: 'Looking to purchase properties', iconColor: 'bg-blue-50 text-blue-600' },
  { value: 'SELLER', label: 'Property Seller', icon: UserCheck, description: 'Looking to sell properties', iconColor: 'bg-rose-50 text-rose-600' },
  { value: 'AGENT', label: 'Real Estate Agent', icon: Users, description: 'Helping clients buy and sell properties', iconColor: 'bg-emerald-50 text-emerald-600' },
  { value: 'LEGAL_REVIEWER', label: 'Legal Reviewer', icon: Scale, description: 'Reviewing legal documents and contracts', iconColor: 'bg-purple-50 text-purple-600' },
  { value: 'BANK', label: 'Bank / Lender', icon: Briefcase, description: 'Providing financing for real estate', iconColor: 'bg-amber-50 text-amber-600' }
];

const ROLE_DASHBOARD_MAP = {
  'AGENT': '/agent/dashboard',
  'BUYER': '/dashboard',
  'SELLER': '/dashboard',
  'BANK': '/bank/dashboard',
  'LEGAL_REVIEWER': '/legal/dashboard',
};

export default function SelectRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      navigate('/login');
      return;
    }

    if (storedUser.role && storedUser.role !== '') {
      navigate(ROLE_DASHBOARD_MAP[storedUser.role] || '/dashboard', { replace: true });
      return;
    }

    setUserData(storedUser);
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId;

      if (!userId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }

      let response;
      try {
        response = await api.put(`/users/${userId}/role`, { role: selectedRole });
      } catch (err) {
        response = await api.put(`/auth/users/${userId}/role`, { role: selectedRole });
      }

      const updatedUser = { ...user, role: selectedRole, isNewUser: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate(ROLE_DASHBOARD_MAP[selectedRole] || '/dashboard', { replace: true });
    } catch (err) {
      let errorMessage = 'Failed to update role. Please try again.';
      if (err.response?.data?.error) errorMessage = err.response.data.error;
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="text-center pt-10 pb-6 px-6 border-b border-slate-200">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="RealEstate Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="hidden h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🏠</span>
            </div>
            <div className="text-left">
              <span className="text-[22px] font-extrabold tracking-tight text-slate-900 block leading-tight">RealEstate</span>
              <span className="text-[10px] font-medium text-emerald-600 tracking-widest uppercase">Due Diligence</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-4 tracking-tight">Choose Your Role</h1>
          <p className="text-slate-500 mt-2">
            Welcome {userData.fullName || userData.email || 'User'}! Select how you'll be using this platform
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;

            return (
              <motion.div
                key={role.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.value)}
                className={`bg-white cursor-pointer rounded-2xl p-6 transition-all border-2 shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${role.iconColor} ${isSelected ? 'border border-emerald-200' : ''}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-base ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
                      {role.label}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{role.description}</p>
                  </div>
                  {isSelected && (
                    <div className="text-emerald-500">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="border-t border-slate-200 mt-2 flex flex-col items-center justify-center pt-6 pb-8 px-6 bg-slate-50/30">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            style={{
              backgroundColor: selectedRole ? '#10b981' : '#cbd5e1',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '16px 0',
              width: '100%',
              maxWidth: '300px',
              borderRadius: '12px',
              boxShadow: selectedRole ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '0 auto',
              cursor: selectedRole ? 'pointer' : 'not-allowed',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Setting up...
              </div>
            ) : (
              <>Continue to Dashboard <ChevronRight className="h-5 w-5" /></>
            )}
          </button>

          <div className="mt-4 text-center text-xs text-slate-400">
            You can change your role later in settings
          </div>
        </div>
      </motion.div>
    </div>
  );
}