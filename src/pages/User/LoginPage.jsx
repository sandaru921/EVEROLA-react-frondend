import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGoogle, faTwitter,} from "@fortawesome/free-brands-svg-icons";
import {useLogin} from "../../data/useLogin";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {ErrorBanner} from "@components/ErrorBanner.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useLogin();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

      // ✅ Store token and permissions in localStorage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("permissions", JSON.stringify(result.data.permissions));

      setTimeout(() => navigate("/sample"), 1500);
    } else {
      setError(result.message);
    }
  };
  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="welcome-text">
          Hello, <strong>Welcome!</strong>
        </h2>
        {error && <ErrorBanner message={error} onClose={() => setError(null)}/>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username or E-mail</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
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
          <div className="options">
            <div>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label>Remember me</label>
            </div>
            <Link to="/login/forgot-password">
            Forgot password
            </Link>
          </div>
          <div className="btn">
            <button type="submit" className="btn-login">
              Login
            </button>
            <button className="btn-signup" onClick={handleSignUp}>
              Signup
            </button>
          </div>
        </form>

        <div className="alternative-signin">
          ------------ Or sign in with ------------
        </div>
        <div className="social-btns">
          <button
            className="social-btn"
            onClick={() => (window.location.href = "https://www.google.com")}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </button>
          <button
            className="social-btn"
            onClick={() => (window.location.href = "https://www.facebook.com")}
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button
            className="social-btn"
            onClick={() => (window.location.href = "https://www.twitter.com")}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </button>
        </div>
        <br />
        <p className="signup-text">
          Don't have an account?{' '}
          <Link to="/register">
             Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
