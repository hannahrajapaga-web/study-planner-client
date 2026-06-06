import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Trash2, Calendar, CheckSquare, Square, FileText, Pencil, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import '../App.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');

  // Edit state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('');

  useEffect(() => {
    fetchTasksAndSubjects();
  }, []);

  const fetchTasksAndSubjects = async () => {
    try {
      const [tasksRes, subjectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/subjects')
      ]);
      setTasks(tasksRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error('Failed to load tasks and subjects:', err);
      toast.error('Failed to load tasks!');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return;

    if (deadline && new Date(deadline) < new Date()) {
      alert('⚠️ Deadline cannot be in the past!');
      return;
    }

    try {
      const payload = {
        title,
        description,
        deadline: deadline ? deadline : null,
        subject: subjectId ? { id: parseInt(subjectId) } : null
      };
      await api.post('/tasks', payload);
      setTitle('');
      setDescription('');
      setDeadline('');
      setSubjectId('');
      fetchTasksAndSubjects();
      toast.success('Task added!');
    } catch (err) {
      setError('Could not add task. Please check values.');
      toast.error('Could not add task!');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const res = await api.put(`/tasks/${id}/toggle`);
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      toast.success(res.data.completed ? 'Task completed! ✅' : 'Task marked incomplete');
    } catch (err) {
      console.error('Failed to toggle task:', err);
      toast.error('Failed to update task!');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success('Task deleted!');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task!');
    }
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDeadline(task.deadline ? task.deadline.slice(0, 16) : '');
    setEditSubjectId(task.subject ? task.subject.id : '');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDeadline('');
    setEditSubjectId('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty!');
      return;
    }

    if (editDeadline && new Date(editDeadline) < new Date()) {
      alert('⚠️ Deadline cannot be in the past!');
      return;
    }

    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline ? editDeadline : null,
        subject: editSubjectId ? { id: parseInt(editSubjectId) } : null
      };
      const res = await api.put(`/tasks/${id}`, payload);
      setTasks(tasks.map(t => t.id === id ? res.data : t));
      setEditingTaskId(null);
      toast.success('Task updated!');
    } catch (err) {
      console.error('Failed to update task:', err);
      toast.error('Failed to update task!');
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">
        <div className="header-bar">
          <div style={{ height: '1.5rem' }}></div>
          <div>
            <h1>Task Planner & Tracker</h1>
            <p>Manage tasks, assignments, and exam dates</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Add New Task
            </h3>
            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish Calculus Homework"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Chapter 4, exercises 1 to 10"
                />
              </div>

              <div className="form-group">
                <label>Deadline Date & Time</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => {
                    const selected = new Date(e.target.value);
                    if (selected < new Date()) {
                      alert('⚠️ Deadline cannot be in the past!');
                      setDeadline('');
                    } else {
                      setDeadline(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <label>Link to Subject</label>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                  <option value="">No Course Category (General)</option>
                  {subjects.map(subj => (
                    <option key={subj.id} value={subj.id}>{subj.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary">Add Task</button>
            </form>
          </div>

          <div className="card">
            <h3>Your Task Checklist</h3>
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No tasks registered. Rest easy, or add tasks to stay on track!</p>
            ) : (
              <div>
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-item ${task.completed ? 'completed' : ''}`}
                    style={{
                      borderLeft: `5px solid ${task.subject ? task.subject.colorCode : '#64748b'}`,
                      padding: '1.2rem',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.4)',
                      marginBottom: '0.8rem'
                    }}
                  >
                    {editingTaskId === task.id ? (
                      // Edit mode
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description (optional)"
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                        />
                        <input
                          type="datetime-local"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                        />
                        <select
                          value={editSubjectId}
                          onChange={(e) => setEditSubjectId(e.target.value)}
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                        >
                          <option value="">No Subject</option>
                          {subjects.map(subj => (
                            <option key={subj.id} value={subj.id}>{subj.name}</option>
                          ))}
                        </select>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            style={{ background: 'var(--sage)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{ background: 'var(--oat)', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            style={{ background: 'none', border: 'none', color: task.completed ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                          </button>

                          <div>
                            <span
                              className={`task-title ${task.completed ? 'completed' : ''}`}
                              style={{ color: task.completed ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: '500' }}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <FileText size={12} /> {task.description}
                              </div>
                            )}
                            {task.deadline && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Calendar size={12} /> Due: {new Date(task.deadline).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          {task.subject && (
                            <span className="badge" style={{ backgroundColor: task.subject.colorCode, color: '#fff' }}>
                              {task.subject.name}
                            </span>
                          )}
                          <button
                            onClick={() => handleStartEdit(task)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px' }}
                            title="Edit Task"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.7)', cursor: 'pointer', padding: '0.2rem', borderRadius: '4px' }}
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
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