import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'RESIDENTIAL',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Retrieve JWT token stored during login
    const token = localStorage.getItem('token'); 

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : 0,
      sqft: formData.sqft ? parseInt(formData.sqft, 10) : 0,
      imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
    };

    try {
      await axios.post('http://localhost:8080/api/properties', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Property published successfully!');
      navigate('/search-property');
    } catch (error) {
      console.error('Error posting property:', error);
      alert('Failed to post property. Make sure you are logged in as Real Estate Agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Post New Property Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Property Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Modern Villa with Pool & Garden"
            className="w-full border rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Street Address</label>
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
            <label className="block text-sm font-semibold mb-2 text-slate-700">City</label>
            <input type="text" name="city" required className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">State</label>
            <input type="text" name="state" required className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Zip Code</label>
            <input type="text" name="zipCode" required className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Property Type</label>
            <select name="propertyType" className="w-full border rounded-lg p-3" onChange={handleChange}>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="LAND">Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Price ($)</label>
            <input type="number" name="price" required placeholder="450000" className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Bedrooms</label>
            <input type="number" name="bedrooms" placeholder="3" className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Bathrooms</label>
            <input type="number" name="bathrooms" placeholder="2" className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">SqFt</label>
            <input type="number" name="sqft" placeholder="2200" className="w-full border rounded-lg p-3" onChange={handleChange} />
          </div>
        </div>

        {/* 📸 PICTURE SECTION WITH LIVE PREVIEW */}
        <div className="border-2 border-dashed border-slate-300 p-4 rounded-lg bg-slate-50">
          <label className="block text-sm font-semibold mb-1 text-slate-700">Property Image URL</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"
            className="w-full border rounded-lg p-3 bg-white"
            onChange={handleChange}
          />
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Image Preview:</p>
              <img
                src={formData.imageUrl}
                alt="Property Preview"
                className="w-full h-48 object-cover rounded-lg border shadow-sm"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Invalid+Image+URL'; }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Description</label>
          <textarea name="description" rows="3" className="w-full border rounded-lg p-3" placeholder="Provide property highlights..." onChange={handleChange}></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition"
        >
          {loading ? 'Publishing...' : 'Publish Property Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;