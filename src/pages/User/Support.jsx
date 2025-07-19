import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import UserSidebar from '../../components/UserSidebar.jsx';
import UserSearchBar from '../../components/UserSearchBar.jsx';

const Support = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const user = {
    username: 'Sandaru71',
    email: 'rohanasandaru@gmail.com',
    role: 'Recruiter',
  };

  // 🧠 Updated FAQ content for online assessment platform
  const faqs = [
    {
      question: 'How do I start an assessment?',
      answer: 'After logging in, go to the "Activities" section on your dashboard and click on the quiz or job assessment you want to attempt.',
    },
    {
      question: 'Can I retake a quiz after submitting?',
      answer: 'It depends on the quiz settings. Some quizzes allow retakes, while others can be attempted only once. Please check the quiz instructions.',
    },
    {
      question: 'How can I view my quiz results?',
      answer: 'Once your quiz is submitted and evaluated, results will appear under the "Completed Activities" section of your dashboard.',
    },
    {
      question: 'What if my internet disconnects during a test?',
      answer: 'Your progress is auto-saved periodically. Reconnect and revisit the test page. If the issue continues, contact support immediately.',
    },
  ];

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
        {/* Header */}
        <header className="bg-white/30 dark:bg-gray-700/30 backdrop-blur-md shadow-md p-4 rounded-b-lg flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <FiMenu size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
          {/* <UserSearchBar searchQuery={''} setSearchQuery={() => {}} /> */}
        </header>

        {/* Main */}
        <main className="p-6">
          {/* Help Heading */}
          <div className="flex flex-col items-center mb-8">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              Got any problem?
            </h2>
            <Link to="/chat">
              <button className="bg-[#4A90E2] text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-600 transition-colors">
                Chat with Us <span className="ml-2">→</span>
              </button>
            </Link>
          </div>

          {/* FAQ Section */}
          <h3 className="text-2xl font-semibold mb-6 text-black dark:white">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-[#2ECC71]"
              >
                <h4 className="text-lg font-medium mb-2 text-black dark:text-white">{faq.question}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Support;
