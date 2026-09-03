// src/routes/legal/documents.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/app-shell';
import { FileText, CheckCircle, XCircle, Clock, Download, Eye, Search, Users, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { documentService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await documentService.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setDocuments(list);
    } catch (err) {
      console.error('Error fetching legal documents:', err);
      setDocuments([]);
      setError(err.response?.data?.message || 'Documents could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (doc.documentName && doc.documentName.toLowerCase().includes(q)) ||
           (doc.propertyName && doc.propertyName.toLowerCase().includes(q)) ||
           (doc.documentType && doc.documentType.toLowerCase().includes(q));
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"><div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2"><AlertCircle className="h-5 w-5" />{error}</span><button type="button" onClick={fetchDocuments} className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Retry</button></div></div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader 
        title="Verify Legal Documents" 
        subtitle="Review, audit, and verify property titles, zoning permits, and environmental reports from PostgreSQL"
        actions={
          <div className="flex flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              />
            </div>
            
            <button 
              onClick={() => navigate('/properties')}
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
              <Building2 size={16} /> 
              Browse Properties
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div 
              key={doc.documentId || doc.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-900 text-sm">{doc.documentName}</h3>
                    <Badge variant="outline" className="text-xs bg-slate-100">{doc.fileFormat || doc.documentType || 'PDF'}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Property: <strong className="text-slate-700">{doc.propertyName || 'Verified Asset'}</strong></p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                    {doc.uploadedByUserEmail && (
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {doc.uploadedByUserEmail}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Uploaded {formatDate(doc.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto self-end md:self-center">
                <Badge className="bg-emerald-500 text-white">
                  {doc.reportId ? 'Audited & Verified' : 'Pending Review'}
                </Badge>
                {doc.propertyId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/properties/${doc.propertyId}`)}
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Property
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No legal documents found</h3>
            <p className="text-xs text-slate-500 mt-1">Uploaded titles, permits, and surveys in the database will appear here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}