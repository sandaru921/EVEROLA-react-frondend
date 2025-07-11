import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axiosInstance from "../api/axiosInstance.js";

const useLogout = () => {
    const navigate = useNavigate();

    return () => {
        localStorage.removeItem("permissions");
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
        navigate("/login");
        toast.info("Logged out");
    };
};

export default useLogout;


