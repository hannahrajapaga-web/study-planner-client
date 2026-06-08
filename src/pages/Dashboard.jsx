import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Target, Bell, Award, CheckCircle2, BookOpen } from 'lucide-react';
import '../App.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [studyGoal, setStudyGoal] = useState('');
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, tasksRes, subjectsRes, schedulesRes, notificationsRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/tasks'),
        api.get('/subjects'),
        api.get('/schedules'),
        api.get('/notifications')
      ]);

      setUser(profileRes.data);
      setStudyGoal(profileRes.data.studyGoal || 'No study goal set yet.');
      setTasks(tasksRes.data);
      setSubjects(subjectsRes.data);
      setSchedules(schedulesRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile/goal', { studyGoal });
      setUser(res.data);
      setIsEditingGoal(false);
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await Promise.all(notifications.map(n => api.put(`/notifications/${n.id}/read`)));
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const username = localStorage.getItem('username') || 'Student';
  const now = new Date();

  // Split tasks into overdue and upcoming
  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = pendingTasks.filter(t => t.deadline && new Date(t.deadline) < now);
  const upcomingTasks = pendingTasks.filter(t => !t.deadline || new Date(t.deadline) >= now);
  const displayTasks = [...overdueTasks, ...upcomingTasks].slice(0, 4);

  // Today's schedule
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[now.getDay()];
  const todaySchedules = schedules.filter(s => s.dayOfWeek.toUpperCase() === todayName);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">

        <div className="dashboard-welcome">
          Welcome {username}
        </div>

        <div className="header-bar">
          <div>
            <h1>Study Desk</h1>
            <p>Here is your dashboard overview for today</p>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid-3">
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '1rem', borderRadius: '12px' }}>
              <BookOpen size={30} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Subjects Tracked</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{subjects.length}</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '1rem', borderRadius: '12px' }}>
              <CheckCircle2 size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Task Completion</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{completionRate}%</p>
              <div style={{ background: 'rgba(0,0,0,0.1)', height: '6px', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
                <div style={{ background: 'var(--sage)', height: '100%', width: `${completionRate}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.25)', padding: '1rem', borderRadius: '12px' }}>
              <Award size={30} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Scheduled Classes</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.8rem', fontWeight: 'bold' }}>{schedules.length}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Study Goal */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <Target color="var(--sage)" />
                <h3 style={{ margin: 0, color: 'var(--sage)' }}>Your Active Study Goal</h3>
              </div>
              {!isEditingGoal ? (
                <div>
                  <p style={{ fontSize: '1.1rem', fontStyle: 'italic', margin: '0 0 1rem 0' }}>"{studyGoal}"</p>
                  <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => setIsEditingGoal(true)}>
                    Update Goal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateGoal}>
                  <div className="form-group">
                    <input type="text" value={studyGoal} onChange={(e) => setStudyGoal(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>Save</button>
                    <button type="button" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'var(--oat)' }} onClick={() => setIsEditingGoal(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Pending Deadlines */}
            <div className="card">
              <h3 style={{ color: 'var(--sage)' }}>Pending Deadlines</h3>
              {displayTasks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>All tasks completed! Great job.</p>
              ) : (
                displayTasks.map(task => {
                  const isOverdue = task.deadline && new Date(task.deadline) < now;
                  return (
                    <div
                      className="task-item"
                      key={task.id}
                      style={{
                        borderLeft: `4px solid ${isOverdue ? '#ef4444' : task.subject?.colorCode || 'var(--sage)'}`,
                        background: isOverdue ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.4)',
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <span className="task-title" style={{ color: isOverdue ? '#ef4444' : 'var(--text-main)', fontWeight: '500' }}>
                          {task.title} {isOverdue && '⚠️ Overdue'}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: isOverdue ? '#ef4444' : 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Due: {task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline'}
                        </div>
                      </div>
                      {task.subject && (
                        <span className="badge" style={{ backgroundColor: task.subject.colorCode || 'var(--sage)', color: '#fff' }}>
                          {task.subject.name}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Today's Schedule */}
            <div className="card">
              <h3 style={{ color: 'var(--sage)' }}>Today's Schedule ({todayName})</h3>
              {todaySchedules.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No classes scheduled for today.</p>
              ) : (
                todaySchedules.map(s => (
                  <div key={s.id} style={{
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.4)',
                    borderLeft: `4px solid ${s.subject?.colorCode || 'var(--sage)'}`,
                    marginBottom: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{s.subject?.name || 'Class'}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {s.startTime} – {s.endTime}
                      </div>
                    </div>
                    {s.subject && (
                      <span className="badge" style={{ backgroundColor: s.subject.colorCode, color: '#fff' }}>
                        {s.subject.name}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Alert Center */}
          <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell color="var(--sage)" size={20} />
                <h3 style={{ margin: 0, color: 'var(--sage)' }}>Alert Center</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleClearAllNotifications}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent study alerts or reminders.</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '8px',
                    background: notif.read ? 'rgba(0,0,0,0.02)' : 'rgba(219,186,174,0.15)',
                    borderLeft: `3.5px solid ${notif.read ? 'var(--oat)' : 'var(--blush)'}`,
                    marginBottom: '0.8rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>{notif.message}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}