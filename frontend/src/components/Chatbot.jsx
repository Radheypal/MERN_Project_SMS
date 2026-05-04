import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I\'m your Grievance Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/chat`, { message: userMsg });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={s.wrapper}>
      {/* Chat Window */}
      {open && (
        <div style={s.window}>
          <div style={s.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={s.botAvatar}>🤖</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>Grievance Assistant</div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={s.closeBtn}>✕</button>
          </div>

          <div style={s.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                {msg.from === 'bot' && <div style={s.botIcon}>🤖</div>}
                <div style={msg.from === 'user' ? s.userBubble : s.botBubble}
                  dangerouslySetInnerHTML={{ __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '• $1')
                    .replace(/\n/g, '<br/>') }} />
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={s.botIcon}>🤖</div>
                <div style={s.botBubble}>
                  <span style={s.typing}>● ● ●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} style={s.inputRow}>
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              style={s.input} disabled={loading} />
            <button type="submit" style={s.sendBtn} disabled={loading}>➤</button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)} style={s.fab}>
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}

const s = {
  wrapper: { position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 },
  fab: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '24px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  window: { position: 'absolute', bottom: '70px', right: '0', width: '340px', background: '#fff', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  botAvatar: { width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  closeBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '12px' },
  messages: { height: '320px', overflowY: 'auto', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column' },
  botIcon: { width: '28px', height: '28px', background: '#ede9fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '8px', flexShrink: 0 },
  botBubble: { background: '#fff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', fontSize: '13px', color: '#1e293b', maxWidth: '240px', lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  userBubble: { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: '13px', maxWidth: '240px', lineHeight: 1.5 },
  typing: { color: '#94a3b8', letterSpacing: '2px', fontSize: '16px' },
  inputRow: { display: 'flex', padding: '12px', borderTop: '1px solid #f1f5f9', gap: '8px', background: '#fff' },
  input: { flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '24px', fontSize: '13px', outline: 'none', background: '#f8fafc' },
  sendBtn: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};
