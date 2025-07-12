import axios from "axios";
import { backendBaseURL } from "../data/environment";

const axiosInstance = axios.create({
    baseURL: backendBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically add token to headers before requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global error handler
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            // Clear sensitive storage
            localStorage.removeItem("token");
            localStorage.removeItem("permissions");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
