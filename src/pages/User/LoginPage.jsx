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
import axios from "axios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
          "https://localhost:5031/api/user/login", // 👈 use HTTPS and correct port
          formData
      );
      alert("User login Successfully");
      console.log("Login successful", response.data);

      // Optionally store the token and redirect
      // localStorage.setItem("token", response.data.token);
      navigate("/UserDashboard");
    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
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
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username or E-mail</label>
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
          Don't have an account?
          <Link to="/register">
             Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
