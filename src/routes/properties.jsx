// src/routes/properties.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/app-shell';
import { Input } from '../components/ui/input';
import { Search, Building2 } from 'lucide-react';
import { propertyService } from '../services/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getAll();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProperties();
      return;
    }
    setLoading(true);
    try {
      const response = await propertyService.search(searchQuery);
      setProperties(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return amount >= 1000000 ? `$${(amount / 1000000).toFixed(1)}M` : `$${amount.toLocaleString()}`;
  };

  const getRiskColor = (risk) => {
    if (!risk) return 'text-gray-500 bg-gray-100';
    switch(risk.toLowerCase()) {
      case 'low': return 'text-emerald-600 bg-emerald-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <>
      <PageHeader 
        title="Property Search" 
        subtitle="Find and analyze properties across the US"
        actions={
          // ✅ MOVED SEARCH BAR AND BUTTON SIDE-BY-SIDE HERE
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by address, city, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <button 
              onClick={handleSearch} 
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
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        }
      />

      {/* ✅ REMOVED THE INPUT FROM HERE BECAUSE IT'S NOW IN THE HEADER */}
      
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{property.address}</h3>
                      <p className="text-gray-600">{property.city}, {property.state} {property.zipCode}</p>
                      <p className="text-xs text-gray-400 mt-1">Parcel ID: {property.parcelId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(property.risk)}`}>
                      {property.risk || 'Unknown'} Risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-semibold text-gray-900">{property.size || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold text-gray-900">{property.propertyType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cap Rate</p>
                      <p className="font-semibold text-gray-900">{property.capRate || 'N/A'}%</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => window.location.href = `/properties/${property.id}`}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s ease-in-out',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}