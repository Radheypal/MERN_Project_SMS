import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidateForm from './components/CandidateForm.jsx';
import CandidateList from './components/CandidateList.jsx';
import JobMatch from './components/JobMatch.jsx';
import SavedCandidates from './components/SavedCandidates.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Show login/register if not logged in
  if (!user) {
    if (showRegister) {
      return <Register onLogin={handleLogin} switchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} switchToRegister={() => setShowRegister(true)} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
}

function MainApp({ user, onLogout }) {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: '👥 Candidates' },
    { to: '/add', label: '➕ Add Candidate' },
    { to: '/match', label: '🎯 Job Match' },
    { to: '/saved', label: '⭐ Saved' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🏢</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px' }}>Candidate Shortlisting System</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>AI-Powered Recruitment</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              ...s.navLink,
              background: location.pathname === link.to ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'
            }}>{link.label}</Link>
          ))}
          <div style={s.userBadge}>👤 {user.name}</div>
          <button onClick={onLogout} style={s.logoutBtn}>🚪 Logout</button>
        </div>
      </nav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/add" element={<CandidateForm />} />
          <Route path="/match" element={<JobMatch />} />
          <Route path="/saved" element={<SavedCandidates />} />
        </Routes>
      </div>
    </div>
  );
}

const s = {
  nav: { background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  navLink: { color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
  userBadge: { background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  logoutBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }
};
