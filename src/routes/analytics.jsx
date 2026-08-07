// src/routes/analytics.jsx
import React from 'react';
import { PageHeader } from '../components/app-shell';
import { TrendingUp, TrendingDown, Users, Building2, FileText, AlertTriangle } from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

const activityData = [
  { month: 'Jan', reports: 42, users: 12 },
  { month: 'Feb', reports: 58, users: 15 },
  { month: 'Mar', reports: 71, users: 18 },
  { month: 'Apr', reports: 65, users: 20 },
  { month: 'May', reports: 82, users: 24 },
  { month: 'Jun', reports: 94, users: 28 },
];

const riskData = [
  { name: 'Low', value: 62, color: '#10b981' },
  { name: 'Medium', value: 28, color: '#f59e0b' },
  { name: 'High', value: 10, color: '#ef4444' },
];

const propertyTypes = [
  { type: 'Office', count: 45 },
  { type: 'Residential', count: 38 },
  { type: 'Mixed-Use', count: 22 },
  { type: 'Retail', count: 15 },
  { type: 'Industrial', count: 12 },
];

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader 
        title="Analytics Dashboard" 
        subtitle="Portfolio performance and insights"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Properties</span>
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">132</h3>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" /> +12 this month
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Active Users</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">28</h3>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" /> +8% growth
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reports Generated</span>
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">412</h3>
            <div className="flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" /> +24 this week
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk Alerts</span>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">7</h3>
            <div className="flex items-center gap-1 text-sm text-red-500">
              <TrendingDown className="h-4 w-4" /> 3 high priority
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