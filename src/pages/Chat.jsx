import { useState } from 'react';
import { FiSend, FiMenu } from 'react-icons/fi';
import UserSidebar from '../components/UserSidebar';

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you today?', sender: 'support', time: '10:00 AM' },
    { id: 2, text: 'I have a question about my account.', sender: 'user', time: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const user = { username: 'Sandaru71', email: 'rohanasandaru@gmail.com', role: 'Recruiter' };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user', time: '10:02 AM' }]);
    setNewMessage('');
    // Simulate a reply from support
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: 'Sure, what would you like to know?', sender: 'support', time: '10:03 AM' },
      ]);
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-[#F7F9FC]'}`}>
      <UserSidebar darkMode={darkMode} setDarkMode={setDarkMode} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />
      <div className="md:ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden">
            <FiMenu size={24} className="text-gray-800 dark:text-gray-200" />
          </button>
          <h2 className="text-xl font-semibold text-[#333333]">Chat with Support</h2>
        </header>
        <main className="p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md flex flex-col h-[70vh]">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <img
                src="https://via.placeholder.com/40.png?text=Support"
                alt="Support Agent"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="text-lg font-semibold text-[#333333]">Support Agent</h3>
                <p className="text-sm text-[#666666]">Online</p>
              </div>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-[#4A90E2] text-white'
                        : 'bg-gray-100 text-[#333333]'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400 block mt-1">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
              <button
                onClick={handleSendMessage}
                className="ml-3 bg-[#4A90E2] text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;