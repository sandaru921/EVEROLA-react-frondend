import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import bgImage from "../../assets/bgImage.jpg";
import React, { useState, useRef, useEffect } from "react";

const HomePage = () => {
const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};

const handleClickOutside = (event) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setDropdownOpen(false);
  }
};

useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="homepage">
      <img src={bgImage} alt="Background" className="bgImage" />
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
          <li>
            <div className="dropdown" ref={dropdownRef}>
              <button className="dropbtn" onClick={toggleDropdown}>
                Sample Question  <i className="fa fa-caret-down"></i>
              </button>
              <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                <Link to="/sample-question-01">Senior Software Engineer</Link>
                <Link to="/sample-question-02">Intern Software Engineer</Link>
                <Link to="/sample-question-03">Backend Developer</Link>
              </div>
            </div>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login">Login</button>
          </Link>
          <Link to="/register">
            <button className="register">Signup</button>
          </Link>
        </div>
      </nav>
      <div className="content">
        <h2>Find the right talent, effortlessly & efficiently.</h2>
        <div className="auth-buttons">
          <Link to="/register">
            <button className="register">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
