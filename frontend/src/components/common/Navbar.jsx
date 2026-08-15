import { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaChevronDown,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ showFilter = false, showSearch = true, onToggleFilter }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const userRole =
    localStorage.getItem("userRole") || localStorage.getItem("role") || "";
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userName =
    storedUser.name || localStorage.getItem("userName") || "User";
  const displayRole =
    userRole
      .replace(/^ROLE_/i, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "Buyer";

  const normalizedRole = userRole
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  const canPostProperty =
    normalizedRole === "REAL_ESTATE_AGENT" ||
    normalizedRole === "ADMINISTRATOR";

  return (
    <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm border-b">
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative w-[500px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate(
                    `/search-property?query=${encodeURIComponent(searchQuery.trim())}`,
                  );
                }
              }}
              placeholder="Search by address, city, pincode..."
              className="w-full rounded-xl border border-gray-300 py-3 pl-5 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(
                    `/search-property?query=${encodeURIComponent(searchQuery.trim())}`,
                  );
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 cursor-pointer"
            >
              <FaSearch />
            </button>
          </div>
        )}

        {showFilter && (
          <button
            onClick={onToggleFilter}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 hover:bg-gray-100 transition"
          >
            <FaFilter />
            Filters
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* 👔 RESTRICTED: Only visible for Real Estate Agents and Admins */}
        {canPostProperty && (
          <Link
            to="/add-property"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <FaPlus />
            Post Property
          </Link>
        )}

        <div className="relative cursor-pointer">
          <FaBell className="text-2xl text-gray-700 hover:text-blue-600 transition" />

          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            3
          </span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">{userName}</h2>

            <p className="text-sm text-gray-500 ">{displayRole}</p>
          </div>

          <FaChevronDown className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
