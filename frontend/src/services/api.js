// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (token) => api.get(`/auth/verify?token=${token}`),
  resendVerification: (email) => api.post(`/auth/resend-verification?email=${email}`),
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  },
};

// User Service
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateRole: (role, email) => api.put('/users/role', { role, email }),
};

// Property Service
export const propertyService = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  getByParcelId: (parcelId) => api.get(`/properties/parcel/${parcelId}`),
  search: (query) => api.get(`/properties/search?q=${query}`),
  filter: (filters) => api.get('/properties/filter', { params: filters }),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  initialize: () => api.post('/properties/initialize'),
};

// Admin Service
export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Seller Service
export const sellerService = {
  listProperty: (data) => api.post('/seller/list-property', data),
  getMyProperties: () => api.get('/seller/my-properties'),
  updateProperty: (id, data) => api.put(`/seller/update-property/${id}`, data),
  updateStatus: (id, status) => api.patch(`/seller/update-status/${id}?status=${status}`),
  getInquiries: (propertyId) => api.get(`/seller/inquiries/${propertyId}`),
  deleteProperty: (id) => api.delete(`/seller/delete-property/${id}`),
};

export default api;