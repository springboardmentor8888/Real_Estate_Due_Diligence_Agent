import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, ChevronDown, Search, LayoutDashboard, Building2, FileText, 
  Bookmark, BellRing, GitCompareArrows, LineChart, Settings, User, 
  Shield, LogOut 
} from "lucide-react";
import { Logo } from "./logo";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { authService } from "../services/api";
const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Property Search", to: "/properties", icon: Building2 },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Watchlist", to: "/watchlist", icon: Bookmark },
  { label: "Alerts", to: "/notifications", icon: BellRing },
  { label: "Comparables", to: "/comparables", icon: GitCompareArrows },
  { label: "Analytics", to: "/analytics", icon: LineChart },
];

const SECONDARY = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Admin", to: "/admin", icon: Shield },
];

export function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  
  // Get user from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.fullName || 'User';
  const userEmail = userData.email || '';
  const userRole = userData.role || '';

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name || name === 'User') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <aside className="glass-strong fixed inset-y-3 left-3 z-30 hidden w-60 flex-col rounded-2xl p-3 lg:flex">
        <div className="px-2 py-2"><Logo /></div>
        <nav className="mt-4 flex flex-1 flex-col gap-0.5">
          {NAV.map((i) => {
            const active = pathname === i.to || (i.to !== "/dashboard" && pathname.startsWith(i.to));
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  active 
                    ? "bg-foreground/[0.06] text-foreground" 
                    : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                }`}
              >
                <i.icon className={`h-4 w-4 ${active ? "text-emerald" : ""}`} />
                {i.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald shadow-glow" />}
              </Link>
            );
          })}
          <div className="my-3 h-px bg-border" />
          {SECONDARY.map((i) => {
            const active = pathname.startsWith(i.to);
            return (
              <Link
                key={i.to}
                to={i.to}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                  active 
                    ? "bg-foreground/[0.06] text-foreground" 
                    : "text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground"
                }`}
              >
                <i.icon className="h-4 w-4" />
                {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="glass mt-3 rounded-xl p-3">
          <div className="text-[11px] font-medium text-foreground">Enterprise plan</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">1,240 / 2,000 reports</div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/[0.06]">
            <div className="h-full w-[62%] rounded-full bg-emerald" />
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 md:px-6">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search properties, owners, reports…" className="h-9 rounded-lg border-border bg-foreground/[0.03] pl-9 text-[13px] placeholder:text-muted-foreground" />
              <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-foreground/[0.03] px-1.5 py-0.5 text-[10px] text-muted-foreground md:block">⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Link to="/notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-foreground/[0.03]">
                  <Avatar className="h-7 w-7 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-emerald to-chart-2 text-[11px] font-semibold text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <div className="text-[12px] leading-tight text-foreground">{userName}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">{userRole}</div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong">
                  <DropdownMenuLabel>
                    <div className="text-xs text-muted-foreground">My Account</div>
                    <div className="text-sm font-medium text-foreground">{userName}</div>
                    <div className="text-xs text-muted-foreground">{userEmail}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

export function RiskBadge({ level }) {
  const cls = level === "Low"
    ? "bg-emerald/15 text-emerald border-emerald/30"
    : level === "Medium"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-destructive/15 text-destructive border-destructive/30";
  return (
    <Badge variant="outline" className={`gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level} risk
    </Badge>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gradient">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}