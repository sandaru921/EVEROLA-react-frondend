import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSearch } from 'react-icons/fi';
import UserSidebar from "../../components/UserSidebar.jsx";


const Support = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const user = { username: 'Sandaru71', email: 'rohanasandaru@gmail.com', role: 'Recruiter' };

  // FAQ Data
  const faqs = [
    {
      question: 'How long until we deliver your first blog post?',
      answer: 'Really boy law county she unable her sister. Feet you off its like six. Among sex are leave law built now. In built table in an rapid blush. Merits behind on afraid or warmly.',
    },
    {
      question: 'How long until we deliver your first blog post?',
      answer: 'Really boy law county she unable her sister. Feet you off its like six. Among sex are leave law built now.',
    },
    {
      question: 'How long until we deliver your first blog post?',
      answer: 'Really boy law county she unable her sister. Feet you off its like six.',
    },
    {
      question: 'How long until we deliver your first blog post?',
      answer: 'Really boy law county she unable her sister.',
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#F7F9FC]'}`}>
      <UserSidebar darkMode={darkMode} setDarkMode={setDarkMode} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />
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
        <main className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">Got any problem?</h2>
            <Link to="/chat">
              <button className="bg-[#4A90E2] text-white px-6 py-3 rounded-full flex items-center mx-auto hover:bg-blue-600 transition-colors">
                Chat with Us <span className="ml-2">→</span>
              </button>
            </Link>
          </div>
          {/* Call Center Woman Image */}
          <div className="flex justify-center mb-8">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" // Real image of a call center woman
              alt="Call Center Woman"
              className="w-64 h-40 object-cover rounded-lg"
            />
          </div>
          {/* FAQ Section with Smaller Tiles */}
          <h3 className="text-2xl font-semibold text-[#333333] mb-6">Frequently Ask Questions</h3>
          <div className="grid grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#2ECC71]">
                <h4 className="text-lg font-medium text-[#333333] mb-2">{faq.question}</h4>
                <p className="text-[#666666] text-sm line-clamp-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Support;