import {useState} from 'react';
import {FiMail, FiMenu, FiSearch, FiX} from 'react-icons/fi';
import UserSidebar from '../../components/UserSidebar'; // Adjusted path as previously fixed

const Invite = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(''); // State for email input
  const user = { username: 'Sandaru71', email: 'rohanasandaru@gmail.com', role: 'Recruiter' };

  const handleInviteNow = () => {
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    const referralLink = 'https://everola.com/referral/Sandaru71';
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Referral link copied to clipboard!');
    });
  };

  const handleSendEmail = () => {
    // For now, we'll use a mailto link as a placeholder
    const subject = encodeURIComponent('Invite to Join EVEROLA');
    const body = encodeURIComponent(
      'I wanted to share an amazing platform where you can easily find the right job. It’s simple, quick, and super effective!\nVisit: www.link.com'
    );
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setIsModalOpen(false);
    setRecipientEmail('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#F7F9FC]'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      <div className="md:ml-64">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
          </div>
        </header>
        <main className="p-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-[#333333] mb-6">Connect Your Friends to Their Dream Jobs!</h2>
          <div className="mb-8">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              alt="Friends connecting"
              className="w-96 h-60 object-cover rounded-lg"
            />
          </div>
          <div className="space-x-4">
            <button
              onClick={handleInviteNow}
              className="bg-[#00C4CC] text-white px-6 py-3 rounded-full hover:bg-teal-600 transition-colors"
            >
              Invite Now
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-[#B2E0E2] text-white px-6 py-3 rounded-full hover:bg-teal-300 transition-colors"
            >
              Copy link
            </button>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#333333]">Invite Friends</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter friend's email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4CC]"
              />
            </div>
            <div className="mb-4">
              <textarea
                value="I wanted to share an amazing platform where you can easily find the right job. It’s simple, quick, and super effective!\nVisit: www.link.com"
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-[#FFF5F5] text-gray-700 focus:outline-none"
                rows="4"
              />
            </div>
            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center w-full bg-[#00C4CC] text-white py-2 rounded-full hover:bg-teal-600 transition-colors"
            >
              <FiMail size={20} className="mr-2" />
              Mail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invite;