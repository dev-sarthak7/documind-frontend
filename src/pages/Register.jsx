import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import AnimatedBg from '../components/AnimatedBg';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <AnimatedBg />
      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1, animation: 'fadeIn 0.4s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={s.logoIcon}>
            <span style={{ fontSize: '24px' }}>🧠</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '500', letterSpacing: '-0.5px', marginBottom: '6px' }}>DocuMind</h1>
          <p style={{ fontSize: '13px', color: '#444' }}>Create your account</p>
        </div>

        <div style={s.glassCard}>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} placeholder="Sarthak"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ ...s.field, marginBottom: '1.5rem' }}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button style={{ ...s.primaryBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '13px', color: '#444' }}>
            Have an account? <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  logoIcon: { width: '52px', height: '52px', background: 'rgba(124,111,247,0.15)', border: '0.5px solid rgba(124,111,247,0.3)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  glassCard: { background: 'rgba(18,18,30,0.7)', backdropFilter: 'blur(20px)', border: '0.5px solid rgba(124,111,247,0.2)', borderRadius: '16px', padding: '2rem' },
  error: { background: 'rgba(255,107,107,0.1)', border: '0.5px solid rgba(255,107,107,0.3)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '13px' },
  field: { marginBottom: '1rem' },
  label: { fontSize: '11px', color: '#444', display: 'block', marginBottom: '6px', letterSpacing: '0.8px', textTransform: 'uppercase' },
  input: { width: '100%', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#f0f0f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  primaryBtn: { width: '100%', padding: '0.85rem', background: 'rgba(124,111,247,0.9)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
};