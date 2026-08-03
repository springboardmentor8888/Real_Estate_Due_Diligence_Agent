import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import CommandPaletteModal from "../common/CommandPaletteModal";

function MainLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-250 flex flex-col relative">
      {/* Top Header Navbar */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Content Area with Fixed Sidebar */}
      <div className="flex flex-1">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 lg:pl-72 flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1500px] w-full mx-auto transition-colors duration-250 min-h-[calc(100vh-80px)]">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      {/* Floating Command Palette Overlay (Ctrl + K) */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default MainLayout;