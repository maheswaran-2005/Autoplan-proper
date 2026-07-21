// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/layout/Header.jsx
// Sticky top bar with logo + step progress bar.
// Reads current step from context.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { usePlan } from '../../context/PlanContext.jsx'
import { STEPS_LIST } from '../../constants/index.js'

export default function Header({ onDashboard }) {
  const { state, goTo } = usePlan()
  const step = state.step

  return (
    <header style={{ background: '#0f1923', color: '#f7f4ef', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 52, gap: 12, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,.35)' }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: 'linear-gradient(135deg,#b8862a,#b03820)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: onDashboard ? 'pointer' : 'default' }}
          onClick={onDashboard}>
          🏠
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13 }}>
            AUTO<span style={{ color: '#b8862a' }}>PLAN</span>
            <span style={{ fontSize: 8, marginLeft: 5, background: 'rgba(184,134,42,.18)', color: '#b8862a', border: '1px solid rgba(184,134,42,.3)', borderRadius: 4, padding: '1px 5px', fontFamily: "'DM Mono',monospace" }}>PRO</span>
          </div>
          <div style={{ fontSize: 8, color: '#5a6070', letterSpacing: '1px', fontFamily: "'DM Mono',monospace" }}>
            VASTU FLOOR PLAN GENERATOR
          </div>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {STEPS_LIST.map((st, i) => {
          const done   = step > st.id
          const active = step === st.id
          return (
            <div key={st.id} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Step button */}
              <button
                onClick={() => { if (done || active) goTo(st.id) }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 6, border: `1px solid ${active ? '#b8862a' : done ? 'rgba(184,134,42,.3)' : '#1e2d3d'}`, background: active ? 'rgba(184,134,42,.15)' : 'transparent', color: active ? '#b8862a' : done ? '#806828' : '#4a5a6a', cursor: done || active ? 'pointer' : 'default' }}
              >
                {/* Circle number */}
                <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, background: done ? '#b8862a' : active ? 'rgba(184,134,42,.18)' : '#1e2d3d', color: done ? '#0f1923' : active ? '#b8862a' : '#4a5a6a', border: `1.5px solid ${done || active ? '#b8862a' : '#2a3d50'}` }}>
                  {done ? '✓' : st.id}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{st.lbl}</span>
              </button>

              {/* Connector line between steps */}
              {i < STEPS_LIST.length - 1 && (
                <div style={{ width: 7, height: 1.5, background: step > st.id ? 'rgba(184,134,42,.45)' : '#1e2d3d' }} />
              )}
            </div>
          )
        })}
      </div>
    </header>
  )
}