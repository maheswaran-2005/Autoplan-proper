// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// App.jsx — Root component
//
// This file ONLY:
//   1. Wraps app in PlanProvider (global state)
//   2. Renders Header + current Step + nav buttons
//   3. Manages toasts
//
// All heavy logic is in the individual components.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { PlanProvider, usePlan } from './context/PlanContext.jsx'
import { useToast } from './hooks/useToast.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header      from './components/layout/Header.jsx'
import Step1Owner  from './components/steps/Step1Owner.jsx'
import Step2Plot   from './components/steps/Step2Plot.jsx'
import Step3Rooms  from './components/steps/Step3Rooms.jsx'
import Step4Options from './components/steps/Step4Options.jsx'
import Step5Plan   from './components/steps/Step5Plan.jsx'
import { PrimaryBtn, GhostBtn } from './components/ui/Button.jsx'
import { Toast } from './components/ui/InfoBox.jsx'
import Landing  from './components/pages/Landing.jsx';
import Login    from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import Dashboard from './components/pages/Dashboard.jsx';

// Global CSS
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
html, body, #root { height: 100%; background: #f7f4ef; color: #0f1923; font-family: 'Syne', sans-serif; -webkit-font-smoothing: antialiased }
@keyframes fu { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
`

// The wizard page — shows current step + nav buttons
function WizardPage({ addToast }) {
  const { state, goTo } = usePlan()
  const step = state.step

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '24px 14px 80px' }}>

      {/* Current step component */}
      {step === 1 && <Step1Owner />}
      {step === 2 && <Step2Plot />}
      {step === 3 && <Step3Rooms />}
      {step === 4 && <Step4Options />}
      {step === 5 && <Step5Plan addToast={addToast} />}

      {/* Navigation buttons (Back / Continue) — hidden on step 5 */}
      {step < 5 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
          <GhostBtn onClick={() => goTo(Math.max(1, step - 1))} disabled={step === 1}>
            ← Back
          </GhostBtn>
          <div style={{ flex: 1 }} />
          <PrimaryBtn onClick={() => goTo(step === 4 ? 5 : step + 1)}>
            {step === 4 ? 'Generate Blueprint →' : 'Continue →'}
          </PrimaryBtn>
        </div>
      )}
    </div>
  )
}

// Root export
export default function App() {
  const { toasts, addToast } = useToast()

  return (
    <BrowserRouter>
      <PlanProvider>
        <style>{CSS}</style>
        <div style={{ minHeight: '100vh', background: '#f7f4ef' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/planner"
              element={
                <>
                  <Header />
                  <WizardPage addToast={addToast} />
                  <Toast toasts={toasts} />
                </>
              }
            />
            <Route path="*" element={<Landing />} />
          </Routes>
        </div>
      </PlanProvider>
    </BrowserRouter>
  )
}
