// src/routes/property-details.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Loader2, Home, Shield, GitCompare, FileText,
  MapPin, Calendar, DollarSign, Ruler, Building2, ShieldAlert,
  Download, FileCheck, Eye, ShoppingCart, Heart, Share2,
  Clock, CheckCircle, AlertTriangle, Info, Phone, Mail,
  User, Briefcase, Scale, Landmark, Crown, Star
} from 'lucide-react';
import { PageHeader, RiskBadge } from '../components/app-shell';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { propertyService } from '../services/api';
import api from '../services/api';

// Import components
import PropertyRisk from '../components/PropertyRisk';
import PropertyComparables from '../components/PropertyComparables';
import GenerateReport from '../components/GenerateReport';

const getAddressDisplay = (property) => {
  const address = property?.address;

  // Keep compatibility with the page's existing fallback data while safely
  // handling the nested AddressResponse returned by the backend.
  if (typeof address === 'string') {
    const location = [property?.city, property?.state, property?.zipCode]
      .filter(Boolean)
      .join(', ');

    return {
      street: address || 'Address unavailable',
      location,
      full: [address, location].filter(Boolean).join(', '),
      city: property?.city || '',
      state: property?.state || '',
    };
  }

  const street = [address?.addressLine1, address?.addressLine2]
    .filter(Boolean)
    .join(', ') || property?.propertyName || 'Address unavailable';
  const location = [
    address?.district,
    address?.city,
    address?.state,
    address?.country,
    address?.postalCode,
  ].filter(Boolean).join(', ');

  return {
    street,
    location,
    full: [street, location].filter(Boolean).join(', '),
    city: address?.city || '',
    state: address?.state || '',
  };
};

const normalizeProperty = (property) => ({
  ...property,
  id: property?.propertyId ?? property?.id,
  parcelId: property?.propertyCode ?? property?.parcelId,
  price: property?.marketValue ?? property?.price ?? 0,
  size: property?.totalArea != null ? `${property.totalArea} sq ft` : property?.size || 'N/A',
  listingStatus: property?.status ?? property?.listingStatus ?? 'UNDER_REVIEW',
  listingDescription: property?.description ?? property?.listingDescription ?? 'No description available.',
  riskScore: property?.riskScore ?? 0,
  risk: property?.risk ?? 'Not assessed',
  ownerName: property?.ownerName ?? 'Not available',
  zoningCode: property?.zoningCode ?? 'Not available',
  floodZone: property?.floodZone ?? 'Not available',
  titleStatus: property?.titleStatus ?? 'Not available',
});

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isBuyer = userData.role === 'BUYER';

  useEffect(() => {
    loadProperty();
    if (isBuyer) {
      checkWatchlistStatus();
    }
  }, [id, isBuyer]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getById(id);
      const normalizedProperty = normalizeProperty(response.data);
      setProperty(normalizedProperty);
      if (normalizedProperty.price) {
        setOfferAmount(normalizedProperty.price.toString());
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setProperty(normalizeProperty({
        id: id,
        parcelId: `P-${id}`,
        address: '123 Main Street, San Francisco, CA',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        price: 750000,
        size: '1,850 sqft',
        yearBuilt: 2015,
        ownerName: 'John Doe',
        propertyType: 'Residential',
        risk: 'Low',
        riskScore: 18,
        capRate: '5.4',
        bedrooms: 3,
        bathrooms: 2.5,
        squareFootage: 1850,
        lotSize: '6,500 sqft',
        listingStatus: 'Available',
        listingDescription: 'Beautiful property in prime location with stunning views.',
        floodZone: 'Zone X - Minimal Risk',
        zoningCode: 'Residential R-1',
        titleStatus: 'Clear',
        createdAt: '2024-01-10'
      }));
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const response = await api.get(`/buyer/watchlist/status/${id}`);
      setIsWatchlisted(response.data.isInWatchlist);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (isWatchlisted) {
        await api.delete(`/buyer/watchlist/${id}`);
        setIsWatchlisted(false);
      } else {
        await api.post(`/buyer/watchlist/${id}`);
        setIsWatchlisted(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      alert('Failed to update watchlist');
    }
  };

  const handleMakeOffer = async () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      alert('Please enter a valid offer amount');
      return;
    }

    setSubmittingOffer(true);
    try {
      const response = await api.post(`/buyer/offers/${id}/offer`, null, {
        params: { amount: parseFloat(offerAmount) }
      });
      
      if (response.data.success) {
        setOfferSuccess(true);
        setTimeout(() => {
          setShowOfferModal(false);
          setOfferSuccess(false);
          loadProperty();
        }, 2000);
      } else {
        alert(response.data.message || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Error making offer:', error);
      alert('Failed to submit offer. Please try again.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const addressDisplay = getAddressDisplay(property);
      
      doc.setFontSize(20);
      doc.text('Due Diligence Report', 20, 20);
      
      doc.setFontSize(12);
      let y = 40;
      const lineHeight = 8;
      
      const lines = [
        ['Property:', addressDisplay.full],
        ['City:', addressDisplay.city],
        ['State:', addressDisplay.state],
        ['Price:', `$${property.price?.toLocaleString()}`],
        ['Size:', property.size],
        ['Year Built:', property.yearBuilt],
        ['Risk Level:', property.risk],
        ['Risk Score:', `${property.riskScore}/100`],
        ['Zoning:', property.zoningCode || 'N/A'],
        ['Flood Zone:', property.floodZone || 'N/A'],
        ['Title Status:', property.titleStatus || 'Clear'],
      ];
      
      lines.forEach(([label, value]) => {
        doc.text(`${label} ${value}`, 20, y);
        y += lineHeight;
      });
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y + 20);
      doc.text('Parcel Intelligence - Due Diligence Report', 20, y + 28);
      
      doc.save(`Due_Diligence_Report_${property.parcelId || property.id}.pdf`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'risk', label: 'Risk Assessment', icon: Shield },
    { id: 'comparables', label: 'Comparables', icon: GitCompare },
    { id: 'report', label: 'Generate Report', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <h2 className="mb-2 text-2xl font-semibold">Property Not Found</h2>
        <Button onClick={() => navigate("/properties")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>
      </div>
    );
  }

  const addressDisplay = getAddressDisplay(property);

  return (
    <>
      <PageHeader 
        title="Property Details" 
        subtitle="Complete Due Diligence Report" 
        actions={
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/properties")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />Back
            </Button>
            {isBuyer && (
              <Button 
                variant="outline"
                onClick={toggleWatchlist}
                className={isWatchlisted ? 'text-amber-500 border-amber-500' : ''}
              >
                <Star className={`h-4 w-4 mr-2 ${isWatchlisted ? 'fill-amber-500' : ''}`} />
                {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={handleDownloadReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            {isBuyer && property.listingStatus === 'AVAILABLE' && (
              <Button 
                onClick={() => setShowOfferModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
            )}
          </div>
        }
      />

      {/* Property Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-64 bg-gradient-to-r from-emerald-500 to-emerald-700 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className={`text-sm font-semibold ${
              property.listingStatus === 'AVAILABLE' || property.listingStatus === 'VERIFIED' ? 'text-emerald-600' :
              property.listingStatus === 'UNDER_REVIEW' ? 'text-amber-600' :
              'text-gray-600'
            }`}>
              {property.listingStatus}
            </span>
          </div>
        </div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="bg-white rounded-2xl p-4 shadow-lg w-full md:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">{addressDisplay.street}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {addressDisplay.location || 'Location unavailable'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Built {property.yearBuilt}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={16} />
                  {property.propertyType}
                </span>
              </div>
            </div>
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl mt-4 md:mt-0 shadow-lg">
              <div className="text-sm opacity-80">Price</div>
              <div className="text-2xl font-bold">${property.price?.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Size</p>
          <p className="font-semibold text-gray-900">{property.size}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Bedrooms</p>
          <p className="font-semibold text-gray-900">{property.bedrooms || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Bathrooms</p>
          <p className="font-semibold text-gray-900">{property.bathrooms || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Lot Size</p>
          <p className="font-semibold text-gray-900">{property.lotSize || 'N/A'}</p>
        </div>
      </div>

      {/* Risk Score Card */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Risk Assessment Score</h3>
              <p className="text-sm text-gray-500">Overall property risk rating</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-bold ${
              property.riskScore < 30 ? 'text-emerald-600' :
              property.riskScore < 60 ? 'text-amber-500' :
              'text-red-500'
            }`}>
              {property.riskScore}/100
            </span>
            <p className={`text-sm font-medium ${
              property.riskScore < 30 ? 'text-emerald-600' :
              property.riskScore < 60 ? 'text-amber-500' :
              'text-red-500'
            }`}>
              {property.riskScore < 30 ? 'Low Risk' :
               property.riskScore < 60 ? 'Medium Risk' :
               'High Risk'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="font-semibold text-gray-900 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.listingDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-medium text-gray-900">{property.ownerName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Property Type</p>
                  <p className="font-medium text-gray-900">{property.propertyType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Zoning</p>
                  <p className="font-medium text-gray-900">{property.zoningCode}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Flood Zone</p>
                  <p className="font-medium text-gray-900">{property.floodZone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Title Status</p>
                  <p className="font-medium text-gray-900">{property.titleStatus}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Parcel ID</p>
                  <p className="font-medium text-gray-900">{property.parcelId}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PropertyRisk propertyId={id} />
            </motion.div>
          )}

          {activeTab === 'comparables' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PropertyComparables propertyId={id} />
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GenerateReport propertyId={id} propertyDetails={property} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            {offerSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900">Offer Submitted!</h3>
                <p className="text-gray-500 mt-2">Your offer has been sent to the seller.</p>
                <Button 
                  onClick={() => setShowOfferModal(false)}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Make an Offer</h3>
                  <button 
                    onClick={() => setShowOfferModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Property</label>
                    <p className="text-gray-900">{addressDisplay.full}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">List Price</label>
                    <p className="text-emerald-600 font-semibold">${property.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your Offer Amount</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Enter offer amount"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowOfferModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleMakeOffer}
                      disabled={submittingOffer}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {submittingOffer ? 'Submitting...' : 'Submit Offer'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
