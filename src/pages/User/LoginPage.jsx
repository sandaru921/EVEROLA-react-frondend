import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useLogin} from "../../data/useLogin";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ErrorBanner} from "@components/ErrorBanner.jsx";
import {backendBaseURL} from "../../data/environment";
import axiosInstance from "../../api/axiosInstance.js";
import {GoogleLogin} from "@react-oauth/google";

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#4cbad1',
        minHeight: '100vh',
        paddingTop: '5%',
        paddingBottom: '5%',
        alignItems: "center",
    },
    box: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        width: '400px',
    },
    logo: {
        width: '50px',
        marginBottom: '20px',
    },
    heading: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    strong: {
        color: '#008cba',
    },
    inputGroup: {
        textAlign: 'left',
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        color: '#555',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '14px',
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        marginBottom: '20px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    loginButton: {
        borderRadius: '10px',
        padding: '10px 30px',
        backgroundColor: '#005b7c',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    signupButton: {
        borderRadius: '10px',
        padding: '9px 28px',
        backgroundColor: '#008eab',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    alternativeSignin: {
        margin: '20px 0',
        fontSize: '14px',
        color: '#666',
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
    signupText: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#555',
    },
    signupLink: {
        color: '#008cba',
        textDecoration: 'none',
        fontWeight: "bold"
    }
};

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {loginUser} = useLogin();
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        identifier: "", // can be username or email
        password: "",
        rememberMe: false
    });

    const isValidIdentifier = (identifier) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        return emailRegex.test(identifier) || usernameRegex.test(identifier);
    };

    // Update form inputs on change
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // On form submit, validate inputs, call loginUser, handle success/error
    const handleSubmit = async (e) => {
        e.preventDefault(); //  Prevent form default behavior

        // Basic validation
        if (!formData.identifier.trim()) {
            setError("Please enter your username or email.");
            return;
        }

        if (!isValidIdentifier(formData.identifier.trim())) {
            setError("Please enter a valid username or email.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        const result = await loginUser(formData);// send identifier instead of email

        if (result.success) {
            toast.success(result.message || "login successfully!");

            // Store token and permissions in localStorage
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("permissions", JSON.stringify(result.data.permissions));

            setTimeout(() => navigate("/userdashboard"), 1500);
        } else {
            setError(result.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSignUp = () => {
        navigate("/register");
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div>
                    <img src={logo} alt="logo" style={styles.logo}/>
                </div>
                <h2 style={styles.heading}>
                    Hello, <strong style={styles.strong}>Welcome!</strong>
                </h2>
                {error && <ErrorBanner message={error} onClose={() => setError(null)}/>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username or E-mail</label>
                        <input
                            type="text"
                            name="identifier"
                            value={formData.identifier}
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
                            <button type="button" onClick={togglePasswordVisibility} style={styles.togglePassword}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                            </button>
                        </div>
                    </div>
                    <div style={styles.options}>
                        <div>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <label> Remember me</label>
                        </div>
                        <Link to="/login/forgot-password">Forgot password</Link>
                    </div>
                    <div style={styles.buttonGroup}>
                        <button type="submit" style={styles.loginButton}>Login</button>
                        <button type="button" style={styles.signupButton} onClick={handleSignUp}>Signup</button>
                    </div>
                </form>

                <div style={styles.alternativeSignin}>
                    ------------ Or sign in with ------------
                </div>
                <div>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const credential = credentialResponse.credential;

                                const response = await axiosInstance.post(`${backendBaseURL}user/google-login`, {
                                    credential,
                                });

                                toast.success("Logged in with Google!");
                                localStorage.setItem("token", response.data.token);
                                localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
                                navigate("/userdashboard");
                            } catch (error) {
                                console.error("Google login error:", error.response?.data || error.message);
                                toast.error("Google login failed.");
                            }
                        }}
                        onError={() => {
                            toast.error("Google login failed.");
                        }}
                    />
                </div>
                <p style={styles.signupText}>
                    Don’t have an account? <Link to="/register" style={styles.signupLink}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
