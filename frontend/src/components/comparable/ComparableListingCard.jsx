import { FaMapMarkerAlt, FaRulerCombined, FaTag } from "react-icons/fa";

import { formatCurrency } from "../../data/comparableData";

const ComparableListingCard = ({ listing }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
      <img
        src={listing.image}
        alt={listing.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-lg text-gray-800">{listing.name}</h3>

          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            {listing.distance}
          </span>
        </div>

        <p className="mt-3 flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt className="text-red-500" />
          {listing.address}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaTag className="text-green-600" />
            {formatCurrency(listing.price)}
          </div>

          <div className="flex items-center gap-2">
            <FaRulerCombined className="text-blue-600" />
            {listing.area}
          </div>
        </div>

        <p className="mt-4 font-semibold text-blue-600">
          {formatCurrency(listing.pricePerSqft)} / sq.ft
        </p>
      </div>
    </div>
  );
};

export default ComparableListingCard;
