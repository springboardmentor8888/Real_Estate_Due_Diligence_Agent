import {
  FaSearch,
  FaFileAlt,
  FaBalanceScale,
  FaFolderOpen,
  FaBookmark,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const actions = [
  {
    title: "Search New Property",
    icon: <FaSearch />,
    link: "/search-property",
  },
  {
    title: "Generate Report",
    icon: <FaFileAlt />,
    link: "/reports",
  },
  {
    title: "Compare Properties",
    icon: <FaBalanceScale />,
    link: "/comparisons",
  },
  {
    title: "View My Reports",
    icon: <FaFolderOpen />,
    link: "/reports",
  },
  {
    title: "Saved Properties",
    icon: <FaBookmark />,
    link: "/saved-properties",
  },
];

const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{action.icon}</span>

              <span className="font-medium text-gray-700">{action.title}</span>
            </div>

            <FaChevronRight className="text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
