// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// hooks/useToast.js
//
// WHY A HOOK?
// Toast logic (add, auto-remove after 3s) is
// used in App.jsx and Step5. Instead of copy-pasting
// the same useState + setTimeout code, we extract it
// into one hook. App just calls:
//   const { toasts, addToast } = useToast()
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    // Auto-remove after 3.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  return { toasts, addToast }
}
