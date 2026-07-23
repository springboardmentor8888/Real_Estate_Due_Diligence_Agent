import axios from "axios";

const API_URL = "http://localhost:8081/api/properties";

export const searchProperty = async (address) => {
  return axios.get(`${API_URL}/search`, {
    params: { address },
  });
};

export const getPropertyDetails = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};