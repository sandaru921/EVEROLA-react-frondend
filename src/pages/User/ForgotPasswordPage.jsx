import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axiosInstance from "../../api/axiosInstance.js";
import {backendBaseURL} from "../../data/environment.js";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ErrorBanner} from "@components/ErrorBanner.jsx";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9eb4bf",
        minHeight: "100vh",
    },
    box: {
        minHeight: "75vh",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        width: "450px",
    },
    logo: {
        width: "50px",
        marginBottom: "20px",
    },
    backToLogin: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "10px",
        textAlign: "left",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#008cba",
        marginBottom: "20px",
        textAlign: "left",
    },
    inputGroup: {
        textAlign: "left",
        marginBottom: "10px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        color: "#555",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "14px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#005b7c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        marginTop: "10px",
        marginBottom: "10px",
    },
    passwordWrapper: {
        position: "relative",
    },
    togglePassword: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#666",
    },
};

const ForgotPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
    const [error, setError] = useState(null); // Holds error messages for form validation
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password strength regex: min 8 chars, uppercase, lowercase, number, special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

        if (!passwordRegex.test(formData.newPassword)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setError(null); // clear previous errors
            await axiosInstance.post(`${backendBaseURL}user/verify-reset-otp`, {
                email: formData.email,
                otp,
                newPassword: formData.newPassword
            });
            toast.success("Password updated successfully!");
            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            console.error("Password update failed", err);
            toast.error("Failed to update password.");
        }
    };

    const sendOtp = async () => {
        try {
            await axiosInstance.post(`${backendBaseURL}user/send-reset-otp`, {email: formData.email});
            toast.success("OTP sent to your email");
            setOtpSent(true);
        } catch {
            toast.error("Failed to send OTP");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div>
                    <Link to={"/"}>
                        <img src={logo} alt="logo" style={styles.logo}/>
                    </Link>
                </div>
                <div style={styles.backToLogin}>
                    <Link to="/login" className="text-black hover:text-blue-800">
                        &lt; Back to login
                    </Link>
                </div>
                <h2 style={styles.heading}>Forgot Your Password?</h2>

                {/* Show error banner here */}
                {error && <ErrorBanner message={error} onClose={() => setError(null)}/>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="button"
                            onClick={sendOtp}
                            className="w-full px-4 py-2 bg-[#005b7c] text-white rounded-md text-base mt-2 mb-2 hover:bg-[#007ca1] transition-colors duration-300">
                        Send OTP
                    </button>

                    {otpSent && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Enter OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                            <button
                                type="button"
                                style={styles.togglePassword}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                            </button>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <div style={styles.passwordWrapper}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                                <button
                                    type="button"
                                    style={styles.togglePassword}
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}/>
                                </button>
                            </div>
                        </div>
                        <button type="submit"
                                className="w-full px-4 py-2 bg-[#005b7c] text-white rounded-md text-base mt-2 mb-2 hover:bg-[#007ca1] transition-colors duration-300">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;