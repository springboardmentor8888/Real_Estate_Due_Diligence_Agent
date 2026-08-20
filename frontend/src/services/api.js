import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===== FIXED: Better error handling =====
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log the error details
        console.error('API Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });

        // Handle 401 Unauthorized — but NOT on auth endpoints (register/login)
        // to prevent hijacking the registration flow
        const requestUrl = error.config?.url || '';
        const isAuthEndpoint = requestUrl.includes('/auth/');
        const isOnAuthPage = window.location.pathname === '/register' ||
                             window.location.pathname === '/login';

        if (error.response?.status === 401 && !isAuthEndpoint && !isOnAuthPage) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        // Handle 500 errors specifically
        if (error.response?.status === 500) {
            console.error('⚠️ SERVER ERROR (500):', error.response?.data);
            // Show user-friendly message
            error.message = 'Server error. Please try again later.';
        }

        // Handle network errors (backend not running)
        if (!error.response) {
            console.error('⚠️ NETWORK ERROR: Backend might not be running');
            error.message = 'Cannot connect to server. Please check if backend is running.';
        }

        return Promise.reject(error);
    }
);

// ===== YOUR SERVICES (all unchanged) =====

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return Promise.resolve({ data: { message: 'Logged out successfully' } });
    },
    googleLogin: (email, firstName, lastName) =>
        api.post('/auth/google-login', { email, firstName, lastName }),
    verifyEmail: (token) => api.post('/auth/verify-email', { token }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) =>
        api.post('/auth/reset-password', { token, newPassword }),
    resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

export const userService = {
    getCurrentUser: () => api.get('/users/me'),
    getUserById: (id) => api.get(`/users/${id}`),
    updateProfile: (id, data) => api.put(`/users/${id}`, data),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

export const propertyService = {
    getProperties: (params) => api.get('/properties/all', { params }),
    getAll: (params) => api.get('/properties/all', { params }),
    search: (query) => api.get('/properties/search', { params: { query } }),
    getPropertyById: (id) => api.get(`/properties/${id}`),
    getById: (id) => api.get(`/properties/${id}`),
    createProperty: (data) => api.post('/properties', data),
    updateProperty: (id, data) => api.put(`/properties/${id}`, data),
    deleteProperty: (id) => api.delete(`/properties/${id}`),
};

export const dueDiligenceService = {
    getReports: (params) => api.get('/reports', { params }),
    getReportById: (id) => api.get(`/reports/${id}`),
    getReportsByProperty: (propertyId) => api.get(`/reports/property/${propertyId}`),
    createReport: (data) => api.post('/reports', data),
    updateReport: (id, data) => api.put(`/reports/${id}`, data),
    deleteReport: (id) => api.delete(`/reports/${id}`),
};

export const notificationService = {
    getNotifications: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const documentService = {
    getAll: () => api.get('/documents/all'),
    getByProperty: (propertyId) => api.get(`/documents/property/${propertyId}`),
    upload: (data) => api.post('/documents', data),
};

export const riskAssessmentService = {
    getAll: () => api.get('/risk-assessments'),
    getByProperty: (propertyId) => api.get(`/risk-assessments/property/${propertyId}`),
    getSummary: () => api.get('/risk-assessments/summary'),
};

export const dashboardService = {
    getStats: (role) => api.get('/dashboard/stats', { params: role ? { role } : {} }),
    getSummary: (role) => api.get('/dashboard/summary', { params: role ? { role } : {} }),
    getPropertyStatus: (role) => api.get('/dashboard/property-status', { params: role ? { role } : {} }),
    getRiskSummary: (role) => api.get('/dashboard/risk-summary', { params: role ? { role } : {} }),
    getRecentProperties: (role) => api.get('/dashboard/recent-properties', { params: role ? { role } : {} }),
    getRecentReports: (role) => api.get('/dashboard/recent-reports', { params: role ? { role } : {} }),
};

export default api;