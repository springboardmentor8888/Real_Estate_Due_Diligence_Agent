import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Info } from 'lucide-react';

export default function GenerateReport({ propertyId, propertyDetails }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-blue-500/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              Generate Due Diligence Report
            </h2>
            <p className="mt-1 text-gray-500">
              This will compile all data into a downloadable PDF document.
            </p>
          </div>
          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">Unavailable</span>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Server-side report generation and file downloads are not implemented yet. Existing report records can be viewed from the Reports page.
        </div>
      </div>
    </motion.div>
  );
}
