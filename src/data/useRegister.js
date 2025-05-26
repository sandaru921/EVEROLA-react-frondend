import axiosInstance from "../api/axiosInstance.js";
import { backendBaseURL } from "./environment";

export const useRegister = () => {
    const registerUser = async (formData) => {
        try {
            const response = await axiosInstance.post(`${backendBaseURL}user/register`, formData);

            if (response.status === 200 || response.status === 201) {
                return { success: true, message: "User Registered Successfully" };
            }
            return { success: false, message: "Unexpected response from server." };

        } catch (error) {
            if (error.response) {
                return {
                    success: false,
                    message: error.response.data?.message || "Registration failed. Try again.",
                };
            } else if (error.request) {
                return {
                    success: false,
                    message: "No response from server. Check your internet connection.",
                };
            } else {
                return {
                    success: false,
                    message: "Request setup failed. Try again later.",
                };
            }
        }
    };

    return { registerUser };
};
