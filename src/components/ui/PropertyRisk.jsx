// src/components/PropertyRisk.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
export default function PropertyRisk({ propertyId }) {
  const riskData = {
    overallRisk: 'Low',
    riskScore: 68,
    details: [
      { label: 'Flood Zone', status: 'Zone X - Minimal', icon: 'safe' },
      { label: 'Environmental Hazards', status: 'None Detected', icon: 'safe' },
      { label: 'Zoning Laws', status: 'C-3-O Commercial', icon: 'safe' },
      { label: 'Title Deed Status', status: 'Clear - No Liens', icon: 'safe' },
    ]
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Assessment Report</h2>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Score: {riskData.riskScore}/100</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {riskData.details.map((item, index) => (
          <div key={index} className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {item.icon === 'safe' ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <Badge variant={item.icon === 'safe' ? 'default' : 'destructive'} className={item.icon === 'safe' ? 'bg-emerald-500' : ''}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </motion.div>
  );
}