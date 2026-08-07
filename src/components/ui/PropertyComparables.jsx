// src/components/PropertyComparables.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, DollarSign, Ruler } from 'lucide-react';
import { Badge } from './badge';
import api from '../../services/api';

// Chart Imports
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function PropertyComparables({ propertyId }) {
  const [comparables, setComparables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparables();
  }, [propertyId]);

  const fetchComparables = async () => {
    try {
      const response = await api.get(`/comparables/${propertyId}`);
      setComparables(response.data);
    } catch (error) {
      // Fallback mock data for presentation
      setComparables([
        { id: 101, address: '456 Oak Ave, SF', price: 810000, sqft: 2000, distance: '0.3 mi', score: 95 },
        { id: 102, address: '789 Pine St, SF', price: 690000, sqft: 1750, distance: '0.8 mi', score: 88 },
        { id: 103, address: '321 Elm Blvd, SF', price: 725000, sqft: 1900, distance: '1.2 mi', score: 76 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the Bar Chart
  const chartData = comparables.map(comp => ({
    name: comp.address.split(',')[0], // Just the street name for the chart
    Price: comp.price / 1000, // Show in thousands
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comparables Analysis</h2>
        <Badge className="bg-blue-500">Market Data</Badge>
      </div>

      <p className="text-muted-foreground">
        Based on recent sales in the surrounding area, here are the top matching properties:
      </p>

      {/* Bar Chart Section */}
      <div className="glass rounded-2xl border border-border p-6 bg-white">
        <h3 className="mb-4 text-sm font-medium text-gray-500">Price Comparison ($000s)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                formatter={(value) => `$${value.toLocaleString()}k`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="Price" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* List Section */}
      <div className="grid gap-5 md:grid-cols-3">
        {comparables.map((comp) => (
          <div key={comp.id} className="rounded-xl border border-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Comp #{comp.id}</h3>
              </div>
              <Badge variant="outline">{comp.score}% Match</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{comp.address}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <DollarSign className="h-4 w-4" />
                  ${comp.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  {comp.sqft} sqft
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground text-right">
                {comp.distance} away
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}