import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

const rankColors = { High: '#10b981', Medium: '#f59e0b', Low: '#ef4444' };

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>{d.name}</p>
        <p style={{ color: '#6366f1', fontSize: '13px' }}>Match Score: <strong>{d.matchScore}%</strong></p>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Experience: {d.experience} yrs</p>
        <p style={{ color: rankColors[d.rank], fontSize: '13px', fontWeight: '600' }}>{d.rank} Match</p>
      </div>
    );
  }
  return null;
};

export default function MatchGraph({ results }) {
  if (!results || results.length === 0) return null;

  const data = results.map(c => ({
    name: c.name.split(' ')[0],
    fullName: c.name,
    matchScore: c.matchScore,
    experience: c.experience,
    rank: c.rank
  }));

  return (
    <div style={s.card}>
      <h3 style={s.title}>📊 Match Score Graph</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: '#475569' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="matchScore" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={index} fill={rankColors[entry.rank]} />
            ))}
            <LabelList dataKey="matchScore" position="top" formatter={v => `${v}%`} style={{ fontSize: 12, fontWeight: 700, fill: '#1e293b' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={s.legend}>
        {Object.entries(rankColors).map(([rank, color]) => (
          <div key={rank} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: color }} />
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{rank} Match</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  card: { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginTop: '16px' },
  title: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  legend: { display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }
};
