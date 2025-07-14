import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode] = useState(false);

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'https://localhost:5031',
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
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
      await axiosInstance.post('/api/messages', message);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const uniqueUsers = [...new Set(messages.map(msg => msg.sender).filter(s => s !== 'Admin'))];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} p-6`}>
      <h2 className="text-2xl font-semibold mb-6">Admin Chat</h2>

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="mb-4 p-2 rounded border"
      >
        <option value="">Select a user</option>
        {uniqueUsers.map((user) => (
          <option key={user} value={user}>{user}</option>
        ))}
      </select>

      <div className="h-[400px] overflow-y-auto bg-white rounded shadow p-4 mb-4">
        {loading ? (
          <div>Loading messages...</div>
        ) : selectedUser ? (
          messages
            .filter(
              msg =>
                (msg.sender === selectedUser && msg.recipient === 'Admin') ||
                (msg.sender === 'Admin' && msg.recipient === selectedUser)
            )
            .map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  msg.sender === 'Admin' ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
        ) : (
          <div className="text-gray-500">Select a user to view messages</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminChat;
