import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "RESIDENTIAL",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    surveyNo: "",
    registrationNo: "",
  });

  const [images, setImages] = useState(["", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.some((url) => !url.trim())) {
      alert("Please enter all 4 property image URLs.");
      return;
    }

    setLoading(true);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      const propertyData = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        propertyType: formData.propertyType,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : 0,
        sqft: formData.sqft ? parseInt(formData.sqft, 10) : 0,
        surveyNo: formData.surveyNo,
        registrationNo: formData.registrationNo,
        imageUrls: images,
      };

      const response = await axios.post(
        "http://localhost:8080/api/properties",
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Property created:", response.data);

      alert("Property published successfully!");

      navigate("/search-property");
    } catch (error) {
      console.error("Error posting property:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to post property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Post New Property Listing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            required
            placeholder="123 Ocean Drive"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              City
            </label>
            <input
              type="text"
              name="city"
              required
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              State
            </label>
            <input
              type="text"
              name="state"
              required
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              required
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Property Type
            </label>
            <select
              name="propertyType"
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            >
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="LAND">Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              required
              placeholder="450000"
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              placeholder="3"
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              placeholder="2"
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              SqFt
            </label>
            <input
              type="number"
              name="sqft"
              placeholder="2200"
              className="w-full border rounded-lg p-3"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 📜 LEGAL IDENTIFIERS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Survey Number / Plot ID
            </label>
            <input
              type="text"
              name="surveyNo"
              placeholder="e.g. SY-4002/1A"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNo"
              placeholder="e.g. REG-MH-2026-8842"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg bg-slate-50">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Property Images
          </label>

          <p className="text-sm text-slate-500 mb-4">
            Enter exactly 4 image URLs. The first image will be the main image.
          </p>

          <div className="space-y-4">
            {images.map((url, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Image {index + 1}
                  {index === 0 && (
                    <span className="ml-2 text-blue-600 font-semibold">
                      (Main Image)
                    </span>
                  )}
                </label>

                <input
                  type="url"
                  required
                  value={url}
                  placeholder="https://example.com/property-image.jpg"
                  onChange={(e) => {
                    const updatedImages = [...images];
                    updatedImages[index] = e.target.value;
                    setImages(updatedImages);
                  }}
                  className="w-full border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {url.trim() && (
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="mt-2 w-full h-40 object-cover rounded-lg border shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition cursor-pointer disabled:bg-blue-300"
        >
          {loading ? "Publishing..." : "Publish Property Listing"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
