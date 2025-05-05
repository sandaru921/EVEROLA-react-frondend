import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const adminId = 'Admin'; // Hardcoded for now

  // Fetch list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5031/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to a hardcoded user if the API fails
        setUsers(['Sandaru71']);
      }
    };

    fetchUsers();
  }, []);

  // Fetch messages for the selected user
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5031/api/messages/${selectedUser}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [selectedUser]);

  // Handle sending a message to the selected user
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      text: newMessage,
      sender: adminId,
      recipient: selectedUser,
      timestamp: new Date().toLocaleTimeString(),
    };

    try {
      await axios.post('http://localhost:5031/api/messages', message);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex gap-6">
      {/* User List */}
      <div className="w-1/4 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Users</h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser === user
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-textPrimary hover:bg-gray-200'
              }`}
            >
              {user}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-semibold text-textPrimary mb-4">
              Chat with {selectedUser}
            </h2>
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-secondary rounded-lg">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 flex ${
                    msg.sender === adminId ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === adminId
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-textPrimary'
                    }`}
                  >
                    <p className="font-medium">{msg.sender}</p>
                    <p>{msg.text}</p>
                    <p className="text-xs text-textSecondary mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-textPrimary text-center">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default AdminChat;