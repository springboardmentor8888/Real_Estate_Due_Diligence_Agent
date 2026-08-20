// src/routes/analytics.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/app-shell';
import { TrendingUp, TrendingDown, Users, Building2, FileText, AlertTriangle } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { dashboardService, propertyService } from '../services/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeUsers: 0,
    reportsGenerated: 0,
    highRiskAlerts: 0
  });
  const [activityData, setActivityData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats('BUYER');
      const data = res.data || {};
      setStats({
        totalProperties: data.totalProperties || 0,
        activeUsers: data.extraMetrics?.activeUsers || 0,
        reportsGenerated: data.reportsGenerated || 0,
        highRiskAlerts: data.highRiskAlerts || 0
      });

      // Map real risk data
      const riskOverview = data.riskOverview || {};
      const newRiskData = [
        { name: 'Low Risk', value: riskOverview.lowRiskCount || 0, color: '#10b981' },
        { name: 'Medium Risk', value: riskOverview.mediumRiskCount || 0, color: '#f59e0b' },
        { name: 'High Risk', value: riskOverview.highRiskCount || 0, color: '#ef4444' }
      ].filter(item => item.value > 0);
      setRiskData(newRiskData.length > 0 ? newRiskData : [{ name: 'No Risk Data', value: 1, color: '#e2e8f0' }]);

      // Map real activity data from recent activities (fallback to current month if empty)
      const activities = data.recentActivities || [];
      const activityMap = {};
      
      activities.forEach(item => {
        if (!item.timestamp) return;
        const date = new Date(item.timestamp);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!activityMap[month]) activityMap[month] = { month, reports: 0, users: 0 };
        if (item.type === 'REPORT') activityMap[month].reports += 1;
        else activityMap[month].users += 1; // Generic other activity for now
      });
      
      const newActivityData = Object.values(activityMap);
      if (newActivityData.length === 0) {
        newActivityData.push({ 
          month: new Date().toLocaleString('default', { month: 'short' }), 
          reports: 0, 
          users: 0 
        });
      }
      setActivityData(newActivityData);

    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { type: 'Properties', count: stats.totalProperties || 0 },
    { type: 'Reports', count: stats.reportsGenerated || 0 },
    { type: 'Alerts', count: stats.highRiskAlerts || 0 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Analytics Dashboard" 
        subtitle="Portfolio performance and database insights"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Total Properties</span>
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalProperties}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              Live from database
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Active Users</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{stats.activeUsers}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              Registered users
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Reports Generated</span>
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{stats.reportsGenerated}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              Due diligence reports
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">Risk Alerts</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">{stats.highRiskAlerts}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              High / Critical priority
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={riskData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80} 
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Property Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}