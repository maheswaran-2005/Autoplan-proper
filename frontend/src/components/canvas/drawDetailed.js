// drawDetailed.js — Multi-floor blueprint
import { rc, ftIn } from '../../utils/helpers.js'
import { drawWin, drawDoor, drawMainDoor, drawCompass, drawLabel, dimLine, drawTitleBlock } from './drawHelpers.js'

function drawFloor(ctx, layout, cfg, OX, OY, sc, label) {
  const { rooms, plotL, plotW, facing, EW } = layout
  const PW = plotL*sc, PH = plotW*sc
  const WT = EW*sc
  const px = x => OX + x*sc
  const py = y => OY + (plotW - y)*sc

  // Floor bg
  ctx.fillStyle = '#fdfcfa'; ctx.fillRect(OX, OY, PW, PH)

  // Grid lines inside floor
  ctx.save(); ctx.beginPath(); ctx.rect(OX, OY, PW, PH); ctx.clip()
  ctx.strokeStyle = 'rgba(120,140,170,0.055)'; ctx.lineWidth = 0.5
  const gs = sc*0.5
  for (let gx=0; gx<PW; gx+=gs) { ctx.beginPath(); ctx.moveTo(OX+gx,OY); ctx.lineTo(OX+gx,OY+PH); ctx.stroke() }
  for (let gy=0; gy<PH; gy+=gs) { ctx.beginPath(); ctx.moveTo(OX,OY+gy); ctx.lineTo(OX+PW,OY+gy); ctx.stroke() }
  ctx.restore()

  // Room fills
  rooms.filter(r=>!r.inside).forEach(r=>{
    const [rx,ry,rw,rh]=[px(r.x1),py(r.y2),r.w*sc,r.h*sc]
    if(rw<2||rh<2) return
    ctx.fillStyle=rc(r.type).f; ctx.fillRect(rx,ry,rw,rh)
  })

  // Bathroom sub-fills
  rooms.filter(r=>r.type==='bedroom'&&r.bathBox).forEach(r=>{
    const b=r.bathBox
    const [bx,by,bw,bh]=[px(b.x1),py(b.y2),(b.x2-b.x1)*sc,(b.y2-b.y1)*sc]
    ctx.fillStyle=rc('bathroom').f; ctx.fillRect(bx,by,bw,bh)
    ctx.save(); ctx.beginPath(); ctx.rect(bx,by,bw,bh); ctx.clip()
    ctx.strokeStyle='rgba(36,96,160,0.12)'; ctx.lineWidth=0.9
    for(let d=-bh;d<bw+bh;d+=6){ctx.beginPath();ctx.moveTo(bx+d,by);ctx.lineTo(bx+d+bh,by+bh);ctx.stroke()}
    ctx.restore()
  })

  // Exterior walls
  ctx.fillStyle='#232d38'
  ctx.fillRect(OX,OY,PW,WT); ctx.fillRect(OX,OY+PH-WT,PW,WT)
  ctx.fillRect(OX,OY,WT,PH); ctx.fillRect(OX+PW-WT,OY,WT,PH)

  // Interior walls
  rooms.filter(r=>r.type!=='balcony'&&!r.inside).forEach(r=>{
    const [rx,ry,rw,rh]=[px(r.x1),py(r.y2),r.w*sc,r.h*sc]
    if(rw<2||rh<2) return
    ctx.strokeStyle=rc(r.type).s; ctx.lineWidth=Math.max(1.8,WT*0.50); ctx.lineCap='square'
    ctx.strokeRect(rx,ry,rw,rh)
    if(r.type==='bedroom'&&r.bathBox){
      const b=r.bathBox
      ctx.strokeStyle='#2460a0'; ctx.lineWidth=Math.max(1.2,WT*0.35)
      ctx.strokeRect(px(b.x1),py(b.y2),(b.x2-b.x1)*sc,(b.y2-b.y1)*sc)
    }
  })

  // Windows
  const eps=EW+0.05
  rooms.filter(r=>!['bathroom','balcony','store','stair'].includes(r.type)&&!r.inside).forEach(r=>{
    const [rx,ry,rw,rh]=[px(r.x1),py(r.y2),r.w*sc,r.h*sc]
    if(rw<20||rh<20) return
    const wL=Math.min(rw*0.42,sc,52),wT=Math.max(5,WT*0.75)
    if(r.y2>=plotW-eps) drawWin(ctx,rx+rw/2,ry,wL,wT,'h')
    if(r.y1<=eps)       drawWin(ctx,rx+rw/2,ry+rh,wL,wT,'h')
    if(r.x1<=eps)       drawWin(ctx,rx,ry+rh/2,wL,wT,'v')
    if(r.x2>=plotL-eps) drawWin(ctx,rx+rw,ry+rh/2,wL,wT,'v')
    if(r.type==='bedroom'&&r.bathBox){
      const b=r.bathBox
      const [bx,by,bw,bh]=[px(b.x1),py(b.y2),(b.x2-b.x1)*sc,(b.y2-b.y1)*sc]
      const wL2=Math.min(bw*0.5,28),wT2=Math.max(4,WT*0.6)
      if(b.y2>=plotW-eps) drawWin(ctx,bx+bw/2,by,wL2,wT2,'h')
      if(b.y1<=eps)       drawWin(ctx,bx+bw/2,by+bh,wL2,wT2,'h')
      if(b.x1<=eps)       drawWin(ctx,bx,by+bh/2,wL2,wT2,'v')
      if(b.x2>=plotL-eps) drawWin(ctx,bx+bw,by+bh/2,wL2,wT2,'v')
    }
  })

  // Doors
  rooms.filter(r=>!['balcony','garage','stair'].includes(r.type)&&!r.inside).forEach(r=>{
    const [rx,ry,rw,rh]=[px(r.x1),py(r.y2),r.w*sc,r.h*sc]
    if(rw<20||rh<20) return
    const dw=Math.min(rw*0.28,sc*0.85,44)
    if(r.type==='bathroom') drawDoor(ctx,rx+rw*0.18,ry,dw,'down','#2460a0')
    else                    drawDoor(ctx,rx+rw*0.22,ry+rh,dw,'up','#2a3644')
    if(r.type==='bedroom'&&r.bathBox){
      const b=r.bathBox; const [bx,by,,bh]=[px(b.x1),py(b.y2),(b.x2-b.x1)*sc,(b.y2-b.y1)*sc]
      const bbw=(b.x2-b.x1)*sc
      drawDoor(ctx,bx+bbw*0.18,by+bh,Math.min(bbw*0.52,34),'up','#2460a0')
    }
  })

  // Main door (ground floor only)
  if (layout.floorIndex === 0) {
    const mainR=rooms.find(r=>r.isMainDoor)
    if(mainR){
      const [mrx,mry,mrw,mrh]=[px(mainR.x1),py(mainR.y2),mainR.w*sc,mainR.h*sc]
      const mdw=Math.min(mrw*0.32,sc,52),mdx=mrx+mrw*0.5
      if(facing==='South')     drawMainDoor(ctx,mdx,mry+mrh,mdw,'up')
      else if(facing==='North')drawMainDoor(ctx,mdx,mry,mdw,'down')
      else if(facing==='East') drawMainDoor(ctx,mrx+mrw,mry+mrh/2,mdw,'eleft')
      else                     drawMainDoor(ctx,mrx,mry+mrh/2,mdw,'eright')
    }
  }

  // Labels
  rooms.filter(r=>r.type!=='balcony'&&!r.inside).forEach(r=>{
    const [rx,ry,rw,rh]=[px(r.x1),py(r.y2),r.w*sc,r.h*sc]
    if(rw<12||rh<12) return
    drawLabel(ctx,r,rx,ry,rw,rh)
    if(r.type==='bedroom'&&r.bathBox){
      const b=r.bathBox
      const [bx,by,bw,bh]=[px(b.x1),py(b.y2),(b.x2-b.x1)*sc,(b.y2-b.y1)*sc]
      if(bw>12&&bh>12){
        ctx.fillStyle='#2460a0'; ctx.font=`700 ${Math.max(6,Math.min(9,bw/5))}px 'Syne',sans-serif`
        ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('WC',bx+bw/2,by+bh/2)
      }
    }
  })

  // Border
  ctx.strokeStyle='#0f1923'; ctx.lineWidth=Math.max(2.2,WT*0.55); ctx.lineCap='square'
  ctx.strokeRect(OX,OY,PW,PH)

  // Floor label badge
  ctx.save()
  const badgeH=22, bX=OX, bY=OY-badgeH-4
  ctx.fillStyle='#0f1923'; ctx.beginPath(); ctx.roundRect?ctx.roundRect(bX,bY,PW,badgeH,4):ctx.fillRect(bX,bY,PW,badgeH); ctx.fill()
  ctx.fillStyle='#d4a843'; ctx.font="700 11px 'Syne',sans-serif"; ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillText(label, OX+PW/2, bY+badgeH/2)
  ctx.restore()
}

export function drawDetailed(canvas, layout, cfg) {
  if (!canvas || !layout) return
  const ctx = canvas.getContext('2d')
  const CW = canvas.width, CH = canvas.height
  ctx.clearRect(0,0,CW,CH)

  const floors = layout.floors || [{ ...layout, floorIndex:0 }]
  const numFloors = floors.length
  const { plotL, plotW, facing, EW } = layout
  const FLOOR_LABELS = ['Ground Floor (G)', 'First Floor (G+1)', 'Second Floor (G+2)']

  // Layout all floors in columns or rows depending on count
  const SIDE_GAP = 72, TOP_GAP = 56, BOTTOM = 110, BETWEEN = 48

  // Calculate scale to fit all floors side by side
  const totalFloorW = numFloors * plotL + (numFloors-1) * (BETWEEN/40)
  const scH = (CH - TOP_GAP - BOTTOM - 30) / plotW
  const scW = (CW - SIDE_GAP*2 - (numFloors-1)*(BETWEEN)) / (numFloors * plotL)
  const sc  = Math.min(scH, scW)

  const PW = plotL*sc, PH = plotW*sc
  const totalW = numFloors*PW + (numFloors-1)*BETWEEN
  const startX = (CW - totalW) / 2

  // Page background
  ctx.fillStyle = '#fdfcfa'; ctx.fillRect(0,0,CW,CH)
  // Full grid
  ctx.strokeStyle='rgba(120,140,170,0.04)'; ctx.lineWidth=0.5
  for(let gx=0;gx<CW;gx+=sc*0.5){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,CH);ctx.stroke()}
  for(let gy=0;gy<CH;gy+=sc*0.5){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(CW,gy);ctx.stroke()}

  // Draw each floor
  floors.forEach((fl, i) => {
    const OX = startX + i*(PW+BETWEEN)
    const OY = TOP_GAP + 30
    drawFloor(ctx, fl, cfg, OX, OY, sc, FLOOR_LABELS[i] || `Floor ${i}`)

    // Dimensions (only on last floor for clarity)
    if (i === numFloors-1) {
      ctx.save(); ctx.font="400 9px 'DM Mono',monospace"
      dimLine(ctx,OX,OY+PH+18,OX+PW,OY+PH+18,`${plotL.toFixed(2)}m  (${ftIn(plotL)})`,'h')
      dimLine(ctx,OX+PW+18,OY,OX+PW+18,OY+PH,`${plotW.toFixed(2)}m  (${ftIn(plotW)})`,'v')
      ctx.restore()
    }

    // Stair arrow connecting floors (between plans)
    if (i < numFloors-1) {
      const mx = OX+PW+BETWEEN/2, my = OY+PH/2
      ctx.save()
      ctx.strokeStyle='#b8862a'; ctx.lineWidth=1.5; ctx.setLineDash([4,3])
      ctx.beginPath(); ctx.moveTo(OX+PW+6,my); ctx.lineTo(mx-12,my); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle='#b8862a'; ctx.font="600 8px 'DM Mono',monospace"; ctx.textAlign='center'
      ctx.fillText('STAIR ↑', mx, my-8)
      ctx.restore()
    }
  })

  // Title
  ctx.textAlign='center'; ctx.fillStyle='#0f1923'; ctx.font="800 13px 'Syne',sans-serif"
  const ttl=`${facing.toUpperCase()} FACING — ${numFloors>1?layout.floors.length+'-FLOOR ':''} VASTU BLUEPRINT`
  ctx.fillText(ttl, CW/2, 28)
  const tw=ctx.measureText(ttl).width
  ctx.strokeStyle='#b8862a'; ctx.lineWidth=1.5; ctx.setLineDash([])
  ctx.beginPath(); ctx.moveTo(CW/2-tw/2,32); ctx.lineTo(CW/2+tw/2,32); ctx.stroke()

  drawCompass(ctx, 36, TOP_GAP+30, facing)
  drawTitleBlock(ctx, startX, TOP_GAP+30+PH+28, totalW, 65, layout, cfg, false)
}

export function drawPlaceholder(canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W=canvas.width, H=canvas.height
  ctx.fillStyle='#f7f4ef'; ctx.fillRect(0,0,W,H)
  ctx.strokeStyle='rgba(120,140,180,.06)'; ctx.lineWidth=0.5
  for(let gx=0;gx<W;gx+=30){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke()}
  for(let gy=0;gy<H;gy+=30){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke()}
  ctx.textAlign='center'; ctx.textBaseline='middle'
  ctx.fillStyle='#c0b0a0'; ctx.font="500 13px 'Syne',sans-serif"
  ctx.fillText('Configure your plot and click Generate Plan',W/2,H/2-22)
  ctx.fillStyle='#b8862a'; ctx.font="700 16px 'Syne',sans-serif"
  ctx.fillText('Generate Vastu Floor Plan',W/2,H/2+12)
}