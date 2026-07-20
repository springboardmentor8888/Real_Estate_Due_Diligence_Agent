// src/routes/properties.jsx
import React, { useState, useEffect } from 'react';
import { AppShell, PageHeader } from '../components/app-shell';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, MapPin, Building2, DollarSign, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.propertyType) params.append('propertyType', filters.propertyType);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      const response = await api.get(`/properties/search?${params.toString()}`);
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
    switch(risk) {
      case 'LOW': return 'text-emerald bg-emerald/10';
      case 'MEDIUM': return 'text-amber-400 bg-amber-500/10';
      case 'HIGH': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-foreground/5';
    }
  };

  return (
    <AppShell>
      <PageHeader 
        title="Property Search" 
        subtitle="Find and analyze properties across the US"
        actions={
          <Button 
            onClick={handleSearch} 
            className="bg-emerald text-primary-foreground hover:bg-emerald/90"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by address, city, state, or parcel ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-background/50"
            />
          </div>
          <Input
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
            className="bg-background/50"
          />
          <Input
            placeholder="State"
            value={filters.state}
            onChange={(e) => setFilters({...filters, state: e.target.value})}
            className="bg-background/50"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          properties.map((property) => (
            <div key={property.id} className="glass rounded-2xl p-6 hover:shadow-glow transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {property.address}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {property.city}, {property.state} {property.zipCode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Parcel ID: {property.parcelId}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(property.risk)}`}>
                      {property.risk || 'Unknown'} Risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-medium">{formatCurrency(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="font-medium">{property.size || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium">{property.propertyType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cap Rate</p>
                      <p className="font-medium">{property.capRate || 'N/A'}%</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="shrink-0"
                  onClick={() => window.location.href = `/properties/${property.id}`}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}