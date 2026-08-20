// src/routes/bank/risks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ShieldAlert, AlertTriangle, CheckCircle, Eye, ShieldCheck, Clock } from 'lucide-react';
import { riskAssessmentService, dashboardService } from '../../services/api';

export default function BankRisks() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [riskOverview, setRiskOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const [assessRes, statsRes] = await Promise.all([
        riskAssessmentService.getAll(),
        dashboardService.getStats('BANK')
      ]);

      const list = Array.isArray(assessRes.data) ? assessRes.data : [];
      setAssessments(list);
      setRiskOverview(statsRes.data?.riskOverview || null);
    } catch (error) {
      console.error('Error fetching bank risk assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'LOW': return 'bg-emerald-500 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-white';
      case 'HIGH':
      case 'CRITICAL': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
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
        title="Lender Risk Assessments" 
        subtitle="Property collateral risks, title checks, flood zones, and compliance ratings from PostgreSQL"
        actions={
          <Button 
            onClick={() => navigate('/properties')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> Review Properties
          </Button>
        }
      />

      {/* Overview Stat Box */}
      {riskOverview && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs text-slate-500">Average Risk Score</span>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{riskOverview.averageRiskScore || 0} / 100</h4>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs text-slate-500">Total Audited Items</span>
            <h4 className="text-2xl font-bold text-slate-900 mt-1">{riskOverview.totalAssessments || assessments.length}</h4>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs text-slate-500">Low Risk Clearances</span>
            <h4 className="text-2xl font-bold text-emerald-600 mt-1">{riskOverview.lowRiskCount || 0}</h4>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs text-slate-500">High Risk Alerts</span>
            <h4 className="text-2xl font-bold text-red-600 mt-1">{riskOverview.highRiskCount || 0}</h4>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.length > 0 ? (
          assessments.map((a) => {
            const assessId = a.assessmentId || a.id;
            const categoryName = a.categoryName || a.riskCategory?.categoryName || 'General Risk';
            const propName = a.propertyName || (a.property ? a.property.propertyName : 'Property Assessment');
            const propId = a.propertyId || (a.property ? a.property.propertyId : null);

            return (
              <div key={assessId} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{propName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Category: <strong className="text-slate-700">{categoryName}</strong></p>
                  </div>
                  <Badge className={getRiskBadgeColor(a.riskLevel)}>
                    {a.riskLevel || 'ASSESSED'}
                  </Badge>
                </div>

                {a.recommendation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <strong>Findings & Recommendations:</strong> {a.recommendation}
                  </div>
                )}

                <div className="mt-4 text-xs text-slate-500 border-t border-slate-100 pt-3 flex justify-between items-center">
                  <span>Risk Score: <strong className="text-slate-900">{a.riskScore != null ? a.riskScore : 'N/A'}</strong></span>
                  {propId && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/properties/${propId}`)}
                      className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                    >
                      View Property <Eye className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <ShieldCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No risk assessments recorded in database</h3>
            <p className="text-xs text-slate-500 mt-1">Property due diligence audits and risk ratings will stream here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}