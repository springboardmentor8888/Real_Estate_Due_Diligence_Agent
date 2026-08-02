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
import { NavLink } from "react-router-dom";

// 1. Standard User Menu Items (Visible to ALL roles: Buyer, Agent, Legal, Financial, etc.)
const mainMenuItems = [
  {
    icon: <HiOutlineHome />,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <HiMagnifyingGlass />,
    label: "Search Property",
    path: "/search-property",
  },
  {
    icon: <HiOutlineDocumentText />,
    label: "My Reports",
    path: "/reports",
  },
  {
    icon: <HiOutlineBookmark />,
    label: "Saved Properties",
    path: "/saved-properties",
  },
  {
    icon: <HiOutlineScale />,
    label: "Comparable Properties",
    path: "/property-comparison",
  },
  {
    icon: <HiOutlineClock />,
    label: "Property History",
    path: "/property-history",
  },
  {
    icon: <HiOutlineBell />,
    label: "Alerts & Notifications",
    path: "/alerts",
  },
];

// 2. Admin Only Menu Items (STRICTLY ADMIN)
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
  // 1. Read role from localStorage and normalize to uppercase safely
  const rawRole = localStorage.getItem("userRole") || "USER";
  const userRole = rawRole.toUpperCase();

  // 2. Strict Admin check (Evaluates to true ONLY for "ADMIN")
  const isAdmin = userRole === "ADMIN";

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
        
        {/* Main User Menu */}
        <div className="flex flex-col gap-1.5">
          {mainMenuItems.map((item) => (
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

        {/* --- ADMINISTRATION SECTION (STRICTLY SHOWN IF isAdmin IS TRUE) --- */}
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

      {/* Logout Footer (Clears localStorage on logout) */}
      <div className="mt-auto pt-6 border-t border-slate-800">
        <NavLink
          to="/login"
          onClick={() => {
            localStorage.removeItem("userRole");
            localStorage.removeItem("authToken");
          }}
          className="flex items-center gap-4 w-full px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl" />
          <span className="font-medium text-[14px]">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;