import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import office from "../../assets/office.jpg";
import React, { useState, useRef, useEffect } from "react";

const HomePage = () => {
  // State to track dropdown open/close
const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};

// Close dropdown if click outside detected
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
      {/*<img src={bgImage} alt="Background" className="bgImage" />*/}
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

      <div className="flex items-center justify-center px-0 pt-38 pb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-7xl">
          {/* Left Content */}
          <div className="flex-1 text-white">
            <h2 className="text-4xl mb-4 font-bold leading-tight text-[#084b66] whitespace-nowrap">
              Fast. Fair. Future-Ready Recruitment.
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              Streamline your hiring process with our Role-Based Assessment System.
              Easily create secure, role-based assessments, track candidate
              performance in real-time, and simplify recruitment with automated tests,
              instant feedback, and seamless integrations. Smarter hiring starts here.
            </p>
            <div>
              <Link to="/register">
                <button className="bg-[#008eab] hover:bg-[#55cbe2] text-white py-2 px-5 rounded-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
                src={office}
                alt="Assessment Illustration"
                className="w-[98%] h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
