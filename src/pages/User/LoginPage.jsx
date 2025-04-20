import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
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
        <form onSubmit={handleSubmit}>
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
            <a href="/forgot-password">Forgot password</a>
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
          Don't have an account?
          <Link to="/register">
            <a href="/signup"> Sign Up</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
