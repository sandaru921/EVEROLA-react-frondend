import { useState, useEffect } from 'react'; // Added useEffect for API calls
import { Link } from 'react-router-dom';
import { FiSearch, FiMoon, FiSun, FiMenu } from 'react-icons/fi';
import UserSidebar from '../../components/UserSidebar.jsx';
import axios from 'axios'; // Added for API requests

const UserDashboard = () => {
  // State Management
  // - isSidebarOpen: Controls sidebar visibility
  // - darkMode: Toggles dark/light theme
  // - searchQuery: Filters jobs by title
  // - filterRole: Filters jobs by role (dynamic based on user)
  // - user: Stores logged-in user data from localStorage or API
  // - jobs: Stores job listings fetched from the backend
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [user, setUser] = useState(() => ({
    username: localStorage.getItem('username') || 'Guest',
    email: localStorage.getItem('email') || '',
    role: localStorage.getItem('role') || 'User',
  }));
  const [jobs, setJobs] = useState([]);

  // Fetch User and Job Data on Mount
  // - Uses useEffect to fetch user profile and jobs when component mounts
  // - Includes authentication token from localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5031/api/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser((prev) => ({ ...prev, ...response.data }));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5031/api/jobs', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobs(response.data); // Expecting an array of jobs
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      }
    };

    fetchUserData();
    fetchJobs();
  }, []);

  // Filter Jobs Based on User Input and Role
  // - Filters jobs by title (searchQuery) and user role (filterRole)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterRole ? job.title.toLowerCase().includes(filterRole.toLowerCase()) : true)
  );

  // Render the Dashboard
  // - Main container with theme toggle and sidebar integration
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64">
        {/* Header with Search, Filter, and Theme Toggle */}
        // - Header includes menu toggle, search bar, role filter, and dark mode button
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <FiMenu size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
          <div className="flex items-center space-x-4 w-full max-w-md">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="">All Roles</option>
              <option value="software engineer">Software Engineer</option>
              <option value="hr manager">HR Manager</option>
              <option value="business analyst">Business Analyst</option>
              <option value="quality assurance">Quality Assurance</option>
              {user.role && <option value={user.role.toLowerCase()}>{user.role}</option>}
            </select>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="text-gray-800 dark:text-gray-200">
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </header>
        <main className="p-6">
          {/* Main Content with Job Listings */}
          // - Displays a personalized greeting and job grid based on user role
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">
            Jobs for you, {user.username} ({user.role})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">{job.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${job.applied ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {job.applied ? 'Applied' : 'Not Applied'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{job.type}</p>
                  <img src="https://via.placeholder.com/150" alt={job.title} className="w-full h-24 object-cover rounded-md mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{job.description}</p>
                  <div className="flex space-x-2">
                    <Link to={`/jobs/${job.id}`} className="text-gray-700 dark:text-gray-200 text-sm hover:underline">
                      Read More...
                    </Link>
                    <button className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500">
                      Quick Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No jobs available for your role or search criteria.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;