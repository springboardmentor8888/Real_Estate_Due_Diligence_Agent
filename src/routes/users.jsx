// src/routes/users.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { 
  Trash2, Mail, User, 
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import api from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ UPDATED PATH TO MATCH YOUR BACKEND CONTROLLER
        const response = await api.get('/admin/users');
        
        setUsers(response.data || []);
        
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Could not load user data. Please make sure the Spring Boot backend is running on port 8080.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleBadge = (role) => {
    switch(role) {
      case 'BUYER': return <Badge className="bg-blue-500 text-white border-0">BUYER</Badge>;
      case 'AGENT': return <Badge className="bg-indigo-500 text-white border-0">AGENT</Badge>;
      case 'LEGAL_REVIEWER': return <Badge className="bg-emerald-500 text-white border-0">LEGAL_REVIEWER</Badge>;
      case 'BANK': return <Badge className="bg-amber-500 text-white border-0">BANK</Badge>;
      default: return <Badge className="bg-slate-300 text-slate-700 border-0">UNKNOWN</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl shadow-lg border border-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-slate-500">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="User Management" subtitle="Error loading data" />
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-red-100 max-w-2xl mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Connection Error</h3>
          <p className="text-slate-500 mb-4">{error}</p>
          <p className="text-xs text-slate-400">Make sure your Spring Boot backend is running on port 8080.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="User Management" 
        subtitle={`Manage ${users.length} registered users`}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-600">User</th>
                <th className="px-6 py-4 font-medium text-slate-600">Email</th>
                <th className="px-6 py-4 font-medium text-slate-600">Role</th>
                <th className="px-6 py-4 font-medium text-slate-600">Status</th>
                <th className="px-6 py-4 font-medium text-slate-600">Verified</th>
                <th className="px-6 py-4 font-medium text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    No registered users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <motion.tr 
                    key={user.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        {user.fullName || user.name || 'User'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {user.active ? (
                        <Badge className="bg-emerald-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
                      ) : (
                        <Badge className="bg-red-500 text-white"><AlertCircle className="h-3 w-3 mr-1" /> Inactive</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.emailVerified ? (
                        <Badge className="bg-slate-100 text-slate-700 border-0"><CheckCircle className="h-3 w-3 mr-1 text-emerald-500" /> Verified</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 border-0"><AlertCircle className="h-3 w-3 mr-1 text-amber-500" /> Unverified</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert(`Delete user: ${user.email}`)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}