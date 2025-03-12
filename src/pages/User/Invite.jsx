import { useState } from 'react'; // Add this import
import UserSidebar from "../../components/UserSidebar.jsx";

import { FiMenu, FiSearch } from 'react-icons/fi'; // Add this import

const Invite = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const user = { username: 'Sandaru71', email: 'rohanasandaru@gmail.com', role: 'Recruiter' };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <UserSidebar darkMode={darkMode} setDarkMode={setDarkMode} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />
      <div className="md:ml-64">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Invite Friend</h2>
        </header>
        <main className="p-6">
          <p className="text-gray-700 dark:text-gray-300">Share this link to invite: example.com/invite</p>
        </main>
      </div>
    </div>
  );
};

export default Invite;