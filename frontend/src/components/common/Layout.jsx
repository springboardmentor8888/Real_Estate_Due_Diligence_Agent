import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);

  const showNavbar =
    location.pathname === "/dashboard" ||
    location.pathname === "/search-property";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {showNavbar && (
          <Navbar
            showFilter={location.pathname === "/search-property"}
            onToggleFilter={() => setShowFilters(!showFilters)}
          />
        )}

        <main className="flex-1">
          <Outlet context={{ showFilters, setShowFilters }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;
