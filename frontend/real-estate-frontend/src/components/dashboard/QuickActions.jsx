import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building2,
  Waves,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Property Search",
      description: "Search land registry by APN, City, or Address",
      icon: Search,
      path: "/property-search",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      title: "Zoning Compliance",
      description: "Review building limits & FAR regulations",
      icon: Building2,
      path: "/zoning",
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      title: "Flood Zone Audit",
      description: "Analyze flood risk maps & elevation safety",
      icon: Waves,
      path: "/flood-zone",
      gradient: "from-cyan-600 to-teal-600",
    },
    {
      title: "Environmental Records",
      description: "Inspect soil, water, & EPA hazards",
      icon: Leaf,
      path: "/environmental",
      gradient: "from-emerald-600 to-green-600",
    },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>⚡</span> Quick Diligence Actions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access frequently used property audit workflows across Indian state registries.
          </p>
        </div>

        <button
          onClick={() => navigate("/property-search")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Compass size={16} className="text-cyan-400" />
          <span>Launch Search Engine</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;

          return (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className="group relative p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400/80 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.gradient} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={22} />
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-4 group-hover:translate-x-1 transition-transform">
                <span>View Details</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;