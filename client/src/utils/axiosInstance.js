import axios from "axios";

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 400) &&
      error.response.data.message === "Invalid Token"
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
