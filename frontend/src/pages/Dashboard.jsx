import StatCard from "../components/common/StatCard";
import RecentSearches from "./RecentSearches";
import QuickActions from "./QuickActions";
import Notifications from "./Notifications";
import RecentReports from "./RecentReports";
import { FaSearch, FaFileAlt, FaBookmark, FaBell } from "react-icons/fa";


const Dashboard = () => {
  return (
    <div className="px-8 pt-5 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome, User!</h1>

        <p className="mt-2 text-gray-500">
          Here's what's happening with your due diligence activities.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <StatCard
          icon={<FaSearch />}
          title="Total Searches"
          value="12"
          change="+12% this month"
          changeColor="text-green-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon={<FaFileAlt />}
          title="Reports Generated"
          value="6"
          change="+8% this month"
          changeColor="text-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon={<FaBookmark />}
          title="Saved Properties"
          value="7"
          change="+5% this month"
          changeColor="text-green-600"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          icon={<FaBell />}
          title="Alerts"
          value="3"
          change="View all"
          changeColor="text-blue-600"
          iconBg="bg-red-100"
          iconColor="text-red-600"
          link="/alerts"
        />
      </div>
      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="col-span-2">
          <RecentSearches />
        </div>

        <div>{<QuickActions />}</div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-8">
        <RecentReports />
        <Notifications />
      </div>
    </div>
  );
};

export default Dashboard;
