import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function InfoCard({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
  collapsible = false,
  defaultOpen = true,
  variant = "default", // "blue", "green", "amber", "purple", "cyan", "red", "gray", "default"
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const cardVariants = {
    blue: "bg-blue-50/40 border-blue-200/80 text-blue-950",
    green: "bg-emerald-50/40 border-emerald-200/80 text-emerald-950",
    amber: "bg-amber-50/40 border-amber-200/80 text-amber-950",
    purple: "bg-purple-50/40 border-purple-200/80 text-purple-950",
    cyan: "bg-cyan-50/40 border-cyan-200/80 text-cyan-950",
    red: "bg-rose-50/40 border-rose-200/80 text-rose-950",
    gray: "bg-slate-50/60 border-slate-200/80 text-slate-900",
    default: "bg-white border-slate-200 text-slate-900",
  };

  const iconVariants = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
    red: "bg-rose-100 text-rose-700 border-rose-200",
    gray: "bg-slate-200 text-slate-700 border-slate-300",
    default: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <div
      className={`rounded-2xl p-6 lg:p-8 border shadow-xs transition-all duration-200 ${
        cardVariants[variant] || cardVariants.default
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                iconVariants[variant] || iconVariants.default
              }`}
            >
              <Icon size={18} />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {title}
            </h2>
            {subtitle && <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {action}
          {collapsible && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80 transition-colors cursor-pointer"
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {(!collapsible || isOpen) && <div>{children}</div>}
    </div>
  );
}

export default InfoCard;