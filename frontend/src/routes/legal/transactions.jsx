// src/routes/legal/transactions.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { Scale, FileText, CheckCircle, XCircle, Clock, Eye, Search, Users, DollarSign } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const transactions = [
  {
    id: 1,
    property: '123 Main Street, San Francisco, CA',
    amount: '$750,000',
    buyer: 'Swaraj Pakhale',
    seller: 'BlackRock Real Estate Trust',
    status: 'Pending Legal Review',
    date: '2 days ago'
  },
  {
    id: 2,
    property: '456 Oak Avenue, Los Angeles, CA',
    amount: '$1,200,000',
    buyer: 'Archana Pakhale',
    seller: 'Vanguard Group',
    status: 'Approved',
    date: '1 week ago'
  }
];

export default function ReviewTransactions() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      
      <PageHeader 
        title="Review Transactions" 
        subtitle="Review and approve property sales and loan transactions"
        actions={
          // ✅ FIXED: Flex row with equal height items
          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              />
            </div>
            
            {/* ✅ GREEN BUTTON - Same height as search bar */}
            <button 
              onClick={() => alert('New Review workflow clicked!')}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '10px 18px',
                borderRadius: '12px',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              <Scale size={16} /> 
              New Review
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <Scale className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{tx.property}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {tx.amount}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Buyer: {tx.buyer}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Seller: {tx.seller}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tx.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Badge className={`${tx.status === 'Approved' ? 'bg-emerald-500' : tx.status === 'Rejected' ? 'bg-red-500' : 'bg-amber-500'} text-white`}>
                {tx.status}
              </Badge>
              <button className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
              
              {tx.status === 'Pending Legal Review' && (
                <div className="flex gap-2">
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Approve
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}