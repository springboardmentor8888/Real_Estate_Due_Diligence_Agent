import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        keyword: searchTerm,
        city: cityFilter,
        propertyType: propertyType !== 'ALL' ? propertyType : ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Text Input */}
        <div className="relative md:col-span-2">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search address, title, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Property Type Dropdown */}
        <div>
          <select 
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-700"
          >
            <option value="ALL">All Types</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="INDUSTRIAL">Industrial</option>
            <option value="LAND">Land / Plot</option>
          </select>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FaSearch /> Search Properties
        </button>
      </div>
    </form>
  );
};

export default SearchBar;