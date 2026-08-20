// src/routes/agent/ListProperty.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/app-shell';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Upload, X, Image, Plus, Loader2, MapPin, DollarSign, Home, Building2 } from 'lucide-react';
import api from '../../services/api';

const propertyTypes = ['Residential', 'Commercial', 'Industrial', 'Mixed-Use'];
const listingStatuses = ['AVAILABLE', 'UNDER_REVIEW', 'VERIFIED', 'SOLD', 'REJECTED'];
const ownerTypes = ['INDIVIDUAL', 'CORPORATION', 'TRUST', 'LLC'];

export default function ListProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    parcelId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: '',
    price: '',
    size: '',
    yearBuilt: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    lotSize: '',
    latitude: '',
    longitude: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerType: 'INDIVIDUAL',
    listingPrice: '',
    minimumOfferPrice: '',
    listingDescription: '',
    propertyFeatures: '',
    listingStatus: 'AVAILABLE'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    e.target.value = '';
    alert('Property image uploads are not available yet. Images are not stored by the current backend.');
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        propertyCode: formData.parcelId.trim(),
        propertyType: formData.propertyType,
        propertyName: formData.address.trim(),
        description: [formData.listingDescription, formData.propertyFeatures]
          .filter(Boolean)
          .join('\n\n') || null,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        totalArea: formData.squareFootage || formData.size ? parseFloat(formData.squareFootage || formData.size) : null,
        landArea: formData.lotSize ? parseFloat(formData.lotSize) : null,
        marketValue: formData.listingPrice || formData.price ? parseFloat(formData.listingPrice || formData.price) : null,
        address: {
          addressType: 'PHYSICAL',
          addressLine1: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: 'USA',
          postalCode: formData.zipCode.trim(),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        },
      };

      const response = await api.post('/properties', propertyData);

      if (response.data?.propertyId) {
        navigate('/agent/properties');
      } else {
        alert(response.data.message || 'Failed to list property');
      }
    } catch (error) {
      console.error('Error listing property:', error);
      const errorMsg = error.response?.data?.message || 'Failed to list property. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="List New Property" 
        subtitle="Add a new property to the marketplace"
        actions={
          <Button 
            variant="outline" 
            onClick={() => navigate('/agent/properties')} 
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Details */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Home className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Parcel ID *</Label>
              <Input
                name="parcelId"
                value={formData.parcelId}
                onChange={handleChange}
                placeholder="Enter parcel ID"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Property Type *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleSelectChange('propertyType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter property address"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">City *</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">State *</Label>
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Zip Code *</Label>
              <Input
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Price ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Size (sqft)</Label>
              <Input
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Enter size"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Year Built</Label>
              <Input
                name="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="Year built"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Lot Size</Label>
              <Input
                name="lotSize"
                type="number"
                value={formData.lotSize}
                onChange={handleChange}
                placeholder="Lot size"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Bedrooms</Label>
              <Input
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Number of bedrooms"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Bathrooms</Label>
              <Input
                name="bathrooms"
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Number of bathrooms"
              />
            </div>
          </div>
        </div>

        {/* Listing Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Listing Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Listing Price ($)</Label>
              <Input
                name="listingPrice"
                type="number"
                value={formData.listingPrice}
                onChange={handleChange}
                placeholder="Enter listing price"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Minimum Offer Price ($)</Label>
              <Input
                name="minimumOfferPrice"
                type="number"
                value={formData.minimumOfferPrice}
                onChange={handleChange}
                placeholder="Enter minimum offer price"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Listing Status</Label>
              <Select
                value={formData.listingStatus}
                onValueChange={(value) => handleSelectChange('listingStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {listingStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Property Description</Label>
              <Textarea
                name="listingDescription"
                value={formData.listingDescription}
                onChange={handleChange}
                placeholder="Describe the property (location, features, nearby amenities, etc.)"
                rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Property Features</Label>
              <Textarea
                name="propertyFeatures"
                value={formData.propertyFeatures}
                onChange={handleChange}
                placeholder="List property features (pool, garage, central AC, hardwood floors, etc.)"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Owner Name *</Label>
              <Input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Owner full name"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Owner Type</Label>
              <Select
                value={formData.ownerType}
                onValueChange={(value) => handleSelectChange('ownerType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner type" />
                </SelectTrigger>
                <SelectContent>
                  {ownerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Owner Email</Label>
              <Input
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="Owner email"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Owner Phone</Label>
              <Input
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleChange}
                placeholder="Owner phone number"
              />
            </div>
          </div>
        </div>

        {/* Images Upload */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Click to upload property images</p>
              <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB each</p>
            </label>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Property ${index + 1}`}
                    className="h-24 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/agent/properties')} className="border-slate-300 text-slate-700 hover:bg-slate-50">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Listing Property...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                List Property
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
