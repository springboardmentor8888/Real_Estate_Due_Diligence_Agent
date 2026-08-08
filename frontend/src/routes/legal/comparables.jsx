// src/routes/legal/comparables.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { Home, MapPin, Search } from 'lucide-react';

const comparables = [
  { id: 1, address: '456 Oak Avenue, SF', price: 810000, sqft: 2000, beds: 3, baths: 2, dist: '0.3 mi', match: 88 },
  { id: 2, address: '789 Pine Street, SF', price: 690000, sqft: 1750, beds: 3, baths: 2, dist: '0.8 mi', match: 76 },
];

export default function LegalComparables() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Comparables Analysis" 
        subtitle="Compare properties side by side"
        actions={
          <button className="!bg-emerald-600 hover:!bg-emerald-700 !text-slate-900 font-bold py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/30">
            Compare Selected
          </button>
        }
      />
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Enter address to find comparables..." className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {comparables.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">#{c.id}</h3>
              </div>
              <Badge className="bg-blue-500">{c.match}% Match</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <MapPin className="h-4 w-4" /> {c.address}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
              <div><span className="text-slate-400 block">Price</span><span className="font-semibold text-slate-800">${c.price.toLocaleString()}</span></div>
              <div><span className="text-slate-400 block">Size</span><span className="font-semibold text-slate-800">{c.sqft} sqft</span></div>
              <div><span className="text-slate-400 block">Beds/Baths</span><span className="font-semibold text-slate-800">{c.beds} / {c.baths}</span></div>
              <div><span className="text-slate-400 block">Distance</span><span className="font-semibold text-slate-800">{c.dist}</span></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}