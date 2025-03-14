import { useState } from 'react';
import { FiMenu, FiLogOut, FiHome, FiActivity, FiHeadphones, FiUserPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UserSidebar = ({ darkMode, setDarkMode, isOpen, setIsOpen, user }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    // Simulate logout action (e.g., clear auth token and redirect to login)
    localStorage.removeItem('authToken'); // Example: Clear token
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#2f332f] text-white p-4 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      } md:w-64 z-50 border-r border-gray-200`}
    >
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden mb-4">
        <FiMenu size={24} />
      </button>
      <div className="mb-6">
        <img
          src="https://via.placeholder.com/40.png?text=S"
          alt={user.username}
          className="w-10 h-10 rounded-full mb-2"
        />
        <h3 className="text-lg font-semibold">{user.username}</h3>
        <p className="text-sm">{user.email}</p>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link
              to="/"
              className="flex items-center px-2 py-1 border-2 border-transparent hover:border-white hover:shadow-md hover:scale-105 transition-all duration-200 rounded"
            >
              <FiHome size={20} className="mr-2" /> Home
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/activities"
              className="flex items-center px-2 py-1 border-2 border-transparent hover:border-white hover:shadow-md hover:scale-105 transition-all duration-200 rounded"
            >
              <FiActivity size={20} className="mr-2" /> Activities
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/support"
              className="flex items-center px-2 py-1 border-2 border-transparent hover:border-white hover:shadow-md hover:scale-105 transition-all duration-200 rounded"
            >
              <FiHeadphones size={20} className="mr-2" /> Support
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/invite"
              className="flex items-center px-2 py-1 border-2 border-transparent hover:border-white hover:shadow-md hover:scale-105 transition-all duration-200 rounded"
            >
              <FiUserPlus size={20} className="mr-2" /> Invite friend
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center px-2 py-1 w-full text-left border-2 border-transparent hover:border-white hover:shadow-md hover:scale-105 transition-all duration-200 rounded"
            >
              <FiLogOut size={20} className="mr-2" /> Log out
            </button>
          </li>
        </ul>
      </nav>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-[#00C4CC] text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors"
              >
                Sure
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebar;