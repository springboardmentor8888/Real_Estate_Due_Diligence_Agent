// src/routes/agent/Inquiries.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Mail, MessageSquare, CheckCircle, Clock, User, 
  Home, Reply, Eye, Search, Filter, XCircle, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function Inquiries() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/agent/inquiries');
      setInquiries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inquiries from backend:', error);
      setInquiries([]);
      setError(error.response?.data?.message || 'Inquiries could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (id) => {
    if (!responseText.trim()) {
      alert('Please enter a response');
      return;
    }
    
    try {
      await api.post(`/agent/inquiries/${id}/respond`, { response: responseText });
      setInquiries(inquiries.map(i => 
        i.id === id ? { ...i, status: 'RESPONDED', response: responseText, respondedAt: new Date().toISOString() } : i
      ));
      setSelectedInquiry(null);
      setResponseText('');
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      alert('Failed to submit response to backend');
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toUpperCase()) {
      case 'NEW': return <Badge className="bg-amber-500 text-white"><Clock className="h-3 w-3 mr-1" /> New</Badge>;
      case 'RESPONDED': return <Badge className="bg-emerald-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Responded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    statusFilter === 'ALL' || (i.status && i.status.toUpperCase() === statusFilter)
  );

  const pendingCount = inquiries.filter(i => i.status === 'NEW').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"><div className="flex items-center justify-between gap-4"><span className="flex items-center gap-2"><XCircle className="h-5 w-5" />{error}</span><button type="button" onClick={fetchInquiries} className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium"><RefreshCw className="h-4 w-4" /> Retry</button></div></div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Agent Inquiries" 
        subtitle={pendingCount > 0 ? `${pendingCount} pending client inquiries from PostgreSQL` : 'All client inquiries answered'}
        actions={
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="ALL">All Inquiries</option>
              <option value="NEW">New</option>
              <option value="RESPONDED">Responded</option>
            </select>
            <Button variant="outline" onClick={fetchInquiries} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-800">No buyer inquiries found in database</h3>
            <p className="text-xs text-gray-500 mt-1">Inquiries submitted on your property listings will appear here.</p>
          </div>
        ) : (
          filteredInquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow ${
                 inquiry.status === 'NEW' ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                     inquiry.status === 'NEW' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                       <h3 className="font-semibold text-gray-900">{inquiry.senderName || 'Buyer'}</h3>
                      <span className="text-sm text-gray-400">•</span>
                       <span className="text-sm text-gray-500">{inquiry.senderEmail}</span>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Home className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">{inquiry.property?.address || inquiry.propertyAddress || 'Property Listing'}</span>
                      {(inquiry.property?.id || inquiry.propertyId) && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-blue-600 p-0 h-auto font-medium"
                          onClick={() => navigate(`/properties/${inquiry.property?.id || inquiry.propertyId}`)}
                        >
                          View Property
                        </Button>
                      )}
                    </div>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{inquiry.message}</p>
                    </div>
                    {inquiry.response && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-xs font-semibold text-emerald-800">Your Response:</p>
                        <p className="text-sm text-gray-700 mt-1">{inquiry.response}</p>
                        {inquiry.respondedAt && (
                          <p className="text-[11px] text-gray-400 mt-1">Responded {new Date(inquiry.respondedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Received {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                  </div>
                </div>
                {inquiry.status === 'NEW' && (
                  <Button 
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Respond to Inquiry</h3>
              <button 
                onClick={() => {
                  setSelectedInquiry(null);
                  setResponseText('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">From</p>
                 <p className="text-sm text-gray-900 font-medium">{selectedInquiry.senderName || 'Buyer'} ({selectedInquiry.senderEmail})</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Property</p>
                <p className="text-sm text-gray-900 font-medium">{selectedInquiry.property?.address || selectedInquiry.propertyAddress}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Message</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{selectedInquiry.message}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  rows={4}
                  placeholder="Type your response here..."
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedInquiry(null);
                    setResponseText('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => respondToInquiry(selectedInquiry.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Send Response
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
