import { backendBaseURL } from "./environment";
import axiosInstance from "../api/axiosInstance.js";

export const useLogin = () => {
    const loginUser = async ({ identifier, password }) => {
        // Check if input is email or username
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const payload = emailRegex.test(identifier)
            ? { email: identifier, password }
            : { username: identifier, password };

        try {
            // Attempt to log in the user
            const response = await axiosInstance.post(`${backendBaseURL}user/login`, payload);
            return { success: true, data: response.data };

        } catch (error) {
            // Handle errors based on the type of error
            if (error.response) {
                if (error.response.status === 401) {
                    return { success: false, message: "Invalid credentials." };
                }
                return { success: false, message: "Something went wrong. Please try again." };
            } else if (error.request) {
                return { success: false, message: "No response from server. Please check your internet connection." };
            } else {
                return { success: false, message: "Error setting up request. Please try again later." };
            }
        }
    };

    return { loginUser };
};
