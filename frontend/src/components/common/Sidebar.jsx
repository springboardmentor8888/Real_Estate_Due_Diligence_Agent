import {
  HiOutlineHome,
  HiMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineBookmark,
  HiOutlineScale,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineClipboardDocumentList,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineQuestionMarkCircle,
  HiOutlineBuildingOffice2,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";

// 1. Menu items with role-based accessibility settings
const mainMenuItems = [
  {
    icon: <HiOutlineHome />,
    label: "Dashboard",
    path: "/dashboard",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
  {
    icon: <HiMagnifyingGlass />,
    label: "Search Property",
    path: "/search-property",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
  {
    icon: <HiOutlineDocumentText />,
    label: "My Reports",
    path: "/reports",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
  {
    icon: <HiOutlineBookmark />,
    label: "Saved Properties",
    path: "/saved-properties",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
  {
    icon: <HiOutlineScale />,
    label: "Comparable Properties",
    path: "/property-comparison",
    // 🔒 Hidden from standard BUYER role
    roles: ["REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN"],
  },
  {
    icon: <HiOutlineClock />,
    label: "Property History",
    path: "/property-history",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
  {
    icon: <HiOutlineBell />,
    label: "Alerts & Notifications",
    path: "/alerts",
    roles: ["BUYER", "REAL_ESTATE_AGENT", "LEGAL_REVIEWER", "FINANCIAL_INSTITUTION", "ADMIN", "USER"],
  },
];

// 2. Admin Only Menu Items (UNTOUCHED)
const adminMenuItems = [
  {
    icon: <HiOutlineShieldCheck />,
    label: "Admin Dashboard",
    path: "/admin",
  },
  {
    icon: <HiOutlineChartBar />,
    label: "Analytics",
    path: "/analytics",
  },
  {
    icon: <HiOutlineClipboardDocumentList />,
    label: "Audit Logs",
    path: "/audit-logs",
  },
];

// 3. General Profile/Support Items
const secondaryMenuItems = [
  {
    icon: <HiOutlineUser />,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: <HiOutlineCog6Tooth />,
    label: "Settings",
    path: "/settings",
  },
  {
    icon: <HiOutlineQuestionMarkCircle />,
    label: "Help & Support",
    path: "/help",
  },
];

function Sidebar() {
  const navigate = useNavigate();

  // 1. Safely retrieve user data and role from multiple localStorage fallbacks
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const rawRole =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    storedUser.role ||
    "BUYER";

  const userRole = rawRole.toUpperCase();

  // 2. Admin check (matches ADMIN or ROLE_ADMIN)
  const isAdmin = userRole.includes("ADMIN");

  // 3. Filter main menu items based on the user's role
  const visibleMenuItems = mainMenuItems.filter((item) =>
    item.roles.some((role) => userRole.includes(role))
  );

  // 4. Get display name
  const userName =
    storedUser.name ||
    (storedUser.email ? storedUser.email.split("@")[0] : "User");

  // Logout handler - Removes session keys safely without clearing custom saved properties
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white shadow-2xl flex flex-col px-6 py-8">
      {/* App Branding */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-2xl shadow-md">
          <HiOutlineBuildingOffice2 />
        </div>

        <div>
          <h2 className="text-xl font-bold">Real Estate</h2>
          <p className="text-sm text-slate-400">Due Diligence Agent</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-6 overflow-y-auto pr-1">
        {/* Main User Menu (Filtered by Role) */}
        <div className="flex flex-col gap-1.5">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 w-full ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-[14px]">{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* --- ADMINISTRATION SECTION (SHOWN IF isAdmin IS TRUE) --- */}
        {isAdmin && (
          <div className="pt-2 border-t border-slate-800">
            <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </p>
            <div className="flex flex-col gap-1.5">
              {adminMenuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 w-full ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-[14px]">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Account & Settings Section */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex flex-col gap-1.5">
            {secondaryMenuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-300 w-full ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-[14px]">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Profile Card & Logout Footer */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-white text-sm truncate capitalize">
              {userName}
            </p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {userRole.replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl" />
          <span className="font-medium text-[14px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;