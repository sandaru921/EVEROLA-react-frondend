import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMoon, FiSun, FiMenu } from 'react-icons/fi';
import axios from 'axios';

import UserSidebar from '../../components/UserSidebar.jsx';
import UserSearchBar from '../../components/UserSearchBar.jsx';

const UserDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState({
    email: localStorage.getItem('email') || '',
    role: localStorage.getItem('role') || 'User',
    name: '', // will be fetched from UserProfile table
  });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Fetch user from UserProfile table
      axios
        .get('https://localhost:5031/api/UserProfile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser((prev) => ({ ...prev, ...res.data }));
        })
        .catch((err) => console.error('Error fetching user profile:', err));

      axios
        .get('https://localhost:5031/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setJobs(res.data))
        .catch((err) => console.error('Error fetching jobs:', err));
    }
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />

      <div className="md:ml-64">
        {/* Header */}
        <header className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-md shadow-md p-4 rounded-b-lg flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <FiMenu size={24} className="text-gray-800 dark:text-gray-200" />
          </button>

          <UserSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <button onClick={() => setDarkMode(!darkMode)} className="text-gray-800 dark:text-gray-200 ml-4">
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <h2 className="text-2xl font-medium mb-6">
            Jobs for you, <span className="font-bold">{user.name || '...'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
  key={job.id}
  className="bg-[#008eab]/80 text-white dark:bg-[#008eab]/90 backdrop-blur-md p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all"
>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.applied
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {job.applied ? 'Applied' : 'Not Applied'}
                    </span>
                  </div>

                  <p className="text-sm opacity-90 mb-2">{job.type}</p>

                  <img
                    src={job.imageUrl || 'https://via.placeholder.com/150'}
                    alt={job.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />

                  <p className="text-sm opacity-90 mb-3 line-clamp-2">{job.description}</p>

                  <div className="flex space-x-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-sm underline hover:text-[#01bcc6]"
                    >
                      Read More...
                    </Link>
                    <button className="bg-[#008eab] hover:bg-[#01bcc6] text-white px-3 py-1 rounded-full text-sm">
                      Quick Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No jobs available for your role or search criteria.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
