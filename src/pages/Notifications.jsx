import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const { updateNotificationCount } = useContext(NotificationContext);

  const fetchNotifications = () => {
    if (!userId || !token) return;
    setLoading(true);

    axios.get(`https://amshc-backend.onrender.com/api/notifications/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.read).length;
      updateNotificationCount(unread);
    })
    .catch((err) => console.error("Failed to load notifications", err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    axios.put(`https://amshc-backend.onrender.com/api/notifications/read/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      updateNotificationCount(updated.filter(n => !n.read).length);
    })
    .catch((err) => console.error("Failed to mark as read", err));
  };

  const deleteNotification = (id) => {
    axios.delete(`https://amshc-backend.onrender.com/api/notifications/${id}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      updateNotificationCount(updated.filter(n => !n.read).length);
    })
    .catch(err => console.error("Failed to delete notification", err));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">🔔 My Notifications</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500">You have no notifications.</p>
      ) : (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {notifications.map((notif) => (
            <li key={notif.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
              <p className="font-semibold text-blue-700 mb-1">{notif.type.replace('_', ' ')}</p>
              <p className="text-gray-700">{notif.message}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default Notifications;
//hello