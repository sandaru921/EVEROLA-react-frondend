import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";


const ForgotPasswordPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        alert("Password Updated Successfully");
      };

    return (
        <div className="register-container">
          <div className="register-box">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="back-to-login">
            <Link to="/login">
                <a href="/login"> &lt; Back to login </a>
            </Link>
            </div>
            <h2 className="forgot-password-heading">Forgot Your Password?</h2>
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
                <label>New Password</label>
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn-signup">
                Update Password
              </button>
            </form>
            <br />
            <div className="alternative-signup">
              ------------ Or login with ------------
            </div>
            <br />
            <div className="social-btns">
              <button className="social-btn" onClick={() => window.location.href = 'https://www.google.com'}>
                <FontAwesomeIcon icon={faGoogle} />
              </button>
              <button className="social-btn" onClick={() => window.location.href = 'https://www.facebook.com'}>
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="social-btn" onClick={() => window.location.href = 'https://www.twitter.com'}>
                <FontAwesomeIcon icon={faTwitter} />
              </button>
            </div>
          </div>
        </div>
      );
}

export default ForgotPasswordPage;