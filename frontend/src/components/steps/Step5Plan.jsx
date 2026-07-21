// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/steps/Step5Plan.jsx
// Step 5: Generate + view the floor plan
// Contains canvas, tabs, generate button
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useRef, useEffect } from 'react'
import { usePlan } from '../../context/PlanContext.jsx'
import { useGenerate } from '../../hooks/useGenerate.js'
import { PrimaryBtn, GhostBtn, TabBtn } from '../ui/Button.jsx'
import { EmptyTab } from '../ui/InfoBox.jsx'
import VastuTab    from '../tabs/VastuTab.jsx'
import ScheduleTab from '../tabs/ScheduleTab.jsx'
import SpecTab     from '../tabs/SpecTab.jsx'
import { drawDetailed, drawPlaceholder } from '../canvas/drawDetailed.js'
import HousePlan3D from '../steps/House3d.jsx'
import { drawSchematic } from '../canvas/drawSchematic.js'
import { GENERATE_MSGS } from '../../constants/index.js'
import { mToFt } from '../../utils/helpers.js'

export default function Step5Plan({ addToast }) {
  const { state, goTo } = usePlan()
  const cfg = state.cfg

  const detailRef = useRef(null)
  const schemaRef = useRef(null)
  const layoutRef = useRef(null)   // stores layout without re-render

  const [seed, setSeed] = useState(0)
  const [view, setView] = useState('detail')
  const [tab,  setTab]  = useState('plan')

  const { busy, prog, done, generate } = useGenerate(
    detailRef, schemaRef, drawDetailed, drawSchematic, addToast
  )

  // Show placeholder on first load
  useEffect(() => {
    drawPlaceholder(detailRef.current)
    drawPlaceholder(schemaRef.current)
  }, [])

  // Keep layoutRef in sync
  useEffect(() => {
    if (state.layout) layoutRef.current = state.layout
  }, [state.layout])

  const vChar = String.fromCharCode(65 + seed % 4)

  // Summary strip items
  const summary = [
    ['Owner',   cfg.owner || '—'],
    ['Plot',    `${mToFt(cfg.plotL)}'×${mToFt(cfg.plotW)}'`],
    ['Facing',  cfg.facing],
    ['Beds',    String(cfg.beds)],
    ['Floors',  cfg.floors || 'G'],
    ['Toilets', `${cfg.beds} attached`],
    ['Variant', vChar],
  ]

  return (
    <div>
      {/* Summary strip */}
      <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 10, padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 13, boxShadow: '0 2px 12px rgba(15,25,35,.08)' }}>
        {summary.map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 9, color: '#a09890', textTransform: 'uppercase', letterSpacing: .7, fontFamily: "'DM Mono',monospace" }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: 12, marginTop: 1 }}>{val}</div>
          </div>
        ))}
        <button onClick={() => goTo(1)} style={{ marginLeft: 'auto', background: 'transparent', border: '1.5px solid #c8c2b8', borderRadius: 6, padding: '4px 10px', color: '#a09890', fontSize: 11, cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>Edit</button>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 11 }}>
        {[['plan','🗺 Blueprint'],['3d','🏠 3D View'],['vastu','🧭 Vastu'],['schedule','📐 Rooms'],['spec','📋 Spec']].map(([id, lbl]) => (
          <TabBtn key={id} active={tab === id} onClick={() => setTab(id)}>{lbl}</TabBtn>
        ))}
      </div>

      {/* ── BLUEPRINT TAB ── */}
      {tab === 'plan' && (
        <div style={{ background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,25,35,.13)' }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: '1px solid #c8c2b8', flexWrap: 'wrap', gap: 7, background: '#ede8e0' }}>
            {/* View toggle */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[['detail','Detailed'],['schema','Schematic']].map(([id, lbl]) => (
                <button key={id} onClick={() => setView(id)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: `1.5px solid ${view === id ? '#b8862a' : '#c8c2b8'}`, background: view === id ? 'rgba(184,134,42,.10)' : 'transparent', color: view === id ? '#b8862a' : '#a09890', cursor: 'pointer', fontFamily: "'Syne',sans-serif" }}>
                  {lbl}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 7 }}>
              {!done && !busy && (
                <PrimaryBtn onClick={() => generate(seed)}>Generate Vastu Plan</PrimaryBtn>
              )}
              {done && !busy && (
                <>
                  <PrimaryBtn onClick={() => { const ns = seed + 1; setSeed(ns); generate(ns) }}>Regenerate</PrimaryBtn>
                  <GhostBtn onClick={() => {
                    const activeCanvas = view === 'detail' ? detailRef.current : schemaRef.current
                    const a = document.createElement('a')
                    a.download = `autoplan-${cfg.facing}-${view}.png`
                    a.href = activeCanvas.toDataURL('image/png', 1)
                    a.click()
                    addToast('Exported PNG!', 'success')
                  }}>Export PNG</GhostBtn>
                </>
              )}
            </div>
          </div>

          {/* Generation progress */}
          {busy && (
            <div style={{ padding: 24, background: '#ede8e0', display: 'flex', flexDirection: 'column', gap: 11 }}>
              {GENERATE_MSGS.map((msg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: i <= prog ? 1 : 0.15 }}>
                  <span style={{ fontSize: 14, color: i < prog ? '#16a34a' : i === prog ? '#b8862a' : '#888' }}>
                    {i < prog ? '✓' : i === prog ? '›' : '○'}
                  </span>
                  <span style={{ fontSize: 12, color: i === prog ? '#b8862a' : '#a09890', fontWeight: i === prog ? 600 : 400, fontFamily: "'DM Mono',monospace" }}>
                    {msg}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Canvas */}
          <div style={{ display: busy ? 'none' : 'block', background: '#fdfcfa' }}>
            <canvas ref={detailRef} width={1600} height={780} style={{ display: view === 'detail' ? 'block' : 'none', width: '100%', height: 'auto' }} />
            <canvas ref={schemaRef} width={1400} height={700} style={{ display: view === 'schema' ? 'block' : 'none', width: '100%', height: 'auto' }} />
          </div>
        </div>
      )}

      {/* ── OTHER TABS ── */}
      {tab === 'vastu'    && (done && layoutRef.current ? <VastuTab    layout={layoutRef.current} /> : <EmptyTab>Generate a plan first.</EmptyTab>)}
      {tab === '3d'       && (done && layoutRef.current ? <HousePlan3D layout={layoutRef.current} cfg={cfg} /> : <EmptyTab>Generate a plan first.</EmptyTab>)}
      {tab === 'schedule' && (done && layoutRef.current ? <ScheduleTab layout={layoutRef.current} /> : <EmptyTab>Generate a plan first.</EmptyTab>)}
      {tab === 'spec'     && <SpecTab cfg={cfg} layout={layoutRef.current} vChar={vChar} />}
    </div>
  )
}