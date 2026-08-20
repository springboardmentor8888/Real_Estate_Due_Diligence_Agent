// src/routes/properties.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/app-shell';
import { Input } from '../components/ui/input';
import { Search, Building2, Eye, ShieldCheck, MapPin, DollarSign } from 'lucide-react';
import { propertyService } from '../services/api';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getAll({ size: 30 });
      const list = response.data?.content || (Array.isArray(response.data) ? response.data : []);
      setProperties(list);
    } catch (error) {
      console.error('Error fetching properties from backend:', error);
      setProperties([]);
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
      // The API exposes structured search criteria only. Fetch the catalogue and
      // filter the fields displayed by this directory instead of sending an
      // unsupported `query` parameter that the backend would ignore.
      const response = await propertyService.getAll({ size: 100 });
      const list = response.data?.content || (Array.isArray(response.data) ? response.data : []);
      const query = searchQuery.trim().toLowerCase();
      setProperties(list.filter((property) => [
        property.propertyName,
        property.propertyCode,
        property.address?.addressLine1,
        property.address?.addressLine2,
        property.address?.city,
        property.address?.state,
        property.address?.postalCode,
      ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query))));
    } catch (error) {
      console.error('Error searching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return '$' + Number(amount).toLocaleString();
  };

  const getRiskColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
      case 'VERIFIED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'UNDER_REVIEW':
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'SOLD':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <>
      <PageHeader 
        title="Property Directory" 
        subtitle="Explore real properties and due diligence assets retrieved live from PostgreSQL"
        actions={
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
      
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading properties from PostgreSQL...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900">No properties found in database</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or add new properties.</p>
          </div>
        ) : (
          properties.map((property) => {
            const propId = property.propertyId || property.id;
            const addressLine = property.address?.addressLine1 || property.propertyName || property.address || 'Property Address';
            const city = property.address?.city || property.city || '';
            const state = property.address?.state || property.state || '';
            const postalCode = property.address?.postalCode || property.zipCode || '';
            const locationStr = (city || state) ? `${city}${city && state ? ', ' : ''}${state} ${postalCode}` : '';
            const price = property.marketValue || property.price || 0;
            const code = property.propertyCode || property.parcelId || `P-${propId}`;
            const size = property.totalArea ? `${property.totalArea} sq ft` : (property.size || 'N/A');
            const propType = property.propertyType || 'Real Estate';
            const status = property.status || 'AVAILABLE';

            return (
              <div key={propId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{addressLine}</h3>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                            {code}
                          </span>
                        </div>
                        {locationStr && <p className="text-xs text-slate-500 mt-1">{locationStr}</p>}
                        {property.description && (
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{property.description}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase font-medium">Market Value</p>
                        <p className="font-bold text-emerald-600 text-sm mt-0.5">{formatCurrency(price)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase font-medium">Total Area</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{size}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase font-medium">Property Type</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{propType}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase font-medium">Built Year</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{property.builtYear || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/properties/${propId}`)}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.2s ease-in-out',
                      whiteSpace: 'nowrap',
                      alignSelf: 'center'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                  >
                    <Eye className="h-4 w-4" />
                    Due Diligence
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
