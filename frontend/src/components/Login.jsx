import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

export default function Login({ setAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/api/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));
      setAuth(res.data.student);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🎓</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Login to your student account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" style={styles.btn}>Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register" style={{ color: '#4f46e5' }}>Register</Link></p>
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
  btn: { width: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', padding: '12px', fontWeight: '600', fontSize: '15px', marginTop: '4px' },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }
};
