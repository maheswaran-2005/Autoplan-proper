// PlannerNav.jsx — Shared navbar for all 5 wizard steps
// Import into each step: import PlannerNav from './PlannerNav.jsx'
// Usage: <PlannerNav currentStep={1} />
// Needs usePlan context + useNavigate from react-router-dom

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlan } from '../../context/PlanContext.jsx'

const STEPS = [
  { n:1, label:'Owner'     },
  { n:2, label:'Plot'      },
  { n:3, label:'Rooms'     },
  { n:4, label:'Options'   },
  { n:5, label:'Blueprint' },
]

export default function PlannerNav({ currentStep }) {
  const navigate = useNavigate()
  const { state, goTo } = usePlan()
  const step = currentStep ?? state.step

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const root = document.querySelector('.st-page-root')
    const target = root || window
    const fn = (e) => {
      const el = e?.target ?? window
      setScrolled((el.scrollTop ?? window.scrollY) > 22)
    }
    target.addEventListener('scroll', fn, { passive: true })
    return () => target.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`st-nav${scrolled ? ' scrolled' : ''}`}>

      {/* ── Logo → home ── */}
      <button className="st-nav-logo" onClick={() => navigate('/')}>
        <div className="st-nav-logo-mark">🏠</div>
        <span className="st-nav-logo-text">Auto<b>Plan</b></span>
        <span className="st-nav-logo-badge">PRO</span>
      </button>

      <div className="st-nav-sep" />

      {/* ── Step progress strip ── */}
      <div className="st-nav-steps">
        {STEPS.map((s, i) => {
          const done   = step > s.n
          const active = step === s.n
          return (
            <div key={s.n} className="st-nav-step-item">
              {i > 0 && <div className={`st-nav-connector${done ? ' done' : ''}`} />}
              <div
                className={`st-nav-dot${done ? ' done' : active ? ' active' : ''}`}
                onClick={() => done && goTo(s.n)}
                title={done ? `Jump to ${s.label}` : s.label}
              >
                {done ? '✓' : s.n}
              </div>
              <span className={`st-nav-step-lbl${active ? ' active' : done ? ' done' : ''}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Right: save indicator + home button ── */}
      <div className="st-nav-right">
        <div className="st-nav-save">
          <div className="st-nav-save-dot" />
          Auto-saved
        </div>
        <button className="st-nav-home" onClick={() => navigate('/')}>
          <span className="st-nav-home-icon">←</span>
          Home
        </button>
      </div>
    </nav>
  )
}