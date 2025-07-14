import { useEffect, useState } from 'react';
import { FiMenu, FiCheckCircle, FiBell } from 'react-icons/fi';
import { BsAward } from 'react-icons/bs';
import UserSidebar from '../../components/UserSidebar.jsx';

const mockActivities = [
  { id: 1, type: 'quiz', message: 'Completed "Frontend Developer Quiz"', date: '2025-07-10' },
  { id: 2, type: 'badge', message: 'Earned "Quiz Master" Badge', date: '2025-07-08' },
  { id: 3, type: 'job', message: 'Applied for "UI Designer Role"', date: '2025-07-05' },
  { id: 4, type: 'quiz', message: 'Completed "Java Basics Quiz"', date: '2025-07-02' },
];

const mockNotifications = [
  { id: 1, message: 'New quiz available: ReactJS Intermediate', date: 'Today' },
  { id: 2, message: 'You earned a badge: Fast Learner', date: 'Yesterday' },
];

const UserActivities = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = { username: 'Sandaru Rohana', email: 'rohanasandaru@gmail.com', role: 'User' };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#00383d]' : 'bg-[#e0f4f5]'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="md:ml-64 p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-700 dark:text-white">
            <FiMenu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#005B66] dark:text-white">
            👋 Welcome back, {user.username.split(' ')[0]}!
          </h2>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-[#1a2c2d] rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-[#005B66] dark:text-white mb-3 flex items-center gap-2">
            <FiBell /> Notifications
          </h3>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
            {mockNotifications.map((n) => (
              <li key={n.id}>
                <strong>{n.date}:</strong> {n.message}
              </li>
            ))}
          </ul>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-[#1a2c2d] rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-[#005B66] dark:text-white mb-3">
            🕓 Recent Activities
          </h3>
          <div className="space-y-4 border-l-4 border-[#005B66] dark:border-[#99f6e4] pl-4">
            {mockActivities.map((act) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-2.5 top-1.5 w-3 h-3 bg-[#005B66] dark:bg-[#99f6e4] rounded-full"></div>
                <p className="text-gray-700 dark:text-gray-200">{act.message}</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">{act.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-[#1a2c2d] rounded-lg p-4 shadow">
          <h3 className="text-lg font-semibold text-[#005B66] dark:text-white mb-3 flex items-center gap-2">
            <BsAward /> Earned Badges
          </h3>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white px-4 py-2 rounded-full text-sm font-semibold">
              🧠 Quiz Master
            </div>
            <div className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white px-4 py-2 rounded-full text-sm font-semibold">
              ⚡ Fast Learner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivities;
