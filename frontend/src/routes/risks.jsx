// src/routes/bank/risks.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/app-shell';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import api from '../services/api';

export default function RiskAssessments() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/risk-categories');
      const list = Array.isArray(res.data) ? res.data : [];
      setRisks(list);
    } catch (err) {
      console.error('Error fetching risk categories:', err);
      setRisks([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (weight) => {
    const w = Number(weight) || 1;
    if (w >= 3) return <Badge className="bg-red-500 text-white">High Priority</Badge>;
    if (w === 2) return <Badge className="bg-amber-500 text-white">Moderate Priority</Badge>;
    return <Badge className="bg-emerald-500 text-white">Standard Priority</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Risk Assessments"
        subtitle={`System Risk Factors & Categories (${risks.length} active criteria)`}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((item, idx) => (
          <div key={item.riskCategoryId || idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900">{item.categoryName}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.description || 'Evaluates environmental, structural, and financial risk variables.'}</p>
              </div>
              {getRiskBadge(item.weight)}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs flex gap-4 text-slate-500">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-600"/> Weight: {item.weight || 1.0}</span>
              <span className="flex items-center gap-1"><CheckCircle size={14} className="text-blue-600"/> Status: Active</span>
            </div>
          </div>
        ))}

        {risks.length === 0 && (
          <div className="col-span-2 bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400">
            <ShieldAlert size={36} className="mx-auto mb-2 opacity-50" />
            <h4 className="font-semibold text-slate-800">No risk categories found</h4>
            <p className="text-xs text-slate-500 mt-1">Add risk categories to begin calculating automated property risk scores.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}