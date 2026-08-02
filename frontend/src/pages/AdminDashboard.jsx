import StatCard from "../components/common/StatCard";
import { FaUsers, FaBuilding, FaFileAlt, FaExclamationTriangle } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="px-8 pt-5 pb-8">

      <h1 className="text-4xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Monitor users, properties, reports and system activity.
      </p>


      <div className="grid grid-cols-4 gap-6 mt-8">

        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value="120"
          change="+10% this month"
          changeColor="text-green-600"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />


        <StatCard
          icon={<FaBuilding />}
          title="Total Properties"
          value="85"
          change="+8% this month"
          changeColor="text-green-600"
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />


        <StatCard
          icon={<FaFileAlt />}
          title="Reports Generated"
          value="45"
          change="+12% this month"
          changeColor="text-green-600"
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />


        <StatCard
          icon={<FaExclamationTriangle />}
          title="High Risk Properties"
          value="7"
          change="Needs attention"
          changeColor="text-red-600"
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />

      </div>

    </div>
  );
};

export default AdminDashboard;