// src/routes/select-role.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, Scale, Briefcase, UserCheck, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ROLES = [
  { value: 'BUYER', label: 'Property Buyer', icon: Building2, description: 'Looking to purchase properties', iconColor: 'bg-blue-50 text-blue-600' },
  { value: 'AGENT', label: 'Real Estate Agent', icon: Users, description: 'Helping clients buy and sell properties', iconColor: 'bg-emerald-50 text-emerald-600' },
  { value: 'LEGAL_REVIEWER', label: 'Legal Reviewer', icon: Scale, description: 'Reviewing legal documents and contracts', iconColor: 'bg-purple-50 text-purple-600' },
  { value: 'BANK', label: 'Bank / Lender', icon: Briefcase, description: 'Providing financing for real estate', iconColor: 'bg-amber-50 text-amber-600' },
  { value: 'ADMIN', label: 'Admin', icon: Shield, description: 'System administrator', iconColor: 'bg-indigo-50 text-indigo-600' }
];

export default function SelectRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const fullName = params.get('fullName');
    const userId = params.get('userId');

    if (!token || !email) {
      navigate('/login');
      return;
    }

    localStorage.setItem('tempToken', token);
    setUserData({ email, fullName, userId });
  }, [location, navigate]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('tempToken');
      const email = userData.email;
      
      const response = await api.put('/users/role', 
        { role: selectedRole, email: email },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('token', token);
      localStorage.removeItem('tempToken');
      
      localStorage.setItem('user', JSON.stringify({
        fullName: userData.fullName || 'User',
        email: userData.email,
        role: selectedRole,
        userId: userData.userId,
        active: true,
        emailVerified: true
      }));

      navigate('/dashboard');
      
    } catch (err) {
      let errorMessage = 'Failed to update role. Please try again.';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ RESTORED: Soft Slate Grey Background
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
      >
        <div className="text-center pt-10 pb-6 px-6 border-b border-slate-200">
          
          {/* ✅ HARDCODED LOGO TO BYPASS IMPORT ERROR */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <img 
              src="/logo.png" 
              alt="RealEstate Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback Box */}
            <div className="hidden h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-sm">RE</span>
            </div>
            <div>
              <span className="text-[18px] font-extrabold tracking-tight text-slate-900 block leading-none">RealEstate</span>
              <span className="text-[9px] font-medium text-emerald-600 tracking-wider">Due Diligence</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-6 tracking-tight">Choose Your Role</h1>
          <p className="text-slate-500 mt-2">
            Welcome {userData.fullName || 'User'}! Select how you'll be using Parcel Intelligence
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
                  {/* ✅ COLORFUL ICON BACKGROUNDS */}
                  <div className={`p-3 rounded-xl ${role.iconColor} ${
                    isSelected 
                      ? 'border border-emerald-200' 
                      : ''
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-base ${
                      isSelected ? 'text-emerald-700' : 'text-slate-900'
                    }`}>
                      {role.label}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {role.description}
                    </p>
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
          
          {/* ✅ PERFECT GREEN BUTTON */}
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
            onMouseOver={(e) => selectedRole && (e.target.style.backgroundColor = '#059669')}
            onMouseOut={(e) => selectedRole && (e.target.style.backgroundColor = '#10b981')}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Setting up...
              </div>
            ) : (
              <>
                Continue to Dashboard <ChevronRight className="h-5 w-5" />
              </>
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