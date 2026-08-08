import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Ruler } from 'lucide-react';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PropertyComparables({ propertyId }) {
  const [comparables, setComparables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    setComparables([
      { id: 101, address: '456 Oak Ave, SF', price: 810000, sqft: 2000, distance: '0.3 mi', score: 95 },
      { id: 102, address: '789 Pine St, SF', price: 690000, sqft: 1750, distance: '0.8 mi', score: 88 },
      { id: 103, address: '321 Elm Blvd, SF', price: 725000, sqft: 1900, distance: '1.2 mi', score: 76 },
    ]);
    setLoading(false);
  }, [propertyId]);

  const chartData = comparables.map(comp => ({
    name: comp.address.split(',')[0],
    Price: comp.price / 1000,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comparables Analysis</h2>
        <Badge className="bg-blue-500">Market Data</Badge>
      </div>

      <p className="text-gray-500">Based on recent sales in the surrounding area:</p>

      <div className="glass rounded-2xl border border-gray-200 p-6 bg-white">
        <h3 className="mb-4 text-sm font-medium text-gray-500">Price Comparison ($000s)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}k`} />
              <Bar dataKey="Price" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {comparables.map((comp) => (
          <div key={comp.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Comp #{comp.id}</h3>
              </div>
              <Badge variant="outline">{comp.score}% Match</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{comp.address}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <DollarSign className="h-4 w-4" />
                  ${comp.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Ruler className="h-4 w-4" />
                  {comp.sqft} sqft
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}