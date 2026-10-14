// src/routes/properties.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/app-shell';
import { Input } from '../components/ui/input';
import {
  Search,
  Building2,
  Eye,
  ShieldCheck,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { propertyService } from '../services/api';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchProperties = useCallback(async (pageIndex = 0, query = activeQuery, size = pageSize) => {
    setLoading(true);
    try {
      const params = { page: pageIndex, size };
      if (query && query.trim()) {
        params.query = query.trim();
      }
      const response = await propertyService.getAll(params);
      const data = response.data;

      if (data && typeof data === 'object') {
        const list = data.content || (Array.isArray(data) ? data : []);
        setProperties(list);
        setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : (list.length > 0 ? 1 : 0));
        setTotalElements(typeof data.totalElements === 'number' ? data.totalElements : list.length);
        setPage(typeof data.number === 'number' ? data.number : pageIndex);
      } else {
        setProperties([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Error fetching properties from backend:', error);
      setProperties([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [activeQuery, pageSize]);

  useEffect(() => {
    fetchProperties(page, activeQuery, pageSize);
  }, [fetchProperties, page, activeQuery, pageSize]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setActiveQuery(trimmed);
    setPage(0);
    fetchProperties(0, trimmed, pageSize);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveQuery('');
    setPage(0);
    fetchProperties(0, '', pageSize);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== page) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setPage(0);
  };

  const isSynthetic = (property) => {
    const code = property?.propertyCode || property?.parcelId || '';
    const desc = property?.description || '';
    return code.startsWith('SYN-') ||
           desc.includes('[Demonstration Asset]') ||
           desc.toLowerCase().includes('synthetic demonstration');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return '$' + Number(amount).toLocaleString();
  };

  const getRiskColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'VERIFIED':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'UNDER_REVIEW':
      case 'PENDING':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'SOLD':
        return 'text-slate-700 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const startRecord = totalElements > 0 ? page * pageSize + 1 : 0;
  const endRecord = Math.min((page + 1) * pageSize, totalElements);

  return (
    <>
      <PageHeader
        title="Property Directory"
        subtitle="Explore real properties and due diligence assets retrieved live from PostgreSQL"
        actions={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search code, city, street, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
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

      {/* Dataset & Synthetic Transparency Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900 mb-4 shadow-sm">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="leading-relaxed">
          <span className="font-semibold text-amber-950">Synthetic Demonstration Data Notice: </span>
          This catalogue contains simulated real estate assets marked with the <span className="inline-block bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded border border-amber-300 text-[10px]">Synthetic Demo</span> tag.
          Synthetic property records are generated strictly for algorithmic testing and due diligence workflow simulation.
          Their ownership, title chain, municipal zoning, and legal status are unverified simulation data and must not be treated as real-world transactions.
        </div>
      </div>

      {/* Active Search & Result Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-slate-600 mb-2">
        <div className="flex items-center gap-2">
          {activeQuery ? (
            <span className="flex items-center gap-1.5">
              <span>Results for</span>
              <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                "{activeQuery}"
              </strong>
              <button
                onClick={handleClearSearch}
                className="text-emerald-600 hover:text-emerald-700 underline font-medium ml-1"
              >
                Clear filter
              </button>
            </span>
          ) : (
            <span>Showing all properties in catalog</span>
          )}
          <span className="text-slate-400">•</span>
          <span>
            {totalElements > 0 ? (
              <>Showing <strong>{startRecord}</strong>–<strong>{endRecord}</strong> of <strong>{totalElements}</strong> properties</>
            ) : (
              '0 properties'
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="pageSizeSelect" className="text-slate-500">Rows per page:</label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">Loading properties from PostgreSQL...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900">No properties found</h3>
            <p className="text-xs text-gray-500 mt-1">
              {activeQuery
                ? `No properties matched "${activeQuery}". Try adjusting your search keywords.`
                : 'No property records are currently available in the database.'}
            </p>
            {activeQuery && (
              <button
                onClick={handleClearSearch}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Clear Search
              </button>
            )}
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
            const size = property.totalArea ? `${Number(property.totalArea).toLocaleString()} sq ft` : (property.size || 'N/A');
            const propType = property.propertyType || 'Real Estate';
            const status = property.status || 'AVAILABLE';
            const synthetic = isSynthetic(property);

            return (
              <div key={propId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{addressLine}</h3>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                            {code}
                          </span>
                          {synthetic && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Synthetic Demo
                            </span>
                          )}
                        </div>
                        {locationStr && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {locationStr}
                        </p>}
                        {property.description && (
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{property.description}</p>
                        )}
                        {synthetic && (
                          <p className="text-[11px] text-amber-700 bg-amber-50/60 rounded px-2 py-1 mt-2 border border-amber-100">
                            <strong>Demonstration Simulation:</strong> Generated algorithmic record. Ownership, title, and legal permits are unverified synthetic test data.
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getRiskColor(status)}`}>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mt-6">
          <div className="text-xs text-slate-500">
            Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong> ({totalElements} total properties)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(0)}
              disabled={page === 0 || loading}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0 || loading}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-medium"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>

            {/* Quick page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page <= 2) {
                pageNum = i;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                  className={`min-w-[34px] h-[34px] px-2 rounded-lg text-xs font-semibold transition ${
                    page === pageNum
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-medium"
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
