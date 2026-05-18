import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

export default function CandidateForm() {
  const [form, setForm] = useState({ name: '', email: '', skills: '', experience: '', bio: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      await axios.post(`${API}/api/candidates`, { ...form, skills: skillsArray, experience: Number(form.experience) });
      setSuccess('Candidate added successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    }
  };

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h2 style={s.title}>➕ Add New Candidate</h2>
        <p style={s.sub}>Fill in the candidate details below</p>
        {error && <div style={s.error}>⚠️ {error}</div>}
        {success && <div style={s.success}>✅ {success}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="e.g. rahul@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label style={s.label}>Skills <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma separated)</span></label>
          <input style={s.input} placeholder="e.g. React, Node.js, MongoDB" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} required />
          <label style={s.label}>Experience (years)</label>
          <input style={s.input} type="number" min="0" placeholder="e.g. 2" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required />
          <label style={s.label}>Bio / Projects</label>
          <textarea style={s.textarea} placeholder="Brief bio or project description..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          <button type="submit" style={s.btn}>Add Candidate</button>
        </form>
      </div>
    </div>
  );
}

const s = {
  wrapper: { display: 'flex', justifyContent: 'center' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '520px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  title: { fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '6px' },
  sub: { color: '#94a3b8', fontSize: '14px', marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', marginBottom: '16px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '13px', fontSize: '15px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  success: { background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }
};
