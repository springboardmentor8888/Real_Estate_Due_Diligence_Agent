import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer token if available in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global 401 errors & redirect to login (safeguarded for demo/mock sessions)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem("token") || "";
      const isMockSession = token.startsWith("mock-") || token.includes("signature") || token.includes("bharath");
      
      if (!isMockSession) {
        console.warn("Unauthorized access - clearing session credentials");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("demoUser");
        localStorage.removeItem("mockUser");
        if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
          window.location.href = "/login";
        }
      } else {
        console.warn("Demo/Mock session API fallback:", error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

