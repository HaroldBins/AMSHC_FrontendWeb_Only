import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import DefaultAvatar from '../images/default-avatar.jpg';

const Messaging = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loggedInUserAvatarUrl, setLoggedInUserAvatarUrl] = useState('');
  const bottomRef = useRef(null);

  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('userId'));
  const role = localStorage.getItem('role');

  const getUserDisplayName = (u) => u.name || u.fullName || '';

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const [userRes, usersRes] = await Promise.all([
          axios.get(`${baseURL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(role === 'PATIENT'
            ? `${baseURL}/api/doctors`
            : `${baseURL}/api/messages/chat-partners/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setLoggedInUserAvatarUrl(userRes.data.avatarUrl || '');
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      }
    };

    fetchInitialData();
  }, [token, role, userId]);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.get(`${baseURL}/api/messages/conversation`, {
        params: {
          user1: userId,
          user2: selectedUser.userId || selectedUser.id,
          page: 0,
          size: 100,
          sortBy: 'timestamp',
          sortDir: 'asc'
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.content);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, [selectedUser, userId, token]);

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages();

    let interval = setInterval(fetchMessages, 2000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearInterval(interval);
      } else {
        interval = setInterval(fetchMessages, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMessages, selectedUser]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageContent = newMessage;
    setNewMessage('');

    const tempMessage = {
      id: Date.now(),
      senderId: userId,
      receiverId: selectedUser.userId || selectedUser.id,
      content: messageContent,
      timestamp: new Date().toISOString(),
      senderAvatarUrl: loggedInUserAvatarUrl
    };

    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    try {
      await axios.post(`${baseURL}/api/messages/send`, {
        senderId: userId,
        receiverId: selectedUser.userId || selectedUser.id,
        senderRole: role,
        content: messageContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchMessages(); // Refresh after sending
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  const getAvatar = (url) => {
    return (!url || url.trim() === '') ? DefaultAvatar : url;
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-blue-800 mb-4">💬 Messaging</h1>

      <div className="flex gap-6">
        {/* Left Panel */}
        <div className="w-1/3">
          <input
            type="text"
            placeholder={role === 'PATIENT' ? 'Search doctor...' : 'Search patient...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border"
          />
          <ul className="mt-4 space-y-2">
            {users
              .filter(u => getUserDisplayName(u).toLowerCase().includes(search.toLowerCase()))
              .map(u => {
                const uid = u.userId || u.id;
                return (
                  <li
                    key={uid}
                    className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-blue-100 border ${selectedUser && (selectedUser.id === uid || selectedUser.userId === uid) ? 'bg-blue-200' : ''}`}
                    onClick={() => handleSelectUser(u)}
                  >
                    <img
                      src={getAvatar(u.avatarUrl)}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span><strong>{getUserDisplayName(u)}</strong> {u.specialization && `– ${u.specialization}`}</span>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 bg-white rounded-xl shadow p-4 border h-[500px] flex flex-col">
          {selectedUser ? (
            <>
              <h2 className="text-lg font-semibold mb-2 text-blue-700">
                Chat with {getUserDisplayName(selectedUser)}
              </h2>

              <div className="flex-1 overflow-y-auto space-y-4 border-t border-b py-3 mb-3">
                {messages.map((msg) => (
                  <div
                    key={msg.messageId || msg.id}
                    className={`flex items-end ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.senderId !== userId && (
                      <img
                        src={getAvatar(msg.senderAvatarUrl)}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    )}
                    <div className="flex flex-col max-w-xs">
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm ${msg.senderId === userId ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}
                      >
                        {msg.content}
                      </div>
                      {msg.senderId === userId && (
                        <small className="text-right text-[10px] text-gray-500 mt-1">
                          {msg.read ? 'Seen' : 'Delivered'}
                        </small>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 p-3 rounded-l-lg border border-gray-300"
                  placeholder="Type your message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-5 rounded-r-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-20">
              {role === 'PATIENT' ? 'Select a doctor to start chatting' : 'Select a patient to start chatting'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
