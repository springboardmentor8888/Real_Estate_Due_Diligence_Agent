// src/routes/admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { 
  Users, Building2, FileText, 
  AlertTriangle, CheckCircle, UserCheck, UserX, RefreshCw,
  MailCheck, MailX, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  Tooltip, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    roleCounts: {},
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    totalReports: 0,
    completedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/dashboard', { timeout: 10000 });
      const data = response.data;
      
      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch admin data');
      }
      
      const allUsers = data.users || [];
      const roleCounts = {};
      allUsers.forEach(u => {
        const role = u.role || 'UNKNOWN';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      
      const verifiedUsers = allUsers.filter(u => u.emailVerified).length;
      const unverifiedUsers = allUsers.filter(u => !u.emailVerified).length;
      
      setStats({
        totalUsers: data.totalUsers || allUsers.length,
        activeUsers: data.activeUsers || allUsers.filter(u => u.active).length,
        inactiveUsers: data.inactiveUsers || allUsers.filter(u => !u.active).length,
        verifiedUsers: verifiedUsers,
        unverifiedUsers: unverifiedUsers,
        roleCounts: roleCounts,
        totalProperties: data.totalProperties || 0,
        availableProperties: data.availableProperties || 0,
        soldProperties: data.soldProperties || 0,
        totalReports: data.totalReports || 0,
        completedReports: data.completedReports || 0,
      });
      
    } catch (error) {
      console.error('❌ Error fetching admin data:', error);
      let errorMessage = 'Failed to fetch admin data. ';
      if (error.code === 'ERR_NETWORK') {
        errorMessage += 'Cannot connect to the backend server. Please make sure the backend is running on port 8080.';
      } else if (error.response?.status === 403) {
        errorMessage += 'You do not have admin permissions.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Your session has expired. Please login again.';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        errorMessage += error.message || 'Please refresh the page.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-500">Loading admin data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={fetchAdminData}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
          <p className="text-xs text-gray-400">
            Make sure the backend server is running and you have admin access
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const roleChartData = Object.keys(stats.roleCounts || {}).map(role => ({
    name: role,
    value: stats.roleCounts[role]
  }));

  const userActivityData = [
    { name: 'Active', value: stats.activeUsers },
    { name: 'Inactive', value: stats.inactiveUsers },
  ];

  const verificationData = [
    { name: 'Verified', value: stats.verifiedUsers },
    { name: 'Unverified', value: stats.unverifiedUsers },
  ];

  return (
    <>
      <PageHeader 
        title="Admin Dashboard" 
        subtitle={`Welcome back, surendra pakhale! Here's your workspace overview.`}
        actions={
          <button
            onClick={fetchAdminData}
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            <RefreshCw className="h-4 w-4" /> Refresh Data
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-600 flex items-center"><UserCheck className="h-3 w-3 mr-1" /> {stats.activeUsers} Active</span>
            <span className="text-gray-300">|</span>
            <span className="text-red-500 flex items-center"><UserX className="h-3 w-3 mr-1" /> {stats.inactiveUsers} Inactive</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Email Verification</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <MailCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-600">{stats.verifiedUsers} Verified</span>
            <span className="text-red-500">{stats.unverifiedUsers} Unverified</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-600">{stats.availableProperties} Available</span>
            <span className="text-rose-600">{stats.soldProperties} Sold</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-emerald-600">{stats.completedReports} Completed</span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Role Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Users by Role</h3>
            <Badge className="bg-blue-500">{Object.keys(roleChartData).length} Roles</Badge>
          </div>
          <div className="h-56">
            {roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No users data available
              </div>
            )}
          </div>
        </div>

        {/* User Status Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">User Status</h3>
            <Badge className="bg-emerald-500">Active vs Inactive</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Email Verification Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Email Verification</h3>
            <Badge className="bg-blue-500">Verified vs Unverified</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}