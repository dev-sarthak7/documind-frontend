import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AnimatedBg from '../components/AnimatedBg';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/api/upload/documents');
      setDocuments(res.data.documents);
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      alert('Only PDF and TXT files are supported'); return;
    }
    setUploading(true);
    try {
      const { data } = await api.post('/api/upload/presigned-url', {
        fileName: file.name, fileType: file.type, fileSize: file.size,
      });
      await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      await api.post('/api/upload/confirm', { documentId: data.documentId });
      await fetchDocuments();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally { setUploading(false); }
  };

  const statusColor = { uploaded: '#f0a500', processing: '#7c6ff7', ready: '#4caf50', failed: '#ff6b6b' };
  const readyCount = documents.filter(d => d.status === 'ready').length;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <nav style={s.nav}>
          <div style={s.logo}>
            <div style={s.logoIcon}>🧠</div>
            DocuMind
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#444' }}>{user?.name}</span>
            <button style={s.btn} onClick={() => { logout(); navigate('/login'); }}>
              Logout
            </button>
          </div>
        </nav>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
            {[
              [documents.length, 'Total docs', '#a78bfa'],
              [readyCount, 'Ready to chat', '#4caf50'],
              [documents.filter(d => d.status === 'processing').length, 'Processing', '#7c6ff7'],
            ].map(([n, label, color]) => (
              <div key={label} style={s.statCard}>
                <div style={{ fontSize: '11px', color: '#444', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                <div style={{ fontSize: '26px', fontWeight: '500', color }}>{n}</div>
              </div>
            ))}
          </div>

          <div
            style={{ ...s.glassCard, padding: '2.5rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer', borderColor: dragOver ? 'rgba(124,111,247,0.6)' : 'rgba(124,111,247,0.2)', borderStyle: 'dashed' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            {uploading ? (
              <>
                <div style={{ fontSize: '32px', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</div>
                <p style={{ color: '#a78bfa', fontSize: '14px' }}>Uploading...</p>
              </>
            ) : (
              <>
                <div style={s.uploadIcon}>⬆</div>
                <p style={{ fontSize: '14px', color: '#ccc', marginBottom: '4px' }}>Drop a PDF or TXT file here</p>
                <p style={{ fontSize: '12px', color: '#444' }}>or <span style={{ color: '#a78bfa' }}>browse files</span> — AI processes for instant Q&A</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
                  {['PDF', 'TXT', 'Max 10MB'].map(t => (
                    <span key={t} style={s.fileBadge}>{t}</span>
                  ))}
                </div>
              </>
            )}
            <input id="fileInput" type="file" accept=".pdf,.txt" style={{ display: 'none' }}
              onChange={e => handleFileUpload(e.target.files[0])} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#ccc' }}>
              Your documents <span style={{ color: '#333', fontWeight: '400' }}>({documents.length})</span>
            </h2>
          </div>

          {documents.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#333', padding: '3rem' }}>No documents yet. Upload one to get started.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: '10px' }}>
              {documents.map(doc => (
                <div key={doc._id} style={s.docCard}
                  onClick={() => doc.status === 'ready' && navigate(`/chat/${doc._id}`)}>
                  <div style={{ ...s.docIcon, borderColor: `${statusColor[doc.status] || '#333'}44` }}>
                    <span style={{ fontSize: '18px', display: 'inline-block', animation: doc.status === 'processing' ? 'spin 2s linear infinite' : 'none' }}>
                      {doc.status === 'ready' ? '📄' : doc.status === 'processing' ? '⟳' : doc.status === 'failed' ? '✗' : '⏳'}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#bbb', marginBottom: '0.6rem', wordBreak: 'break-word', lineHeight: '1.4' }}>{doc.fileName}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor[doc.status] || '#666', display: 'inline-block', animation: doc.status === 'processing' ? 'pulse 1.5s ease-in-out infinite' : 'none' }}></span>
                    <span style={{ fontSize: '11px', color: statusColor[doc.status] || '#666' }}>{doc.status}</span>
                  </div>
                  {doc.status === 'ready' && (
                    <p style={{ marginTop: '6px', fontSize: '11px', color: '#7c6ff7' }}>Click to chat →</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const s = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(8,8,16,0.6)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 10 },
  logo: { fontSize: '1.2rem', fontWeight: '500', color: '#f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { width: '30px', height: '30px', background: 'rgba(124,111,247,0.15)', border: '0.5px solid rgba(124,111,247,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' },
  btn: { padding: '0.4rem 0.9rem', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#888', fontFamily: 'inherit', transition: 'all 0.2s' },
  statCard: { background: 'rgba(18,18,30,0.6)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' },
  glassCard: { background: 'rgba(18,18,30,0.7)', backdropFilter: 'blur(20px)', border: '0.5px solid rgba(124,111,247,0.2)', borderRadius: '16px' },
  uploadIcon: { width: '48px', height: '48px', background: 'rgba(124,111,247,0.1)', border: '0.5px solid rgba(124,111,247,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '20px' },
  fileBadge: { padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.06)', fontSize: '11px', color: '#444' },
  docCard: { background: 'rgba(18,18,30,0.6)', backdropFilter: 'blur(10px)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' },
  docIcon: { width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' },
};