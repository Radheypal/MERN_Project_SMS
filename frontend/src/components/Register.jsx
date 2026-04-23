import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register({ setAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      setAuth(res.data.student);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🎓</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.sub}>Register as a new student</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input placeholder="Enter your name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label>Email</label>
          <input type="email" placeholder="Enter your email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" placeholder="Create a password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" style={styles.btn}>Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  logo: { fontSize: '40px', textAlign: 'center', marginBottom: '8px' },
  title: { textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#1f2937' },
  sub: { textAlign: 'center', color: '#6b7280', marginBottom: '24px', fontSize: '14px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', padding: '12px', fontWeight: '600', fontSize: '15px', marginTop: '4px' },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }
};
