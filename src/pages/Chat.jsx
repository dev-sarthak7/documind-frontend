import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Send, ArrowLeft, Loader, FileText } from 'lucide-react';

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

  useEffect(() => {
    fetchDocument();
    fetchHistory();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    } finally {
      setLoading(false);
    }
  };

  const getSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.get(`/api/chat/summary/${documentId}`);
      setSummary(res.data.summary);
    } catch (err) { alert('Failed to get summary'); }
    finally { setLoadingSummary(false); }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={styles.docInfo}>
          <FileText size={18} style={{color:'#7c6ff7'}} />
          <span style={styles.docName}>{document?.fileName}</span>
        </div>
        <button style={styles.summaryBtn} onClick={getSummary} disabled={loadingSummary}>
          {loadingSummary ? 'Summarizing...' : 'Get Summary'}
        </button>
      </div>

      {/* Summary Panel */}
      {summary && (
        <div style={styles.summaryPanel}>
          <h3 style={styles.summaryTitle}>Document Summary</h3>
          <p style={styles.summaryText}>{summary}</p>
        </div>
      )}

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyChat}>
            <p>Ask anything about <strong>{document?.fileName}</strong></p>
            <p style={{marginTop:'0.5rem', color:'#555', fontSize:'0.9rem'}}>e.g. "What is the main topic?", "Summarize section 2"</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{...styles.message, ...(msg.role === 'user' ? styles.userMessage : styles.aiMessage)}}>
            <div style={styles.messageRole}>{msg.role === 'user' ? 'You' : 'DocuMind'}</div>
            <div style={styles.messageContent}>{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{...styles.message, ...styles.aiMessage}}>
            <div style={styles.messageRole}>DocuMind</div>
            <Loader size={16} style={{color:'#7c6ff7'}} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input style={styles.input} placeholder="Ask a question about this document..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()} />
        <button style={styles.sendBtn} onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', flexDirection:'column', height:'100vh', background:'#0f0f0f' },
  header: { display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.5rem', borderBottom:'1px solid #1a1a1a', background:'#0f0f0f' },
  backBtn: { display:'flex', alignItems:'center', gap:'0.4rem', background:'transparent', border:'1px solid #2a2a2a', color:'#888', padding:'0.4rem 0.8rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem' },
  docInfo: { display:'flex', alignItems:'center', gap:'0.5rem', flex:1 },
  docName: { color:'#ccc', fontSize:'0.95rem', fontWeight:'500' },
  summaryBtn: { background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#7c6ff7', padding:'0.4rem 0.9rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem' },
  summaryPanel: { background:'#1a1a1a', borderBottom:'1px solid #2a2a2a', padding:'1.25rem 1.5rem', maxHeight:'200px', overflowY:'auto' },
  summaryTitle: { color:'#7c6ff7', fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.5rem' },
  summaryText: { color:'#ccc', fontSize:'0.9rem', lineHeight:'1.6' },
  messages: { flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  emptyChat: { textAlign:'center', margin:'auto', color:'#888' },
  message: { maxWidth:'75%', padding:'0.85rem 1rem', borderRadius:'12px' },
  userMessage: { alignSelf:'flex-end', background:'#7c6ff7', color:'white' },
  aiMessage: { alignSelf:'flex-start', background:'#1a1a1a', border:'1px solid #2a2a2a' },
  messageRole: { fontSize:'0.75rem', fontWeight:'600', marginBottom:'0.35rem', opacity:0.7 },
  messageContent: { fontSize:'0.95rem', lineHeight:'1.6' },
  inputArea: { display:'flex', gap:'0.75rem', padding:'1rem 1.5rem', borderTop:'1px solid #1a1a1a', background:'#0f0f0f' },
  input: { flex:1, background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'10px', padding:'0.75rem 1rem', color:'#f0f0f0', fontSize:'0.95rem', outline:'none' },
  sendBtn: { background:'#7c6ff7', border:'none', borderRadius:'10px', padding:'0.75rem 1rem', color:'white', cursor:'pointer', display:'flex', alignItems:'center' },
};