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

const ForgotPasswordPage = () => {
 const [error, setError] = useState(null); // Holds error messages for form validation

    const [formData, setFormData] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });

  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <div className="register-container">
          <div className="register-box">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="back-to-login">
            <Link to="/login">
              &lt; Back to login
            </Link>
            </div>
            <h2 className="forgot-password-heading">Forgot Your Password?</h2>

            {/* Show error banner here */}
            {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

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
                  name="newPassword"
                  value={formData.newPassword}
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