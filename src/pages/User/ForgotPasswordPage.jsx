import React, {useState} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGoogle, faTwitter,} from "@fortawesome/free-brands-svg-icons";
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
        backgroundColor: "#4cbad1",
        minHeight: "100vh",
    },
    box: {
        backgroundColor: "white",
        padding: "30px",
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
        marginBottom: "15px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        color: "#555",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "10px",
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
    },
    alternativeText: {
        fontSize: "14px",
        color: "#555",
    },
    socialButton: {
        paddingLeft: "15px",
        paddingRight: "15px",
        fontSize: "20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        margin: "0 5px",
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
            await axiosInstance.post(`${backendBaseURL}user/reset-password`, {
                email: formData.email,
                newPassword: formData.newPassword
            });
            toast.success("Password updated successfully!");
        } catch (err) {
            console.error("Password update failed", err);
            toast.error("Failed to update password.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div>
                    <img src={logo} alt="logo" style={styles.logo}/>
                </div>
                <div style={styles.backToLogin}>
                    <Link to="/login">
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
                        <button type="submit" style={styles.button}>
                            Update Password
                        </button>
                    </div>
                </form>
                <br/>
                <div style={styles.alternativeText}>
                    ------------ Or login with ------------
                </div>
                <br/>
                <div>
                    <button style={styles.socialButton} onClick={() => window.location.href = 'https://www.google.com'}>
                        <FontAwesomeIcon icon={faGoogle}/>
                    </button>
                    <button style={styles.socialButton}
                            onClick={() => window.location.href = 'https://www.facebook.com'}>
                        <FontAwesomeIcon icon={faFacebookF}/>
                    </button>
                    <button style={styles.socialButton}
                            onClick={() => window.location.href = 'https://www.twitter.com'}>
                        <FontAwesomeIcon icon={faTwitter}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;