import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

export default function Register({ setAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API}/api/register`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      setAuth(res.data.student);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.brand}>🎓</div>
        <h1 style={s.brandTitle}>Join the Grievance Portal</h1>
        <p style={s.brandSub}>Create your account and start managing your complaints effectively</p>
        <div style={s.features}>
          {['🔐 Secure authentication', '📋 Easy grievance submission', '📊 Real-time status tracking'].map(f => (
            <div key={f} style={s.feature}>{f}</div>
          ))}
        </div>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Create Account ✨</h2>
          <p style={s.sub}>Register as a new student</p>
          {error && <div style={s.error}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <label>Password</label>
            <input type="password" placeholder="Create a strong password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'Creating account...' : 'Register →'}
            </button>
          </form>
          <p style={s.link}>Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: '600' }}>Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex' },
  left: { flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', color: '#fff' },
  brand: { fontSize: '56px', marginBottom: '16px' },
  brandTitle: { fontSize: '32px', fontWeight: '800', marginBottom: '12px', lineHeight: 1.2 },
  brandSub: { fontSize: '16px', opacity: 0.85, marginBottom: '40px', lineHeight: 1.6 },
  features: { display: 'flex', flexDirection: 'column', gap: '14px' },
  feature: { background: 'rgba(255,255,255,0.15)', padding: '12px 18px', borderRadius: '10px', fontSize: '14px', backdropFilter: 'blur(10px)' },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#f8fafc' },
  card: { background: '#fff', padding: '44px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' },
  sub: { color: '#94a3b8', fontSize: '14px', marginBottom: '28px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '13px', fontSize: '15px', marginTop: '6px', borderRadius: '10px' },
  link: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }
};
