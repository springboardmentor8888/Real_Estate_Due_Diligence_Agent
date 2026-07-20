// src/routes/select-role.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, Scale, Briefcase, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Logo } from '../components/logo';
import api from '../services/api';

const ROLES = [
  { 
    value: 'BUYER', 
    label: 'Property Buyer', 
    icon: Building2,
    description: 'Looking to purchase properties'
  },
  { 
    value: 'AGENT', 
    label: 'Real Estate Agent', 
    icon: Users,
    description: 'Helping clients buy and sell properties'
  },
  { 
    value: 'LEGAL_REVIEWER', 
    label: 'Legal Reviewer', 
    icon: Scale,
    description: 'Reviewing legal documents and contracts'
  },
  { 
    value: 'BANK', 
    label: 'Bank / Lender', 
    icon: Briefcase,
    description: 'Providing financing for real estate'
  },
  { 
    value: 'ADMIN', 
    label: 'Admin', 
    icon: Shield,
    description: 'System administrator'
  }
];

export default function SelectRole() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    const fullName = params.get('fullName');
    const userId = params.get('userId');
    const picture = params.get('picture');

    console.log('SelectRole page loaded with:', { token, email, fullName, userId });

    if (!token || !email) {
      console.error('Missing required parameters');
      navigate('/login');
      return;
    }

    // Store token temporarily
    localStorage.setItem('tempToken', token);
    setUserData({ email, fullName, userId, picture });
  }, [location, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

// src/routes/select-role.jsx - Updated handleSubmit
const handleSubmit = async () => {
  if (!selectedRole) {
    setError('Please select a role');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('tempToken');
    const email = userData.email; // Get email from URL params
    
    console.log('Updating role for email:', email);
    console.log('Selected role:', selectedRole);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'null');
    
    // Instead of using token to extract email, send email in the request body
    const response = await api.put('/users/role', 
      { 
        role: selectedRole,
        email: email  // Send email explicitly
      },
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    console.log('Role updated successfully:', response.data);

    // Store the JWT token permanently
    localStorage.setItem('token', token);
    localStorage.removeItem('tempToken');
    
    // Store user data
    localStorage.setItem('user', JSON.stringify({
      fullName: userData.fullName || 'User',
      email: userData.email,
      role: selectedRole,
      userId: userData.userId,
      picture: userData.picture,
      active: true,
      emailVerified: true
    }));

    // Redirect to dashboard
    navigate('/dashboard');
    
  } catch (err) {
    console.error('Role update error:', err);
    console.error('Error response:', err.response);
    console.error('Error data:', err.response?.data);
    
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error || 
                        'Failed to update role. Please try again.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-emerald/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <h1 className="text-3xl font-semibold text-gradient mt-6">
            Choose Your Role
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome {userData.fullName || 'User'}! Select how you'll be using Parcel Intelligence
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            
            return (
              <motion.div
                key={role.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.value)}
                className={`glass cursor-pointer rounded-2xl p-6 transition-all ${
                  isSelected 
                    ? 'border-emerald/50 shadow-glow bg-emerald/5' 
                    : 'hover:border-emerald/30'
                } border-2`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected 
                      ? 'bg-emerald/20 text-emerald' 
                      : 'bg-foreground/5 text-muted-foreground'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isSelected ? 'text-emerald' : 'text-foreground'
                    }`}>
                      {role.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="text-emerald">
                      <UserCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            className="w-full md:w-auto px-12 rounded-xl bg-emerald text-primary-foreground shadow-glow hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Continue to Dashboard'}
          </Button>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          You can change your role later in settings
        </div>
      </motion.div>
    </div>
  );
}