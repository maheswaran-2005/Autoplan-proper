// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/tabs/ScheduleTab.jsx
// Room schedule table with dimensions + sqft
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { VASTU_COLORS } from '../../utils/vastuEngine.js'

const TH = { padding: '7px 10px', textAlign: 'left', color: '#a09890', fontWeight: 700, borderBottom: '1.5px solid #c8c2b8', fontSize: 10, fontFamily: "'DM Mono',monospace" }
const TD = (i) => ({ padding: '6px 10px', background: i % 2 === 0 ? '#fff' : '#ede8e0' })

export default function ScheduleTab({ layout }) {
  if (!layout) return null
  const { rooms, builtUp } = layout
  const main = rooms.filter(r => !r.inside)

  return (
    <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,25,35,.08)' }}>
      <div style={{ padding: '11px 14px', borderBottom: '1px solid #c8c2b8', fontWeight: 700, fontSize: 12, color: '#b8862a', background: '#ede8e0' }}>
        Room Schedule
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#ede8e0' }}>
              {['#', 'Room', 'W (m)', 'H (m)', 'm²', 'sqft', 'Toilet?', 'Vastu'].map(h => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {main.map((r, i) => {
              const sv      = r.vastu || 'neutral'
              const hasBath = r.type === 'bedroom' && r.bathBox
              return (
                <tr key={r.id}>
                  <td style={{ ...TD(i), color: '#a09890', fontFamily: 'monospace' }}>{i + 1}</td>
                  <td style={{ ...TD(i), fontWeight: 600 }}>{r.name}</td>
                  <td style={{ ...TD(i), fontFamily: 'monospace' }}>{r.w.toFixed(2)}</td>
                  <td style={{ ...TD(i), fontFamily: 'monospace' }}>{r.h.toFixed(2)}</td>
                  <td style={{ ...TD(i), fontFamily: 'monospace', color: '#b8862a', fontWeight: 700 }}>{r.area.toFixed(2)}</td>
                  <td style={{ ...TD(i), fontFamily: 'monospace' }}>{(r.area * 10.764).toFixed(1)}</td>
                  <td style={TD(i)}>
                    {hasBath
                      ? <span style={{ fontSize: 10, fontWeight: 700, color: '#2460a0', background: 'rgba(36,96,160,.10)', padding: '2px 7px', borderRadius: 9 }}>Yes</span>
                      : <span style={{ fontSize: 10, color: '#a09890' }}>—</span>
                    }
                  </td>
                  <td style={TD(i)}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: VASTU_COLORS[sv], background: VASTU_COLORS[sv] + '22', padding: '2px 7px', borderRadius: 9, textTransform: 'capitalize' }}>{sv}</span>
                  </td>
                </tr>
              )
            })}

            {/* Total row */}
            <tr style={{ background: 'rgba(184,134,42,.07)', borderTop: '2px solid #c8c2b8' }}>
              <td colSpan={4} style={{ padding: '8px 10px', fontWeight: 700, color: '#b8862a' }}>TOTAL BUILT-UP</td>
              <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#b8862a' }}>{builtUp.toFixed(2)}</td>
              <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{(builtUp * 10.764).toFixed(1)}</td>
              <td colSpan={2} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
