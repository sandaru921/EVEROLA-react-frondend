import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode] = useState(false);

  const token = localStorage.getItem('token');
  const tokenData = decodeToken(token);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:5031/api/messages', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const messageData = {
        text: newMessage.trim(),
        sender: 'Admin',
        recipient: selectedUser,
        role: 'Admin'
      };

      await axios.post('https://localhost:5031/api/messages', messageData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setNewMessage('');
      await fetchMessages();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  // Get unique users who have messaged the admin
  const uniqueUsers = [...new Set(
    messages
      .filter(msg => msg.sender !== 'Admin')
      .map(msg => msg.sender)
  )];

  // Filter messages for selected user
  const filteredMessages = selectedUser
    ? messages.filter(msg => 
        (msg.sender === selectedUser && msg.recipient === 'Admin') ||
        (msg.sender === 'Admin' && msg.recipient === selectedUser)
    ) : [];

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
          filteredMessages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                msg.sender === 'Admin' 
                  ? 'bg-blue-200 text-right ml-20' 
                  : 'bg-gray-200 text-left mr-20'
              }`}
            >
              <div className="font-semibold">
                {msg.sender === 'Admin' ? 'You' : msg.sender}
              </div>
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
          disabled={!selectedUser}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!selectedUser || !newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminChat;