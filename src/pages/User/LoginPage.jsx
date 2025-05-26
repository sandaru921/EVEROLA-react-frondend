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
    email: "",
    password: "",
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //  Prevent form default behavior
    const result = await loginUser(formData);

    if (result.success) {
      toast.success(result.message || "login successfully!");
      // setToken(result.data.token);
      // setPermissions(result.data.permissions || []);
        localStorage.setItem("token", result.data.token); // ✅ explicitly store token
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
