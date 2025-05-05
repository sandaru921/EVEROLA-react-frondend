import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiInfo ,FiMenu ,FiSearch } from 'react-icons/fi';
import UserSidebar from "../../components/UserSidebar.jsx";



const ProgressChart = ({ completed, total }) => {
  const percentage = (completed / total) * 100;
  return (
    <div className="w-32 h-32 relative">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="15.91549430918954"
          fill="none"
          stroke={percentage > 50 ? '#4caf50' : '#2196f3'}
          strokeWidth="3"
          strokeDasharray={`${percentage * 0.629, 100 - percentage * 0.629}`}
          strokeDashoffset="25"
          transform="rotate(-90 18 18)"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          className="text-gray-800 dark:text-gray-200 font-bold"
        >
          {completed}
        </text>
      </svg>
    </div>
  );
};

const UserActivities = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const filteredActivities = activities.filter(activity => 
    filterStatus === 'all' || 
    (filterStatus === 'ongoing' && activity.completed < activity.total) || 
    (filterStatus === 'completed' && activity.completed === activity.total)
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>

      
      <UserSidebar darkMode={darkMode} setDarkMode={setDarkMode} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />
      <div className="md:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <FiMenu size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
          <div className="flex items-center space-x-4 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Hello {user.username}</h2>
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search activities"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </header>
        <main className="p-6">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mb-6">Ongoing Process</h2>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : filteredActivities.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No activities found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">{activity.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.completed}/{activity.total} Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{activity.remainingTime}</p>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-200 mt-8 mb-6">Process Tracker</h2>
          {!loading && filteredActivities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <ProgressChart completed={activity.completed} total={activity.total} />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400">■</span> {activity.passed} Passed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400">■</span> {activity.fastestTime} Fastest Time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400">■</span> {activity.correctAnswers} Correct Answers
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-green-600 dark:text-green-400">■</span> {activity.totalAnswers} Total Answers
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.totalAttempts} Total Quiz Attempts
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.totalTime} Total Time
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={handleRefresh} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100">
              <FiRefreshCw className="mr-2" /> Refresh
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserActivities;