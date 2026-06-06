import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, Calendar, LogOut } from 'lucide-react';
import '../App.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Student';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Schedule', path: '/schedule', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="logo">📚 Smart Study Planner</div>
      
      <div style={{ marginBottom: '2rem', color: '#94a3b8', fontSize: '0.95rem' }}>
        Welcome back, <strong style={{ color: '#fff' }}>{username}</strong>
      </div>

      <nav className="nav-links">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button 
          onClick={handleLogout} 
          className="nav-item" 
          style={{ 
            background: 'none', 
            border: 'none', 
            width: '100%', 
            textAlign: 'left',
            color: '#ef4444' 
          }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}