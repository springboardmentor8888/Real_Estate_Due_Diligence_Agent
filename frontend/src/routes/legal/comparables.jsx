import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { GitCompare, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LegalComparables() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Comparables Analysis" subtitle="Review agent-created comparable property relationships" />
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
        <GitCompare className="mx-auto mb-4 h-10 w-10 text-slate-500" />
        <Badge variant="outline" className="mb-4">No source property selected</Badge>
        <div className="mx-auto flex max-w-lg items-start gap-2 text-left text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Comparable relationships are available from a property detail page after an agent creates them. No estimated or presentation comparables are shown here.
        </div>
        <Link to="/properties" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white">
          Browse Properties <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
