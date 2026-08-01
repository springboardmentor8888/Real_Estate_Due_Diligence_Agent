import apiClient from "./apiClient";

// Register API
export const registerUser = async (userData) => {
  return apiClient.post("/api/auth/register", userData);
};

// Login API
export const loginUser = async (loginData) => {
  return apiClient.post("/api/auth/login", loginData);
};