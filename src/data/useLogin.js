import { backendBaseURL } from "./environment";
import axiosInstance from "../api/axiosInstance.js";

export const useLogin = () => {
    const loginUser = async (formData) => {
        try {
            const response = await axiosInstance.post(`${backendBaseURL}user/login`, formData);
            return { success: true, data: response.data };
        } catch (error) {
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
