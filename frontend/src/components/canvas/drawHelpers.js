// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/canvas/drawHelpers.js
// Shared canvas drawing primitives.
// Used by both drawDetailed and drawSchematic.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { rc, ftIn } from '../../utils/helpers.js'

function hasCtxOps(ctx) {
  return !!ctx &&
    typeof ctx.save === 'function' &&
    typeof ctx.restore === 'function' &&
    typeof ctx.beginPath === 'function' &&
    typeof ctx.moveTo === 'function' &&
    typeof ctx.lineTo === 'function' &&
    typeof ctx.stroke === 'function'
}

export function drawWin(ctx, cx, cy, len, thk, dir) {
  if (!hasCtxOps(ctx) || !isFinite(cx) || !isFinite(cy) || !isFinite(len) || !isFinite(thk) || !dir) {
    console.warn('drawWin: Invalid parameters', { cx, cy, len, thk, dir })
    return
  }
  ctx.save(); ctx.strokeStyle = '#1a4880'; ctx.lineWidth = 1.0
  const h = thk / 2
  if (dir === 'h') {
    ctx.clearRect(cx - len/2, cy - h - 1, len, h*2 + 2)
    ctx.fillStyle = '#c0dcf4'; ctx.fillRect(cx - len/2, cy - h, len, h*2)
    const yLines = [cy - h, cy, cy + h]
    for (const yy of yLines) {
      ctx.beginPath(); ctx.moveTo(cx - len/2, yy); ctx.lineTo(cx + len/2, yy); ctx.stroke()
    }
    const xLines = [cx - len/2, cx, cx + len/2]
    for (const xx of xLines) {
      ctx.beginPath(); ctx.moveTo(xx, cy - h); ctx.lineTo(xx, cy + h); ctx.stroke()
    }
  } else {
    ctx.clearRect(cx - h - 1, cy - len/2, h*2 + 2, len)
    ctx.fillStyle = '#c0dcf4'; ctx.fillRect(cx - h, cy - len/2, h*2, len)
    const xLines = [cx - h, cx, cx + h]
    for (const xx of xLines) {
      ctx.beginPath(); ctx.moveTo(xx, cy - len/2); ctx.lineTo(xx, cy + len/2); ctx.stroke()
    }
    const yLines = [cy - len/2, cy, cy + len/2]
    for (const yy of yLines) {
      ctx.beginPath(); ctx.moveTo(cx - h, yy); ctx.lineTo(cx + h, yy); ctx.stroke()
    }
  }
  ctx.restore()
}

export function drawWinLine(ctx, cx, cy, len, thk, dir) {
  if (!hasCtxOps(ctx) || !isFinite(cx) || !isFinite(cy) || !isFinite(len) || !isFinite(thk) || !dir) {
    console.warn('drawWinLine: Invalid parameters', { cx, cy, len, thk, dir })
    return
  }
  ctx.save(); const h = thk / 2; ctx.fillStyle = '#fff'
  if (dir === 'h') {
    ctx.fillRect(cx - len/2, cy - h - 1, len, h*2 + 2)
    ctx.strokeStyle = '#0f1923'; ctx.lineWidth = 1.2
    const yLines = [cy - h, cy, cy + h]
    for (const yy of yLines) {
      ctx.beginPath(); ctx.moveTo(cx - len/2, yy); ctx.lineTo(cx + len/2, yy); ctx.stroke()
    }
  } else {
    ctx.fillRect(cx - h - 1, cy - len/2, h*2 + 2, len)
    ctx.strokeStyle = '#0f1923'; ctx.lineWidth = 1.2
    const xLines = [cx - h, cx, cx + h]
    for (const xx of xLines) {
      ctx.beginPath(); ctx.moveTo(xx, cy - len/2); ctx.lineTo(xx, cy + len/2); ctx.stroke()
    }
  }
  ctx.restore()
}

export function drawDoor(ctx, hx, hy, dw, swing, color) {
  if (!ctx || !isFinite(hx) || !isFinite(hy) || !isFinite(dw) || !swing) {
    console.warn('drawDoor: Invalid parameters', { hx, hy, dw, swing })
    return
  }
  ctx.save(); ctx.strokeStyle = color || '#2a3644'; ctx.lineWidth = 1.4
  ctx.fillStyle = '#fff'; ctx.fillRect(hx - 1, hy - 2, dw + 2, 5)
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + dw, hy); ctx.stroke()
  ctx.setLineDash([2.5, 2]); ctx.globalAlpha = 0.45; ctx.lineWidth = 0.9
  ctx.beginPath()
  if (swing === 'up') ctx.arc(hx, hy, dw, Math.PI * 1.5, 0)
  else                ctx.arc(hx, hy, dw, 0, Math.PI / 2)
  ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.restore()
}

export function drawMainDoor(ctx, cx, cy, dw, swing) {
  if (!ctx || !isFinite(cx) || !isFinite(cy) || !isFinite(dw) || !swing) {
    console.warn('drawMainDoor: Invalid parameters', { cx, cy, dw, swing })
    return
  }
  ctx.save(); const hx = cx - dw/2
  ctx.strokeStyle = '#b03820'; ctx.lineWidth = 2.4
  if (swing === 'up' || swing === 'down') {
    ctx.fillStyle = '#fff'; ctx.fillRect(hx - 2, cy - 3, dw + 4, 6)
    ctx.beginPath(); ctx.moveTo(hx, cy); ctx.lineTo(hx + dw, cy); ctx.stroke()
    ctx.fillStyle = '#0f1923'; ctx.fillRect(hx - 2, cy - 4, 4, 8); ctx.fillRect(hx + dw - 2, cy - 4, 4, 8)
    ctx.setLineDash([3, 2.5]); ctx.strokeStyle = 'rgba(176,56,32,.5)'; ctx.lineWidth = 1.4
    ctx.beginPath()
    if (swing === 'up') ctx.arc(hx, cy, dw, Math.PI * 1.5, 0)
    else                ctx.arc(hx, cy, dw, 0, Math.PI / 2)
    ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#b03820'; ctx.font = "700 9px 'Syne',sans-serif"
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    ctx.fillText('MAIN DOOR', cx, cy + (swing === 'up' ? 6 : -17))
  } else {
    const hy2 = cy - dw/2
    ctx.fillStyle = '#fff'; ctx.fillRect(cx - 3, hy2 - 2, 6, dw + 4)
    ctx.beginPath(); ctx.moveTo(cx, hy2); ctx.lineTo(cx, hy2 + dw); ctx.stroke()
    ctx.setLineDash([3, 2.5]); ctx.strokeStyle = 'rgba(176,56,32,.5)'; ctx.lineWidth = 1.4
    ctx.beginPath()
    if (swing === 'eleft') ctx.arc(cx, hy2, dw, 0, Math.PI / 2)
    else                   ctx.arc(cx, hy2, dw, Math.PI / 2, Math.PI)
    ctx.stroke(); ctx.setLineDash([])
    ctx.fillStyle = '#b03820'; ctx.font = "700 9px 'Syne',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.save(); ctx.translate(cx + (swing === 'eleft' ? 18 : -18), cy); ctx.rotate(-Math.PI / 2)
    ctx.fillText('MAIN DOOR', 0, 0); ctx.restore()
  }
  ctx.restore()
}

export function drawCompass(ctx, cx, cy, facing) {
  if (!ctx || !isFinite(cx) || !isFinite(cy) || !facing) {
    console.warn('drawCompass: Invalid parameters', { cx, cy, facing })
    return
  }
  ctx.save(); const R = 22
  ctx.fillStyle = '#f8f6f2'; ctx.strokeStyle = '#a09880'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.arc(cx, cy, R + 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#0f1923'
  ctx.beginPath(); ctx.moveTo(cx, cy - R + 3); ctx.lineTo(cx - 7, cy + 5); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#a09880'
  ctx.beginPath(); ctx.moveTo(cx, cy + R - 3); ctx.lineTo(cx + 7, cy - 5); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill()
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill()
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = '#0f1923'; ctx.font = "700 9px 'Syne',sans-serif"; ctx.fillText('N', cx, cy - R - 7)
  ctx.fillStyle = '#888'; ctx.font = "7px 'Syne',sans-serif"
  ctx.fillText('S', cx, cy + R + 8); ctx.fillText('E', cx + R + 10, cy + 2); ctx.fillText('W', cx - R - 10, cy + 2)
  const dirs = { North: [0, 1], South: [0, -1], East: [1, 0], West: [-1, 0] }
  const [dx, dy] = dirs[facing] || [0, -1]
  ctx.strokeStyle = '#b03820'; ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(cx + dx * (R - 3), cy - dy * (R - 3)); ctx.lineTo(cx + dx * (R + 7), cy - dy * (R + 7)); ctx.stroke()
  ctx.fillStyle = '#b03820'; ctx.font = "600 8px 'Syne',sans-serif"; ctx.fillText(facing, cx, cy + R + 20)
  ctx.restore()
}

export function drawLabel(ctx, r, rx, ry, rw, rh) {
  if (!ctx || !r || !isFinite(rx) || !isFinite(ry) || !isFinite(rw) || !isFinite(rh)) {
    console.warn('drawLabel: Invalid parameters', { r, rx, ry, rw, rh })
    return
  }
  const cx = rx + rw / 2, cy = ry + rh / 2
  const fs = Math.max(7, Math.min(11, Math.min((rw - 4) / 8, rh * 0.22)))
  const cl = rc(r.type)
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = cl.l; ctx.font = `700 ${fs}px 'Syne',sans-serif`
  const parts = r.name.split(' ')
  const half  = Math.ceil(parts.length / 2)
  const l1 = parts.slice(0, half).join(' ')
  const l2 = parts.slice(half).join(' ')
  const hasDim = rh > fs * 3.5 + 16 && rw > 38
  const baseY  = hasDim ? cy - fs * 0.7 : l2 ? cy - fs * 0.6 : cy
  ctx.fillText(l1, cx, baseY)
  if (l2) ctx.fillText(l2, cx, baseY + fs + 2)
  const nH = l2 ? (fs + 2) * 2 : fs
  if (hasDim) {
    ctx.font = `500 ${Math.max(6, fs * 0.74)}px 'DM Mono',monospace`; ctx.fillStyle = '#5a5040'
    ctx.fillText(`${r.w.toFixed(2)}x${r.h.toFixed(2)}m`, cx, baseY + nH + 5)
    if (rh > nH + 28) {
      ctx.font = `400 ${Math.max(5.5, fs * 0.65)}px 'DM Mono',monospace`; ctx.fillStyle = '#8a7860'
      ctx.fillText(`(${ftIn(r.w)} x ${ftIn(r.h)})`, cx, baseY + nH + 15)
    }
  }
  if (rw > 22 && rh > 20) {
    const vc = { excellent: '#16a34a', good: '#65a30d', neutral: '#94a3b8', bad: '#ef4444' }
    const dc = vc[r.vastu] || vc.neutral
    const dr = Math.max(3, Math.min(5, rw * 0.030))
    ctx.fillStyle = dc; ctx.beginPath(); ctx.arc(rx + rw - dr - 3, ry + dr + 3, dr, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
}

export function dimLine(ctx, x1, y1, x2, y2, label, dir) {
  if (!ctx || !isFinite(x1) || !isFinite(y1) || !isFinite(x2) || !isFinite(y2) || !label || !dir) {
    console.warn('dimLine: Invalid parameters', { x1, y1, x2, y2, label, dir })
    return
  }
  ctx.save(); ctx.strokeStyle = '#2a3444'; ctx.fillStyle = '#2a3444'; ctx.lineWidth = 0.8
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
  if (dir === 'h') {
    [x1, x2].forEach(x => { ctx.beginPath(); ctx.moveTo(x, y1 - 5); ctx.lineTo(x, y1 + 5); ctx.stroke() })
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    const tw = ctx.measureText(label).width + 6
    ctx.fillStyle = '#fff'; ctx.fillRect((x1 + x2) / 2 - tw / 2, y1 - 1, tw, 13)
    ctx.fillStyle = '#2a3444'; ctx.fillText(label, (x1 + x2) / 2, y1 + 1)
  } else {
    [y1, y2].forEach(y => { ctx.beginPath(); ctx.moveTo(x1 - 5, y); ctx.lineTo(x1 + 5, y); ctx.stroke() })
    ctx.save(); ctx.translate(x1 + 13, (y1 + y2) / 2); ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const tw2 = ctx.measureText(label).width + 6
    ctx.fillStyle = '#fff'; ctx.fillRect(-tw2 / 2, -7, tw2, 14)
    ctx.fillStyle = '#2a3444'; ctx.fillText(label, 0, 0); ctx.restore()
  }
  ctx.restore()
}

export function drawTitleBlock(ctx, x, y, w, h, layout, cfg, schematic) {
  if (!ctx || !layout || !isFinite(x) || !isFinite(y) || !isFinite(w) || !isFinite(h)) {
    console.warn('drawTitleBlock: Invalid parameters')
    return
  }
  ctx.save()
  ctx.fillStyle = schematic ? '#fff' : '#f5f2ec'
  ctx.fillRect(x, y, w, h); ctx.strokeStyle = '#a09880'; ctx.lineWidth = 0.9; ctx.strokeRect(x, y, w, h)
  ctx.beginPath(); ctx.moveTo(x + w * 0.5, y); ctx.lineTo(x + w * 0.5, y + h); ctx.stroke()
  ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = '#0f1923'
  ctx.font = "700 11px 'Syne',sans-serif"
  ctx.fillText(`${layout.facing.toUpperCase()} FACING ${schematic ? 'SCHEMATIC' : 'BLUEPRINT'}`, x + 8, y + 5)
  ctx.font = "400 8px 'DM Mono',monospace"; ctx.fillStyle = '#5a4a38'
  ctx.fillText(`Plot: ${(layout.totalArea * 10.764).toFixed(0)} sqft (${layout.plotL.toFixed(2)}x${layout.plotW.toFixed(2)}m)`, x + 8, y + 18)
  ctx.fillText(`Built-up: ${(layout.builtUp * 10.764).toFixed(0)} sqft`, x + 8, y + 28)
  ctx.fillText('Toilets inside each bedroom', x + 8, y + 38)
  const rx2 = x + w * 0.5 + 8
  ctx.fillStyle = '#0f1923'; ctx.font = "700 10px 'Syne',sans-serif"; ctx.fillText('AUTOPLAN PRO', rx2, y + 5)
  ctx.font = "400 8px 'DM Mono',monospace"; ctx.fillStyle = '#5a4a38'
  ctx.fillText(`Owner: ${cfg?.owner || '—'}`, rx2, y + 18)
  ctx.fillText(`Variant ${String.fromCharCode(65 + (layout.variant || 0))} · Scale 1:100`, rx2, y + 28)
  ctx.fillText(`Date: ${cfg?.date || new Date().toLocaleDateString()}`, rx2, y + 38)
  ctx.restore()
}
