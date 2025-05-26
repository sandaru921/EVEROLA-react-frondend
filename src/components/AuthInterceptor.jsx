import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

const AuthInterceptor = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error?.response?.status;

                if ((status === 401 || status === 403) && location.pathname !== "/login") {
                        localStorage.removeItem("token");

                    // ✅ This displays the toast immediately
                    toast.error("Session expired. Please log in again.", {
                        onClose: () => {
                            // ✅ Navigate only after toast closes
                            navigate("/login");
                        },
                        autoClose: 2000,
                    });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [navigate, location]);

    return null; // This component does not render anything
};

export default AuthInterceptor;
