import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || '';

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchCandidates = async (q = '') => {
    const res = await axios.get(`${API}/api/candidates${q ? `?search=${q}` : ''}`);
    setCandidates(res.data);
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this candidate?')) return;
    await axios.delete(`${API}/api/candidates/${id}`);
    fetchCandidates(search);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>👥 All Candidates <span style={s.badge}>{candidates.length}</span></h2>
        <button onClick={() => navigate('/add')} style={s.addBtn}>➕ Add Candidate</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or skill..."
          style={s.searchInput}
          onKeyDown={e => e.key === 'Enter' && fetchCandidates(search)} />
        <button onClick={() => fetchCandidates(search)} style={s.searchBtn}>Search</button>
        <button onClick={() => { setSearch(''); fetchCandidates(); }} style={s.resetBtn}>Reset</button>
      </div>

      {candidates.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '56px' }}>📭</div>
          <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '12px' }}>No candidates found</p>
          <button onClick={() => navigate('/add')} style={{ ...s.addBtn, marginTop: '16px' }}>Add First Candidate</button>
        </div>
      ) : (
        <div style={s.grid}>
          {candidates.map(c => (
            <div key={c._id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={s.avatar}>{c.name.charAt(0).toUpperCase()}</div>
                <button onClick={() => handleDelete(c._id)} style={s.deleteBtn}>🗑️</button>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '12px 0 4px' }}>{c.name}</h3>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{c.email}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={s.expBadge}>💼 {c.experience} yr{c.experience !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {c.skills.map(skill => (
                  <span key={skill} style={s.skillTag}>{skill}</span>
                ))}
              </div>
              {c.bio && <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px', lineHeight: 1.5 }}>{c.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  badge: { background: '#ede9fe', color: '#6d28d9', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', marginLeft: '8px' },
  addBtn: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' },
  searchInput: { flex: 1, padding: '11px 16px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' },
  searchBtn: { background: '#6366f1', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  resetBtn: { background: '#94a3b8', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '60px', color: '#94a3b8', background: '#fff', borderRadius: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  avatar: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' },
  deleteBtn: { background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  expBadge: { background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  skillTag: { background: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }
};
