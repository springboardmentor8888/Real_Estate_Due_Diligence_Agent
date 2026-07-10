import { useState } from "react";

function PropertySearch() {
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    if (!address.trim()) {
      alert("Please enter a property address");
      return;
    }

    alert("Address validation successful!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-center mb-6">
          Property Search
        </h1>

        <input
          type="text"
          placeholder="Enter Property Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Search Property
        </button>
      </div>
    </div>
  );
}

export default PropertySearch;