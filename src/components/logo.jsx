import { Home } from "lucide-react";

export function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald to-chart-2 shadow-glow">
        <Home className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <span className="text-[15px] font-bold tracking-tight text-foreground">RED</span>
    </div>
  );
}