// src/routes/profile.jsx
import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  User, Mail, Building2, Shield, Calendar, Edit2, Save, X, Camera,
  Phone, MapPin, Briefcase, Scale, Landmark, Lock, Key,
  FileText, TrendingUp, Activity, Users, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: '',
    companyName: '',
    licenseNumber: '',
    barNumber: '',
    bankName: '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const name = userData.fullName || (userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : '') || 'User';
    const email = userData.email || '';
    const role = (userData.role || 'BUYER').toUpperCase();

    setUser({
      fullName: name,
      email: email,
      role: role,
      createdAt: userData.createdAt || new Date().toISOString(),
    });
    setFormData({
      fullName: name,
      email: email,
      role: role,
      phoneNumber: userData.phone || '',
      address: '',
      companyName: '',
      licenseNumber: '',
      barNumber: '',
      bankName: '',
    });
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    
    // Simulate a save delay
    setTimeout(() => {
      setUser({ ...user, ...formData });
      localStorage.setItem('user', JSON.stringify({
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        fullName: formData.fullName,
      }));
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleIcon = (role) => {
    switch(role?.toUpperCase()) {
      case 'AGENT': return <Briefcase className="h-4 w-4" />;
      case 'SELLER': return <Briefcase className="h-4 w-4" />;
      case 'LEGAL_REVIEWER': return <Scale className="h-4 w-4" />;
      case 'BANK': return <Landmark className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch(role?.toUpperCase()) {
      case 'AGENT': return 'bg-blue-100 text-blue-700';
      case 'SELLER': return 'bg-rose-100 text-rose-700';
      case 'LEGAL_REVIEWER': return 'bg-indigo-100 text-indigo-700';
      case 'BANK': return 'bg-amber-100 text-amber-700';
      default: return 'bg-emerald-100 text-emerald-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* CUSTOM HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card - Left Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto border-4 border-emerald-100 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-2xl font-bold">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.fullName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <Badge className={`mt-3 ${getRoleColor(user?.role)} px-3 py-1`}>
              {getRoleIcon(user?.role)}
              <span className="ml-1">{user?.role || 'BUYER'}</span>
            </Badge>
            <div className="mt-4 pt-4 border-t border-gray-100 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              {user?.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setEditing(!editing)}
              style={{
                backgroundColor: editing ? '#ef4444' : '#10b981',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '10px 0',
                width: '100%',
                marginTop: '16px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = editing ? '#dc2626' : '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = editing ? '#ef4444' : '#10b981'}
            >
              {editing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats - Left Side Bottom */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <FileText className="h-5 w-5 text-emerald-600 mx-auto" />
              <p className="text-xl font-bold text-gray-900 mt-1">12</p>
              <p className="text-xs text-gray-500">Reports</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto" />
              <p className="text-xl font-bold text-gray-900 mt-1">8</p>
              <p className="text-xs text-gray-500">Properties</p>
            </div>
          </div>
        </div>

        {/* Profile Form - Right Side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              Profile Information
            </h3>
            
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            )}

            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Row 3 - Role */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <Input
                  value={formData.role || 'BUYER'}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
                <p className="text-xs text-gray-400 mt-1">Role is assigned during registration</p>
              </div>

              {/* Role-specific fields */}
              {formData.role === 'AGENT' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">License Number</Label>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                    placeholder="Enter license number"
                  />
                </div>
              )}

              {formData.role === 'LEGAL_REVIEWER' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bar Number</Label>
                  <Input
                    value={formData.barNumber}
                    onChange={(e) => setFormData({...formData, barNumber: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                    placeholder="Enter bar number"
                  />
                </div>
              )}

              {formData.role === 'BANK' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    disabled={!editing}
                    className={!editing ? 'bg-gray-50 border-gray-200' : 'border-emerald-200 focus:ring-emerald-500'}
                    placeholder="Enter bank name"
                  />
                </div>
              )}

              {/* Save Button */}
              {editing && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      padding: '12px 0',
                      width: '100%',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">
                  <Key className="h-4 w-4 mr-2 inline" />
                  Change Password
                </button>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-sm font-medium">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}