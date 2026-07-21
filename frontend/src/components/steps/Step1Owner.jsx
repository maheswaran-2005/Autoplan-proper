// Step1Owner.jsx — Full-width · Single nav buttons · Dark luxury
import { usePlan } from '../../context/PlanContext.jsx'
import { STEP_CSS } from './stepTheme.js'
import PlannerNav from './PlannerNav.jsx'

function Field({ label, req, icon, hint, children }) {
  return (
    <div className="st-field">
      <label className="st-lbl">{req && <span className="st-req" />}{label}</label>
      <div className="st-iwrap">
        {icon && <span className="st-ico">{icon}</span>}
        {children}
      </div>
      {hint && <div className="st-hint">{hint}</div>}
    </div>
  )
}

export default function Step1Owner() {
  const { state, set, goTo } = usePlan()
  const c = state.cfg

  return (
    <>
      <style>{STEP_CSS}</style>
      <div className="st-page-root">
        <PlannerNav currentStep={1} />
        <div className="st-page-content">

          {/* ── Full-width card ── */}
          <div className="st-step st-card st-corners">
            <div className="st-scan" />
            <div className="st-head">
              <div className="st-head-icon">👤</div>
              <div>
                <div className="st-head-title">Owner &amp; <em>Project</em></div>
                <div className="st-head-sub">Details for blueprint title block</div>
              </div>
              <div className="st-step-badge">STEP 01 / 05</div>
            </div>
            <div className="st-body">
              <div className="st-g2">
                <Field label="Owner Name" req icon="🙍">
                  <input className="st-input" placeholder="Rajesh Kumar"
                    value={c.owner} onChange={e => set('owner', e.target.value)} />
                </Field>
                <Field label="Phone" icon="📱">
                  <input className="st-input" placeholder="+91 98765 43210"
                    value={c.phone} onChange={e => set('phone', e.target.value)} />
                </Field>
              </div>
              <div className="st-g2">
                <Field label="Email" icon="✉️">
                  <input className="st-input" type="email" placeholder="owner@example.com"
                    value={c.address} onChange={e => set('address', e.target.value)} />
                </Field>
                <Field label="Plan Date" icon="📅">
                  <input className="st-input" type="date"
                    value={c.date} onChange={e => set('date', e.target.value)} />
                </Field>
              </div>
              <div className="st-div">
                <div className="st-div-line" /><div className="st-div-lbl">Site Location</div><div className="st-div-line" />
              </div>
              <Field label="Site Address" icon="📍">
                <input className="st-input"
                  placeholder="Plot 12, 5th Cross, Velachery, Chennai 600042"
                  value={c.siteAddress || ''} onChange={e => set('siteAddress', e.target.value)} />
              </Field>
              <div className="st-info">
                <div className="st-info-ic">📋</div>
                <div>
                  <div className="st-info-title">Blueprint Title Block</div>
                  <div className="st-info-text">
                    Owner name, address, and date will appear in the title block of every generated floor plan drawing.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Single nav row ── */}
          <div className="st-step-nav">
            <div style={{ flex:1 }} />
            <button className="st-step-nav-next" onClick={() => goTo(2)}>Continue →</button>
          </div>

        </div>
      </div>
    </>
  )
}