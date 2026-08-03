import { useState } from "react";
import { 
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  FaChartLine, FaFilter, FaDownload, FaSearchPlus, FaExclamationTriangle, FaFileContract, FaClock 
} from "react-icons/fa";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");

  // Mock data for Monthly Due Diligence Activity
  const monthlyActivityData = [
    { month: "Jan", searches: 120, reports: 45 },
    { month: "Feb", searches: 180, reports: 70 },
    { month: "Mar", searches: 240, reports: 110 },
    { month: "Apr", searches: 310, reports: 165 },
    { month: "May", searches: 290, reports: 140 },
    { month: "Jun", searches: 420, reports: 210 },
  ];

  // Mock data for Property Risk Distribution (With Custom Fill Colors)
  const riskDistributionData = [
    { category: "Low Risk", count: 142, color: "#10B981" },     // Emerald
    { category: "Medium Risk", count: 88, color: "#F59E0B" },    // Amber
    { category: "High Risk", count: 34, color: "#EF4444" },     // Red
    { category: "Critical Flag", count: 12, color: "#881337" },  // Rose Dark
  ];

  // Mock data for Top Real Estate Markets
  const topMarkets = [
    { city: "Austin, TX", searches: 450, reportsGenerated: 180, avgRisk: "Low (18%)" },
    { city: "Miami, FL", searches: 380, reportsGenerated: 145, avgRisk: "Medium (42%)" },
    { city: "New York, NY", searches: 310, reportsGenerated: 120, avgRisk: "High (65%)" },
    { city: "Seattle, WA", searches: 260, reportsGenerated: 98, avgRisk: "Low (22%)" },
  ];

  // 📥 Function to Export Analytics to CSV
  const handleExportCSV = () => {
    const csvRows = [
      ["Market / City", "Total Searches", "Reports Generated", "Average Risk Level"],
      ...topMarkets.map(m => [m.city, m.searches, m.reportsGenerated, m.avgRisk])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `due_diligence_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-8 pt-6 pb-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaChartLine className="text-blue-600" /> Platform Analytics & Insights
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time due diligence search trends, risk distributions, and regional market intelligence.
          </p>
        </div>

        {/* Time Filter & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <FaFilter className="text-gray-400 text-xs ml-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-2 py-1 text-sm bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="30d">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Property Searches</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">1,560</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">↑ 18.2% vs last period</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FaSearchPlus className="text-2xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Reports Generated</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">770</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">↑ 12.5% conversion rate</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FaFileContract className="text-2xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">High Risk Flagged</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">46</p>
            <p className="text-xs text-rose-600 font-medium mt-1">Needs legal audit</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><FaExclamationTriangle className="text-2xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Avg Report Gen Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.4s</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Optimal API latency</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FaClock className="text-2xl" /></div>
        </div>
      </div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Area Chart: Activity Volume over Time */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Due Diligence Activity Trends</h2>
            <p className="text-xs text-gray-500">Searches conducted vs reports generated over time</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="searches" name="Searches" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSearches)" />
                <Area type="monotone" dataKey="reports" name="Reports" stroke="#10B981" fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Property Risk Level Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Property Risk Level Breakdown</h2>
            <p className="text-xs text-gray-500">Categorization of properties analyzed by risk severity</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" name="Properties" radius={[6, 6, 0, 0]}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Analyzed Real Estate Markets Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Top Analyzed Real Estate Markets</h2>
          <p className="text-xs text-gray-500 mt-0.5">Locations with highest due diligence engagement</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Market / City</th>
                <th className="px-6 py-3 font-medium">Total Searches</th>
                <th className="px-6 py-3 font-medium">Reports Generated</th>
                <th className="px-6 py-3 font-medium">Average Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {topMarkets.map((m, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{m.city}</td>
                  <td className="px-6 py-4 font-mono">{m.searches}</td>
                  <td className="px-6 py-4 font-mono">{m.reportsGenerated}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
                      m.avgRisk.includes("High") ? "bg-red-100 text-red-700" :
                      m.avgRisk.includes("Medium") ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {m.avgRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;