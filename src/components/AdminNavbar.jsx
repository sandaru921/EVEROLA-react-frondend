import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaBell, FaTrash, FaEye } from "react-icons/fa";
import axios from "axios";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);
  const notificationRef = useRef(null);

  const API_URL = "https://localhost:5031/api/Jobs";

  // Fetch jobs and load dismissed notifications
  useEffect(() => {
    // Load dismissed IDs from localStorage
    const storedDismissedIds = JSON.parse(localStorage.getItem("dismissedNotifications") || "[]");
    setDismissedIds(storedDismissedIds);

    const fetchJobs = async () => {
      try {
        const response = await axios.get(API_URL, { timeout: 5000 });
        if (Array.isArray(response.data)) {
          const currentDate = new Date("2025-07-26"); // Hardcoded for consistency
          const sevenDaysFromNow = new Date(currentDate);
          sevenDaysFromNow.setDate(currentDate.getDate() + 7);

          const expiringJobs = response.data
            .filter((job) => {
              const expiringDate = new Date(job.ExpiringDate);
              return (
                expiringDate <= sevenDaysFromNow &&
                expiringDate >= currentDate &&
                !storedDismissedIds.includes(job.Id)
              );
            })
            .map((job) => {
              const expiringDate = new Date(job.ExpiringDate);
              const timeDiff = expiringDate - currentDate;
              const daysToExpire = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
              return {
                id: job.Id,
                title: job.Title,
                daysToExpire,
              };
            });
          setNotifications(expiringJobs);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchJobs();
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dismiss a single notification
  const handleDismissNotification = (id) => {
    const updatedDismissedIds = [...dismissedIds, id];
    setDismissedIds(updatedDismissedIds);
    localStorage.setItem("dismissedNotifications", JSON.stringify(updatedDismissedIds));
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Dismiss all notifications
  const handleDismissAllNotifications = () => {
    const allIds = notifications.map((notification) => notification.id);
    const updatedDismissedIds = [...dismissedIds, ...allIds];
    setDismissedIds(updatedDismissedIds);
    localStorage.setItem("dismissedNotifications", JSON.stringify(updatedDismissedIds));
    setNotifications([]);
  };

  // View job details
  const handleViewJob = (id) => {
    navigate(`/admin/edit-job/${id}`);
    setNotificationOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-[#004d66] text-white py-4 px-6 shadow-md w-full fixed top-0 z-2">
      <div className="container mx-auto flex justify-between items-center pl-64">
        <div className="flex items-center">
          <img src="/img/logo3.png" alt="Logo" className="h-10 mr-3" />
          <span className="text-xl font-bold">Admin Dashboard</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
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
          {/* Notification Icon */}
          <div className="relative group" ref={notificationRef}>
            <button
              className="flex items-center space-x-1 hover:text-gray-300"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <FaBell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <span className="font-semibold text-gray-700">Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={handleDismissAllNotifications}
                    >
                      Delete All
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="px-4 py-2 text-sm text-gray-700">No jobs expiring soon.</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">Job ID: {notification.id}</p>
                        <p>{notification.title}</p>
                        <p className="text-red-600">
                          Has {notification.daysToExpire} day{notification.daysToExpire !== 1 ? "s" : ""} to expire
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleViewJob(notification.id)}
                          title="View Job"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDismissNotification(notification.id)}
                          title="Delete Notification"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* User Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-gray-300">
              <FaUserCircle size={20} />
              <span>Admin</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
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
          <button
            className="block py-2 px-4 hover:bg-[#003d56] w-full text-left"
            onClick={() => {
              setMobileMenuOpen(false);
              setNotificationOpen(!notificationOpen);
            }}
          >
            Notifications ({notifications.length})
          </button>
          {notificationOpen && (
            <div className="pl-4">
              <div className="flex justify-between items-center px-4 py-2">
                <span className="font-semibold text-white">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    className="text-red-300 text-sm hover:underline"
                    onClick={handleDismissAllNotifications}
                  >
                    Delete All
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-2 text-sm text-white">No jobs expiring soon.</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-2 text-sm text-white flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">Job ID: {notification.id}</p>
                      <p>{notification.title}</p>
                      <p className="text-red-300">
                        Has {notification.daysToExpire} day{notification.daysToExpire !== 1 ? "s" : ""} to expire
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-300 hover:text-blue-500"
                        onClick={() => handleViewJob(notification.id)}
                        title="View Job"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        className="text-red-300 hover:text-red-500"
                        onClick={() => handleDismissNotification(notification.id)}
                        title="Delete Notification"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 px-4 hover:bg-[#003d56]"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;