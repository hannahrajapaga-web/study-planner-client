import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import '../App.css';

const MODES = {
  focus: { label: 'Focus Time', minutes: 25, color: 'var(--sage)', bg: 'var(--avocado)' },
  short: { label: 'Short Break', minutes: 5, color: 'var(--blush)', bg: 'var(--peach)' },
  long: { label: 'Long Break', minutes: 15, color: 'var(--oat)', bg: 'var(--honey)' },
};

export default function Pomodoro() {
  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundjay.com/buttons/sounds/button-09a.mp3');
  }, []);

  useEffect(() => {
    setSecondsLeft(MODES[mode].minutes * 60);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [mode]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (mode === 'focus') setSessions(s => s + 1);
            try { audioRef.current.play(); } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
    clearInterval(intervalRef.current);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = ((MODES[mode].minutes * 60 - secondsLeft) / (MODES[mode].minutes * 60)) * 100;
  const current = MODES[mode];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="main-content">
        <div className="header-bar">
          <div style={{ height: '1.5rem' }}></div>
          <div>
            <h1>Pomodoro Timer</h1>
            <p>Stay focused, study smarter</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

          {/* Mode Selector */}
          <div style={{
            display: 'flex',
            gap: '0.8rem',
            background: 'rgba(255,255,255,0.5)',
            padding: '0.5rem',
            borderRadius: '20px',
            border: '1.5px solid var(--oat)'
          }}>
            {Object.entries(MODES).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Lora, serif',
                  fontStyle: 'italic',
                  fontWeight: mode === key ? '600' : '400',
                  fontSize: '0.9rem',
                  background: mode === key ? val.bg : 'transparent',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {key === 'focus'
                  ? <BookOpen size={14} />
                  : <Coffee size={14} />}
                {val.label}
              </button>
            ))}
          </div>

          {/* Timer Card */}
          <div style={{
            background: current.bg,
            border: '1.5px solid var(--oat)',
            borderRadius: '24px',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            boxShadow: 'var(--card-shadow)',
            minWidth: '340px'
          }}>

            {/* Circle Timer */}
            <div style={{ position: 'relative', width: '220px', height: '220px' }}>
              <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="110" cy="110" r="95"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="10"
                />
                <circle
                  cx="110" cy="110" r="95"
                  fill="none"
                  stroke={current.color}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 95}`}
                  strokeDashoffset={`${2 * Math.PI * 95 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3.2rem',
                  fontWeight: 'bold',
                  color: 'var(--text-main)',
                  fontFamily: 'Lora, serif',
                  letterSpacing: '2px'
                }}>
                  {minutes}:{seconds}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginTop: '0.2rem'
                }}>
                  {current.label}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1.5px solid var(--oat)',
                  borderRadius: '50%',
                  width: '48px', height: '48px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                style={{
                  background: 'var(--blush)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '72px', height: '72px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(221, 186, 174, 0.5)',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  fontFamily: 'Lora, serif'
                }}
              >
                {isRunning ? <Pause size={28} /> : <Play size={28} />}
              </button>

              <div style={{ width: '48px' }} />
            </div>
          </div>

          {/* Sessions + Tip side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', maxWidth: '700px' }}>

            {/* Session Counter */}
            <div className="card" style={{ textAlign: 'center', background: 'var(--honey)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Sessions Today</h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'var(--sage)',
                fontFamily: 'Lora, serif'
              }}>
                {sessions} 
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                {sessions === 0 ? 'Start your first session!' :
                 sessions < 4 ? 'Good progress, keep going!' :
                 'Amazing focus today! '}
              </div>
            </div>

            {/* Tip Card */}
            <div className="card" style={{ background: 'var(--peach)', display: 'flex', alignItems: 'center' }}>
              <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>
                {mode === 'focus'
                  ? ' Close distracting tabs and put your phone away. You got this!'
                  : mode === 'short'
                  ? ' Stretch, grab some water and rest your eyes for a bit.'
                  : ' Step away from the screen. You deserve a proper rest!'}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}