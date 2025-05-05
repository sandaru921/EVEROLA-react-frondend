import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserSidebar from '../../components/UserSidebar';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';
import { IoSend, IoClose, IoHappyOutline } from 'react-icons/io5';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [isOpen, setIsOpen] = useState(false); // State for sidebar open/close
  const userId = 'Sandaru71';
  const recipient = 'Admin';
  const messagesEndRef = useRef(null);

  // Mock user data (replace with actual user data from auth context or API)
  const user = {
    username: 'Sandaru71',
    role: 'User',
  };

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5031/api/messages/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      text: newMessage,
      sender: userId,
      recipient: recipient,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:5031/api/messages', message);
      setMessages([...messages, message]);
      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  // Handle Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`flex min-h-[calc(100vh-64px)] ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
      />

      {/* Chat Area */}
      <div className="flex-1 p-6">
        <div className="relative max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => window.history.back()}
          >
            <IoClose size={24} />
          </button>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6">
            {loading && (
              <div className="text-center text-gray-500">Loading messages...</div>
            )}
            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mb-4 ${
                  msg.sender === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender !== userId && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === userId
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-textPrimary rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(msg.timestamp), 'h:mm a')}
                  </p>
                </div>
                {msg.sender === userId && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <IoHappyOutline size={24} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-10">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a new message here"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary text-black rounded-full hover:bg-accent transition-colors"
              >
                <IoSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;