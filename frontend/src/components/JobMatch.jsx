import React, { useState } from 'react';
import axios from 'axios';
import MatchGraph from './MatchGraph.jsx';

const API = import.meta.env.VITE_API_URL || '';

export default function JobMatch() {
  const [form, setForm] = useState({ requiredSkills: '', minExperience: '', preferredSkills: '' });
  const [results, setResults] = useState([]);
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [questions, setQuestions] = useState({});
  const [qLoading, setQLoading] = useState('');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('savedCandidates') || '[]'));

  const handleMatch = async (e) => {
    e.preventDefault(); setLoading(true); setResults([]); setAiResult('');
    try {
      const res = await axios.post(`${API}/api/match`, {
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience),
        preferredSkills: form.preferredSkills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setResults(res.data);
    } catch (err) { alert(err.response?.data?.message || 'Match failed'); }
    finally { setLoading(false); }
  };

  const handleAIShortlist = async () => {
    setAiLoading(true); setAiResult('');
    try {
      const res = await axios.post(`${API}/api/ai/shortlist`, {
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minExperience: Number(form.minExperience),
        preferredSkills: form.preferredSkills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setAiResult(res.data.aiResult);
    } catch { alert('AI shortlisting failed'); }
    finally { setAiLoading(false); }
  };

  const handleInterviewQ = async (candidate) => {
    setQLoading(candidate._id);
    try {
      const res = await axios.post(`${API}/api/ai/interview-questions`, { skills: candidate.skills, name: candidate.name });
      setQuestions(prev => ({ ...prev, [candidate._id]: res.data.questions }));
    } catch { alert('Failed to generate questions'); }
    finally { setQLoading(''); }
  };

  const handleSave = (candidate) => {
    const existing = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    const alreadySaved = existing.find(c => c._id === candidate._id);
    let updated;
    if (alreadySaved) {
      updated = existing.filter(c => c._id !== candidate._id);
    } else {
      updated = [...existing, candidate];
    }
    localStorage.setItem('savedCandidates', JSON.stringify(updated));
    setSaved(updated);
  };

  const isSaved = (id) => saved.some(c => c._id === id);

  const rankColor = { High: '#10b981', Medium: '#d97706', Low: '#dc2626' };
  const rankBg = { High: '#f0fdf4', Medium: '#fffbeb', Low: '#fef2f2' };

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '20px' }}>🎯 Job Matching & Shortlisting</h2>

      <div style={s.grid}>
        {/* Form */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>📋 Job Requirements</h3>
          <form onSubmit={handleMatch}>
            <label style={s.label}>Required Skills <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma separated)</span></label>
            <input style={s.input} placeholder="e.g. React, Node.js" value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} required />
            <label style={s.label}>Minimum Experience (years)</label>
            <input style={s.input} type="number" min="0" placeholder="e.g. 1" value={form.minExperience} onChange={e => setForm({ ...form, minExperience: e.target.value })} required />
            <label style={s.label}>Preferred Skills <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
            <input style={s.input} placeholder="e.g. AWS, Docker" value={form.preferredSkills} onChange={e => setForm({ ...form, preferredSkills: e.target.value })} />
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? '⏳ Matching...' : '🔍 Find Matches'}
            </button>
            <button type="button" onClick={handleAIShortlist} style={s.aiBtn} disabled={aiLoading || !form.requiredSkills}>
              {aiLoading ? '🤖 Analyzing...' : '🤖 AI Shortlist'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div style={{ flex: 1 }}>
          {results.length > 0 && (
            <>
              {/* Stats row */}
              <div style={s.statsRow}>
                {['High', 'Medium', 'Low'].map(rank => (
                  <div key={rank} style={{ ...s.statCard, borderTop: `3px solid ${rankColor[rank]}` }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: rankColor[rank] }}>
                      {results.filter(r => r.rank === rank).length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{rank} Match</div>
                  </div>
                ))}
              </div>

              <div style={s.card}>
                <h3 style={s.cardTitle}>📊 Shortlisted Candidates ({results.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.map((c, i) => (
                    <div key={c._id} style={{ ...s.resultCard, borderLeft: `4px solid ${rankColor[c.rank]}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={s.rankBadge}>#{i + 1}</span>
                            <span style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>{c.name}</span>
                            <span style={{ background: rankBg[c.rank], color: rankColor[c.rank], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                              {c.rank} Match
                            </span>
                            <span style={{ background: '#ede9fe', color: '#6d28d9', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                              {c.matchScore}%
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>💼 {c.experience} yrs exp</span>
                            <span style={{ color: '#64748b', fontSize: '13px' }}>✅ Matched: <strong>{c.matchedSkills.join(', ') || 'None'}</strong></span>
                            {c.preferredMatched?.length > 0 && (
                              <span style={{ color: '#64748b', fontSize: '13px' }}>⭐ Preferred: {c.preferredMatched.join(', ')}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {c.skills.map(skill => (
                              <span key={skill} style={{
                                background: c.matchedSkills.includes(skill) ? '#d1fae5' : '#f1f5f9',
                                color: c.matchedSkills.includes(skill) ? '#065f46' : '#64748b',
                                padding: '2px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                              }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '10px' }}>
                          <button onClick={() => handleSave(c)} style={{
                            ...s.saveBtn,
                            background: isSaved(c._id) ? '#fef3c7' : '#f1f5f9',
                            color: isSaved(c._id) ? '#92400e' : '#64748b'
                          }}>
                            {isSaved(c._id) ? '⭐ Saved' : '☆ Save'}
                          </button>
                          <button onClick={() => handleInterviewQ(c)} style={s.qBtn} disabled={qLoading === c._id}>
                            {qLoading === c._id ? '...' : '🤖 Questions'}
                          </button>
                        </div>
                      </div>
                      {questions[c._id] && (
                        <div style={s.questions}
                          dangerouslySetInnerHTML={{ __html: questions[c._id]
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>') }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Graph */}
              <MatchGraph results={results} />
            </>
          )}

          {aiResult && (
            <div style={{ ...s.card, marginTop: '16px' }}>
              <h3 style={s.cardTitle}>🤖 AI Recommendation</h3>
              <div style={s.aiBox}
                dangerouslySetInnerHTML={{ __html: aiResult
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '• $1')
                  .replace(/\n/g, '<br/>') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  grid: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  card: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: '300px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' },
  input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '12px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '10px' },
  aiBtn: { width: '100%', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '12px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '16px' },
  statCard: { flex: 1, background: '#fff', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  resultCard: { border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fafafa' },
  rankBadge: { background: '#1e1b4b', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' },
  saveBtn: { border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  qBtn: { background: '#ede9fe', color: '#6d28d9', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
  questions: { marginTop: '12px', background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#374151', lineHeight: 1.6 },
  aiBox: { background: '#f0fdf4', padding: '16px', borderRadius: '10px', fontSize: '14px', color: '#1e293b', lineHeight: 1.7 }
};
