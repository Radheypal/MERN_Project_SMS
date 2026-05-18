import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CandidateForm from './components/CandidateForm.jsx';
import CandidateList from './components/CandidateList.jsx';
import JobMatch from './components/JobMatch.jsx';

export default function App() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: '👥 Candidates' },
    { to: '/add', label: '➕ Add Candidate' },
    { to: '/match', label: '🎯 Job Match' },
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              ...s.navLink,
              background: location.pathname === link.to ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'
            }}>{link.label}</Link>
          ))}
        </div>
      </nav>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' }}>
        <Routes>
          <Route path="/" element={<CandidateList />} />
          <Route path="/add" element={<CandidateForm />} />
          <Route path="/match" element={<JobMatch />} />
        </Routes>
      </div>
    </div>
  );
}

const s = {
  nav: { background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  navLink: { color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }
};
