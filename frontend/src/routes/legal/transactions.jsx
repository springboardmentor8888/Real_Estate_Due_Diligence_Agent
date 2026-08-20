// src/routes/legal/transactions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Scale, FileText, CheckCircle, Clock, Eye, Search, DollarSign, Building2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { propertyService, dashboardService } from '../../services/api';

export default function ReviewTransactions() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getAll({ size: 20 });
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setProperties(list);
    } catch (err) {
      console.error('Error fetching legal review transactions:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return '$' + Number(amount).toLocaleString();
  };

  const filteredProps = properties.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const addr = p.address?.addressLine1 || p.propertyName || '';
    return addr.toLowerCase().includes(q) || (p.propertyCode && p.propertyCode.toLowerCase().includes(q));
  });

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
        title="Legal Transaction Reviews" 
        subtitle="Active acquisitions, contracts, and property conveyances under legal due diligence in PostgreSQL"
        actions={
          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              />
            </div>
            
            <Button 
              onClick={() => navigate('/properties')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Building2 className="mr-2 h-4 w-4" /> Properties
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {filteredProps.length > 0 ? (
          filteredProps.map((p) => {
            const propId = p.propertyId || p.id;
            const addressStr = p.address?.addressLine1 || p.propertyName || 'Property Asset';
            const locationStr = p.address ? `${p.address.city || ''}, ${p.address.state || ''} ${p.address.postalCode || ''}` : '';
            const price = p.marketValue || p.price;
            const status = p.status || 'UNDER_REVIEW';

            return (
              <div 
                key={propId} 
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <Scale className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-base">{addressStr}</h3>
                      {p.propertyCode && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                          {p.propertyCode}
                        </span>
                      )}
                    </div>
                    {locationStr && <p className="text-xs text-slate-500 mt-0.5">{locationStr}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span>Transaction Valuation: <strong className="text-emerald-600 font-semibold">{formatCurrency(price)}</strong></span>
                      {p.createdByEmail && <span>Listed By: {p.createdByEmail}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto self-end md:self-center">
                  <Badge className={status === 'VERIFIED' || status === 'AVAILABLE' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
                    {status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/properties/${propId}`)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Legal Review
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <Scale className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No active transactions awaiting legal review</h3>
            <p className="text-xs text-slate-500 mt-1">Property transactions submitted in the system will automatically stream here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}