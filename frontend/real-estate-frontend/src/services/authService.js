import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

// Register API
export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Login API
export const loginUser = async (loginData) => {
  return axios.post(`${API_URL}/login`, loginData);
};