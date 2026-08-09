import React from 'react';
import { FaClock, FaHistory, FaBuilding } from 'react-icons/fa';

const PropertyHistory = ({ history = [], onSelectProperty }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
        <FaHistory className="mx-auto text-3xl mb-2 text-gray-300" />
        <p className="text-sm">No recent search or property history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaClock className="text-emerald-600" /> Recent Due Diligence Searches
      </h3>

      <div className="divide-y divide-gray-100">
        {history.map((item, index) => (
          <div 
            key={item.id || index}
            onClick={() => onSelectProperty && onSelectProperty(item)}
            className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                <FaBuilding />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {item.title || item.street || item.address || "Property Analysis"}
                </p>
                <p className="text-xs text-gray-400">
                  {item.city ? `${item.city}, ` : ''}{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently analyzed'}
                </p>
              </div>
            </div>

            {item.riskScore && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                item.riskScore <= 35 ? 'bg-emerald-100 text-emerald-700' :
                item.riskScore <= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>
                Score: {item.riskScore}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyHistory;