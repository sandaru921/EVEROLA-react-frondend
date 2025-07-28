import { useState } from 'react';
import { FiMail, FiMenu, FiX } from 'react-icons/fi';
import UserSidebar from '../../components/UserSidebar';
import UserSearchBar from '../../components/UserSearchBar';

const Invite = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const user = {
    username: 'Sandaru71',
    email: 'rohanasandaru@gmail.com',
    role: 'Recruiter',
  };

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
            <FiMenu size={24} className="text-black dark:text-white" />
          </button>
          
        </header>

        <main className="p-6 flex flex-col items-center text-center space-y-10">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-black dark:text-black">
              Connect Your Friends to Their Dream Jobs
            </h2>
            <p className="text-black dark:text-black max-w-xl mx-auto">
              Share your referral link or invite via email. Help your friends discover the right opportunity.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <button
              onClick={handleInviteNow}
              className="bg-[#00A8B0] text-white px-8 py-3 rounded-full hover:bg-[#008f95] transition-colors"
            >
              Invite by Email
            </button>
            <button
              onClick={handleCopyLink}
              className="bg-[#00C4CC] text-white px-8 py-3 rounded-full hover:bg-[#009fa5] transition-colors"
            >
              Copy Referral Link
            </button>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">Invite Friends</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <FiX size={20} className="text-black dark:text-white" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-1">To</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Enter friend's email"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C4CC] dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <textarea
                value="I wanted to share an amazing platform where you can easily find the right job. It’s simple, quick, and super effective!\nVisit: www.link.com"
                readOnly
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#FFF5F5] dark:bg-gray-700 text-black dark:text-white focus:outline-none"
                rows="4"
              />
            </div>

            <button
              onClick={handleSendEmail}
              className="flex items-center justify-center w-full bg-[#00A8B0] text-white py-2 rounded-full hover:bg-[#008f95] transition-colors"
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