// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ui/InfoBox.jsx
// Gold tip box used to explain info to user
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function InfoBox({ icon = 'ℹ', title, children }) {
  return (
    <div style={{ background: 'rgba(184,134,42,.07)', border: '1.5px solid rgba(184,134,42,.22)', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 11 }}>
      <span style={{ fontSize: '1.1rem', lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
      <div>
        {title && <div style={{ fontWeight: 700, color: '#b8862a', fontSize: 12, marginBottom: 4 }}>{title}</div>}
        <div style={{ color: '#0f1923', fontSize: 12, lineHeight: 1.6, fontFamily: "'DM Mono',monospace" }}>{children}</div>
      </div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StatBox — small number display card
// Props: label, value, color
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function StatBox({ label, value, color = '#b8862a' }) {
  return (
    <div style={{ background: '#ede8e0', border: '1.5px solid #c8c2b8', borderRadius: 8, padding: '10px 7px', textAlign: 'center' }}>
      <div style={{ fontWeight: 800, fontSize: 15, color }}>{value}</div>
      <div style={{ fontSize: 9, color: '#a09890', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.5px', fontFamily: "'DM Mono',monospace" }}>{label}</div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Grid helpers — 2-col and 4-col layouts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function Grid2({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div>
}

export function Grid4({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }}>{children}</div>
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Toast notification display
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const bg = t.type === 'success' ? '#f0fdf4' : t.type === 'error' ? '#fef2f2' : '#f0f9ff'
        const bd = t.type === 'success' ? '#86efac' : t.type === 'error' ? '#fca5a5' : '#7dd3fc'
        const tc = t.type === 'success' ? '#166534' : t.type === 'error' ? '#991b1b' : '#075985'
        return (
          <div key={t.id} style={{ background: bg, border: `1.5px solid ${bd}`, borderRadius: 8, padding: '9px 14px', fontSize: 12, fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,.12)', color: tc, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{t.type === 'success' ? '✓' : 'ℹ'}</span>
            {t.msg}
          </div>
        )
      })}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EmptyTab — shown when no plan generated yet
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function EmptyTab({ children }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, padding: '48px 20px', textAlign: 'center', color: '#a09890', fontSize: 12, boxShadow: '0 2px 12px rgba(15,25,35,.08)', fontFamily: "'DM Mono',monospace" }}>
      {children}
    </div>
  )
}
