import React, { useState, useEffect } from 'react';

const rankColors = { High: '#10b981', Medium: '#f59e0b', Low: '#ef4444' };
const rankBg = { High: '#f0fdf4', Medium: '#fffbeb', Low: '#fef2f2' };

export default function SavedCandidates() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    setSaved(data);
  }, []);

  const handleRemove = (id) => {
    const updated = saved.filter(c => c._id !== id);
    localStorage.setItem('savedCandidates', JSON.stringify(updated));
    setSaved(updated);
  };

  const handleClear = () => {
    localStorage.removeItem('savedCandidates');
    setSaved([]);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>
          ⭐ Saved Candidates <span style={s.badge}>{saved.length}</span>
        </h2>
        {saved.length > 0 && (
          <button onClick={handleClear} style={s.clearBtn}>🗑️ Clear All</button>
        )}
      </div>

      {saved.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: '56px' }}>⭐</div>
          <p style={{ fontSize: '16px', fontWeight: '600', marginTop: '12px' }}>No saved candidates</p>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Go to Job Match and save shortlisted candidates</p>
        </div>
      ) : (
        <div style={s.grid}>
          {saved.map(c => (
            <div key={c._id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={s.avatar}>{c.name.charAt(0).toUpperCase()}</div>
                <button onClick={() => handleRemove(c._id)} style={s.removeBtn}>✕</button>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '12px 0 4px' }}>{c.name}</h3>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '10px' }}>{c.email}</p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: rankBg[c.rank], color: rankColors[c.rank], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  {c.rank} Match
                </span>
                <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                  {c.matchScore}%
                </span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  💼 {c.experience} yrs
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {c.skills?.map(skill => (
                  <span key={skill} style={s.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  badge: { background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: '20px', fontSize: '13px', marginLeft: '8px' },
  clearBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '60px', color: '#94a3b8', background: '#fff', borderRadius: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  avatar: { width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' },
  removeBtn: { background: '#f1f5f9', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px', color: '#64748b' },
  skillTag: { background: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }
};
