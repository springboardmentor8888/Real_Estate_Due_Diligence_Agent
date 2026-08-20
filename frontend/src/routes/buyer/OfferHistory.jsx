// src/routes/buyer/OfferHistory.jsx
import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  DollarSign, Clock, CheckCircle, XCircle, Home,
  AlertTriangle, Eye, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function OfferHistory() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/buyer/offers');
      const list = Array.isArray(res.data) ? res.data : [];
      setOffers(list);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'ACCEPTED': return <Badge className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" /> Accepted</Badge>;
      case 'REJECTED': return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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
    <>
      <PageHeader 
        title="Offer History" 
        subtitle={`${offers.length} offers submitted`}
      />

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">You haven't made any offers yet</p>
            <Button 
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => window.location.href = '/properties'}
            >
              <Home className="h-4 w-4 mr-2" />
              Browse Properties
            </Button>
          </div>
        ) : (
          offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{offer.property?.address}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">Your Offer: <span className="font-semibold text-emerald-600">${offer.amount?.toLocaleString()}</span></span>
                        <span className="text-sm text-gray-400">|</span>
                        <span className="text-sm text-gray-500">List Price: ${offer.property?.price?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(offer.status)}
                        <span className="text-xs text-gray-400">Submitted {new Date(offer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `/properties/${offer.property?.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Property
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
}