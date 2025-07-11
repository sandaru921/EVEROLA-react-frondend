import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    const axiosInstance = axios.create({
      baseURL: 'http://localhost:5031',
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages.');
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      text: newMessage,
      sender: 'Admin',
      recipient: selectedUser,
      role: 'Admin',
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5031/api/messages', message, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage('');
      const response = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message.');
      toast.error('Failed to send message');
    }
  };

  const uniqueUsers = [...new Set(messages.map(msg => msg.sender).filter(s => s !== 'Admin'))];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-100 text-gray-100' : 'bg-gray-100 text-gray-900'} p-6 transition-colors duration-300`}>
      <h2 className="text-2xl font-semibold mb-6">Admin Chat</h2>
      {loading && <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>}
      {error && <div className="text-center text-red-500 dark:text-red-400 mb-4">{error}</div>}
      <div className="mb-6">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-1/4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
        >
          <option value="">Select a user</option>
          {uniqueUsers.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
      </div>
      <div className="h-[375px] overflow-y-auto bg-white dark:bg-gray-300 rounded-lg shadow-md p-4 mb-6">
        {messages
          .filter(
            msg =>
              (msg.sender === selectedUser && msg.recipient === 'Admin') ||
              (msg.sender === 'Admin' && msg.recipient === selectedUser)
          )
          .map((msg, index) => (
            <div
              key={index}
              className={`mb-3 p-2 rounded-lg ${msg.role === 'Admin' ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            >
              {msg.text} ({new Date(msg.timestamp).toLocaleTimeString()})
            </div>
          ))}
      </div>
      <div className="flex justify-end items-end h-[calc(100vh-600px)]">
        <div className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a reply..."
            className="w-250 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;