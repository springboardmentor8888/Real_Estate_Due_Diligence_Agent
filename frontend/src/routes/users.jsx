// src/routes/users.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/app-shell';
import { 
  Trash2, Mail, User, CheckCircle, AlertCircle, Loader2,
  Edit3, X, Eye, Check, ShieldAlert
} from 'lucide-react';
import api from '../services/api';

const AVAILABLE_ROLES = ['BUYER', 'SELLER', 'AGENT', 'LEGAL_REVIEWER', 'BANK'];

const ROLE_DASHBOARD = {
  BUYER:          '/dashboard',
  SELLER:         '/dashboard',
  AGENT:          '/agent/dashboard',
  LEGAL_REVIEWER: '/legal/dashboard',
  BANK:           '/bank/dashboard',
};

// ---------- Access Guard ----------
function AccessRestricted({ role }) {
  const home = ROLE_DASHBOARD[role] || '/dashboard';
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-red-100 max-w-md w-full">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          The User Directory is reserved for <strong>Real Estate Agents</strong> who manage workspace access.<br /><br />
          Your current role — <span className="font-bold text-slate-700">{role}</span> — does not have permission to view or manage system user data.
        </p>
        <a
          href={home}
          className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
        >
          Return to My Dashboard
        </a>
      </div>
    </div>
  );
}

export default function UserManagement() {
  // Read role synchronously so the guard fires before any effect/fetch
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();
  const currentRole = (storedUser.role || '').toUpperCase();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingRoleUser, setEditingRoleUser] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/stats').catch(() => ({ data: null }))
      ]);

      const rawUsers = usersRes.data || [];
      const sanitizedUsers = rawUsers.map(u => {
        let role = u.role || 'BUYER';
        if (role === 'ADMIN' || !role.trim()) role = 'AGENT';
        return {
          ...u,
          id: u.id || u.userId,
          userId: u.id || u.userId,
          role: role,
          active: u.active !== undefined ? Boolean(u.active) : true
        };
      });

      setUsers(sanitizedUsers);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Could not load user data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRole === 'AGENT') {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/users/${userId}/status`);
      if (response.data && response.data.success) {
        setUsers(prev => prev.map(u => (u.id === userId || u.userId === userId) ? { ...u, active: response.data.active } : u));
        fetchUserData();
      }
    } catch (err) {
      alert('Failed to update user status: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      if (response.data) {
        setUsers(prev => prev.map(u => (u.id === userId || u.userId === userId) ? { ...u, role: response.data.role || newRole } : u));
        setEditingRoleUser(null);
        fetchUserData();
      }
    } catch (err) {
      alert('Failed to update user role: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }
    try {
      setActionLoading(true);
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId && u.userId !== userId));
      fetchUserData();
    } catch (err) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // High-contrast, vibrant solid role badges
  const getRoleBadge = (role) => {
    const key = (role || 'BUYER').toUpperCase();
    switch(key) {
      case 'BUYER':
        return <span className="inline-flex items-center px-3 py-1 bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">BUYER</span>;
      case 'SELLER':
        return <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">SELLER</span>;
      case 'AGENT':
        return <span className="inline-flex items-center px-3 py-1 bg-purple-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">AGENT</span>;
      case 'LEGAL_REVIEWER':
        return <span className="inline-flex items-center px-3 py-1 bg-violet-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">LEGAL REVIEWER</span>;
      case 'BANK':
        return <span className="inline-flex items-center px-3 py-1 bg-amber-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">BANK</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">BUYER</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // ── ROLE GUARD (frontend layer) ──────────────────────────
  // Only AGENT may view the User Directory.
  if (!loading && currentRole !== 'AGENT') {
    return <AccessRestricted role={currentRole || 'USER'} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium">Loading user directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="User Directory & Management" subtitle="Error loading data" />
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-red-100 max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Error</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <button onClick={fetchUserData} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
            Retry Connection
          </button>
        </div>
      </>
    );
  }

  // Calculate strict counts from local users array to guarantee math accuracy
  const totalBuyers = users.filter(u => u.role === 'BUYER').length;
  const totalSellers = users.filter(u => u.role === 'SELLER').length;
  const totalAgents = users.filter(u => u.role === 'AGENT').length;
  const totalLegal = users.filter(u => u.role === 'LEGAL_REVIEWER').length;
  const totalBanks = users.filter(u => u.role === 'BANK').length;
  const totalUsers = totalBuyers + totalSellers + totalAgents + totalLegal + totalBanks;

  const activeCount = users.filter(u => u.active === true).length;
  const inactiveCount = totalUsers - activeCount;

  return (
    <>
      <PageHeader 
        title="User Directory & Management" 
        subtitle={`System registry containing ${totalUsers} registered accounts`}
      />

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Total Users</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalUsers}</span>
        </div>
        <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 shadow-sm">
          <span className="text-[11px] text-blue-700 font-bold block uppercase tracking-wider">Buyers</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{totalBuyers}</span>
        </div>
        <div className="bg-red-50/80 p-4 rounded-2xl border border-red-100 shadow-sm">
          <span className="text-[11px] text-red-700 font-bold block uppercase tracking-wider">Sellers</span>
          <span className="text-2xl font-black text-red-900 mt-1 block">{totalSellers}</span>
        </div>
        <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-100 shadow-sm">
          <span className="text-[11px] text-purple-700 font-bold block uppercase tracking-wider">Agents</span>
          <span className="text-2xl font-black text-purple-900 mt-1 block">{totalAgents}</span>
        </div>
        <div className="bg-violet-50/80 p-4 rounded-2xl border border-violet-100 shadow-sm">
          <span className="text-[11px] text-violet-700 font-bold block uppercase tracking-wider">Legal</span>
          <span className="text-2xl font-black text-violet-900 mt-1 block">{totalLegal}</span>
        </div>
        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-100 shadow-sm">
          <span className="text-[11px] text-amber-700 font-bold block uppercase tracking-wider">Banks</span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">{totalBanks}</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider">Active</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] text-slate-700 font-bold block uppercase tracking-wider">Inactive</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{inactiveCount}</span>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/70 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider">User</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider">Registered</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500 font-medium">
                    No registered users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const uid = user.id || user.userId;
                  const isEditingRole = editingRoleUser === uid;

                  return (
                    <motion.tr 
                      key={uid || index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* User Full Name */}
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                            <User className="h-4 w-4" />
                          </div>
                          <span>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Registered User'}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {user.email}
                        </div>
                      </td>

                      {/* Role Column (High-Contrast Solid Badge + Working Edit Button) */}
                      <td className="px-6 py-4">
                        {isEditingRole ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={user.role}
                              disabled={actionLoading}
                              onChange={(e) => handleChangeRole(uid, e.target.value)}
                              className="bg-white border-2 border-emerald-600 rounded-lg px-2.5 py-1 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              {AVAILABLE_ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => setEditingRoleUser(null)}
                              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                              title="Cancel Edit"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {getRoleBadge(user.role)}
                            <button 
                              onClick={() => setEditingRoleUser(uid)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                              title="Edit User Role"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4 text-slate-500 text-xs font-semibold">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Status Column (Solid Vibrant Badge: Green ACTIVE / Red INACTIVE) */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(uid)}
                          disabled={actionLoading}
                          className="focus:outline-none transition-transform hover:scale-105"
                          title="Click to toggle Active / Inactive status"
                        >
                          {user.active ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">
                              <CheckCircle className="h-3.5 w-3.5" /> ACTIVE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">
                              <AlertCircle className="h-3.5 w-3.5" /> INACTIVE
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-100"
                          title="View Profile Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(uid, user.email)}
                          disabled={actionLoading}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Detail Inspector Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">User Profile Details</h3>
                <button onClick={() => setSelectedUser(null)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-xl font-bold">
                    {selectedUser.fullName?.charAt(0) || selectedUser.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{selectedUser.fullName || 'Registered User'}</h4>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">Assigned Role</span>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">Account Status</span>
                    {selectedUser.active ? (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">ACTIVE</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-sm">INACTIVE</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">Registration Date</span>
                    <span className="text-slate-800 font-bold">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">Last Login</span>
                    <span className="text-slate-800 font-bold">{formatDate(selectedUser.lastLogin)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">User ID</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border text-xs font-bold">
                      #{selectedUser.id || selectedUser.userId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs mb-1 uppercase font-semibold">Email Verification</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">
                      <Check className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}