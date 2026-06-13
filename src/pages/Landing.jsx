import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mouse parallax for glows
    const handleMouseMove = (e) => {
      const glows = document.querySelectorAll('.glow-effect');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      glows.forEach(glow => {
        glow.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist:wght@700&family=JetBrains+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .glass-card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid transparent; border-image: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)) 1; transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .glass-card:hover { border-image: linear-gradient(135deg, rgba(124,111,247,0.4), rgba(124,111,247,0.1)) 1; transform: translateY(-4px); }
        .glow-effect { position: absolute; background: radial-gradient(circle at center, rgba(124,111,247,0.15), transparent 70%); pointer-events: none; }
        .ai-pulse { animation: lpulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes lpulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24; font-family: 'Material Symbols Outlined'; }
        .landing * { box-sizing: border-box; }
        .landing a { text-decoration: none; }
      `}</style>

      <div className="landing" style={{ background: '#080810', color: '#e4e1ed', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>

        {/* Nav */}
        <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(19,19,27,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '80px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>DocuMind</div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {['Features', 'How it Works', 'Pricing'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '16px', color: '#c8c4d6' }}>{item}</a>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={() => navigate('/login')} style={{ color: '#c6c0ff', fontWeight: '700', padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>
                Sign In
              </button>
              <button onClick={() => navigate('/register')} style={{ background: '#8b80ff', color: '#2700a1', fontWeight: '700', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 0 20px rgba(124,111,247,0.3)' }}>
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <main style={{ paddingTop: '128px' }}>

          {/* Hero */}
          <section style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '64px 24px', overflow: 'hidden' }}>
            <div className="glow-effect" style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(198,192,255,0.2)', background: 'rgba(198,192,255,0.05)', width: 'fit-content' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c6c0ff' }} className="ai-pulse" />
                  <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: '#c6c0ff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>New: RAG-powered Intelligence</span>
                </div>
                <h1 style={{ fontSize: '48px', lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700', fontFamily: 'Geist, sans-serif', color: '#e4e1ed', maxWidth: '560px' }}>
                  Your documents, <span style={{ color: '#c6c0ff', fontStyle: 'italic' }}>now with a brain.</span>
                </h1>
                <p style={{ fontSize: '18px', lineHeight: '28px', color: '#c8c4d6', maxWidth: '448px' }}>
                  Transform PDFs and reports into interactive conversations with DocuMind's RAG-powered intelligence.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/register')} style={{ background: '#7c6ff7', color: 'white', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '16px', boxShadow: '0 0 30px rgba(124,111,247,0.4)' }}>
                    Get Started for Free
                  </button>
                  <button className="glass-card" style={{ color: '#e4e1ed', padding: '16px 32px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined">play_circle</span> Watch Demo
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(to right, rgba(124,111,247,0.2), rgba(198,191,255,0.2))', borderRadius: '16px', filter: 'blur(32px)', opacity: 0.5 }} />
                <div className="glass-card" style={{ borderRadius: '16px', padding: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6v_HwSBpnNkUNVZu2E0SYOVtUHZ8KKIbI96mOHgpMkGdJFmvqzD2EplGcLFjhs-yL73W5gzy8IRQzjp5d4aerZmgjolvTiAP1LOAzGaXqf39FZR_P2fadcyaQr8JysudvIOsSPK5WS21kh3Sfj_2Wgvg4w7TIzCxg3u-iQvhF6KWNfgSuPn4oLgnRgdlfxiVjjKpzkeYzZBtqyoHd132QRKzbgR03YvCOWv4Q4T6x57sUK195t2mds-OaxYFKHdWrHlPPlOVTUPQ" alt="DocuMind Dashboard" style={{ borderRadius: '12px', width: '100%', opacity: 0.9 }} />
                  <div className="glass-card" style={{ position: 'absolute', bottom: '40px', left: '40px', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#c6c0ff' }}>verified</span>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '13px' }}>Indexing Complete</p>
                      <p style={{ color: '#c8c4d6', fontSize: '12px' }}>2,481 chunks processed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#e4e1ed', marginBottom: '8px', fontFamily: 'Geist, sans-serif' }}>Engineered for deep document understanding</h2>
              <p style={{ fontSize: '16px', color: '#c8c4d6' }}>Technical precision for document intelligence.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {[
                ['upload_file', 'Upload PDFs', 'Bulk processing with high-speed indexing. Supports scanned documents with advanced OCR.'],
                ['forum', 'Ask Questions', 'Context-aware natural language chat. It knows your data like you do, but faster.'],
                ['summarize', 'Get Summaries', 'Instant TL;DR for any length. Extract key takeaways from 500-page reports in seconds.'],
                ['manage_search', 'RAG-powered Search', 'Semantic retrieval across your entire library. Find concepts, not just keywords.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="glass-card" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(198,192,255,0.1)', border: '1px solid rgba(198,192,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c6c0ff' }}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>{title}</h3>
                  <p style={{ fontSize: '16px', color: '#c8c4d6', lineHeight: '24px' }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it Works */}
          <section id="how-it-works" style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
            <div className="glow-effect" style={{ top: '50%', left: 0, width: '100%', height: '50%', opacity: 0.2 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: '#c6c0ff', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Workflow</span>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>Three steps to clarity</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '64px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'linear-gradient(to right, transparent, rgba(198,192,255,0.3), transparent)' }} />
                {[['1', 'Connect', 'Securely upload your PDFs, DOCX, or text files to our encrypted sandbox.'],
                  ['2', 'Index', 'AI vectorizes and understands the structure and semantics of your data.'],
                  ['3', 'Chat', 'Start asking questions and getting cited answers instantly.']
                ].map(([num, title, desc]) => (
                  <div key={num} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div className="glass-card" style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid rgba(198,192,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c6c0ff', fontWeight: '700', fontSize: '20px', position: 'relative', zIndex: 1 }}>
                      {num}
                    </div>
                    <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>{title}</h4>
                    <p style={{ fontSize: '16px', color: '#c8c4d6', lineHeight: '24px' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
            <div className="glass-card" style={{ borderRadius: '32px', padding: '96px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div className="glow-effect" style={{ top: '-50%', left: '-50%', width: '100%', height: '100%', opacity: 0.3 }} />
              <div className="glow-effect" style={{ bottom: '-50%', right: '-50%', width: '100%', height: '100%', opacity: 0.3 }} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '672px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
                <h2 style={{ fontSize: '48px', lineHeight: '56px', fontWeight: '700', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>Ready to unlock your data's potential?</h2>
                <p style={{ fontSize: '18px', color: '#c8c4d6', lineHeight: '28px' }}>Join thousands of researchers, lawyers, and developers who trust DocuMind.</p>
                <button onClick={() => navigate('/register')} style={{ background: '#7c6ff7', color: 'white', padding: '20px 64px', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '18px', boxShadow: '0 0 40px rgba(124,111,247,0.5)' }}>
                  Get Started Now
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{ padding: '64px 0', background: '#0d0d16', borderTop: '1px solid rgba(71,69,84,0.2)', marginTop: '64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '24px', maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#e4e1ed', fontFamily: 'Geist, sans-serif' }}>DocuMind</div>
              <p style={{ fontSize: '16px', color: '#c8c4d6', opacity: 0.8 }}>Empowering human intelligence with technical document RAG.</p>
            </div>
            {[['Product', ['Features', 'How it Works', 'Pricing']], ['Company', ['About Us', 'Contact', 'Privacy Policy']]].map(([heading, links]) => (
              <div key={heading} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: '#c6c0ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{heading}</span>
                {links.map(link => <a key={link} href="#" style={{ fontSize: '16px', color: '#c8c4d6', opacity: 0.8 }}>{link}</a>)}
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono', color: '#c6c0ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Connect</span>
              <a href="https://github.com/dev-sarthak7" style={{ fontSize: '16px', color: '#c8c4d6', opacity: 0.8 }}>GitHub</a>
              <a href="https://linkedin.com" style={{ fontSize: '16px', color: '#c8c4d6', opacity: 0.8 }}>LinkedIn</a>
            </div>
          </div>
          <div style={{ maxWidth: '1280px', margin: '32px auto 0', padding: '16px 24px 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#c8c4d6', opacity: 0.6 }}>
            <span>© 2026 DocuMind. Built by Sarthak Satish Borekar.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}