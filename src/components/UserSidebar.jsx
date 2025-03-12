import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiHome, FiActivity, FiHelpCircle, FiUserPlus, FiLogOut,FiMenu ,FiSearch } from 'react-icons/fi';

const UserSidebar = ({ darkMode, setDarkMode, isOpen, setIsOpen, user }) => {
  const navigate = useNavigate();

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Logout handler
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'} transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 shadow-lg`}>
      <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden">
          <FiX size={24} className={darkMode ? 'text-gray-200' : 'text-gray-800'} />
        </button>
      </div>
      <nav className="mt-6">
        <Link to="/" className={`flex items-center p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
          <FiHome className="mr-3" /> Home
        </Link>
        <Link to="/activities" className={`flex items-center p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
          <FiActivity className="mr-3" /> Activities
        </Link>
        <Link to="/support" className={`flex items-center p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
          <FiHelpCircle className="mr-3" /> Support
        </Link>
        <Link to="/invite" className={`flex items-center p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
          <FiUserPlus className="mr-3" /> Invite Friend
        </Link>
        <button onClick={handleLogout} className={`flex items-center p-3 w-full text-left hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors duration-200`}>
          <FiLogOut className="mr-3" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default UserSidebar;