// src/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Adjust this to match your API base URL
});

axiosInstance.interceptors.response.use(
  (response) => response, // Handle successful responses
  (error) => {
    // Handle failed responses
    if (error.response && error.response.status === 401) {
      // Handle token expiration or invalid token scenario
      localStorage.removeItem("access");
      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
