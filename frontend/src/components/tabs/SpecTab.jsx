// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/tabs/SpecTab.jsx
// Project spec summary table
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { mToFt } from '../../utils/helpers.js'

export default function SpecTab({ cfg, layout, vChar }) {
  const rows = [
    ['Owner',           cfg.owner || '—'],
    ['Phone',           cfg.phone || '—'],
    ['Plot Length',     `${cfg.plotL.toFixed(2)}m ≈ ${mToFt(cfg.plotL)} ft`],
    ['Plot Width',      `${cfg.plotW.toFixed(2)}m ≈ ${mToFt(cfg.plotW)} ft`],
    ['Plot Area',       `${(cfg.plotL * cfg.plotW).toFixed(1)} m² / ${(cfg.plotL * cfg.plotW * 10.764).toFixed(0)} sqft`],
    ['Facing',          cfg.facing],
    ['Bedrooms',        String(cfg.beds)],
    ['Attached Toilets',`${cfg.beds} (inside each bedroom)`],
    ['Wall Thickness',  `${cfg.wallThick}mm`],
    ['Floors',          cfg.floors],
    ['Vastu Mode',      cfg.vastu || 'strict'],
    ['Variant',         vChar],
    ['Built-up',        layout ? `${layout.builtUp.toFixed(2)} m² / ${(layout.builtUp * 10.764).toFixed(0)} sqft` : '—'],
    ['Notes',           cfg.notes || '—'],
  ]

  return (
    <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,25,35,.08)' }}>
      <div style={{ padding: '11px 14px', borderBottom: '1px solid #c8c2b8', fontWeight: 700, fontSize: 12, color: '#b8862a', background: '#ede8e0' }}>
        Project Specifications
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <tbody>
          {rows.map(([label, val], i) => (
            <tr key={label} style={{ background: i % 2 === 0 ? '#fff' : '#ede8e0' }}>
              <td style={{ padding: '6px 14px', color: '#a09890', fontWeight: 700, width: '34%', borderBottom: '1px solid #c8c2b8', fontFamily: "'DM Mono',monospace" }}>{label}</td>
              <td style={{ padding: '6px 14px', color: '#0f1923', fontFamily: 'monospace', fontSize: 11, borderBottom: '1px solid #c8c2b8' }}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
