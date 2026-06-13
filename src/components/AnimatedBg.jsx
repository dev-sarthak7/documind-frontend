export default function AnimatedBg() {
  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      zIndex: 0, pointerEvents: 'none'
    }}>
      {[
        { w: 400, h: 400, color: '#7c6ff7', top: '-100px', left: '-100px', anim: 'flow1 8s ease-in-out infinite' },
        { w: 350, h: 350, color: '#a855f7', bottom: '-80px', right: '-80px', anim: 'flow2 10s ease-in-out infinite' },
        { w: 250, h: 250, color: '#6366f1', top: '40%', left: '50%', anim: 'flow3 12s ease-in-out infinite' },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: b.w, height: b.h,
          background: b.color,
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.2,
          top: b.top, left: b.left,
          bottom: b.bottom, right: b.right,
          animation: b.anim,
        }} />
      ))}
    </div>
  );
}