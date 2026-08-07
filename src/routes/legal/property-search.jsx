// src/routes/legal/property-search.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Search, MapPin, Home } from 'lucide-react';

export default function LegalPropertySearch() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Property Search" 
        subtitle="Find and analyze properties across the US"
        actions={
          <button className="!bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/30">
            <Search className="h-4 w-4 mr-2 inline" /> Search
          </button>
        }
      />
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search by address, city, state, or parcel ID..." className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-semibold text-slate-900">123 Main Street</h3>
            <p className="text-sm text-slate-500">Springfield, IL 62701</p>
            <p className="text-xs text-slate-400">Parcel ID: TEST-001</p>
          </div>
          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full font-medium">LOW Risk</span>
        </div>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div><span className="text-slate-400 block text-xs">Price</span><span className="font-semibold text-slate-800">$250,000</span></div>
          <div><span className="text-slate-400 block text-xs">Size</span><span className="font-semibold text-slate-800">N/A</span></div>
          <div><span className="text-slate-400 block text-xs">Type</span><span className="font-semibold text-slate-800">RESIDENTIAL</span></div>
          <div><span className="text-slate-400 block text-xs">Cap Rate</span><span className="font-semibold text-slate-800">N/A%</span></div>
        </div>
      </div>
    </motion.div>
  );
}