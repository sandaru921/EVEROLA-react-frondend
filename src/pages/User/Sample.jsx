import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { backendBaseURL } from "../../data/environment";
import { toast } from "react-toastify";
import {useLocalStorage} from "react-use";
import LogOutButton from "../../components/LogOutButton.jsx";
import "../../pages/User/HomePage.css";
import useLogout from "../../data/useLogout.js";

const SamplePage = () => {
    const logout = useLogout();
    const navigate = useNavigate();
    const [token, setToken] = useLocalStorage("token", "");
    const [setPermissions] = useLocalStorage("permissions", []);
    const [apiMessage, setApiMessage] = useState(""); // State to hold API response message

    // ✅ Set Authorization header once token is available
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }else {
            delete axiosInstance.defaults.headers.common["Authorization"];
        }
    }, [token]);

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
        <div className="sample-page">
            <h1>Sample Page</h1>
            <button
                className="signup-btn"
                onClick={handleProtectedCall}
            >
                Call Protected API
            </button>

            {apiMessage && (
                <div className="api-message">
                    <p>{apiMessage}</p>
                </div>
            )}

            <LogOutButton onLogout={logout} />
        </div>
    );
};

export default SamplePage;
