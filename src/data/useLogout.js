import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

const useLogout = () => {
    const navigate = useNavigate();

    return () => {
        localStorage.removeItem("permissions");
        localStorage.removeItem("token");
        toast.info("Logged out");
        navigate("/login");
    };
};

export default useLogout;
