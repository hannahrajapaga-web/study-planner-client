import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import '../App.css';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [colorCode, setColorCode] = useState('#6366f1');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      toast.error('Failed to load subjects!');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;

    try {
      const res = await api.post('/subjects', { name, colorCode });
      setSubjects([...subjects, res.data]);
      setName('');
      setColorCode('#6366f1');
      toast.success('Subject created!');
    } catch (err) {
      setError('Could not create subject. Please check connection.');
      toast.error('Could not create subject!');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Warning: Deleting a subject will also permanently delete all associated tasks and study schedules. Proceed?")) {
      return;
    }
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter(s => s.id !== id));
      toast.success('Subject deleted!');
    } catch (err) {
      console.error('Failed to delete subject:', err);
      toast.error('Failed to delete subject!');
    }
  };

  const colors = [
    { value: '#6366f1', name: 'Indigo' },
    { value: '#3b82f6', name: 'Blue' },
    { value: '#10b981', name: 'Emerald' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#ef4444', name: 'Rose' },
    { value: '#ec4899', name: 'Pink' },
    { value: '#8b5cf6', name: 'Violet' },
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">
        <div className="header-bar">
          <div style={{ height: '1.5rem' }}></div>
          <div>
            <h1>Subjects Registry</h1>
            <p>Manage your courses and color themes here</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Add New Subject
            </h3>
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Algorithms & Data Structures"
                  required
                />
              </div>

              <div className="form-group">
                <label>UI Theme Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {colors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setColorCode(color.value)}
                      style={{
                        backgroundColor: color.value,
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: colorCode === color.value ? '2px solid white' : 'none',
                        boxShadow: colorCode === color.value ? '0 0 0 2px var(--sage)' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease'
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Create Subject</button>
            </form>
          </div>

          <div className="card">
            <h3>Your Active Subjects</h3>
            {subjects.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No courses registered yet. Add one on the left to start!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {subjects.map(subj => (
                  <div
                    key={subj.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                      border: '1px solid var(--border-color)',
                      borderLeft: `5px solid ${subj.colorCode}`,
                      borderRadius: '12px',
                      padding: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <BookOpen size={18} style={{ color: subj.colorCode }} />
                      <strong style={{ fontSize: '0.95rem' }}>{subj.name}</strong>
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(subj.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(239, 68, 68, 0.7)',
                        cursor: 'pointer',
                        padding: '0.2rem',
                        borderRadius: '4px'
                      }}
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}