// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ui/Card.jsx
// White box with gold title bar.
// Used on every wizard step page.
// Props: title, icon, sub (subtitle), children
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Card({ title, icon, sub, children }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, padding: '20px 18px', boxShadow: '0 2px 12px rgba(15,25,35,.08)', animation: 'fu .3s both' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: '1.35rem' }}>{icon}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: '#a09890', marginTop: 1, fontFamily: "'DM Mono',monospace" }}>{sub}</div>}
        </div>
      </div>
      {/* Gold divider */}
      <div style={{ height: 2, background: 'linear-gradient(90deg,#b8862a,transparent)', borderRadius: 2, marginBottom: 18 }} />
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  )
}
