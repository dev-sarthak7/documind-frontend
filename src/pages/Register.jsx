import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/register', form);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>DocuMind</h1>
        <p style={styles.subtitle}>Create your account</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Full Name"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Password (min 6 chars)"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.link}>Have an account? <Link to="/login" style={{color:'#7c6ff7'}}>Sign in</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0f0f0f' },
  card: { background:'#1a1a1a', padding:'2.5rem', borderRadius:'16px', width:'100%', maxWidth:'400px', border:'1px solid #2a2a2a' },
  logo: { fontSize:'2rem', fontWeight:'700', color:'#7c6ff7', marginBottom:'0.5rem' },
  subtitle: { color:'#666', marginBottom:'2rem' },
  error: { background:'#2a1a1a', color:'#ff6b6b', padding:'0.75rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.9rem' },
  form: { display:'flex', flexDirection:'column', gap:'1rem' },
  input: { background:'#0f0f0f', border:'1px solid #2a2a2a', borderRadius:'8px', padding:'0.75rem 1rem', color:'#f0f0f0', fontSize:'1rem', outline:'none' },
  button: { background:'#7c6ff7', color:'white', border:'none', borderRadius:'8px', padding:'0.85rem', fontSize:'1rem', fontWeight:'600', cursor:'pointer' },
  link: { textAlign:'center', marginTop:'1.5rem', color:'#666', fontSize:'0.9rem' },
};