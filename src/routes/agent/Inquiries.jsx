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
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/agent/inquiries');
      setInquiries(response.data.inquiries || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Mock data
      setInquiries([
        { id: 1, user: { fullName: 'John Buyer', email: 'john@buyer.com' }, property: { id: 1, address: '425 Market Street, SF' }, message: 'I am very interested in this property. Can I schedule a viewing?', status: 'PENDING', createdAt: '2024-01-15' },
        { id: 2, user: { fullName: 'Sarah Smith', email: 'sarah@email.com' }, property: { id: 2, address: '1200 Brickell Avenue, Miami' }, message: 'Is this property still available? What is the minimum offer price?', status: 'PENDING', createdAt: '2024-01-14' },
        { id: 3, user: { fullName: 'Mike Johnson', email: 'mike@email.com' }, property: { id: 1, address: '425 Market Street, SF' }, message: 'I would like to make an offer. Please send me the details.', status: 'RESPONDED', createdAt: '2024-01-12', response: 'Thank you for your interest. Please submit your offer through the platform.', respondedAt: '2024-01-13' }
      ]);
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
        i.id === id ? { ...i, status: 'RESPONDED', response: responseText, respondedAt: new Date() } : i
      ));
      setSelectedInquiry(null);
      setResponseText('');
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      alert('Failed to respond');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <Badge className="bg-amber-500 text-white"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'RESPONDED': return <Badge className="bg-emerald-500 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Responded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    statusFilter === 'ALL' || i.status === statusFilter
  );

  const pendingCount = inquiries.filter(i => i.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Inquiries" 
        subtitle={pendingCount > 0 ? `${pendingCount} pending inquiries` : 'All inquiries responded'}
        actions={
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Inquiries</option>
              <option value="PENDING">Pending</option>
              <option value="RESPONDED">Responded</option>
            </select>
            {/* ✅ FIXED: Visible Refresh Button */}
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
            <p className="text-gray-500">No inquiries found</p>
          </div>
        ) : (
          filteredInquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow ${
                inquiry.status === 'PENDING' ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    inquiry.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{inquiry.user?.fullName || 'Anonymous'}</h3>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{inquiry.user?.email}</span>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Home className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{inquiry.property?.address || 'Property'}</span>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-blue-600 p-0 h-auto"
                        onClick={() => navigate(`/properties/${inquiry.property?.id}`)}
                      >
                        View Property
                      </Button>
                    </div>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{inquiry.message}</p>
                    </div>
                    {inquiry.response && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="text-sm font-medium text-emerald-700">Your Response:</p>
                        <p className="text-sm text-gray-700 mt-1">{inquiry.response}</p>
                        <p className="text-xs text-gray-400 mt-1">Responded {new Date(inquiry.respondedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Received {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {inquiry.status === 'PENDING' && (
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
                <p className="text-sm font-medium text-gray-700">From</p>
                <p className="text-gray-900">{selectedInquiry.user?.fullName} ({selectedInquiry.user?.email})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Property</p>
                <p className="text-gray-900">{selectedInquiry.property?.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Message</p>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedInquiry.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Your Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
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