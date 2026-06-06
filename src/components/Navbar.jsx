import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../api';
import '../App.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Subjects', path: '/subjects' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Pomodoro', path: '/pomodoro' },
  ];

 useEffect(() => {
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 60000); // fetch every 60 seconds
  return () => clearInterval(interval); // cleanup on unmount
}, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          My Study Planner
        </div>

        <nav className="navbar-menu">
          {menuItems.map((item) => (
            <span
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`navbar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </span>
          ))}

          {/* Bell Icon */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '0.3rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '2.2rem',
                width: '320px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '0.8rem 1rem',
                  fontWeight: '600',
                  borderBottom: '1px solid #f1f5f9',
                  fontSize: '0.9rem'
                }}>
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                    No notifications yet
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        style={{
                          padding: '0.8rem 1rem',
                          borderBottom: '1px solid #f8fafc',
                          background: n.read ? '#fff' : '#f0f9ff',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ color: n.read ? '#94a3b8' : '#3b82f6', marginTop: '2px' }}>●</span>
                        <span>{n.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <span onClick={handleLogout} className="navbar-item signout-link">
            sign out
          </span>
        </nav>
      </div>
      <div className="navbar-dashed-divider"></div>
    </header>
  );
}