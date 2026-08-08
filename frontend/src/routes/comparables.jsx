// src/routes/comparables.jsx
import React, { useState } from 'react';
import { PageHeader } from '../components/app-shell';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, GitCompare, Home, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ComparablesPage() {
  const [comparables] = useState([
    {
      id: 1,
      address: '456 Oak Avenue, San Francisco, CA',
      price: 810000,
      sqft: 2000,
      beds: 3,
      baths: 2,
      distance: '0.3 mi',
      matchScore: 95,
      yearBuilt: 2018,
    },
    {
      id: 2,
      address: '789 Pine Street, San Francisco, CA',
      price: 690000,
      sqft: 1750,
      beds: 3,
      baths: 2,
      distance: '0.8 mi',
      matchScore: 88,
      yearBuilt: 2015,
    },
    {
      id: 3,
      address: '321 Elm Boulevard, San Francisco, CA',
      price: 725000,
      sqft: 1900,
      beds: 4,
      baths: 2.5,
      distance: '1.2 mi',
      matchScore: 76,
      yearBuilt: 2020,
    },
    {
      id: 4,
      address: '987 Maple Drive, San Francisco, CA',
      price: 950000,
      sqft: 2200,
      beds: 4,
      baths: 3,
      distance: '0.6 mi',
      matchScore: 82,
      yearBuilt: 2019,
    },
  ]);

  return (
    <>
      <PageHeader 
        title="Comparables Analysis" 
        subtitle="Compare properties side by side"
        actions={
          // ✅ VISIBLE PURPLE BUTTON
          <button
            onClick={() => alert('Comparing selected properties...')}
            style={{
              backgroundColor: '#8b5cf6', // Purple
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '12px',
              boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            <GitCompare className="h-4 w-4" />
            Compare Selected
          </button>
        }
      />

      {/* ✅ SIDE-BY-SIDE INPUT AND GREEN SEARCH BUTTON */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Enter address to find comparables..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
            />
          </div>
          
          {/* ✅ VISIBLE GREEN SEARCH BUTTON */}
          <button
            onClick={() => alert('Searching for comparables...')}
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
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparables.map((comp, index) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-500/30"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900 text-sm">#{comp.id}</h3>
              </div>
              <Badge className={`${comp.matchScore >= 90 ? 'bg-emerald-500' : comp.matchScore >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                {comp.matchScore}% Match
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{comp.address}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-semibold text-slate-900">${comp.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Size</p>
                  <p className="font-semibold text-slate-900">{comp.sqft} sqft</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Beds/Baths</p>
                  <p className="font-semibold text-slate-900">{comp.beds} beds / {comp.baths} baths</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Distance</p>
                  <p className="font-semibold text-slate-900">{comp.distance}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-slate-500">Built {comp.yearBuilt}</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  ${(comp.price / comp.sqft).toFixed(0)}/sqft
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {comparables.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800">No comparables found</h3>
          <p className="text-slate-500">Search for a property to find comparables</p>
        </div>
      )}
    </>
  );
}