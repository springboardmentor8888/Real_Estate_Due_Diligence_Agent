// src/components/GenerateReport.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

export default function GenerateReport({ propertyId, propertyDetails }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerateReport = () => {
    setLoading(true);
    setSuccess(false);

    // Simulate generating a PDF
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-xl border border-border bg-blue-500/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              Generate Due Diligence Report
            </h2>
            <p className="mt-1 text-muted-foreground">
              This will compile all data, risk assessments, and comparables into a downloadable PDF document.
            </p>
          </div>
          <Badge className="bg-blue-500">Milestone 3</Badge>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Property Summary</div>
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Risk Assessment</div>
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> 3 Comparables</div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button 
            onClick={handleGenerateReport} 
            disabled={loading}
            className="min-w-[180px] bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : success ? (
              <><CheckCircle className="mr-2 h-4 w-4" /> Downloaded!</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Download Report</>
            )}
          </Button>
          {success && <span className="text-emerald-600 font-medium">PDF generated successfully!</span>}
        </div>
      </div>
    </motion.div>
  );
}