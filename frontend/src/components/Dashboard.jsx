import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const initForm = { title: '', description: '', category: 'Academic' };
const categoryColors = { Academic: '#4f46e5', Hostel: '#f59e0b', Transport: '#10b981', Other: '#6b7280' };

export default function Dashboard({ setAuth }) {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState(initForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const navigate = useNavigate();

  const fetchGrievances = async () => {
    try {
      const res = await axios.get(`${API}/api/grievances`, getHeaders());
      setGrievances(res.data);
    } catch {}
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
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await axios.delete(`${API}/api/grievances/${id}`, getHeaders()); fetchGrievances(); };
  const handleSearch = async (e) => { e.preventDefault(); if (!search.trim()) return fetchGrievances(); const res = await axios.get(`${API}/api/grievances/search?title=${search}`, getHeaders()); setGrievances(res.data); };
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('student'); setAuth(null); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <nav style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎓</span>
          <span style={{ fontWeight: '700', fontSize: '18px' }}>Student Grievance System</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#c7d2fe', fontSize: '14px' }}>👤 {student.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
      <div style={styles.container}>
        <div style={styles.statsRow}>
          <div style={styles.statCard}><div style={{ fontSize: '28px', fontWeight: '700', color: '#4f46e5' }}>{grievances.length}</div><div style={{ color: '#6b7280', fontSize: '13px' }}>Total</div></div>
          <div style={styles.statCard}><div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{grievances.filter(g => g.status === 'Pending').length}</div><div style={{ color: '#6b7280', fontSize: '13px' }}>Pending</div></div>
          <div style={styles.statCard}><div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{grievances.filter(g => g.status === 'Resolved').length}</div><div style={{ color: '#6b7280', fontSize: '13px' }}>Resolved</div></div>
        </div>
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editId ? '✏️ Edit Grievance' : '📝 Submit Grievance'}</h3>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input placeholder="Enter grievance title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <label>Description</label>
              <textarea placeholder="Describe your grievance..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={4} style={{ width: '100%', padding: '10px 12px', margin: '6px 0 16px', border: '1px solid #dde1e7', borderRadius: '8px', fontSize: '14px', background: '#f9fafb', resize: 'vertical' }} />
              <label>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Academic</option><option>Hostel</option><option>Transport</option><option>Other</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ ...styles.btn, background: editId ? '#4f46e5' : '#10b981' }}>{editId ? 'Update' : 'Submit'}</button>
                {editId && <button type="button" onClick={() => { setEditId(null); setForm(initForm); }} style={{ ...styles.btn, background: '#6b7280' }}>Cancel</button>}
              </div>
            </form>
          </div>
          <div style={{ flex: 1 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by title..." style={{ flex: 1, padding: '10px 14px', border: '1px solid #dde1e7', borderRadius: '8px', fontSize: '14px' }} />
              <button type="submit" style={{ ...styles.btn, background: '#4f46e5' }}>Search</button>
              <button type="button" onClick={() => { setSearch(''); fetchGrievances(); }} style={{ ...styles.btn, background: '#6b7280' }}>Reset</button>
            </form>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 All Grievances ({grievances.length})</h3>
              {grievances.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}><div style={{ fontSize: '48px' }}>📭</div><p>No grievances found</p></div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {grievances.map(g => (
                    <div key={g._id} style={styles.grievanceCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px', color: '#1f2937' }}>{g.title}</span>
                            <span style={{ background: categoryColors[g.category] + '20', color: categoryColors[g.category], padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{g.category}</span>
                            <span style={{ background: g.status === 'Resolved' ? '#d1fae5' : '#fef3c7', color: g.status === 'Resolved' ? '#065f46' : '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{g.status}</span>
                          </div>
                          <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>{g.description}</p>
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>📅 {new Date(g.date).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
                          <button onClick={() => handleEdit(g)} style={{ background: '#ede9fe', color: '#4f46e5', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
                          <button onClick={() => handleDelete(g._id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Delete</button>
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

const styles = {
  nav: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '7px 16px', borderRadius: '8px', fontWeight: '600' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '24px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  statCard: { flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  grid: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', minWidth: '300px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '20px' },
  error: { background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  btn: { color: '#fff', padding: '10px 20px', fontWeight: '600', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  grievanceCard: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px', background: '#fafafa' }
};
