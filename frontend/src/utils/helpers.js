// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// utils/helpers.js
// Small utility functions used across the app.
// Pure JS — no React, no JSX.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Round to 3 decimal places
export function F(n) {
  return parseFloat(n.toFixed(3))
}

// Convert meters to feet string: 12.19m → "40.0"
export function mToFt(m) {
  return (m * 3.281).toFixed(1)
}

// Convert meters to feet+inches string: 3.05m → "10'0""
export function ftIn(m) {
  const totalInches = Math.round(m * 39.3701)
  const feet = Math.floor(totalInches / 12)
  const inches = totalInches % 12
  return `${feet}'${inches}"`
}

// Get room color by type
import { ROOM_COLORS } from '../constants/index.js'
export function rc(type) {
  return ROOM_COLORS[type] || { f: '#f8f8f8', s: '#888', l: '#444' }
}
