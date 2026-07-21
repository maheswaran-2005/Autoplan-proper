// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// hooks/useGenerate.js
//
// WHY A HOOK?
// Step5Plan.jsx was getting messy with busy/prog/done state.
// We pull it into its own hook. Step5Plan just calls:
//   const { busy, prog, done, generate } = useGenerate(...)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useCallback } from 'react'
import { buildLayout } from '../utils/layoutEngine.js'
import { GENERATE_MSGS } from '../constants/index.js'
import { usePlan } from '../context/PlanContext.jsx'

export function useGenerate(detailRef, schemaRef, drawDetail, drawSchema, addToast) {
  const { state, saveLayout } = usePlan()
  const [busy, setBusy] = useState(false)
  const [prog, setProg] = useState(-1)
  const [done, setDone] = useState(false)

  const generate = useCallback((seed) => {
    setBusy(true)
    setDone(false)
    setProg(0)

    let step = 0
    function tick() {
      if (step < GENERATE_MSGS.length) {
        setProg(step++)
        setTimeout(tick, 380)
      } else {
        // All animation steps done — now actually build
        try {
          if (!state.cfg) {
            addToast('Configuration missing. Please complete all steps.', 'error')
            setBusy(false)
            setDone(false)
            return
          }

          const layout = buildLayout(state.cfg, seed)
          
          if (!layout || !layout.rooms || layout.rooms.length === 0) {
            addToast('Failed to generate layout. Please check your configuration.', 'error')
            setBusy(false)
            setDone(false)
            return
          }

          saveLayout(layout, seed)
          
          if (detailRef.current && drawDetail) {
            drawDetail(detailRef.current, layout, state.cfg)
          }
          if (schemaRef.current && drawSchema) {
            drawSchema(schemaRef.current, layout, state.cfg)
          }
          
          setProg(-1)
          setBusy(false)
          setDone(true)
          addToast('Floor plan ready!', 'success')
        } catch (error) {
          console.error('Blueprint generation error:', error)
          addToast('Error generating blueprint. Check console for details.', 'error')
          setBusy(false)
          setDone(false)
        }
      }
    }
    setTimeout(tick, 100)
  }, [state.cfg, saveLayout, detailRef, schemaRef, drawDetail, drawSchema, addToast])

  return { busy, prog, done, setDone, generate }
}
