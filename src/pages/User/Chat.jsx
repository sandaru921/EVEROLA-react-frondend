import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserSidebar from '../../components/UserSidebar';
import EmojiPicker from 'emoji-picker-react';
import { IoSend, IoClose, IoHappyOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem('token');
  const tokenData = decodeToken(token);
  const userId = tokenData?.nameid;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(`https://localhost:5031/api/messages/${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Filter messages to only show conversations between this user and Admin
      const userMessages = response.data.filter(msg => 
        (msg.sender === userId && msg.recipient === 'Admin') ||
        (msg.sender === 'Admin' && msg.recipient === userId)
      );
      
      setMessages(userMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.response?.data?.message || 'Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 60000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check for first message and trigger auto-reply after 24 hours
    const firstUserMessage = messages.find(msg => msg.sender === userId && !msg.isAutoReply);
    if (firstUserMessage && !localStorage.getItem(`autoReplySent_${userId}`)) {
      const delay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timer = setTimeout(async () => {
        try {
          const autoReplyData = {
            text: "feel free to ask anything, our agents will reply within 2 days",
            sender: 'Admin',
            recipient: userId,
            role: 'Admin',
            isAutoReply: true // Flag to hide from admin
          };
          await axios.post('https://localhost:5031/api/messages', autoReplyData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          localStorage.setItem(`autoReplySent_${userId}`, 'true');
          await fetchMessages();
        } catch (error) {
          console.error('Error sending auto-reply:', error);
          toast.error('Failed to send auto-reply');
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [messages, userId, token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      const messageData = {
        text: newMessage.trim(),
        sender: userId,
        recipient: 'Admin',
        role: 'User'
      };

      await axios.post('https://localhost:5031/api/messages', messageData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewMessage('');
      setShowEmojiPicker(false);
      await fetchMessages();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={`flex min-h-[calc(100vh-64px)] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <UserSidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <button
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            onClick={() => window.history.back()}
          >
            <IoClose size={24} />
          </button>
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {loading && <div className="text-center text-gray-500 dark:text-gray-400">Loading messages...</div>}
            {error && <div className="text-center text-red-500 dark:text-red-400 mb-4">{error}</div>}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mb-4 ${
                  msg.sender === userId ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender !== userId && !msg.isAutoReply && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-black dark:text-white font-medium">
                    A
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender === userId
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none'
                  } shadow-md transition-all duration-200 hover:shadow-lg`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.sender === userId && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-medium">
                    {userId.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <IoHappyOutline size={24} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-10 transform -translate-x-1/2">
                    <EmojiPicker onEmojiClick={onEmojiClick} theme={darkMode ? 'dark' : 'light'} />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a new message here"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
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