import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AnimatedBg from '../components/AnimatedBg';

export default function Chat() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => { fetchDocument(); fetchHistory(); }, [documentId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchDocument = async () => {
    const res = await api.get(`/api/documents/${documentId}`);
    setDocument(res.data.document);
  };

  const fetchHistory = async () => {
    const res = await api.get(`/api/chat/history/${documentId}`);
    setMessages(res.data.messages || []);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const res = await api.post('/api/chat/message', { documentId, question });
      setMessages(prev => [...prev, { role: 'model', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Error: ' + (err.response?.data?.error || 'Something went wrong') }]);
    } finally { setLoading(false); }
  };

  const getSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.get(`/api/chat/summary/${documentId}`);
      setSummary(res.data.summary);
    } catch { alert('Failed to get summary'); }
    finally { setLoadingSummary(false); }
  };

  const suggestions = ['What is the main topic?', 'Summarize key points', 'What are the conclusions?'];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        <nav style={s.nav}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button style={s.btn} onClick={() => navigate('/dashboard')}>← Back</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', color: '#bbb' }}>{document?.fileName}</span>
              <span style={s.readyBadge}>ready</span>
            </div>
          </div>
          <button style={{ ...s.btn, color: '#a78bfa', borderColor: 'rgba(124,111,247,0.3)' }}
            onClick={getSummary} disabled={loadingSummary}>
            {loadingSummary ? '...' : '✦ Summary'}
          </button>
        </nav>

        {summary && (
          <div style={s.summaryPanel}>
            <p style={{ fontSize: '11px', color: '#a78bfa', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</p>
            <p style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.6' }}>{summary}</p>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', margin: 'auto', animation: 'fadeIn 0.4s ease' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🧠</div>
              <p style={{ color: '#555', fontSize: '14px', marginBottom: '1rem' }}>
                Ask anything about <strong style={{ color: '#a78bfa' }}>{document?.fileName}</strong>
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {suggestions.map(q => (
                  <button key={q} style={s.chip} onClick={() => { setInput(q); inputRef.current?.focus(); }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeIn 0.3s ease' }}>
              {msg.role === 'model' && (
                <div style={s.aiAvatar}>🧠</div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{ fontSize: '10px', color: '#333', marginBottom: '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.role === 'user' ? 'You' : <span style={{ color: '#a78bfa' }}>DocuMind</span>}
                </div>
                <div style={msg.role === 'user' ? s.userBubble : s.aiBubble}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
              <div style={s.aiAvatar}>🧠</div>
              <div style={s.aiBubble}>
                <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7c6ff7', display: 'inline-block', animation: `dots 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          )}

          {messages.length > 0 && !loading && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingLeft: '38px' }}>
              {suggestions.map(q => (
                <button key={q} style={s.chip} onClick={() => { setInput(q); inputRef.current?.focus(); }}>{q}</button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{ padding: '1rem 1.25rem', borderTop: '0.5px solid rgba(255,255,255,0.04)' }}>
          <div style={s.glassInput}>
            <textarea
              ref={inputRef}
              style={s.textarea}
              placeholder="Ask a question about this document..."
              value={input}
              rows={1}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '0.5px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '11px', color: '#2a2a3a' }}>↵ Enter to send · Shift+Enter for new line</span>
              <button style={s.sendBtn} onClick={sendMessage} disabled={loading || !input.trim()}>
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(8,8,16,0.6)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.05)' },
  btn: { padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#888', fontFamily: 'inherit', transition: 'all 0.2s' },
  readyBadge: { padding: '2px 8px', background: 'rgba(76,175,80,0.1)', color: '#4caf50', borderRadius: '20px', fontSize: '10px', border: '0.5px solid rgba(76,175,80,0.2)' },
  summaryPanel: { background: 'rgba(18,18,30,0.7)', backdropFilter: 'blur(10px)', borderBottom: '0.5px solid rgba(255,255,255,0.05)', padding: '1.25rem 1.5rem', maxHeight: '180px', overflowY: 'auto' },
  aiAvatar: { width: '28px', height: '28px', background: 'rgba(124,111,247,0.15)', border: '0.5px solid rgba(124,111,247,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0, marginTop: '2px', marginRight: '10px' },
  userBubble: { background: 'rgba(124,111,247,0.25)', border: '0.5px solid rgba(124,111,247,0.3)', borderRadius: '12px', borderBottomRightRadius: '3px', padding: '0.75rem 1rem', fontSize: '13px', color: '#ddd', lineHeight: '1.6' },
  aiBubble: { background: 'rgba(18,18,30,0.7)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: '12px', borderTopLeftRadius: '3px', padding: '0.75rem 1rem', fontSize: '13px', color: '#ccc', lineHeight: '1.6' },
  chip: { padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '11px', color: '#a78bfa', border: '0.5px solid rgba(124,111,247,0.3)', background: 'rgba(124,111,247,0.08)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  glassInput: { background: 'rgba(18,18,30,0.7)', backdropFilter: 'blur(20px)', border: '0.5px solid rgba(124,111,247,0.2)', borderRadius: '14px', padding: '1rem 1.25rem' },
  textarea: { width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#f0f0f0', fontSize: '14px', fontFamily: 'inherit', resize: 'none', lineHeight: '1.5' },
  sendBtn: { width: '34px', height: '34px', background: 'rgba(124,111,247,0.9)', border: 'none', borderRadius: '10px', cursor: 'pointer', color: 'white', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
};