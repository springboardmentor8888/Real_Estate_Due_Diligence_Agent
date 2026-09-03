// src/routes/watchlist.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/app-shell';
import { Badge } from '../components/ui/badge';
import { 
  Star, Eye, Bell, X, Home, DollarSign, MapPin, Clock, 
  AlertTriangle, CheckCircle, Shield, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/buyer/watchlist');
      console.log('Watchlist response:', response.data);
      
      if (response.data.success) {
        setWatchlist(response.data.watchlist || []);
      } else {
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlist([]);
      setError(error.response?.data?.message || 'Watchlist could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (propertyId) => {
    if (!window.confirm('Remove this property from watchlist?')) return;
    
    try {
      await api.delete(`/buyer/watchlist/${propertyId}`);
      setWatchlist(watchlist.filter(item => item.id !== propertyId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist');
    }
  };

  const toggleAlerts = async (propertyId) => {
    try {
      const response = await api.patch(`/buyer/watchlist/${propertyId}/alerts`);
      if (response.data.success) {
        setWatchlist(watchlist.map(item => 
          item.id === propertyId ? { ...item, alertsEnabled: response.data.alertsEnabled } : item
        ));
      }
    } catch (error) {
      console.error('Error toggling alerts:', error);
      alert('Failed to toggle alerts');
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'LOW': return 'text-emerald-600 bg-emerald-50';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"><div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span><button type="button" onClick={fetchWatchlist} className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Retry</button></div></div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Watchlist" 
        subtitle={`${watchlist.length} properties you're tracking`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-200">
              <div className="w-full h-full flex items-center justify-center">
                <Home className="h-16 w-16 text-emerald-300" />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className={item.listingStatus === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-500'}>
                  {item.listingStatus || 'Available'}
                </Badge>
              </div>
              <button
                onClick={() => removeFromWatchlist(item.id)}
                className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-full hover:bg-red-50 transition-colors shadow-md"
              >
                <X className="h-4 w-4 text-gray-600 hover:text-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.address}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-600 font-bold text-lg">
                  ${item.price?.toLocaleString() || 'N/A'}
                </span>
                <Badge variant="outline" className="text-xs">{item.propertyType || 'Property'}</Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRiskColor(item.risk)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {item.risk || 'N/A'} Risk
                </Badge>
                {item.riskScore && (
                  <span className="text-xs text-gray-500">Score: {item.riskScore}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlerts(item.id)}
                    className={`p-1.5 rounded-full transition-colors ${
                      item.alertsEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={item.alertsEnabled ? 'Alerts On' : 'Alerts Off'}
                  >
                    <Bell className={`h-4 w-4 ${item.alertsEnabled ? 'fill-emerald-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => navigate(`/properties/${item.id}`)}
                    className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View Property"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {watchlist.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">Your watchlist is empty</h3>
            <p className="text-slate-500 mb-4">Start tracking properties you're interested in</p>
            
            {/* ✅ REPLACED GHOST BUTTON WITH VISIBLE GREEN BUTTON */}
            <button
              onClick={() => navigate('/properties')}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <Home className="h-4 w-4" />
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </>
  );
}