import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, isAdmin }) => {
  const navigate = useNavigate();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [questionsDropdownOpen, setQuestionsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white py-4 px-8 flex justify-between items-center z-10 rounded-b-3xl shadow-md z-100">
      <div className="flex items-center">
        <img src="/img/logo3.png" alt="Logo" className="h-12" /> {/* Use static URL */}
      </div>

      <nav className="flex items-center space-x-9">
        <ul className="flex space-x-9 list-none">
          <li><a href="#about" className="text-black hover:text-gray-700">About</a></li>
          <li><a href="/privacy" className="text-black hover:text-gray-700">Policy</a></li>
          <li><a href="#blog" className="text-black hover:text-gray-700">Blog</a></li>
          
          {/* Categories Dropdown */}
          <li className="relative">
            <a
              href="#categories"
              className="text-black hover:text-gray-700 cursor-pointer"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            >
              Categories
            </a>
            {categoryDropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 flex flex-col w-40">
                <li><a href="#question1" className="px-2 py-1 hover:bg-gray-100">Software Engineering</a></li>
                <li><a href="#question2" className="px-2 py-1 hover:bg-gray-100">Project Manager</a></li>
                <li><a href="#question3" className="px-2 py-1 hover:bg-gray-100">Business Analytics</a></li>
              </ul>
            )}
          </li>

          {/* Sample Questions Dropdown */}
          <li className="relative">
            <a
              href="#questions"
              className="text-black hover:text-gray-700 cursor-pointer"
              onClick={() => setQuestionsDropdownOpen(!questionsDropdownOpen)}
            >
              Sample Questions
            </a>
            {questionsDropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 flex flex-col w-40">
                <li><a href="#question1" className="px-2 py-1 hover:bg-gray-100">Software Engineering</a></li>
                <li><a href="#question2" className="px-2 py-1 hover:bg-gray-100">Project Manager</a></li>
                <li><a href="#question3" className="px-2 py-1 hover:bg-gray-100">Business Analytics</a></li>
              </ul>
            )}
          </li>
          <li><a href="#contact" className="text-black hover:text-gray-700">Contact</a></li>
        </ul>
      </nav>

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <FaUserCircle 
            className="text-gray-700 cursor-pointer" 
            size={30} 
            onClick={() => navigate("/profile")} 
          />
        ) : (
          <div className="flex space-x-2">
            <Link to="/login">
              <button className="bg-[#005B7C] text-white px-3 py-1 rounded-md hover:bg-[#004d66]">Login</button>
            </Link>
            <Link to="/register">
              <button className="bg-[#008CBA] text-white px-3 py-1 rounded-md hover:bg-[#007399]">Register</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

