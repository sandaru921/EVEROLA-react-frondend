import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import LogOutButton from './LogOutButton';
import useLogout from "../data/useLogout.js";
import { UserProfileContext } from '../context/UserProfileContext'; // Import the context
import { UserProfileProvider } from '../context/UserProfileContext';

const UserSidebar = ({ darkMode = false, setDarkMode = () => {}, isOpen = false, setIsOpen = () => {} }) => {
  const logout = useLogout(); // get logout function
  const { userProfile, loading, error } = useContext(UserProfileContext); // Consume context
  const username = userProfile?.name || 'Guest'; // Use name from userProfile, fallback to 'Guest'
  const role = userProfile?.role || localStorage.getItem('role') || 'User'; // Fallback to localStorage or 'User'
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-gray-100 text-gray-800 p-6 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out shadow-sm`}
    >
      <button onClick={() => setIsOpen(false)} className="md:hidden mb-4">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <Link to="/profile" className="flex items-center mb-8 group">
        <img
          src={userProfile?.profilePicture || 'https://via.placeholder.com/40.png?text=User'}
          alt="User"
          className="w-10 h-10 rounded-full mr-3 border-2 border-gray-300 group-hover:border-gray-400 transition-all duration-200"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-all duration-200">
            {username}
          </h3>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </Link>

      <nav>
        <ul>
          <li className="mb-2">
            <NavLink
              to="/userdashboard"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
                to="/permission-manager"
                className={({ isActive }) =>
                    `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                        isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                    }`
                }
            >
              Permissions
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/activities"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Activities
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Support
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Chat
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/invite"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Invite
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/sample-questions"
              className={({ isActive }) =>
                `block p-3 rounded-lg text-gray-700 transition-all duration-200 ${
                  isActive ? 'bg-gray-200 text-gray-900 font-medium' : 'hover:bg-gray-200 hover:text-gray-900'
                }`
              }
            >
              Sample Questions
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-8">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-center w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
        >
          {darkMode ? (
            <>
              <FiSun className="mr-2" size={18} />
              Light Mode
            </>
          ) : (
            <>
              <FiMoon className="mr-2" size={18} />
              Dark Mode
            </>
          )}
        </button>
      </div>

      {/* Logout Button */}
      <div className="mt-4">
        <LogOutButton onLogout={logout} />
      </div>
    </div>
  );
};

export default UserSidebar;