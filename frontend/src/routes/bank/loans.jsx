// src/routes/bank/loans.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  DollarSign, Building2, Eye, FileText, CheckCircle2, 
  Clock, ShieldCheck, ArrowRight, Landmark 
} from 'lucide-react';
import { propertyService, dashboardService } from '../../services/api';

export default function BankLoans() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanData();
  }, []);

  const fetchLoanData = async () => {
    try {
      setLoading(true);
      const [propsRes, statsRes] = await Promise.all([
        propertyService.getAll({ size: 20 }),
        dashboardService.getStats('BANK')
      ]);

      const propList = propsRes.data?.content || (Array.isArray(propsRes.data) ? propsRes.data : []);
      setProperties(propList);

      const statsData = statsRes.data || {};
      setStats({
        totalLoans: statsData.totalLoans || propList.length,
        pendingLoans: statsData.pendingLoans || 0,
        approvedLoans: statsData.approvedLoans || 0
      });
    } catch (error) {
      console.error('Error fetching bank loan applications:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return '$' + Number(amount).toLocaleString();
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
        title="Commercial & Mortgage Loan Review" 
        subtitle="Active loan applications and property underwriting portfolio from PostgreSQL"
        actions={
          <Button 
            onClick={() => navigate('/bank/reports')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <FileText className="mr-2 h-4 w-4" /> Compliance Reports
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Underwriting Portfolio</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{stats.totalLoans}</h3>
          <p className="text-xs text-slate-400 mt-1">Properties in review pipeline</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Pending Review</span>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">{stats.pendingLoans}</h3>
          <p className="text-xs text-slate-400 mt-1">Awaiting legal & risk approval</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Approved Collateral</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">{stats.approvedLoans}</h3>
          <p className="text-xs text-slate-400 mt-1">Verified asset value</p>
        </div>
      </div>

      {/* Loan Applications List */}
      <div className="space-y-4">
        {properties.length > 0 ? (
          properties.map((p) => {
            const propId = p.propertyId || p.id;
            const addressStr = p.address?.addressLine1 || p.propertyName || p.address || 'Property Asset';
            const locationStr = p.address ? `${p.address.city || ''}, ${p.address.state || ''}` : '';
            const price = p.marketValue || p.price;
            const status = p.status || 'UNDER_REVIEW';

            return (
              <div 
                key={propId}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{addressStr}</h4>
                      {p.propertyCode && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                          {p.propertyCode}
                        </span>
                      )}
                    </div>
                    {locationStr && <p className="text-xs text-slate-500 mt-0.5">{locationStr}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Valuation / Loan Basis: <strong className="text-emerald-600">{formatCurrency(price)}</strong></span>
                      {p.propertyType && <span>Type: {p.propertyType}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Badge className={status === 'VERIFIED' || status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
                    {status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/properties/${propId}`)}
                    className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Underwrite
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Landmark className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No properties in loan portfolio</h3>
            <p className="text-xs text-slate-500 mt-1">Properties added to the system will appear here for loan underwriting.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}