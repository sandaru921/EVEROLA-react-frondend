import React, {useState} from "react";
import {Link} from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGoogle, faTwitter,} from "@fortawesome/free-brands-svg-icons";

const RegisterPage = () => {
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
    alert("User Registered Successfully");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h2 className="heading">GET STARTED</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
        <br />
        <div className="alternative-signup">
          ------------ Or sign up with ------------
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
        <p className="signin-text">
          Already have an account?
          <Link to="/login">
            <a href="/login"> Sign In</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
