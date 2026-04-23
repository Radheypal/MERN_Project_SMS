import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const s = localStorage.getItem('student');
    return s ? JSON.parse(s) : null;
  });

  return (
    <Routes>
      <Route path="/" element={auth ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
      <Route path="/login" element={!auth ? <Login setAuth={setAuth} /> : <Navigate to="/" />} />
      <Route path="/register" element={!auth ? <Register setAuth={setAuth} /> : <Navigate to="/" />} />
    </Routes>
  );
}
