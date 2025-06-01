import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { backendBaseURL } from "../../data/environment";
import { toast } from "react-toastify";
import {useLocalStorage} from "react-use";
import LogOutButton from "../../components/LogOutButton.jsx";
import useLogout from "../../data/useLogout.js";

const SamplePage = () => {
    const logout = useLogout();
    const navigate = useNavigate();
    const [token, setToken] = useLocalStorage("token", "");
    const [permissions, setPermissions] = useLocalStorage("permissions", []);
    const [apiMessage, setApiMessage] = useState(""); // State to hold API response message

    // ✅ Set Authorization header once token is available
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }else {
            delete axiosInstance.defaults.headers.common["Authorization"];
        }
    }, [token]);

    const handleGoToPermissionManager = () => {
        navigate("/permission-manager");
    };

    const handleProtectedCall = async () => {
        try {
            const response = await axiosInstance.get(`${backendBaseURL}user/protected`);
            setApiMessage(response.data.message || "Protected API call successful.");
            toast.success("API call successful!");
            //navigate("/userdashboard");
        } catch (error) {
            // Token is missing/invalid/expired
            if (error.response && error.response.status === 401) {
                // 🧹 Clean up token and permissions
                setToken("");
                setPermissions([]);
                delete axiosInstance.defaults.headers.common["Authorization"];

                setTimeout(() => {
                    navigate("/login");
                }, 1500); // Slight delay to allow state cleanup
            } else {
                toast.error("Something went wrong.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Sample Page</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleProtectedCall}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                    Call Protected API
                </button>
                {permissions.includes("Admin") && (
                <button
                    onClick={handleGoToPermissionManager}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                >
                    Go to User Permissions Manager
                </button>
                    )}
            </div>

            {apiMessage && (
                <div className="bg-white p-4 rounded shadow-md w-full max-w-md text-center">
                    <p className="text-gray-700">{apiMessage}</p>
                </div>
            )}

            <div className="mt-10">
                <LogOutButton onLogout={logout} />
            </div>
        </div>
    );
};

export default SamplePage;
