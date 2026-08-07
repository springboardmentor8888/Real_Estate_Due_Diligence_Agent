// src/routes/property-details.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Building, Calendar, DollarSign, 
  Home, Users, FileText, Star, Download,
  ChevronDown, ChevronUp, Shield, GitCompare
} from 'lucide-react';
import PropertyRisk from './PropertyRisk';
import PropertyComparables from './PropertyComparables';
import GenerateReport from './GenerateReport';
import api from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      // Demo data for Milestone 3
      setProperty({
        id: id,
        address: '123 Main Street, San Francisco, CA',
        price: 750000,
        size: 1850,
        bedrooms: 3,
        bathrooms: 2.5,
        yearBuilt: 2015,
        description: 'Beautiful property in prime location with stunning views. Recently renovated with modern finishes.',
        status: 'Active',
        listedDate: '2024-01-10',
        owner: 'John Doe',
        taxAssessment: 720000,
        zoning: 'Residential R-1',
        floodZone: 'Zone X - Minimal Risk',
        environmentalRecords: 'No issues found',
        permitHistory: '2 permits issued (2018, 2020)',
        schoolDistrict: 'San Francisco Unified',
        lotSize: '6,500 sqft'
      });
    } finally {
      setLoading(false);
    }
  };

  // Define your tabs here - THIS IS THE TABS SECTION
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'risk', label: 'Risk Assessment', icon: Shield },
    { id: 'comparables', label: 'Comparables', icon: GitCompare },
    { id: 'report', label: 'Generate Report', icon: Download },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Property Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-64 bg-gradient-to-r from-emerald-500 to-emerald-700 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-emerald-600">{property?.status}</span>
          </div>
        </div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="bg-white rounded-2xl p-4 shadow-lg w-full md:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">{property?.address}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  San Francisco, CA
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Listed {property?.listedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Building size={16} />
                  {property?.yearBuilt}
                </span>
              </div>
            </div>
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl mt-4 md:mt-0 shadow-lg shadow-emerald-500/25">
              <div className="text-sm opacity-80">Price</div>
              <div className="text-2xl font-bold">${property?.price?.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Size</p>
          <p className="font-semibold text-gray-900">{property?.size} sqft</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Bedrooms</p>
          <p className="font-semibold text-gray-900">{property?.bedrooms}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Bathrooms</p>
          <p className="font-semibold text-gray-900">{property?.bathrooms}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Lot Size</p>
          <p className="font-semibold text-gray-900">{property?.lotSize}</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ⬇️⬇️⬇️ TABS SECTION - UPDATE THIS PART ⬇️⬇️⬇️ */}
      {/* ============================================================ */}
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tab Headers */}
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

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="font-semibold text-gray-900 text-lg">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property?.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-medium text-gray-900">{property?.owner}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Tax Assessment</p>
                  <p className="font-medium text-gray-900">${property?.taxAssessment?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Zoning</p>
                  <p className="font-medium text-gray-900">{property?.zoning}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Flood Zone</p>
                  <p className="font-medium text-gray-900">{property?.floodZone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">School District</p>
                  <p className="font-medium text-gray-900">{property?.schoolDistrict}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Permit History</p>
                  <p className="font-medium text-gray-900">{property?.permitHistory}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Risk Assessment Tab - USING THE NEW COMPONENT */}
          {activeTab === 'risk' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PropertyRisk propertyId={id} />
            </motion.div>
          )}

          {/* Comparables Tab - USING THE NEW COMPONENT */}
          {activeTab === 'comparables' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PropertyComparables propertyId={id} />
            </motion.div>
          )}

          {/* Generate Report Tab - USING THE NEW COMPONENT */}
          {activeTab === 'report' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GenerateReport propertyId={id} propertyDetails={property} />
            </motion.div>
          )}
        </div>
      </div>
      {/* ============================================================ */}
      {/* ⬆️⬆️⬆️ END OF TABS SECTION ⬆️⬆️⬆️ */}
      {/* ============================================================ */}
    </motion.div>
  );
};

export default PropertyDetails;