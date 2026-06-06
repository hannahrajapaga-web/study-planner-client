import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import Schedule from './pages/Schedule';
import Pomodoro from './pages/Pomodoro';
import './App.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
    <Toaster position="top-right" />
      <Routes>
        {/* Auth Screens */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* Protected Feature Screens */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/subjects" 
          element={isAuthenticated ? <Subjects /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tasks" 
          element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/schedule" 
          element={isAuthenticated ? <Schedule /> : <Navigate to="/login" />} 
        />

        {/* Catch-all Route redirect */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
        <Route 
  path="/pomodoro" 
  element={isAuthenticated ? <Pomodoro /> : <Navigate to="/login" />} 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;