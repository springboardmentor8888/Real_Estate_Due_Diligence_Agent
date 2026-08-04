import React from "react";
import { Search, MapPin, Filter } from "lucide-react";

function PropertySearchWorkspaceHeader({
  searchAddress,
  setSearchAddress,
  selectedCategory,
  setSelectedCategory,
  onSearch,
}) {
  const categories = [
    { id: "ALL", label: "All Types" },
    { id: "Residential", label: "Residential" },
    { id: "Commercial", label: "Commercial" },
    { id: "Industrial", label: "Industrial" },
    { id: "Agricultural", label: "Agricultural" },
  ];

  const recentSearches = [
    "Gachibowli Tech Park Phase 2, Hyderabad",
    "Whitefield Outer Ring Road, Bengaluru",
    "BKC Corporate Tower, Mumbai",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchAddress, selectedCategory);
  };

  const handleChipClick = (catId) => {
    setSelectedCategory(catId);
    onSearch(searchAddress, catId);
  };

  const handlePillClick = (query) => {
    setSearchAddress(query);
    onSearch(query, selectedCategory);
  };

  return (
    <div className="white-card rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-[#334155] shadow-xs space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight">
          Property Search Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#CBD5E1]">
          Query title deeds, survey numbers, zoning classifications, and flood maps across state registries.
        </p>
      </div>

      {/* Large Search Input & Button */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-3xl">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Search by address, survey number, owner name, city, or state..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Search size={16} />
          <span>Search</span>
        </button>
      </form>

      {/* Filter Chips & Recent Searches Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-[#334155]">
        {/* Category Quick Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 dark:text-[#94A3B8] flex items-center gap-1 mr-1">
            <Filter size={13} /> Filter:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleChipClick(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#334155]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Recent Searches Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-[#94A3B8] font-medium shrink-0">Recent:</span>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePillClick(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-[#334155] text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertySearchWorkspaceHeader;
