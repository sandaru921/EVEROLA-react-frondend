import { useEffect, useState } from 'react';
import { FiMenu, FiRefreshCw, FiSearch } from 'react-icons/fi';
import UserSidebar from '../../components/UserSidebar.jsx';

const ProgressChart = ({ completed, total }) => {
  const percentage = (completed / total) * 100;
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke={percentage > 50 ? '#4caf50' : '#2196f3'}
          strokeWidth="3"
          strokeDasharray={`${percentage * 0.629}, 100 - ${percentage * 0.629}`}
          strokeDashoffset="25"
          transform="rotate(-90 18 18)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          {Math.round(percentage)}%
        </text>
      </svg>
    </div>
  );
};

const UserActivities = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = { username: 'Sandaru71', email: 'rohanasandaru@gmail.com', role: 'Recruiter' };

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const mockData = [
          {
            id: 1,
            title: 'Software Engineer Quiz',
            completed: 30,
            total: 50,
            remainingTime: '23:15 hours',
            passed: 27,
            fastestTime: '30min',
            totalAttempts: 32,
            totalTime: '231min',
            correctAnswers: 200,
            totalAnswers: 380,
          },
          {
            id: 2,
            title: 'UI/UX Designer Quiz',
            completed: 62,
            total: 80,
            remainingTime: '21:15 hours',
            passed: 50,
            fastestTime: '25min',
            totalAttempts: 45,
            totalTime: '300min',
            correctAnswers: 300,
            totalAnswers: 400,
          },
        ];
        setActivities(mockData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleRefresh = () => {
    setActivities([]);
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          title: 'Software Engineer Quiz',
          completed: 35,
          total: 50,
          remainingTime: '20:10 hours',
          passed: 28,
          fastestTime: '29min',
          totalAttempts: 33,
          totalTime: '240min',
          correctAnswers: 210,
          totalAnswers: 390,
        },
        {
          id: 2,
          title: 'UI/UX Designer Quiz',
          completed: 65,
          total: 80,
          remainingTime: '18:30 hours',
          passed: 52,
          fastestTime: '24min',
          totalAttempts: 46,
          totalTime: '310min',
          correctAnswers: 310,
          totalAnswers: 410,
        },
      ];
      setActivities(mockData);
    }, 1000);
  };

  const filteredActivities = activities.filter(
    (activity) =>
      (filterStatus === 'all' ||
        (filterStatus === 'ongoing' && activity.completed < activity.total) ||
        (filterStatus === 'completed' && activity.completed === activity.total)) &&
      activity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64 p-6">
        <header className="flex items-center justify-between bg-transparent mb-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600 dark:text-gray-300">
            <FiMenu size={24} />
          </button>
          <div className="flex items-center w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mr-4">
              Hello, {user.username}
            </h2>
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </header>
        <main>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Your Activities</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">Loading activities...</p>
          ) : filteredActivities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">No activities found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.completed}/{activity.total}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <ProgressChart completed={activity.completed} total={activity.total} />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 dark:text-blue-400">●</span> {activity.passed} Passed
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-blue-500 dark:text-blue-400">●</span> {activity.fastestTime} Fastest
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-500 dark:text-green-400">●</span> {activity.correctAnswers}/{activity.totalAnswers} Correct
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-gray-500 dark:text-gray-400">●</span> {activity.totalAttempts} Attempts
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-gray-500 dark:text-gray-400">●</span> {activity.totalTime} Total
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Time Remaining: {activity.remainingTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserActivities;