// src/routes/agent/MyProperties.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Home, Plus, Eye, Edit, Trash2, DollarSign, MapPin, 
  Clock, TrendingUp, Users, FileText, Search, Filter,
  AlertCircle, CheckCircle, XCircle, Building2, RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/seller/my-properties');
      console.log('Properties response:', response.data);
      
      if (response.data.success) {
        setProperties(response.data.properties || []);
      } else {
        setError(response.data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/seller/delete-property/${id}`);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/seller/update-status/${id}?status=${status}`);
      setProperties(properties.map(p => 
        p.id === id ? { ...p, listingStatus: status } : p
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UNDER_REVIEW': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'VERIFIED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SOLD': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'AVAILABLE': return <CheckCircle className="h-3 w-3" />;
      case 'UNDER_REVIEW': return <Clock className="h-3 w-3" />;
      case 'SOLD': return <CheckCircle className="h-3 w-3" />;
      case 'WITHDRAWN': return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.parcelId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.listingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        title="My Properties" 
        subtitle={`${properties.length} properties listed`}
        actions={
          <div className="flex gap-3">
            {/* Refresh Button */}
            <Button 
              variant="outline"
              onClick={fetchProperties}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-white shadow-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            {/* ✅ FIXED: Standard HTML Button - Green Background with Dark Text */}
            <button
              onClick={() => navigate('/agent/list-property')}
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              List New Property
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Listings</p>
          <p className="text-2xl font-bold text-slate-800">{properties.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-600">
            {properties.filter(p => p.listingStatus === 'AVAILABLE').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under Contract</p>
          <p className="text-2xl font-bold text-amber-600">
            {properties.filter(p => p.listingStatus === 'UNDER_CONTRACT').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sold</p>
          <p className="text-2xl font-bold text-blue-600">
            {properties.filter(p => p.listingStatus === 'SOLD').length}
          </p>
        </div>
      </div>

      {/* Filters - Polished Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search properties by address, city or parcel ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="SOLD">Sold</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Home className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">No properties found</h3>
            <p className="text-slate-500 mt-1">Start listing your first property</p>
            {/* ✅ FIXED: Green Button with Dark Text here too */}
            <button
              onClick={() => navigate('/agent/list-property')}
              className="mt-4 !bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-emerald-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              List Your First Property
            </button>
          </div>
        ) : (
          filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image Section */}
              <div className="h-48 bg-slate-200 relative">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={`http://localhost:8080${property.images[0]}`} 
                    alt={property.address}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200">
                    <div className="text-center">
                      <Building2 className="h-16 w-16 text-emerald-300 mx-auto" />
                      <p className="text-xs text-emerald-500 mt-2">No Image</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={getStatusColor(property.listingStatus)}>
                    {getStatusIcon(property.listingStatus)}
                    <span className="ml-1">{property.listingStatus?.replace('_', ' ') || 'Unknown'}</span>
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1">
                  <Badge variant="outline" className="bg-white/90 text-xs">
                    {property.propertyType || 'Property'}
                  </Badge>
                  {property.images && property.images.length > 0 && (
                    <Badge variant="outline" className="bg-white/90 text-xs flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {property.images.length}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{property.address}</h3>
                  <p className="text-xs text-slate-500">{property.city}, {property.state} {property.zipCode}</p>
                </div>
                <div className="mt-2">
                  <span className="text-emerald-600 font-bold text-lg">${property.price?.toLocaleString()}</span>
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/properties/${property.id}`)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View Property"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                      title="Editing is not available yet"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProperty(property.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <label className="mt-3 block text-xs text-slate-500">
                  Status
                  <select
                    value={property.listingStatus || 'UNDER_REVIEW'}
                    onChange={(event) => updateStatus(property.id, event.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
                  >
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="SOLD">Sold</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </label>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}
