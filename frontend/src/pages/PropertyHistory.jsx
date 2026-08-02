import {
  FaArrowLeft,
  FaCheckCircle,
  FaHistory,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getPropertyById } from "../data/propertyData";
import { propertyTimeline } from "../data/reportData";

function getTimelineDotClass(color) {
  if (color === "green") return "bg-green-500";
  if (color === "blue") return "bg-blue-500";
  if (color === "yellow") return "bg-yellow-500";
  return "bg-purple-500";
}

const checklist = [
  "Registration Verified",
  "Owner Identity Verified",
  "Tax Records Updated",
  "Encumbrance Certificate Verified",
  "Survey Records Checked",
  "Litigation Check Completed",
  "Property Inspection Completed",
];

const PropertyHistory = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const property = getPropertyById(propertyId);
  const owners = [
    { year: "Previous", owner: "Prior Recorded Owner", status: "Previous Owner" },
    { year: "Current", owner: property.owner, status: "Current Owner" },
  ];
  const transactions = [
    { date: property.registrationDate, event: "Property Registration", status: "Completed" },
    {
      date: "20 Jun 2024",
      event: "Tax Review",
      status: property.taxStatus === "Paid" ? "Completed" : "Review Pending",
    },
    { date: "10 Oct 2024", event: "Inspection", status: "Completed" },
  ];

  return (
    <div className="px-8 pt-5 pb-8">
      <button
        onClick={() => navigate(`/property-details/${property.id}`)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft />
        Back to Property Details
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Property History</h1>

        <p className="text-gray-500 mt-3 text-lg">
          Ownership and transaction history for {property.title}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaHome className="text-3xl text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Property</p>
            <h3 className="font-bold">{property.title}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaMapMarkerAlt className="text-3xl text-red-500" />
          <div>
            <p className="text-gray-500 text-sm">Location</p>
            <h3 className="font-bold">{property.city}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaMoneyBillWave className="text-3xl text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Market Value</p>
            <h3 className="font-bold">{property.marketValue}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaCheckCircle className="text-3xl text-green-600" />
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <h3 className="font-bold text-green-600">{property.verificationStatus}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaHistory className="text-blue-600" />
            Property Timeline
          </h2>

          <div className="relative border-l-4 border-blue-200 ml-4">
            {propertyTimeline.map((item) => (
              <div key={`${item.date}-${item.title}`} className="mb-10 ml-8 relative last:mb-0">
                <div
                  className={`absolute -left-[42px] top-1 h-5 w-5 rounded-full border-4 border-white shadow ${getTimelineDotClass(
                    item.color,
                  )}`}
                />
                <p className="text-sm text-gray-400">{item.date}</p>
                <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ownership History
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-gray-600">Year</th>
                <th className="text-left py-3 text-gray-600">Owner</th>
                <th className="text-left py-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={`${owner.year}-${owner.owner}`} className="border-b hover:bg-gray-50">
                  <td className="py-4">{owner.year}</td>
                  <td className="py-4 font-medium">{owner.owner}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        owner.status === "Current Owner"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {owner.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Transaction History
          </h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-gray-600">Date</th>
                <th className="text-left py-3 text-gray-600">Event</th>
                <th className="text-left py-3 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={`${transaction.date}-${transaction.event}`} className="border-b hover:bg-gray-50">
                  <td className="py-4">{transaction.date}</td>
                  <td className="py-4 font-medium">{transaction.event}</td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Due Diligence Checklist
          </h2>

          <div className="space-y-5">
            {checklist.map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3">
                <span className="font-medium text-gray-700">{item}</span>
                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <FaCheckCircle />
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyHistory;
