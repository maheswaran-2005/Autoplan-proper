// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/canvas/drawSchematic.js
// Draws the single-line schematic view
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { ftIn } from '../../utils/helpers.js'
import { drawWinLine, drawDoor, drawMainDoor, drawCompass, dimLine, drawTitleBlock } from './drawHelpers.js'

function hasRoomBox(room) {
  return !!room &&
    isFinite(room.x1) && isFinite(room.y1) &&
    isFinite(room.x2) && isFinite(room.y2) &&
    isFinite(room.w) && isFinite(room.h)
}

function getMainDoorPlacement(room, facing, plotL, plotW, EW, WT, px, py) {
  if (!hasRoomBox(room)) return null

  const edgeTol = EW + 0.06
  const touches = {
    South: room.y1 <= edgeTol,
    North: room.y2 >= (plotW - edgeTol),
    West: room.x1 <= edgeTol,
    East: room.x2 >= (plotL - edgeTol),
  }

  const side = [facing, 'South', 'North', 'East', 'West'].find(s => touches[s])
  if (!side) return null

  if (side === 'South') return { cx: px(room.x1 + room.w / 2), cy: py(room.y1) + WT / 2, swing: 'up', span: room.w }
  if (side === 'North') return { cx: px(room.x1 + room.w / 2), cy: py(room.y2) - WT / 2, swing: 'down', span: room.w }
  if (side === 'East') return { cx: px(room.x2) + WT / 2, cy: py(room.y1 + room.h / 2), swing: 'eleft', span: room.h }
  return { cx: px(room.x1) - WT / 2, cy: py(room.y1 + room.h / 2), swing: 'eright', span: room.h }
}

export function drawSchematic(canvas, layout, cfg) {
  if (!canvas || !layout || !layout.rooms) {
    console.error('drawSchematic: Missing canvas, layout, or rooms', { canvas, layout })
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('drawSchematic: Cannot get canvas context')
    return
  }
  const CW = canvas.width, CH = canvas.height
  ctx.clearRect(0, 0, CW, CH)
  const { rooms, plotL, plotW, facing, EW } = layout
  if (!rooms || rooms.length === 0) {
    console.error('drawSchematic: No rooms to draw')
    return
  }
  
  // Validate plot dimensions
  if (!isFinite(plotL) || !isFinite(plotW) || plotL <= 0 || plotW <= 0) {
    console.error('drawSchematic: Invalid plot dimensions', { plotL, plotW })
    return
  }
  
  const ML = 70, MR = 46, MT = 56, MB = 86
  const sc  = Math.min((CW - ML - MR) / plotL, (CH - MT - MB) / plotW)
  
  if (!isFinite(sc) || sc <= 0 || sc === Infinity) {
    console.error('drawSchematic: Invalid scale factor', { sc })
    return
  }
  
  const OX  = ML, OY = MT, PW = plotL * sc, PH = plotW * sc
  const WT  = EW * sc
  
  if (!isFinite(WT) || !isFinite(PW) || !isFinite(PH)) {
    console.error('drawSchematic: Invalid calculated dimensions', { WT, PW, PH })
    return
  }
  const px  = x => OX + x * sc
  const py  = y => OY + (plotW - y) * sc

  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, CW, CH)

  // Exterior walls — thick filled
  const wt = Math.max(3, WT * 0.85)
  ctx.fillStyle = '#0f1923'
  ctx.fillRect(OX, OY, PW, wt);           ctx.fillRect(OX, OY + PH - wt, PW, wt)
  ctx.fillRect(OX, OY, wt, PH);           ctx.fillRect(OX + PW - wt, OY, wt, PH)

  // Interior partitions
  const iw2 = Math.max(1.5, wt * 0.38)
  rooms.filter(r => hasRoomBox(r) && r.type !== 'balcony' && !r.inside).forEach(r => {
    const [rx, ry, rw, rh] = [px(r.x1), py(r.y2), r.w * sc, r.h * sc]
    if (rw < 2 || rh < 2) return
    ctx.strokeStyle = '#0f1923'; ctx.lineWidth = iw2; ctx.lineCap = 'square'
    ctx.strokeRect(rx, ry, rw, rh)
    if (r.type === 'bedroom' && r.bathBox) {
      const b = r.bathBox
      ctx.strokeStyle = '#2460a0'; ctx.lineWidth = Math.max(1, iw2 * 0.7)
      ctx.strokeRect(px(b.x1), py(b.y2), (b.x2 - b.x1) * sc, (b.y2 - b.y1) * sc)
    }
  })

  // Windows — 3-line symbol
  const eps = EW + 0.08
  rooms.filter(r => hasRoomBox(r) && !r.inside).forEach(r => {
    try {
      const [rx, ry, rw, rh] = [px(r.x1), py(r.y2), r.w * sc, r.h * sc]
      if (rw < 20 || rh < 20) return
      if (!isFinite(rw) || !isFinite(rh) || !isFinite(rx) || !isFinite(ry)) return
      const wL = Math.min(rw * 0.38, sc * 0.9, 44), wT = Math.max(4, wt * 0.6)
      if (!isFinite(wL) || !isFinite(wT) || wL <= 0 || wT <= 0) return
      if (r.y2 >= plotW - eps) drawWinLine(ctx, rx + rw/2, ry,         wL, wT, 'h')
      if (r.y1 <= eps)          drawWinLine(ctx, rx + rw/2, ry + rh,   wL, wT, 'h')
      if (r.x1 <= eps)          drawWinLine(ctx, rx,         ry + rh/2, wL, wT, 'v')
      if (r.x2 >= plotL - eps)  drawWinLine(ctx, rx + rw,   ry + rh/2, wL, wT, 'v')
    } catch (e) {
      console.error('Error drawing windows for schematic:', e)
    }
  })

  // Doors
  rooms.filter(r => hasRoomBox(r) && !['balcony','garage','stair'].includes(r.type) && !r.inside).forEach(r => {
    try {
      const [rx, ry, rw, rh] = [px(r.x1), py(r.y2), r.w * sc, r.h * sc]
      if (rw < 20 || rh < 20) return
      if (!isFinite(rw) || !isFinite(rh) || !isFinite(rx) || !isFinite(ry)) return
      const dw = Math.min(rw * 0.28, sc * 0.8, 42)
      if (!isFinite(dw) || dw <= 0) return
      if (r.type === 'bathroom') drawDoor(ctx, rx + rw * 0.18, ry, dw, 'down', '#2460a0')
      else                       drawDoor(ctx, rx + rw * 0.22, ry + rh, dw, 'up', '#1a2030')
      if (r.type === 'bedroom' && r.bathBox) {
        const b = r.bathBox
        const [bx, by, bw, bh] = [px(b.x1), py(b.y2), (b.x2 - b.x1) * sc, (b.y2 - b.y1) * sc]
        if (!isFinite(bx) || !isFinite(by) || !isFinite(bw) || !isFinite(bh)) return
        const bdw = Math.min(bw * 0.52, 34)
        if (!isFinite(bdw) || bdw <= 0) return
        drawDoor(ctx, bx + bw * 0.18, by + bh, bdw, 'up', '#2460a0')
      }
    } catch (e) {
      console.error('Error drawing doors for schematic:', e)
    }
  })

  // Main door — positioned at plot boundary (exterior edge)
  try {
    const mainR = rooms.find(r => r.isMainDoor) || rooms.find(r => r.type === 'living')
    const pos = getMainDoorPlacement(mainR, facing, plotL, plotW, EW, wt, px, py)
    if (pos) {
      const mdw = Math.min(pos.span * sc * 0.32, sc, 50)
      if (isFinite(mdw) && mdw > 0) drawMainDoor(ctx, pos.cx, pos.cy, mdw, pos.swing)
    }
  } catch (e) {
    console.error('Error drawing main door for schematic:', e)
  }

  // Balcony dashed
  const bal = rooms.find(r => r.type === 'balcony')
  if (bal) {
    ctx.save(); ctx.strokeStyle = '#226040'; ctx.lineWidth = 1.4; ctx.setLineDash([6, 3])
    ctx.strokeRect(px(bal.x1), Math.min(py(bal.y1), py(bal.y2)), Math.abs(bal.w * sc), Math.abs(bal.h * sc))
    ctx.setLineDash([]); ctx.restore()
  }

  // Labels — name + sqft only
  rooms.filter(r => hasRoomBox(r) && r.type !== 'balcony' && !r.inside).forEach(r => {
    const [rx, ry, rw, rh] = [px(r.x1), py(r.y2), r.w * sc, r.h * sc]
    if (rw < 16 || rh < 16) return
    const cx = rx + rw/2, cy = ry + rh/2
    const fs = Math.max(7, Math.min(11, Math.min(rw / 7, rh * 0.22)))
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = '#0f1923'; ctx.font = `700 ${fs}px 'DM Mono',monospace`
    const parts = r.name.split(' ')
    const half  = Math.ceil(parts.length / 2)
    const l1 = parts.slice(0, half).join(' ')
    const l2 = parts.slice(half).join(' ')
    const ly  = l2 ? cy - fs * 0.6 : cy
    ctx.fillText(l1, cx, ly)
    if (l2) ctx.fillText(l2, cx, ly + fs + 2)
    if (rw > 40 && rh > 36) {
      ctx.fillStyle = '#888'; ctx.font = `400 ${fs * 0.76}px 'DM Mono',monospace`
      ctx.fillText(`${(r.area * 10.764).toFixed(0)} sqft`, cx, (l2 ? ly + fs + 14 : ly + fs + 8))
    }
    if (r.type === 'bedroom' && r.bathBox) {
      const b = r.bathBox
      const [bx, by, bw, bh] = [px(b.x1), py(b.y2), (b.x2 - b.x1) * sc, (b.y2 - b.y1) * sc]
      if (bw > 14 && bh > 14) {
        ctx.fillStyle = '#2460a0'; ctx.font = `700 ${Math.max(6, Math.min(9, bw / 5))}px 'DM Mono',monospace`
        ctx.fillText('WC', bx + bw/2, by + bh/2)
      }
    }
  })

  // Border
  ctx.strokeStyle = '#0f1923'; ctx.lineWidth = Math.max(2.4, wt * 0.6); ctx.lineCap = 'square'
  ctx.strokeRect(OX, OY, PW, PH)

  // Dimensions
  ctx.save(); ctx.font = "500 8.5px 'DM Mono',monospace"
  dimLine(ctx, OX, OY + PH + 14, OX + PW, OY + PH + 14, `${plotL.toFixed(2)}m  (${ftIn(plotL)})`, 'h')
  dimLine(ctx, OX + PW + 14, OY, OX + PW + 14, OY + PH, `${plotW.toFixed(2)}m  (${ftIn(plotW)})`, 'v')
  ctx.restore()

  drawCompass(ctx, OX - 54, OY + 28, facing)
  ctx.textAlign = 'center'; ctx.fillStyle = '#0f1923'; ctx.font = "800 12px 'Syne',sans-serif"
  ctx.fillText(`${facing.toUpperCase()} FACING — SINGLE LINE SCHEMATIC`, OX + PW/2, OY - 16)
  drawTitleBlock(ctx, OX, OY + PH + 22, PW, 55, layout, cfg, true)
}
