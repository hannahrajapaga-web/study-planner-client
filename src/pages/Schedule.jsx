import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Trash2, Clock } from 'lucide-react';
import '../App.css';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedulesAndSubjects();
  }, []);

  const fetchSchedulesAndSubjects = async () => {
    try {
      const [schedulesRes, subjectsRes] = await Promise.all([
        api.get('/schedules'),
        api.get('/subjects')
      ]);
      setSchedules(schedulesRes.data);
      setSubjects(subjectsRes.data);
      if (subjectsRes.data.length > 0) {
        setSubjectId(subjectsRes.data[0].id.toString());
      }
    } catch (err) {
      console.error('Failed to load schedule planner:', err);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setError('');

    if (!subjectId) {
      setError('Please create a subject first before scheduling hours.');
      return;
    }

    try {
      const payload = {
        dayOfWeek,
        startTime: startTime + ':00',
        endTime: endTime + ':00',
        subject: { id: parseInt(subjectId) }
      };

      await api.post('/schedules', payload);
      setStartTime('');
      setEndTime('');
      fetchSchedulesAndSubjects();
    } catch (err) {
      setError('Could not create schedule block. Ensure start time is before end time.');
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await api.delete(`/schedules/${id}`);
      setSchedules(schedules.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  };

  const daysOfWeekList = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">
        <div className="header-bar">
            <div style={{ height: '1.5rem' }}></div>
          <div>
            <h1>Weekly Study Planner</h1>
            <p>Plan your weekly courses and self-study blocks</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Schedule Study Block
            </h3>
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleCreateSchedule}>
              <div className="form-group">
                <label>Day of the Week</label>
                <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                  {daysOfWeekList.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Course / Subject</label>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                  {subjects.length === 0 ? (
                    <option value="">-- No Subjects Registered --</option>
                  ) : (
                    subjects.map(subj => (
                      <option key={subj.id} value={subj.id}>{subj.name}</option>
                    ))
                  )}
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={subjects.length === 0}>
                Add to Schedule
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Your Weekly Agenda</h3>
            {schedules.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Your weekly schedule is empty. Start planning on the left!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {daysOfWeekList.map(day => {
                  const daySchedules = schedules.filter(s => s.dayOfWeek === day);
                  if (daySchedules.length === 0) return null;

                  return (
                    <div key={day} style={{ background: 'rgba(255, 255, 255, 0.4)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--sage)', letterSpacing: '0.05em' }}>{day}</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.8rem' }}>
                        {daySchedules.map(block => (
                          <div 
                            key={block.id}
                            style={{
                              background: 'var(--coconut)',
                              borderLeft: `4px solid ${block.subject.colorCode}`,
                              borderRadius: '8px',
                              padding: '0.8rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.95rem' }}>{block.subject.name}</strong>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                <Clock size={12} /> {block.startTime.substring(0, 5)} - {block.endTime.substring(0, 5)}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleDeleteSchedule(block.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(239, 68, 68, 0.7)',
                                cursor: 'pointer',
                                padding: '0.2rem'
                              }}
                              title="Remove study block"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}