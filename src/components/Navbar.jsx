import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ isAuthenticated, isAdmin }) => {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [questionsDropdownOpen, setQuestionsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const categoryDropdownRef = useRef(null);
  const questionsDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (questionsDropdownRef.current && !questionsDropdownRef.current.contains(event.target)) {
        setQuestionsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
    setQuestionsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white py-4 px-6 md:px-8 flex justify-between items-center z-50 shadow-lg rounded-b-2xl">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/img/logo3.png" alt="Logo" className="h-10 md:h-12" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-8">
        <ul className="flex space-x-8 list-none">
          <li>
            <a href="/" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
              Home
            </a>
          </li>
          <li>
            <a href="/blogs" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
              Blog
            </a>
          </li>
          {/* Categories Dropdown */}
          <li className="relative" ref={categoryDropdownRef}>
            <a
              href="#categories"
              className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setCategoryDropdownOpen(!categoryDropdownOpen);
              }}
            >
              Categories
            </a>
            {categoryDropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-3 w-56 mt-2 border border-gray-200 transform transition-all duration-300 ease-in-out">
                <li>
                  <a
                    href="#question1"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Software Engineering');
                    }}
                  >
                    Software Engineering
                  </a>
                </li>
                <li>
                  <a
                    href="#question2"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Project Manager');
                    }}
                  >
                    Project Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#question3"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Business Analytics');
                    }}
                  >
                    Business Analytics
                  </a>
                </li>
              </ul>
            )}
          </li>
          {/* Sample Questions Dropdown */}
          <li className="relative" ref={questionsDropdownRef}>
            <a
              href="#questions"
              className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setQuestionsDropdownOpen(!questionsDropdownOpen);
              }}
            >
              Sample Questions
            </a>
            {questionsDropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-3 w-56 mt-2 border border-gray-200 transform transition-all duration-300 ease-in-out">
                <li>
                  <a
                    href="#question1"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Software Engineering');
                    }}
                  >
                    Software Engineering
                  </a>
                </li>
                <li>
                  <a
                    href="#question2"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Project Manager');
                    }}
                  >
                    Project Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#question3"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200 rounded-md mx-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Business Analytics');
                    }}
                  >
                    Business Analytics
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="/contact" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
              Contact
            </a>
          </li>
          <li>
            <a href="/privacy" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
              Policy
            </a>
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-800 hover:text-[#005B7C] focus:outline-none"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 border-t border-gray-200"
        >
          <a href="/" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
            Home
          </a>
          <a href="/blogs" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
            Blog
          </a>
          {/* Mobile Categories Dropdown */}
          <div className="relative">
            <button
              className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300 w-full text-left"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            >
              Categories
            </button>
            {categoryDropdownOpen && (
              <ul className="bg-gray-50 rounded-lg py-2 mt-2 border border-gray-200">
                <li>
                  <a
                    href="#question1"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Software Engineering');
                    }}
                  >
                    Software Engineering
                  </a>
                </li>
                <li>
                  <a
                    href="#question2"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Project Manager');
                    }}
                  >
                    Project Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#question3"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategorySelect('Business Analytics');
                    }}
                  >
                    Business Analytics
                  </a>
                </li>
              </ul>
            )}
          </div>
          {/* Mobile Sample Questions Dropdown */}
          <div className="relative">
            <button
              className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300 w-full text-left"
              onClick={() => setQuestionsDropdownOpen(!questionsDropdownOpen)}
            >
              Sample Questions
            </button>
            {questionsDropdownOpen && (
              <ul className="bg-gray-50 rounded-lg py-2 mt-2 border border-gray-200">
                <li>
                  <a
                    href="#question1"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Software Engineering');
                    }}
                  >
                    Software Engineering
                  </a>
                </li>
                <li>
                  <a
                    href="#question2"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Project Manager');
                    }}
                  >
                    Project Manager
                  </a>
                </li>
                <li>
                  <a
                    href="#question3"
                    className="block px-4 py-2 text-gray-700 hover:bg-[#E6EFF2] hover:text-[#005B7C] transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect('Business Analytics');
                    }}
                  >
                    Business Analytics
                  </a>
                </li>
              </ul>
            )}
          </div>
          <a href="/contact" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
            Contact
          </a>
          <a href="/privacy" className="text-gray-800 text-lg font-medium hover:text-[#005B7C] transition-colors duration-300">
            Policy
          </a>
        </nav>
      )}

      {/* Authentication Buttons */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <FaUserCircle
            className="text-gray-700 cursor-pointer hover:text-[#005B7C] transition-colors duration-300"
            size={30}
            onClick={() => navigate("/profile")}
          />
        ) : (
          <div className="flex space-x-3">
            <a href="/login">
              <button className="bg-[#005B7C] text-white px-4 py-2 rounded-full hover:bg-[#004d66] transition-colors duration-300 text-sm md:text-base">
                Login
              </button>
            </a>
            <a href="/register">
              <button className="bg-[#008CBA] text-white px-4 py-2 rounded-full hover:bg-[#007399] transition-colors duration-300 text-sm md:text-base">
                Register
              </button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;