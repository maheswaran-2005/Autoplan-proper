// Step3Rooms.jsx — Full-width · Single nav buttons · Dark luxury
import { usePlan } from '../../context/PlanContext.jsx'
import { EXTRAS } from '../../constants/index.js'
import { STEP_CSS } from './stepTheme.js'
import PlannerNav from './PlannerNav.jsx'

export default function Step3Rooms() {
  const { state, set, goTo } = usePlan()
  const c = state.cfg

  return (
    <>
      <style>{STEP_CSS}</style>
      <div className="st-page-root">
        <PlannerNav currentStep={3} />
        <div className="st-page-content">

          <div className="st-step st-card st-corners">
            <div className="st-scan" />
            <div className="st-head">
              <div className="st-head-icon">🛏️</div>
              <div>
                <div className="st-head-title">Rooms &amp; <em>Spaces</em></div>
                <div className="st-head-sub">Each bedroom gets its own toilet carved into the corner</div>
              </div>
              <div className="st-step-badge">STEP 03 / 05</div>
            </div>
            <div className="st-body">
              <div className="st-info">
                <div className="st-info-ic">🚽</div>
                <div>
                  <div className="st-info-title">Toilet Inside Bedroom — Guaranteed</div>
                  <div className="st-info-text">
                    Every bedroom gets a toilet carved from its back corner.
                    Shares the outer wall for ventilation. Entry door from inside the bedroom only.
                  </div>
                </div>
              </div>
              <div className="st-field">
                <div className="st-lbl"><span className="st-req" />Bedrooms (each with attached toilet)</div>
                <div className="st-spinner">
                  <div className="st-spin-side">
                    <div className="st-spin-lbl">Select Count</div>
                    <div className="st-spin-desc">1 – 4 bedrooms</div>
                  </div>
                  <div className="st-spin-mid">
                    <div className="st-spin-val" key={c.beds}>{c.beds}</div>
                  </div>
                  <div className="st-spin-btns">
                    <button className="st-spin-btn" onClick={() => set('beds', Math.min(4, c.beds + 1))}>＋</button>
                    <button className="st-spin-btn" onClick={() => set('beds', Math.max(1, c.beds - 1))}>－</button>
                  </div>
                </div>
              </div>
              <div className="st-toilet">
                <div className="st-toilet-t">🔵 Toilet Plan Summary</div>
                <div className="st-toilet-g">
                  <div className="st-toilet-item">Attached toilets: <strong>{c.beds}</strong></div>
                  <div className="st-toilet-item">Position: <strong>Back corner</strong></div>
                  <div className="st-toilet-item">Access: <strong>Inside bedroom</strong></div>
                  <div className="st-toilet-item">Room overlap: <strong style={{ color:'var(--green)' }}>Zero</strong></div>
                </div>
              </div>
              <div className="st-div"><div className="st-div-line" /><div className="st-div-lbl">Additional Spaces</div><div className="st-div-line" /></div>
              <div className="st-chk-grid">
                {EXTRAS.map(({ k, lbl }) => {
                  const on = !!c[k]
                  return (
                    <div key={k} className={`st-chk${on ? ' on' : ''}`} onClick={() => set(k, !c[k])}>
                      <div className="st-chk-box">{on ? '✓' : ''}</div>
                      <div className="st-chk-lbl">{lbl}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Single nav row ── */}
          <div className="st-step-nav">
            <button className="st-step-nav-back" onClick={() => goTo(2)}>← Back</button>
            <div style={{ flex:1 }} />
            <button className="st-step-nav-next" onClick={() => goTo(4)}>Continue →</button>
          </div>

        </div>
      </div>
    </>
  )
}