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
} from "react-icons/hi2";
import { NavLink } from "react-router-dom";

const menuItems = [
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
    label: "Comparisons",
    path: "/comparisons",
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
  {
    icon: <HiOutlineClipboardDocumentList />,
    label: "Audit Logs",
    path: "/audit-logs",
  },
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
  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white shadow-2xl flex flex-col px-6 py-8">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-2xl shadow-md">
          <HiOutlineBuildingOffice2 />
        </div>

        <div>
          <h2 className="text-xl font-bold">Real Estate</h2>
          <p className="text-sm text-slate-400">Due Diligence Agent</p>
        </div>
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium text-[15px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-8 border-t border-slate-700">
        <NavLink
          to="/"
          className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <HiOutlineArrowLeftOnRectangle className="text-2xl" />
          <span className="font-medium text-[15px]">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
export default Sidebar;
