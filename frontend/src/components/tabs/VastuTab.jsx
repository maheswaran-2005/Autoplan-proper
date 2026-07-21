// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/tabs/VastuTab.jsx
// Shows vastu score + room-by-room analysis
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { VASTU_COLORS, countVastu, overallScore } from '../../utils/vastuEngine.js'

export default function VastuTab({ layout }) {
  const rooms = layout.rooms
  const cnt   = countVastu(rooms)
  const score = overallScore(rooms)
  const sc    = score >= 80 ? '#16a34a' : score >= 60 ? '#65a30d' : score >= 40 ? '#ca8a04' : '#dc2626'

  return (
    <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,25,35,.08)' }}>

      {/* Score header */}
      <div style={{ padding: 14, borderBottom: '1px solid #c8c2b8', background: '#ede8e0', display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 34, color: sc, lineHeight: 1 }}>{score}%</div>
          <div style={{ fontSize: 10, color: sc, fontWeight: 700, marginTop: 2 }}>Vastu Score</div>
        </div>

        {/* 4-count grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {Object.entries(cnt).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center', padding: 7, background: 'rgba(0,0,0,.03)', borderRadius: 7 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: VASTU_COLORS[k] }}>{v}</div>
              <div style={{ fontSize: 9, color: '#a09890', textTransform: 'capitalize', fontFamily: "'DM Mono',monospace" }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rooms.filter(r => !r.inside).map(r => {
          const sv = r.vastu || 'neutral'
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', borderRadius: 7, background: '#ede8e0', border: '1px solid #c8c2b8' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: VASTU_COLORS[sv], flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 12 }}>{r.name}</span>
              <span style={{ fontSize: 10, color: '#a09890', fontFamily: "'DM Mono',monospace" }}>Zone: {r.quad}</span>
              <span style={{ fontSize: 10, color: VASTU_COLORS[sv], fontWeight: 700, minWidth: 62, textAlign: 'right', textTransform: 'capitalize' }}>{sv}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
