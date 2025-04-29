import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome, FaHospital, FaUserMd, FaCity, FaHistory,
  FaBell, FaSignOutAlt, FaCog, FaCommentDots
} from 'react-icons/fa';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';

function TopNav() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const { notificationCount, updateNotificationCount } = useContext(NotificationContext);
  const [profile, setProfile] = useState({ fullName: '', profilePictureUrl: '' });

  useEffect(() => {
    if (!userId || !token) return;

    const fetchProfileAndNotifications = async () => {
      try {
        const profileRes = await axios.get(`https://amshc-backend.onrender.com/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);

        const notifRes = await axios.get(`https://amshc-backend.onrender.com/api/notifications/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const unread = notifRes.data.filter(n => !n.read).length;
        updateNotificationCount(unread);
      } catch (error) {
        console.error('Error fetching profile or notifications', error);
      }
    };

    fetchProfileAndNotifications(); // ✅ Call once only
  }, [userId, token, updateNotificationCount]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const avatarSrc = profile.profilePictureUrl
    ? `https://amshc-backend.onrender.com/${profile.profilePictureUrl.replace(/\\/g, '/')}`
    : '/default-avatar.png';

  return (
    <div className="bg-blue-800 p-4 flex justify-between items-center text-white">
      {/* Logo */}
      <div className="text-xl font-semibold">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-white">AMSHC</span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex space-x-8">
        <Link to="/dashboard" className="flex flex-col items-center text-white"><FaHome size={30} /><span className="text-sm">Home</span></Link>
        <Link to="/booking" className="flex flex-col items-center text-white"><FaHospital size={30} /><span className="text-sm">Book now</span></Link>
        <Link to="/doctor" className="flex flex-col items-center text-white"><FaUserMd size={30} /><span className="text-sm">Doctors</span></Link>
        <Link to="/clinics" className="flex flex-col items-center text-white"><FaCity size={30} /><span className="text-sm">Clinics</span></Link>
        <Link to="/booking-history" className="flex flex-col items-center text-white"><FaHistory size={30} /><span className="text-sm">Booking History</span></Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-6">
        <Link to="/settings" className="flex flex-col items-center hover:text-yellow-300">
          <FaCog size={30} /><span className="text-sm">Settings</span>
        </Link>

        <Link to="/notifications" className="relative flex flex-col items-center hover:text-yellow-300">
          <FaBell size={30} />
          <span className="text-sm">Notify</span>
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </Link>

        <Link to="/messages" className="flex flex-col items-center hover:text-yellow-300">
          <FaCommentDots size={30} />
          <span className="text-sm">Messages</span>
        </Link>

        <div className="flex items-center space-x-2">
          <img
            src={avatarSrc}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-white"
            onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
          />
          <span className="text-sm font-medium">{profile.fullName}</span>
        </div>

        <button onClick={handleLogout} className="flex flex-col items-center hover:text-red-400">
          <FaSignOutAlt size={30} /><span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default TopNav;
