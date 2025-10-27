import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3333",
  headers: { "Content-Type": "application/json" },
});

// Inclui token automaticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
