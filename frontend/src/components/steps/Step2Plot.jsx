// Step2Plot.jsx — Full-width · Single nav buttons · Dark luxury
import { usePlan } from '../../context/PlanContext.jsx'
import { PRESETS, DIRS, WALL_OPTIONS, FLOOR_OPTIONS } from '../../constants/index.js'
import { mToFt } from '../../utils/helpers.js'
import { STEP_CSS } from './stepTheme.js'
import PlannerNav from './PlannerNav.jsx'

function Field({ label, req, icon, hint, children }) {
  return (
    <div className="st-field">
      <label className="st-lbl">{req && <span className="st-req" />}{label}</label>
      <div className="st-iwrap">{icon && <span className="st-ico">{icon}</span>}{children}</div>
      {hint && <div className="st-hint">{hint}</div>}
    </div>
  )
}

export default function Step2Plot() {
  const { state, set, goTo } = usePlan()
  const c = state.cfg
  const sqM  = (c.plotL * c.plotW).toFixed(1)
  const sqFt = (c.plotL * c.plotW * 10.764).toFixed(0)
  const built= (c.plotL * c.plotW * 0.82 * 10.764).toFixed(0)

  return (
    <>
      <style>{STEP_CSS}</style>
      <div className="st-page-root">
        <PlannerNav currentStep={2} />
        <div className="st-page-content">

          <div className="st-step st-card st-corners">
            <div className="st-scan" />
            <div className="st-head">
              <div className="st-head-icon">📐</div>
              <div>
                <div className="st-head-title">Plot &amp; <em>Direction</em></div>
                <div className="st-head-sub">Dimensions and Vastu-facing orientation</div>
              </div>
              <div className="st-step-badge">STEP 02 / 05</div>
            </div>
            <div className="st-body">
              <div className="st-g2">
                <Field label="Length (m)" req icon="↔️" hint={`≈ ${mToFt(c.plotL)} ft`}>
                  <input className="st-input" type="number" min="4" max="100" step="0.01"
                    value={c.plotL} onChange={e => set('plotL', parseFloat(e.target.value) || 12)} />
                </Field>
                <Field label="Width (m)" req icon="↕️" hint={`≈ ${mToFt(c.plotW)} ft`}>
                  <input className="st-input" type="number" min="4" max="100" step="0.01"
                    value={c.plotW} onChange={e => set('plotW', parseFloat(e.target.value) || 9)} />
                </Field>
              </div>
              <div className="st-field">
                <div className="st-lbl">Quick Presets (ft)</div>
                <div className="st-pills">
                  {PRESETS.map(([name, l, w]) => {
                    const on = Math.abs(c.plotL - l) < 0.05 && Math.abs(c.plotW - w) < 0.05
                    return (
                      <button key={name} className={`st-pill${on ? ' on' : ''}`}
                        onClick={() => { set('plotL', l); set('plotW', w) }}>{name}</button>
                    )
                  })}
                </div>
              </div>
              <div className="st-g3">
                <div className="st-stat"><div className="st-stat-n">{sqM}</div><div className="st-stat-l">Plot m²</div></div>
                <div className="st-stat"><div className="st-stat-n" style={{ color:'var(--teal)' }}>{sqFt}</div><div className="st-stat-l">Sq Ft</div></div>
                <div className="st-stat"><div className="st-stat-n" style={{ color:'var(--blue)' }}>{built}</div><div className="st-stat-l">Est Built Area</div></div>
              </div>
              <div className="st-div"><div className="st-div-line" /><div className="st-div-lbl">Vastu Facing Direction</div><div className="st-div-line" /></div>
              <div className="st-g4">
                {DIRS.map(([name, abbr, desc]) => (
                  <button key={name} className={`st-dir${c.facing === name ? ' on' : ''}`}
                    onClick={() => set('facing', name)}>
                    <div className="st-dir-abbr">{abbr}</div>
                    <div className="st-dir-name">{name}</div>
                    <div className="st-dir-desc">{desc}</div>
                  </button>
                ))}
              </div>
              <div className="st-g2">
                <Field label="Wall Thickness" icon="🧱">
                  <select className="st-select st-plain" value={c.wallThick} onChange={e => set('wallThick', +e.target.value)}>
                    {WALL_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Floors" icon="🏗️">
                  <select className="st-select st-plain" value={c.floors} onChange={e => set('floors', e.target.value)}>
                    {FLOOR_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          {/* ── Single nav row ── */}
          <div className="st-step-nav">
            <button className="st-step-nav-back" onClick={() => goTo(1)}>← Back</button>
            <div style={{ flex:1 }} />
            <button className="st-step-nav-next" onClick={() => goTo(3)}>Continue →</button>
          </div>

        </div>
      </div>
    </>
  )
}