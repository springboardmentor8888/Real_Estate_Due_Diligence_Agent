import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-250 flex flex-col">
      {/* Top Header Navbar */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Content Area with Fixed Sidebar */}
      <div className="flex flex-1 pt-20">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 lg:pl-72 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto transition-colors duration-250">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;