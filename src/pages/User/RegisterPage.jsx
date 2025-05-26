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
    });

    const [error, setError] = useState(null);
    const {registerUser} = useRegister();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registerUser(formData);
        if (!result.success) {
            setError(result.message);
        } else {
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
