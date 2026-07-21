// Step4Options.jsx — Full-width · Single nav buttons · Dark luxury
import { usePlan } from '../../context/PlanContext.jsx'
import { VASTU_OPTIONS, STYLE_OPTIONS, CONSTRUCTION_OPTIONS, FLOOR_OPTIONS } from '../../constants/index.js'
import { STEP_CSS } from './stepTheme.js'
import PlannerNav from './PlannerNav.jsx'

const EXTRA_CSS = `
.st-opt-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.st-opt-card { padding:14px 16px; border-radius:12px; cursor:pointer; border:1.5px solid rgba(240,230,208,.09); background:rgba(255,255,255,.02); transition:border-color .22s,background .22s,box-shadow .22s; display:flex; flex-direction:column; gap:4px; }
.st-opt-card.on { border-color:rgba(212,168,67,.5); background:rgba(212,168,67,.07); box-shadow:0 0 28px rgba(212,168,67,.18); }
.st-opt-card:hover:not(.on) { border-color:rgba(212,168,67,.26); background:rgba(212,168,67,.04); }
.st-opt-top { display:flex; align-items:center; gap:9px; }
.st-opt-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; border:2px solid rgba(212,168,67,.4); background:transparent; transition:background .18s,border-color .18s; }
.st-opt-card.on .st-opt-dot { background:var(--g); border-color:var(--g); }
.st-opt-title { font-size:13px; font-weight:700; color:rgba(240,230,208,.62); transition:color .22s; }
.st-opt-card.on .st-opt-title { color:var(--g); }
.st-opt-desc { font-family:'DM Mono',monospace; font-size:9px; color:rgba(240,230,208,.26); letter-spacing:.5px; padding-left:19px; }
.st-variants { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.st-var { padding:10px 6px; border-radius:10px; text-align:center; border:1.5px solid rgba(240,230,208,.08); background:rgba(255,255,255,.02); transition:border-color .22s,background .22s; }
.st-var:hover { border-color:rgba(212,168,67,.28); background:rgba(212,168,67,.04); }
.st-var-ltr { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:700; color:var(--g); line-height:1; }
.st-var-sub { font-family:'DM Mono',monospace; font-size:8px; color:rgba(240,230,208,.3); letter-spacing:.8px; margin-top:3px; }
`

function Field({ label, icon, children }) {
  return (
    <div className="st-field">
      <label className="st-lbl">{label}</label>
      <div className="st-iwrap">{icon && <span className="st-ico">{icon}</span>}{children}</div>
    </div>
  )
}

function OptCard({ label, desc, value, current, onClick }) {
  const on = current === value
  return (
    <div className={`st-opt-card${on ? ' on' : ''}`} onClick={onClick}>
      <div className="st-opt-top"><div className="st-opt-dot" /><div className="st-opt-title">{label}</div></div>
      {desc && <div className="st-opt-desc">{desc}</div>}
    </div>
  )
}

export default function Step4Options() {
  const { state, set, goTo } = usePlan()
  const c = state.cfg

  return (
    <>
      <style>{STEP_CSS + EXTRA_CSS}</style>
      <div className="st-page-root">
        <PlannerNav currentStep={4} />
        <div className="st-page-content">

          <div className="st-step st-card st-corners">
            <div className="st-scan" />
            <div className="st-head">
              <div className="st-head-icon">⚙️</div>
              <div>
                <div className="st-head-title">Options &amp; <em>Style</em></div>
                <div className="st-head-sub">Vastu mode, architecture style, construction type</div>
              </div>
              <div className="st-step-badge">STEP 04 / 05</div>
            </div>
            <div className="st-body">
              <div className="st-info">
                <div className="st-info-ic">🔄</div>
                <div>
                  <div className="st-info-title">4 Layout Variants Generated</div>
                  <div className="st-info-text">
                    Every plot generates 4 unique room arrangements A–D.
                    Hit <strong style={{ color:'var(--g)' }}>Regenerate</strong> on step 5 to cycle.
                  </div>
                </div>
              </div>
              <div className="st-variants">
                {['A','B','C','D'].map(v => (
                  <div className="st-var" key={v}>
                    <div className="st-var-ltr">{v}</div>
                    <div className="st-var-sub">VARIANT {v}</div>
                  </div>
                ))}
              </div>
              <div className="st-div"><div className="st-div-line" /><div className="st-div-lbl">Vastu Mode</div><div className="st-div-line" /></div>
              <div className="st-opt-grid">
                {VASTU_OPTIONS.map(([v, l]) => (
                  <OptCard key={v} value={v} label={l} current={c.vastu || 'strict'}
                    onClick={() => set('vastu', v)} />
                ))}
              </div>
              <div className="st-div"><div className="st-div-line" /><div className="st-div-lbl">Architecture &amp; Construction</div><div className="st-div-line" /></div>
              <div className="st-g2">
                <Field label="Architecture Style" icon="🏛️">
                  <select className="st-select st-plain" value={c.archStyle || 'traditional'} onChange={e => set('archStyle', e.target.value)}>
                    {STYLE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Construction Type" icon="🔧">
                  <select className="st-select st-plain" value={c.construction || 'rcc'} onChange={e => set('construction', e.target.value)}>
                    {CONSTRUCTION_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <div className="st-g2">
                <Field label="Floors" icon="🏗️">
                  <select className="st-select st-plain" value={c.floors} onChange={e => set('floors', e.target.value)}>
                    {FLOOR_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <div className="st-div"><div className="st-div-line" /><div className="st-div-lbl">Special Notes</div><div className="st-div-line" /></div>
              <div className="st-field">
                <label className="st-lbl">Additional Instructions</label>
                <div className="st-iwrap">
                  <textarea className="st-textarea"
                    placeholder="e.g. Ground floor master bedroom, extra windows on east side..."
                    value={c.notes || ''} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Single nav row ── */}
          <div className="st-step-nav">
            <button className="st-step-nav-back" onClick={() => goTo(3)}>← Back</button>
            <div style={{ flex:1 }} />
            <button className="st-step-nav-next" onClick={() => goTo(5)}>⚡ Generate Blueprint →</button>
          </div>

        </div>
      </div>
    </>
  )
}