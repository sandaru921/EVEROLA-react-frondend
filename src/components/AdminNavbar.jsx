"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"

const AdminNavbar = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear localStorage, reset auth state, etc.
    navigate("/login")
  }

  return (
    <header className="bg-[#004d66] text-white py-4 px-6 shadow-md ">
      <div className="container mx-auto flex justify-between items-center pl-48">
        <div className="flex items-center">
          <img src="/img/logo3.png" alt="Logo" className="h-10 mr-3" />
          <span className="text-xl font-bold ">Admin Dashboard</span>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/admin/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/admin/blogs" className="hover:text-gray-300">
            Blogs
          </Link>
          <Link to="/admin/users" className="hover:text-gray-300">
            Users
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-gray-300">
              <FaUserCircle size={20} />
              <span>Admin</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-[#004d66] border-t border-[#003d56] py-2">
          <Link
            to="/admin/dashboard"
            className="block py-2 px-4 hover:bg-[#003d56]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/blogs"
            className="block py-2 px-4 hover:bg-[#003d56]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Blogs
          </Link>
          <Link
            to="/admin/users"
            className="block py-2 px-4 hover:bg-[#003d56]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Users
          </Link>
          <Link
            to="/admin/profile"
            className="block py-2 px-4 hover:bg-[#003d56]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/admin/settings"
            className="block py-2 px-4 hover:bg-[#003d56]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Settings
          </Link>
          <button onClick={handleLogout} className="block w-full text-left py-2 px-4 hover:bg-[#003d56]">
            Logout
          </button>
        </div>
      )}
    </header>
  )
}

export default AdminNavbar




