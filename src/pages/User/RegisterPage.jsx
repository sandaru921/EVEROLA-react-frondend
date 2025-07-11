import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGoogle, faTwitter,} from "@fortawesome/free-brands-svg-icons";
import {useRegister} from "../../data/useRegister";
import {ErrorBanner} from "@components/ErrorBanner.jsx";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

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
        <div className="register-container">
            <div className="register-box">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <h2 className="heading">GET STARTED</h2>
                {error && <ErrorBanner message={error} onClose={() => setError(null)}/>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-signup">
                        Sign Up
                    </button>
                </form>
                <br/>
                <div className="alternative-signup">
                    ------------ Or sign up with ------------
                </div>
                <br/>
                <div className="social-btns">
                    <button className="social-btn" onClick={() => window.location.href = 'https://www.google.com'}>
                        <FontAwesomeIcon icon={faGoogle}/>
                    </button>
                    <button className="social-btn" onClick={() => window.location.href = 'https://www.facebook.com'}>
                        <FontAwesomeIcon icon={faFacebookF}/>
                    </button>
                    <button className="social-btn" onClick={() => window.location.href = 'https://www.twitter.com'}>
                        <FontAwesomeIcon icon={faTwitter}/>
                    </button>
                </div>
                <p className="signin-text">
                    Already have an account?{' '}
                    <Link to="/login">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
