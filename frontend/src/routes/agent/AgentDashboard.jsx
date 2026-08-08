// src/routes/agent/AgentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Home, Plus, Eye, Edit, Trash2, DollarSign, MapPin,
  Clock, TrendingUp, Users, FileText, Search, Filter,
  AlertCircle, CheckCircle, CheckCircle2, XCircle, BarChart3, FileCheck,
  Building2, Phone, Mail, Calendar, Star, RefreshCw,
  AlertTriangle // ✅ YEH IMPORT ADD KIYA HAI
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    underContract: 0,
    soldProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalClients: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/seller/dashboard');
      const data = response.data;
      if (data.success) {
        setStats({
          totalListings: data.totalListings || 0,
          activeListings: data.activeListings || 0,
          underContract: data.underContract || 0,
          soldProperties: data.soldProperties || 0,
          totalViews: data.totalViews || 0,
          totalInquiries: data.totalInquiries || 0,
          pendingInquiries: data.pendingInquiries || 0,
          totalClients: data.totalClients || 0
        });
        setRecentProperties(data.recentProperties || []);
        setRecentInquiries(data.recentInquiries || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      // Fallback mock data
      setStats({
        totalListings: 0,
        activeListings: 0,
        underContract: 0,
        soldProperties: 0,
        totalViews: 0,
        totalInquiries: 0,
        pendingInquiries: 0,
        totalClients: 0
      });
      setRecentProperties([]);
      setRecentInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-700';
      case 'UNDER_CONTRACT': return 'bg-amber-100 text-amber-700';
      case 'SOLD': return 'bg-blue-100 text-blue-700';
      case 'WITHDRAWN': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
    <>
      <PageHeader 
        title="Agent Dashboard" 
        subtitle="Welcome back, Archana Pakhale! Here's your workspace overview."
        actions={
          <div className="flex gap-3">
            {/* ✅ VISIBLE GREEN BUTTON WITH DARK TEXT */}
            <button
              onClick={() => navigate('/agent/list-property')}
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              List Property
            </button>
            
            {/* View Listings Button (The Blue one) */}
            <Button 
              variant="outline"
              onClick={() => navigate('/agent/my-properties')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Listings
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Properties</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Building2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Total properties</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Transactions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">In progress</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Reviews</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Awaiting action</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Reports Generated</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <FileCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">0</h3>
            <p className="mt-1 text-xs text-slate-500">Total reports</p>
          </div>
        </div>
      </div>

      {/* Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Property Viewed</div>
                <div className="text-slate-500 text-[10.5px]">123 Main Street</div>
                <span className="text-[9px] text-slate-400">2 minutes ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-3.5 w-3.5" /> {/* ✅ Now defined */}
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Risk Alert</div>
                <div className="text-slate-500 text-[10.5px]">New lien detected on property</div>
                <span className="text-[9px] text-slate-400">1 hour ago</span>
              </div>
            </div>
            <div className="flex gap-3 items-start text-xs">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-[11.5px]">Report Generated</div>
                <div className="text-slate-500 text-[10.5px]">Due Diligence Report #1234</div>
                <span className="text-[9px] text-slate-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => navigate('/agent/list-property')}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
            >
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 mx-auto w-fit">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">List Property</p>
            </button>
            <button 
              onClick={() => navigate('/agent/my-properties')}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all text-center"
            >
              <div className="p-2 rounded-xl bg-gray-100 text-gray-600 mx-auto w-fit">
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2">View Listings</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}