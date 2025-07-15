import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGoogle, faTwitter,} from "@fortawesome/free-brands-svg-icons";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useRegister} from "../../data/useRegister";
import {ErrorBanner} from "@components/ErrorBanner.jsx";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#4cbad1",
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
        marginBottom: "15px",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#008cba",
    },
    inputGroup: {
        textAlign: "left",
        marginBottom: "10px",
    },
    label: {
        display: "block",
        fontSize: "14px",
        color: "#555",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "14px",
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
    submitButton: {
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
    submitButtonHover: {
        backgroundColor: "#5e92a8",
    },
    alternativeText: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "10px",
    },
    socialBtn: {
        padding: "15px",
        fontSize: "20px",
        //borderRadius: "10px",
        margin: "0 5px",
        cursor: "pointer",
        border: "none",
    },
    link: {
        textDecoration: "none",
        color: "#008cba",
        fontWeight: "bold",
    },
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const {registerUser} = useRegister();
    const navigate = useNavigate();

    // Update form inputs on change
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Simple email format validation
    const isValidEmail = (email) => {
        // Simple regex for most email formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation rules
    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const number = /[0-9]/;
        const special = /[!@#$%^&(),.?":{}|<>]/;

        if (!minLength.test(password)) {
            return "Password must be at least 8 characters long.";
        }
        if (!upper.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!lower.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!number.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!special.test(password)) {
            return "Password must contain at least one special character.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Email validation
        if (!isValidEmail(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Password validation
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Call register API hook
        const result = await registerUser(formData);
        if (!result.success) {
            setError(result.message);
        } else {
            // Show success toast and redirect to login
            toast.success(result.message || "Registered successfully!", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => navigate("/login"), 1500);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div>
                    <img src={logo} alt="logo" style={styles.logo}/>
                </div>
                <h2 style={styles.heading}>GET STARTED</h2>
                {error && <ErrorBanner message={error} onClose={() => setError(null)}/>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
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
                        <label style={styles.label}>Password</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
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
                    <button type="submit" style={styles.submitButton}>
                        Sign Up
                    </button>
                </form>
                <br/>
                <div style={styles.alternativeText}>
                    ------------ Or sign up with ------------

                    <br/>
                    <div>
                        <button style={styles.socialBtn}
                                onClick={() => window.location.href = 'https://www.google.com'}>
                            <FontAwesomeIcon icon={faGoogle}/>
                        </button>
                        <button style={styles.socialBtn}
                                onClick={() => window.location.href = 'https://www.facebook.com'}>
                            <FontAwesomeIcon icon={faFacebookF}/>
                        </button>
                        <button style={styles.socialBtn}
                                onClick={() => window.location.href = 'https://www.twitter.com'}>
                            <FontAwesomeIcon icon={faTwitter}/>
                        </button>
                    </div>
                </div>
                <p style={styles.signinText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
