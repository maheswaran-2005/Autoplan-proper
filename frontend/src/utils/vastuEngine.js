// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// utils/vastuEngine.js
// All Vastu calculation logic lives here.
// No React. No JSX. Pure math functions.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VR = {
  masterBed: { best: ['SW','S','W'],    good: ['SE'],      bad: ['NE','N'] },
  bed2:      { best: ['S','W','NW'],    good: ['SW'],      bad: ['NE']     },
  bed3:      { best: ['NW','W'],        good: ['S'],       bad: ['NE']     },
  bed4:      { best: ['S','W'],         good: ['NW'],      bad: ['NE']     },
  living:    { best: ['N','NE','E'],    good: ['NW'],      bad: ['SE','SW']},
  kitchen:   { best: ['SE'],            good: ['NW'],      bad: ['NE','SW']},
  dining:    { best: ['W','E'],         good: ['N'],       bad: ['S']      },
  bathroom:  { best: ['NW','W'],        good: ['E'],       bad: ['NE','SE']},
  pooja:     { best: ['NE','N','E'],    good: [],          bad: ['S','SW','W']},
  study:     { best: ['N','E','NE'],    good: ['NW'],      bad: ['SW']     },
  store:     { best: ['NW','W','SW'],   good: ['S'],       bad: ['NE']     },
  stair:     { best: ['SW','S','W'],    good: ['NW'],      bad: ['NE']     },
  garage:    { best: ['NW','SE'],       good: ['W'],       bad: ['NE']     },
  servant:   { best: ['NW','W'],        good: ['S'],       bad: ['NE']     },
}

// Score a room type in a given compass zone
export function vScore(type, zone) {
  const r = VR[type]
  if (!r) return 'neutral'
  if (r.best.includes(zone)) return 'excellent'
  if (r.good.includes(zone)) return 'good'
  if (r.bad.includes(zone))  return 'bad'
  return 'neutral'
}

// Find which compass zone a room falls in
export function getQuad(room, plotL, plotW) {
  const cx = ((room.x1 + room.x2) / 2) / plotL
  const cy = ((room.y1 + room.y2) / 2) / plotW
  const ns = cy > 0.55 ? 'N' : cy < 0.45 ? 'S' : ''
  const ew = cx < 0.45 ? 'W' : cx > 0.55 ? 'E' : ''
  return (ns + ew) || 'C'
}

// Vastu score colors
export const VASTU_COLORS = {
  excellent: '#16a34a',
  good:      '#65a30d',
  neutral:   '#6b7280',
  bad:       '#dc2626',
}

// Count rooms by vastu category
export function countVastu(rooms) {
  const cnt = { excellent: 0, good: 0, neutral: 0, bad: 0 }
  rooms.filter(r => !r.inside).forEach(r => {
    if (r.vastu) cnt[r.vastu]++
  })
  return cnt
}

// Calculate overall score %
export function overallScore(rooms) {
  const main = rooms.filter(r => !r.inside)
  if (!main.length) return 0
  const total = main.reduce((sum, r) => {
    const pts = { excellent: 100, good: 70, neutral: 40, bad: 10 }
    return sum + (pts[r.vastu] || 40)
  }, 0)
  return Math.round(total / main.length)
}
