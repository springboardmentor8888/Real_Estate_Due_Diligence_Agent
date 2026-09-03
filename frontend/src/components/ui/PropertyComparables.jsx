'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Info } from 'lucide-react';

export default function PropertyComparables({ propertyId }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-2">
        <GitCompare className="h-6 w-6 text-slate-500" />
        <h2 className="text-2xl font-bold">Comparables Analysis</h2>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Comparable-property matching is unavailable because the backend does not expose a property-specific comparable query. No estimated comparables are displayed.
        </div>
      </div>
    </motion.div>
  );
}