import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  BarChart3, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Scale,
  Briefcase,
  Shield,
  Users,
  Search,
  Plus,
  Heart,
  FileCheck,
  Database
} from 'lucide-react';
import { authService } from '../services/api';

// =========================================================
// NAVIGATION ITEMS BY ROLE
// =========================================================

const getNavItems = (role) => {
  // Common items for all roles
  const commonItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/comparables', label: 'Comparables', icon: Scale },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  // Role-specific items
  const roleSpecific = {
    'AGENT': [
      { path: '/agent/dashboard', label: 'Agent Dashboard', icon: LayoutDashboard },
      { path: '/agent/list-property', label: 'List Property', icon: Plus },
      { path: '/agent/properties', label: 'My Properties', icon: Building2 },
      { path: '/agent/inquiries', label: 'Inquiries', icon: Bell },
      { path: '/users', label: 'User Directory', icon: Users },
    ],
    'BUYER': [
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/watchlist', label: 'Watchlist', icon: Heart },
      { path: '/buyer/offers', label: 'My Offers', icon: FileCheck },
    ],
    'BANK': [
      { path: '/bank/dashboard', label: 'Bank Dashboard', icon: LayoutDashboard },
      { path: '/bank/loans', label: 'Loan Applications', icon: Briefcase },
      { path: '/bank/risks', label: 'Risk Assessments', icon: Shield },
      { path: '/bank/reports', label: 'Financial Reports', icon: FileText },
    ],
    'LEGAL_REVIEWER': [
      { path: '/legal/dashboard', label: 'Legal Dashboard', icon: LayoutDashboard },
      { path: '/legal/reports', label: 'Legal Reports', icon: FileText },
      { path: '/legal/comparables', label: 'Comparables', icon: Scale },
      { path: '/legal/property-search', label: 'Property Search', icon: Search },
      { path: '/legal/documents', label: 'Verify Documents', icon: FileCheck },
      { path: '/legal/transactions', label: 'Transactions', icon: Database },
    ],
    'SELLER': [
      { path: '/agent/properties', label: 'My Properties', icon: Building2 },
      { path: '/agent/inquiries', label: 'Inquiries', icon: Bell },
    ],
  };

  // Combine common items with role-specific items
  let items = [...commonItems];
  if (roleSpecific[role]) {
    items = [...items, ...roleSpecific[role]];
  }

  return items;
};

// =========================================================
// APP SHELL COMPONENT
// =========================================================

export function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Get user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !userData) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const role = String(user.role || '').toUpperCase().replace(/^ROLE_/, '');
    const path = location.pathname;
    const requiredRoles = path.startsWith('/bank/')
      ? ['BANK']
      : path.startsWith('/buyer/') || path === '/watchlist' || path === '/analytics'
        ? ['BUYER']
        : path.startsWith('/legal/')
          ? ['LEGAL_REVIEWER']
          : path === '/users' || path === '/agent/dashboard' || path === '/agent/list-property'
            ? ['AGENT']
            : path === '/agent/properties' || path === '/agent/inquiries'
              ? ['AGENT', 'SELLER']
              : [];

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate, user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get navigation items based on role
  const navItems = getNavItems(user?.role || 'BUYER');

  if (user === undefined) {
    return null;
  }

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* =========================================================
          SIDEBAR
          ========================================================= */}
      
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-slate-200 fixed h-full overflow-hidden transition-all duration-300 z-50 lg:relative lg:w-64 lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="RealEstate Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white text-lg">🏠</span>
            </div>
            <div>
              <span className="text-[16px] font-extrabold tracking-tight text-slate-900 block leading-tight">RealEstate</span>
              <span className="text-[8px] font-medium text-emerald-600 tracking-widest uppercase">Due Diligence</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-600' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || 'BUYER'}
                </p>
              </div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT
          ========================================================= */}
      
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Left: Mobile menu button + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="h-5 w-5 text-slate-600" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-5 w-5 text-slate-600" />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children || <Outlet />}
        </main>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// PAGE HEADER COMPONENT
// =========================================================

export function PageHeader({ title, subtitle, description, actions, children }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {(subtitle || description) && (
          <p className="text-sm text-slate-500 mt-1">{subtitle || description}</p>
        )}
      </div>
      {(actions || children) && (
        <div className="flex items-center gap-3">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}

// =========================================================
// RISK BADGE COMPONENT
// =========================================================

export function RiskBadge({ level = 'LOW', score }) {
  const badgeStyles = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300',
  };

  const style = badgeStyles[level?.toUpperCase()] || badgeStyles.LOW;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
      {level?.toUpperCase() || 'LOW'} {score !== undefined ? `(${score})` : ''}
    </span>
  );
}

export default AppShell;
