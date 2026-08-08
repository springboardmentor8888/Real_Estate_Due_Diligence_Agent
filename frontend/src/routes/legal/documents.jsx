// src/routes/legal/documents.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { FileText, CheckCircle, XCircle, Clock, Download, Eye, Search, Users } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const documents = [
  {
    id: 1,
    name: 'Title Deed - 123 Main Street',
    type: 'PDF',
    uploaded: '2 days ago',
    status: 'Pending Review',
    submittedBy: 'Swaraj Pakhale'
  },
  {
    id: 2,
    name: 'Flood Zone Certification - 456 Oak Ave',
    type: 'PDF',
    uploaded: '1 week ago',
    status: 'Verified',
    submittedBy: 'Archana Pakhale'
  },
  {
    id: 3,
    name: 'Property Tax History - P-10243',
    type: 'Excel',
    uploaded: '3 hours ago',
    status: 'Needs Correction',
    submittedBy: 'Swaraj Pakhale'
  }
];

export default function VerifyDocuments() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      
      <PageHeader 
        title="Verify Documents" 
        subtitle="Review and verify legal property documents"
        actions={
          // ✅ FIXED: Flex row with equal height items
          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              />
            </div>
            
            {/* ✅ GREEN BUTTON - Same height as search bar */}
            <button 
              onClick={() => alert('Upload New workflow clicked!')}
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
              <FileText size={16} /> 
              Upload New
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                  <Badge variant="outline" className="text-xs bg-slate-100">{doc.type}</Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {doc.submittedBy}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {doc.uploaded}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Badge className={`${doc.status === 'Verified' ? 'bg-emerald-500' : doc.status === 'Needs Correction' ? 'bg-red-500' : 'bg-amber-500'} text-white`}>
                {doc.status}
              </Badge>
              <button className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
              <button className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"><Download className="h-4 w-4" /></button>
              
              {doc.status === 'Pending Review' && (
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