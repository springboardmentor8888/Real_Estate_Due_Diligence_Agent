// src/components/app-shell.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, LayoutDashboard, Building2, FileText, 
  Bookmark, BellRing, GitCompareArrows, LineChart, Settings, User, 
  Shield, LogOut, Menu, X, Users, BarChart3, Plus, Mail, Home,
  DollarSign, Landmark, FileCheck, Scale
} from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { authService } from '../services/api';

// Regular user navigation
const USER_NAV = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Property Search", to: "/properties", icon: Building2 },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Watchlist", to: "/watchlist", icon: Bookmark },
  { label: "Alerts", to: "/notifications", icon: BellRing },
  { label: "Comparables", to: "/comparables", icon: GitCompareArrows },
  { label: "Analytics", to: "/analytics", icon: LineChart },
];

// Agent navigation
const AGENT_NAV = [
  { label: "Dashboard", to: "/agent/dashboard", icon: LayoutDashboard },
  { label: "My Properties", to: "/agent/properties", icon: Building2 },
  { label: "List Property", to: "/agent/list-property", icon: Plus },
  { label: "Inquiries", to: "/agent/inquiries", icon: Mail },
  { label: "Analytics", to: "/analytics", icon: LineChart },
];

// Legal Reviewer Navigation
const LEGAL_NAV = [
  { label: "Dashboard", to: "/legal/dashboard", icon: LayoutDashboard },
  { label: "Verify Documents", to: "/legal/documents", icon: FileCheck },
  { label: "Review Transactions", to: "/legal/transactions", icon: Scale },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Analytics", to: "/analytics", icon: LineChart },
  { label: "Settings", to: "/settings", icon: Settings },
];

// Bank Navigation
const BANK_NAV = [
  { label: "Dashboard", to: "/bank/dashboard", icon: LayoutDashboard },
  { label: "Loan Applications", to: "/bank/loans", icon: DollarSign },
  { label: "Risk Assessments", to: "/bank/risks", icon: Shield },
  { label: "Financial Reports", to: "/bank/reports", icon: FileCheck },
  { label: "Settings", to: "/settings", icon: Settings },
];

// Admin navigation
const ADMIN_NAV = [
  { label: "Admin Dashboard", to: "/admin", icon: BarChart3 },
  { label: "User Management", to: "/admin/users", icon: Users },
];

const SECONDARY = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Profile", to: "/profile", icon: User },
];

export function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const pathname = location.pathname;
  
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = userData.fullName || 'User';
  const userEmail = userData.email || '';
  const userRole = userData.role || '';
  const isAdmin = userRole === 'ADMIN';
  const isAgent = userRole === 'AGENT';
  const isBank = userRole === 'BANK';
  const isLegal = userRole === 'LEGAL_REVIEWER';

  // Select navigation based on role
  let NAV = USER_NAV;
  if (isAdmin) {
    NAV = ADMIN_NAV;
  } else if (isAgent) {
    NAV = AGENT_NAV;
  } else if (isBank) {
    NAV = BANK_NAV;
  } else if (isLegal) {
    NAV = LEGAL_NAV;
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getInitials = (name) => {
    if (!name || name === 'User') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  // ✅ FIXED: getPageTitle now correctly shows 'User Management'
  const getPageTitle = () => {
    if (isAdmin) {
      if (pathname === '/admin') return 'Admin Dashboard';
      if (pathname === '/admin/users') return 'User Management';
      return 'Admin';
    }
    if (isAgent) {
      const current = AGENT_NAV.find(n => pathname === n.to || pathname.startsWith(n.to + '/'));
      return current?.label || 'Dashboard';
    }
    if (isBank) {
      const current = BANK_NAV.find(n => pathname === n.to || pathname.startsWith(n.to + '/'));
      return current?.label || 'Bank Dashboard';
    }
    if (isLegal) {
      const current = LEGAL_NAV.find(n => pathname === n.to || pathname.startsWith(n.to + '/'));
      return current?.label || 'Legal Dashboard';
    }
    const current = USER_NAV.find(n => pathname === n.to || pathname.startsWith(n.to + '/'));
    return current?.label || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      {sidebarOpen && (
        <>
          {isMobile && (
            <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          )}
          <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-xl ${isMobile ? 'animate-slide-in' : ''}`}>
            <div className="flex flex-col h-full">
              
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link to={isLegal ? "/legal/dashboard" : isBank ? "/bank/dashboard" : "/dashboard"} className="flex items-center gap-3">
                  <img 
                    src="/logo.png" 
                    alt="RealEstate" 
                    className="h-10 w-10 object-contain rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-10 w-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <span className="text-white font-bold text-sm">RE</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900 leading-tight">RealEstate</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Due Diligence</span>
                  </div>
                </Link>
                {isMobile && (
                  <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <X size={20} />
                  </button>
                )}
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {NAV.map((navItem) => {
                  const Icon = navItem.icon;
                  const active = pathname === navItem.to;
                  
                  return (
                    <Link
                      key={navItem.to}
                      to={navItem.to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active 
                          ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                      <span className="font-medium text-sm">{navItem.label}</span>
                    </Link>
                  );
                })}
                
                {/* Show secondary items only for non-admin non-agent non-bank non-legal users */}
                {!isAdmin && !isAgent && !isBank && !isLegal && (
                  <>
                    <div className="my-3 h-px bg-gray-200" />
                    {SECONDARY.map((navItem) => {
                      const Icon = navItem.icon;
                      const active = pathname === navItem.to;
                      return (
                        <Link
                          key={navItem.to}
                          to={navItem.to}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            active 
                              ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon size={18} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                          <span className="font-medium text-sm">{navItem.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </nav>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold text-sm">{getInitials(userName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate uppercase">{userRole || 'User'}</p>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu size={22} />
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {!isAdmin && (
                <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100">
                  <Bell size={20} />
                </Link>
              )}
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100">
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export function RiskBadge({ level }) {
  const cls = level === "Low"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
    : level === "Medium"
      ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
      : "bg-red-500/15 text-red-500 border-red-500/30";
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
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}