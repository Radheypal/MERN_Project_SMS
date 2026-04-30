import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const initForm = { title: '', description: '', category: 'Academic' };
const catColors = { Academic: { bg: '#ede9fe', text: '#6d28d9' }, Hostel: { bg: '#fef3c7', text: '#92400e' }, Transport: { bg: '#d1fae5', text: '#065f46' }, Other: { bg: '#f1f5f9', text: '#475569' } };

export default function Dashboard({ setAuth }) {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState(initForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const navigate = useNavigate();

  const fetchGrievances = async () => {
    try { const res = await axios.get(`${API}/api/grievances`, getHeaders()); setGrievances(res.data); } catch {}
  };

  useEffect(() => { fetchGrievances(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) { await axios.put(`${API}/api/grievances/${editId}`, form, getHeaders()); setEditId(null); }
      else { await axios.post(`${API}/api/grievances`, form, getHeaders()); }
      setForm(initForm); fetchGrievances();
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
  };

  const handleEdit = (g) => { setEditId(g._id); setForm({ title: g.title, description: g.description, category: g.category }); window.scrollTo(0, 0); };
  const handleDelete = async (id) => { if (!window.confirm('Delete this grievance?')) return; await axios.delete(`${API}/api/grievances/${id}`, getHeaders()); fetchGrievances(); };
  const handleSearch = async (e) => { e.preventDefault(); if (!search.trim()) return fetchGrievances(); const res = await axios.get(`${API}/api/grievances/search?title=${search}`, getHeaders()); setGrievances(res.data); };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('student'); setAuth(null); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '18px' }}>Student Grievance System</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Manage your complaints</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={s.avatar}>{student.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{student.name}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>{student.email}</div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={s.container}>
        {/* Stats */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Grievances', value: grievances.length, color: '#6366f1', icon: '📋' },
            { label: 'Pending', value: grievances.filter(g => g.status === 'Pending').length, color: '#f59e0b', icon: '⏳' },
            { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length, color: '#10b981', icon: '✅' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={s.grid}>
          {/* Form */}
          <div style={s.formCard}>
            <h3 style={s.cardTitle}>{editId ? '✏️ Edit Grievance' : '📝 New Grievance'}</h3>
            {error && <div style={s.error}>⚠️ {error}</div>}
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Brief title of your grievance" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <label>Description</label>
              <textarea placeholder="Describe your issue in detail..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} required rows={4}
                style={{ width: '100%', padding: '11px 14px', margin: '5px 0 15px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', resize: 'vertical', fontFamily: 'inherit' }} />
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Academic</option><option>Hostel</option><option>Transport</option><option>Other</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" style={{ ...s.btn, background: editId ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#10b981,#059669)', flex: 1 }}>
                  {editId ? '✏️ Update' : '📤 Submit'}
                </button>
                {editId && <button type="button" onClick={() => { setEditId(null); setForm(initForm); }} style={{ ...s.btn, background: '#94a3b8' }}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* List */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search grievances by title..."
                style={{ flex: 1, padding: '11px 16px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#fff' }} />
              <button type="submit" style={{ ...s.btn, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', padding: '11px 20px' }}>Search</button>
              <button type="button" onClick={() => { setSearch(''); fetchGrievances(); }} style={{ ...s.btn, background: '#94a3b8', padding: '11px 20px' }}>Reset</button>
            </form>

            <div style={s.listCard}>
              <h3 style={s.cardTitle}>📋 All Grievances <span style={{ background: '#ede9fe', color: '#6366f1', padding: '2px 10px', borderRadius: '20px', fontSize: '13px' }}>{grievances.length}</span></h3>
              {grievances.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>📭</div>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>No grievances yet</p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}>Submit your first grievance using the form</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {grievances.map(g => (
                    <div key={g._id} style={s.gCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>{g.title}</span>
                            <span style={{ background: catColors[g.category]?.bg, color: catColors[g.category]?.text, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{g.category}</span>
                            <span style={{ background: g.status === 'Resolved' ? '#d1fae5' : '#fef3c7', color: g.status === 'Resolved' ? '#065f46' : '#92400e', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                              {g.status === 'Resolved' ? '✅' : '⏳'} {g.status}
                            </span>
                          </div>
                          <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>{g.description}</p>
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>📅 {new Date(g.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button onClick={() => handleEdit(g)} style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', padding: '7px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(g._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '7px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  nav: { background: 'linear-gradient(135deg, #1e1b4b, #312e81)', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' },
  logoutBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 18px', borderRadius: '8px', fontWeight: '600', backdropFilter: 'blur(10px)' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '28px 24px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  statCard: { flex: 1, background: '#fff', padding: '24px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  grid: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  formCard: { background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', width: '340px', flexShrink: 0 },
  listCard: { background: '#fff', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  btn: { color: '#fff', padding: '11px 20px', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  gCard: { border: '1.5px solid #f1f5f9', borderRadius: '12px', padding: '16px', background: '#fafafa', transition: 'all 0.2s' }
};
