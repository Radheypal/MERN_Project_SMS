import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function Register({ onLogin, switchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.logo}>🏢</div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Candidate Shortlisting System</p>

        {error && <div style={s.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input
            style={s.input}
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <label style={s.label}>Confirm Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Confirm your password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            required
          />
          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? '⏳ Registering...' : '✅ Register'}
          </button>
        </form>

        <p style={s.switchText}>
          Already have an account?{' '}
          <span style={s.link} onClick={switchToLogin}>Login here</span>
        </p>
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { background: '#fff', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '12px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: '4px' },
  sub: { color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '28px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '13px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '4px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  switchText: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
  link: { color: '#6366f1', fontWeight: '700', cursor: 'pointer' }
};
