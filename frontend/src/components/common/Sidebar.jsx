import { useEffect, useState } from "react";
import {
  HiChevronRight,
  HiMagnifyingGlass,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBell,
  HiOutlineBookmark,
  HiOutlineBuildingOffice2,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineExclamationTriangle,
  HiOutlineCheckBadge,
  HiOutlineHome,
  HiOutlineBanknotes,
  HiOutlinePlusCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi2";
import { NavLink, useNavigate } from "react-router-dom";

const mainMenuItems = [
  {
    icon: <HiOutlineHome />,
    label: "Dashboard",
    path: "/dashboard",
    roles: [
      "BUYER",
      "REAL_ESTATE_AGENT",
      "LEGAL_REVIEWER",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ],
  },
  {
    icon: <HiMagnifyingGlass />,
    label: "Search Property",
    path: "/search-property",
    roles: [
      "BUYER",
      "REAL_ESTATE_AGENT",
      "LEGAL_REVIEWER",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ],
  },

  {
    icon: <HiOutlineBanknotes />,
    label: "Financial Assessment",
    path: "/financial-assessment",
    roles: ["FINANCIAL_INSTITUTION"],
  },

  {
    icon: <HiOutlineDocumentMagnifyingGlass />,
    label: "Legal Reviews",
    path: "/legal-reviews",
    roles: ["LEGAL_REVIEWER"],
  },

  {
    icon: <HiOutlineExclamationTriangle />,
    label: "Risk & Evidence",
    path: "/risk-evidence",
    roles: ["LEGAL_REVIEWER"],
  },

  {
    icon: <HiOutlineDocumentText />,
    label: "Due Diligence Reports",
    path: "/reports",
    roles: [
      "LEGAL_REVIEWER",
      "REAL_ESTATE_AGENT",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ],
  },

  {
    icon: <HiOutlineCheckBadge />,
    label: "Review History",
    path: "/review-history",
    roles: ["LEGAL_REVIEWER"],
  },

  {
    icon: <HiOutlinePlusCircle />,
    label: "Post Property",
    path: "/add-property",
    roles: ["REAL_ESTATE_AGENT", "ADMINISTRATOR"],
  },

  {
    icon: <HiOutlineBookmark />,
    label: "Saved Properties",
    path: "/saved-properties",
    roles: [
      "BUYER",
      "REAL_ESTATE_AGENT",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ],
  },
  {
    icon: <HiOutlineBell />,
    label: "Alerts & Notifications",
    path: "/alerts",
    roles: [
      "BUYER",
      "REAL_ESTATE_AGENT",
      "LEGAL_REVIEWER",
      "FINANCIAL_INSTITUTION",
      "ADMINISTRATOR",
    ],
  },
];

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
  const [savedProperties, setSavedProperties] = useState([]);

  // Load user-scoped saved properties & listen for real-time changes
  useEffect(() => {
    loadSavedProperties();

    const handleUpdate = () => loadSavedProperties();
    window.addEventListener("savedPropertiesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("savedPropertiesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const loadSavedProperties = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user.email || "guest";
      const key = `savedProperties_${userId}`;

      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      setSavedProperties(stored);
    } catch (err) {
      console.error("Failed to parse saved properties from localStorage:", err);
      setSavedProperties([]);
    }
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const rawRole =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    storedUser.role ||
    "BUYER";

  const userRole = String(rawRole)
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  const isAdmin = userRole === "ADMINISTRATOR";

  const visibleMenuItems = mainMenuItems.filter((item) =>
    item.roles.includes(userRole),
  );
  const userName =
    storedUser.name ||
    (storedUser.email ? storedUser.email.split("@")[0] : "User");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const renderLink = (item) => {
    const isSavedLink = item.path === "/saved-properties";

    return (
      <div key={item.label} className="flex flex-col">
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 w-full ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <div className="flex items-center gap-4">
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-[14px]">{item.label}</span>
          </div>

          {/* Badge counter on Saved Properties menu item */}
          {isSavedLink && savedProperties.length > 0 && (
            <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
              {savedProperties.length}
            </span>
          )}
        </NavLink>

        {/* Quick-list preview of saved properties under the menu item */}
        {isSavedLink && savedProperties.length > 0 && (
          <div className="ml-8 mt-1.5 mb-1 flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
            {savedProperties.slice(0, 4).map((prop) => (
              <button
                key={prop.id}
                onClick={() => navigate(`/property-details/${prop.id}`)}
                className="flex items-center justify-between text-left py-1 px-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition group cursor-pointer"
              >
                <span className="truncate max-w-[140px]">
                  {prop.address || `Property #${prop.id}`}
                </span>
                <HiChevronRight className="text-[10px] text-slate-600 group-hover:text-blue-400 transition" />
              </button>
            ))}
            {savedProperties.length > 4 && (
              <button
                onClick={() => navigate("/saved-properties")}
                className="text-left py-1 px-2 text-[11px] font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                +{savedProperties.length - 4} more saved...
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white shadow-2xl flex flex-col px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-2xl shadow-md">
          <HiOutlineBuildingOffice2 />
        </div>
        <div>
          <h2 className="text-xl font-bold">Real Estate</h2>
          <p className="text-sm text-slate-400">Due Diligence Agent</p>
        </div>
      </div>

      <nav className="flex flex-col gap-6 overflow-y-auto pr-1">
        <div className="flex flex-col gap-1.5">
          {visibleMenuItems.map(renderLink)}
        </div>

        {isAdmin && (
          <div className="pt-2 border-t border-slate-800">
            <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </p>
            <div className="flex flex-col gap-1.5">
              {adminMenuItems.map(renderLink)}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800">
          <div className="flex flex-col gap-1.5">
            {secondaryMenuItems.map(renderLink)}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-white text-sm truncate capitalize">
              {userName}
            </p>
            <p className="text-xs text-slate-400 tracking-wider">
              {userRole === "ADMINISTRATOR"
                ? "Administrator"
                : userRole
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
        >
          <HiOutlineArrowLeftOnRectangle className="text-xl" />
          <span className="font-medium text-[14px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
