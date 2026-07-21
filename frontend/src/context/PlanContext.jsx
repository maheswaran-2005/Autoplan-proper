// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// context/PlanContext.jsx
//
// WHY CONTEXT?
// Step1, Step2, Step3... all need the same data.
// Instead of passing props through 5 levels,
// we use Context = a "global store" any component
// can read/write directly.
//
// HOW TO USE IN ANY COMPONENT:
//   const { state, set, goTo } = usePlan()
//   set('plotL', 12.5)   ← update one field
//   goTo(3)              ← go to step 3
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { createContext, useContext, useReducer } from 'react'
import { INIT_CFG } from '../constants/index.js'

const PlanContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, cfg: { ...state.cfg, [action.key]: action.value } }
    case 'SET_LAYOUT':
      return { ...state, layout: action.layout, seed: action.seed }
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'RESET':
      return { cfg: { ...INIT_CFG }, layout: null, seed: 0, step: 1 }
    default:
      return state
  }
}

export function PlanProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    cfg:    { ...INIT_CFG },
    layout: null,
    seed:   0,
    step:   1,
  })

  // set('plotL', 12.5) — update any config field
  function set(key, value) {
    dispatch({ type: 'SET_FIELD', key, value })
  }

  // goTo(3) — jump to any wizard step
  function goTo(step) {
    dispatch({ type: 'SET_STEP', step })
  }

  // saveLayout(layout, seed) — store generated result
  function saveLayout(layout, seed) {
    dispatch({ type: 'SET_LAYOUT', layout, seed })
  }

  return (
    <PlanContext.Provider value={{ state, dispatch, set, goTo, saveLayout }}>
      {children}
    </PlanContext.Provider>
  )
}

// Import this hook in any component to access global state
export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be inside <PlanProvider>')
  return ctx
}
