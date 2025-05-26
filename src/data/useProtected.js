import axiosInstance from "../api/axiosInstance.js";
import { backendBaseURL } from "./environment";

export const useProtected = () => {
    const getProtectedData = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await axiosInstance.get(`${backendBaseURL}user/protected`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { success: true, data: response.data };
        } catch (error) {
            if (error.response && error.response.status === 401) {
                return { success: false, message: "Unauthorized" };
            }
            return { success: false, message: "Something went wrong." };
        }
    };

    return { getProtectedData };
};
