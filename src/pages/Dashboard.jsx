import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Upload, FileText, LogOut, Loader } from 'lucide-react';

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
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF and TXT files are supported');
      return;
    }

    setUploading(true);
    try {
      // 1. Get presigned URL
      const { data } = await api.post('/api/upload/presigned-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // 2. Upload directly to S3
      await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // 3. Confirm upload and trigger processing
      await api.post('/api/upload/confirm', { documentId: data.documentId });

      await fetchDocuments();
      alert('Document uploaded! Processing will complete shortly.');
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const statusColor = (status) => ({
    uploaded: '#f0a500', processing: '#7c6ff7',
    ready: '#4caf50', failed: '#ff6b6b'
  }[status] || '#666');

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>DocuMind</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {/* Upload Zone */}
        <div
          style={{...styles.uploadZone, borderColor: dragOver ? '#7c6ff7' : '#2a2a2a'}}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          {uploading ? (
            <><Loader size={32} style={{color:'#7c6ff7', animation:'spin 1s linear infinite'}} />
            <p style={styles.uploadText}>Uploading...</p></>
          ) : (
            <><Upload size={32} style={{color:'#7c6ff7'}} />
            <p style={styles.uploadText}>Drop a PDF or TXT file here, or click to browse</p>
            <p style={styles.uploadSubtext}>Files are processed with AI for instant Q&A</p></>
          )}
          <input id="fileInput" type="file" accept=".pdf,.txt"
            style={{display:'none'}} onChange={e => handleFileUpload(e.target.files[0])} />
        </div>

        {/* Documents List */}
        <h2 style={styles.sectionTitle}>Your Documents ({documents.length})</h2>
        {documents.length === 0 ? (
          <p style={styles.emptyText}>No documents yet. Upload one to get started.</p>
        ) : (
          <div style={styles.docGrid}>
            {documents.map(doc => (
              <div key={doc._id} style={styles.docCard}
                onClick={() => doc.status === 'ready' && navigate(`/chat/${doc._id}`)}>
                <FileText size={24} style={{color:'#7c6ff7', marginBottom:'0.75rem'}} />
                <p style={styles.docName}>{doc.fileName}</p>
                <span style={{...styles.statusBadge, background: statusColor(doc.status) + '22', color: statusColor(doc.status)}}>
                  {doc.status}
                </span>
                {doc.status === 'ready' && <p style={styles.clickHint}>Click to chat →</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#0f0f0f' },
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #1a1a1a', background:'#0f0f0f', position:'sticky', top:0, zIndex:10 },
  logo: { fontSize:'1.5rem', fontWeight:'700', color:'#7c6ff7' },
  navRight: { display:'flex', alignItems:'center', gap:'1rem' },
  userName: { color:'#888', fontSize:'0.9rem' },
  logoutBtn: { display:'flex', alignItems:'center', gap:'0.4rem', background:'transparent', border:'1px solid #2a2a2a', color:'#888', padding:'0.4rem 0.8rem', borderRadius:'8px', cursor:'pointer', fontSize:'0.85rem' },
  main: { maxWidth:'900px', margin:'0 auto', padding:'2rem' },
  uploadZone: { border:'2px dashed', borderRadius:'16px', padding:'3rem', textAlign:'center', cursor:'pointer', marginBottom:'2.5rem', transition:'border-color 0.2s' },
  uploadText: { marginTop:'1rem', fontSize:'1rem', color:'#ccc' },
  uploadSubtext: { marginTop:'0.5rem', fontSize:'0.85rem', color:'#555' },
  sectionTitle: { fontSize:'1.2rem', fontWeight:'600', marginBottom:'1rem', color:'#f0f0f0' },
  emptyText: { color:'#555', textAlign:'center', padding:'2rem' },
  docGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem' },
  docCard: { background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'12px', padding:'1.25rem', cursor:'pointer', transition:'border-color 0.2s' },
  docName: { fontSize:'0.9rem', color:'#ccc', marginBottom:'0.75rem', wordBreak:'break-word' },
  statusBadge: { display:'inline-block', padding:'0.2rem 0.6rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'600' },
  clickHint: { marginTop:'0.75rem', fontSize:'0.8rem', color:'#7c6ff7' },
};