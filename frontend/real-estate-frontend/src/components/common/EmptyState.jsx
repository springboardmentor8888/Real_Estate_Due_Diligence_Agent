import React from "react";
import { FolderSearch, SearchX, AlertCircle } from "lucide-react";
import Button from "./Button";

function EmptyState({
  title = "No Records Found",
  message = "Search a property address or adjust your filters to view due diligence results.",
  icon: CustomIcon,
  actionLabel,
  onAction,
}) {
  const Icon = CustomIcon || FolderSearch;

  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs mb-4">
        <Icon size={32} />
      </div>

      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed">{message}</p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;