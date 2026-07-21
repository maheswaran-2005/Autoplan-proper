// HousePlan3D.jsx — Clean, robust 3D viewer

import { useEffect, useRef, useState } from 'react'

const CSS = `
.v3-ov{position:fixed;inset:0;z-index:9999;background:#0a1525;display:flex;flex-direction:column;font-family:'Syne',sans-serif;}
.v3-tb{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:50px;flex-shrink:0;background:rgba(8,14,30,.98);border-bottom:1px solid rgba(212,168,67,.18);}
.v3-br{display:flex;align-items:center;gap:10px;}
.v3-bi{width:30px;height:30px;background:linear-gradient(135deg,#d4a843,#9a6818);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px;}
.v3-bn{font-size:13px;font-weight:800;color:#f0e6d0;}
.v3-bs{font-size:8px;color:rgba(212,168,67,.4);letter-spacing:2px;text-transform:uppercase;}
.v3-ci{font-size:10px;color:rgba(212,168,67,.5);letter-spacing:2px;text-transform:uppercase;font-family:monospace;}
.v3-cl{width:32px;height:32px;border-radius:6px;background:rgba(200,60,60,.15);border:1px solid rgba(200,60,60,.3);color:#e07070;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.v3-cl:hover{background:rgba(200,60,60,.3);}
.v3-bd{display:flex;flex:1;overflow:hidden;}
.v3-sb{width:175px;flex-shrink:0;background:rgba(6,12,26,.97);border-right:1px solid rgba(212,168,67,.1);display:flex;flex-direction:column;overflow-y:auto;}
.v3-sc{padding:12px 12px 8px;border-bottom:1px solid rgba(212,168,67,.07);}
.v3-st{font-size:8px;color:rgba(212,168,67,.35);letter-spacing:2.5px;text-transform:uppercase;font-family:monospace;margin-bottom:7px;}
.v3-vb{width:100%;padding:7px 10px;margin-bottom:3px;border-radius:6px;background:transparent;border:1px solid rgba(212,168,67,.12);color:rgba(212,168,67,.42);font-size:10px;letter-spacing:.6px;text-transform:uppercase;cursor:pointer;transition:.15s;font-family:monospace;text-align:left;display:flex;align-items:center;gap:7px;}
.v3-vb:hover{background:rgba(212,168,67,.08);color:rgba(212,168,67,.75);border-color:rgba(212,168,67,.3);}
.v3-vb.on{background:rgba(212,168,67,.16);color:#d4a843;border-color:#d4a843;}
.v3-tg{display:flex;align-items:center;justify-content:space-between;padding:6px 3px;cursor:pointer;border-radius:5px;margin-bottom:2px;}
.v3-tg:hover{background:rgba(212,168,67,.05);}
.v3-tl{font-size:10px;color:rgba(212,168,67,.48);font-family:monospace;}
.v3-sw{width:28px;height:15px;border-radius:8px;background:rgba(255,255,255,.07);border:1px solid rgba(212,168,67,.18);position:relative;transition:.2s;flex-shrink:0;}
.v3-sw.on{background:rgba(212,168,67,.28);border-color:#d4a843;}
.v3-sw::after{content:'';position:absolute;top:2px;left:2px;width:9px;height:9px;border-radius:50%;background:#444;transition:.2s;}
.v3-sw.on::after{left:15px;background:#d4a843;}
.v3-cw{flex:1;position:relative;overflow:hidden;}
.v3-cv{display:block;width:100%;height:100%;cursor:grab;touch-action:none;}
.v3-cv:active{cursor:grabbing;}
.v3-bt{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(6,12,26,.9);border:1px solid rgba(212,168,67,.14);border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:14px;z-index:3;}
.v3-ht{font-size:9px;color:rgba(212,168,67,.28);letter-spacing:1px;text-transform:uppercase;font-family:monospace;}
.v3-ht b{color:rgba(212,168,67,.52);}
.v3-rb{padding:5px 12px;border-radius:5px;background:rgba(212,168,67,.1);border:1px solid rgba(212,168,67,.28);color:#d4a843;font-size:9px;cursor:pointer;font-family:monospace;text-transform:uppercase;letter-spacing:.8px;}
.v3-rb:hover{background:rgba(212,168,67,.2);}
.v3-ld{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#0a1525;z-index:20;}
.v3-sp{width:42px;height:42px;border-radius:50%;border:3px solid rgba(212,168,67,.1);border-top-color:#d4a843;animation:v3spin .7s linear infinite;}
.v3-lt{font-size:10px;color:rgba(212,168,67,.38);letter-spacing:2px;text-transform:uppercase;font-family:monospace;}
@keyframes v3spin{to{transform:rotate(360deg)}}
.v3-ob{width:100%;padding:20px;border-radius:10px;background:linear-gradient(135deg,rgba(212,168,67,.08),rgba(212,168,67,.03));border:1.5px dashed rgba(212,168,67,.28);color:#d4a843;font-size:13px;font-weight:700;cursor:pointer;transition:.2s;font-family:'Syne',sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;}
.v3-ob:hover{background:rgba(212,168,67,.12);border-color:#d4a843;transform:translateY(-1px);}
`

// ── Texture makers (all safe, no external deps) ──────────────────
function mkWallCanvas(r, g, b) {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 4000; i++) {
    const v = Math.random() * 40 - 20
    const rr = Math.max(0, Math.min(255, r + v)) | 0
    const gg = Math.max(0, Math.min(255, g + v * 0.8)) | 0
    const bb = Math.max(0, Math.min(255, b + v * 0.6)) | 0
    ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',0.2)'
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
  }
  const dr = Math.max(0, r - 55) | 0
  const dg = Math.max(0, g - 48) | 0
  const db = Math.max(0, b - 38) | 0
  ctx.strokeStyle = 'rgba(' + dr + ',' + dg + ',' + db + ',0.4)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 256; i += 28) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke()
  }
  ctx.lineWidth = 1
  for (let row = 0; row < 10; row++) {
    const off = row % 2 === 0 ? 0 : 56
    for (let j = off; j < 256; j += 112) {
      ctx.beginPath(); ctx.moveTo(j, row * 28); ctx.lineTo(j, row * 28 + 28); ctx.stroke()
    }
  }
  return c
}

function mkRoofCanvas() {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 128
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.fillStyle = '#5a1602'; ctx.fillRect(0, 0, 256, 128)
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 8; col++) {
      const ox = row % 2 === 0 ? 0 : 16
      const tx = col * 32 + ox, ty = row * 20
      const v = (Math.random() * 25) | 0
      ctx.fillStyle = 'rgb(' + (100 + v) + ',' + (28 + (v * 0.3) | 0) + ',4)'
      ctx.fillRect(tx + 1, ty + 1, 30, 18)
      ctx.fillStyle = 'rgba(255,110,30,0.15)'; ctx.fillRect(tx + 1, ty + 1, 30, 4)
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(tx + 1, ty + 16, 30, 3)
    }
  }
  return c
}

function mkGrassCanvas() {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.fillStyle = '#1c4e10'; ctx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 2000; i++) {
    const g = (40 + Math.random() * 35) | 0
    ctx.fillStyle = 'rgba(8,' + g + ',4,0.6)'
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 2, 2 + Math.random() * 4)
  }
  return c
}

function mkFloorCanvas(r, g, b) {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
  ctx.fillRect(0, 0, 128, 128)
  const dr = Math.max(0, r - 40) | 0
  const dg = Math.max(0, g - 32) | 0
  const db = Math.max(0, b - 25) | 0
  ctx.strokeStyle = 'rgba(' + dr + ',' + dg + ',' + db + ',0.55)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 128; i += 40) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(128, i); ctx.stroke()
  }
  return c
}

function mkConcCanvas() {
  const c = document.createElement('canvas')
  c.width = 128; c.height = 128
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.fillStyle = '#806a38'; ctx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 2000; i++) {
    const v = Math.random() * 20 - 10
    const bv = (148 + v) | 0
    ctx.fillStyle = 'rgba(' + bv + ',' + Math.max(0, bv - 12) + ',' + Math.max(0, bv - 25) + ',0.3)'
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2)
  }
  return c
}

const PAL = {
  living:  { fr: 195, fg: 165, fb: 118, wall: 0xb89a6a, name: 'Living Room' },
  kitchen: { fr: 128, fg: 178, fb: 120, wall: 0x80b278, name: 'Kitchen' },
  bedroom: { fr: 112, fg: 148, fb: 200, wall: 0x7094c8, name: 'Bedroom' },
  bathroom:{ fr: 100, fg: 168, fb: 185, wall: 0x64a8b9, name: 'Bathroom' },
  dining:  { fr: 195, fg: 155, fb: 108, wall: 0xc29b6c, name: 'Dining' },
  pooja:   { fr: 210, fg: 192, fb: 48,  wall: 0xd2c030, name: 'Pooja Room' },
  balcony: { fr: 138, fg: 185, fb: 128, wall: 0x8ab980, name: 'Terrace' },
  garage:  { fr: 148, fg: 148, fb: 148, wall: 0x949494, name: 'Garage' },
  store:   { fr: 168, fg: 148, fb: 115, wall: 0xa89473, name: 'Store' },
  study:   { fr: 122, fg: 150, fb: 208, wall: 0x7a96d0, name: 'Study' },
  stair:   { fr: 162, fg: 148, fb: 118, wall: 0xa29476, name: 'Staircase' },
  servant: { fr: 140, fg: 165, fb: 132, wall: 0x8ca584, name: 'Servant Rm' },
  default: { fr: 148, fg: 148, fb: 148, wall: 0x949494, name: 'Room' },
}

export default function HousePlan3D({ layout, cfg }) {
  const wrapRef = useRef(null)
  const rendRef = useRef(null)
  const rafRef  = useRef(null)
  const roofRef = useRef(null)
  const terrRef = useRef(null)
  const extRef  = useRef([])
  const orb     = useRef({ theta: -0.65, phi: 0.85, r: 30, dragging: false, lx: 0, ly: 0, pinch: 0 })

  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(true)
  const [view,    setView]    = useState('3d')
  const [roof,    setRoof]    = useState(true)
  const [terrace, setTerrace] = useState(false)
  const [inside,  setInside]  = useState(false)

  const nf = layout ? (layout.numFloors || 1) : 1

  useEffect(() => {
    if (!open || !layout || !wrapRef.current) return
    let alive = true
    extRef.current = []
    setLoading(true)

    const loadThree = () => new Promise(resolve => {
      if (window.THREE) return resolve(window.THREE)
      const existing = document.querySelector('script[src*="three.min.js"]')
      if (existing) {
        existing.addEventListener('load', () => resolve(window.THREE))
        return
      }
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      s.onload = () => resolve(window.THREE)
      document.head.appendChild(s)
    })

    loadThree().then(T => {
      if (!alive || !wrapRef.current) return
      buildScene(T)
      setLoading(false)
    })

    return () => {
      alive = false
      cancelAnimationFrame(rafRef.current)
      const el = rendRef.current && rendRef.current.domElement
      if (el && el.parentNode) el.parentNode.removeChild(el)
      if (rendRef.current) rendRef.current.dispose()
      rendRef.current = null
    }
  }, [open, layout])

  useEffect(() => {
    if (roofRef.current) roofRef.current.visible = roof && !terrace && !inside
    if (terrRef.current) terrRef.current.visible = terrace
  }, [roof, terrace, inside])

  useEffect(() => {
    extRef.current.forEach(function(m) { m.visible = !inside })
    if (roofRef.current) roofRef.current.visible = roof && !terrace && !inside
  }, [inside])

  useEffect(() => {
    if (!layout) return
    const o = orb.current
    const s = Math.max(layout.plotL || 12, layout.plotW || 9)
    const numF = layout.numFloors || 1
    const R = s * (1.6 + numF * 0.3)
    const presets = {
      '3d':    { theta: -0.65, phi: 0.85, r: R },
      'front': { theta: 0,     phi: 0.80, r: R * 0.85 },
      'corner':{ theta: -0.78, phi: 0.72, r: R * 1.0 },
      'side':  { theta: 1.57,  phi: 0.80, r: R * 0.85 },
      'aerial':{ theta: -0.5,  phi: 0.18, r: R * 1.4 },
      'inside':{ theta: -0.5,  phi: 1.20, r: s * 0.7 },
    }
    // Rotate camera to face the front door based on facing direction
    const facingDir = layout.facing || 'South'
    if (facingDir === 'East')  { presets['3d'].theta = -1.57; presets['front'].theta = -1.57; presets['corner'].theta = -2.35 }
    if (facingDir === 'West')  { presets['3d'].theta =  1.57; presets['front'].theta =  1.57; presets['corner'].theta =  0.78 }
    if (facingDir === 'North') { presets['3d'].theta =  2.50; presets['front'].theta =  3.14; presets['corner'].theta =  2.35 }
    const p = presets[view] || presets['3d']
    o.theta = p.theta; o.phi = p.phi; o.r = p.r
    if (view === 'inside') setInside(true)
    else setInside(false)
  }, [view, layout])

  function buildScene(T) {
    const wrap = wrapRef.current
    const W = wrap.clientWidth
    const H = wrap.clientHeight || 600

    const renderer = new T.WebGLRenderer({ antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = T.PCFSoftShadowMap
    renderer.toneMapping = T.NoToneMapping
    renderer.setClearColor(0x0a1525)
    renderer.domElement.className = 'v3-cv'
    wrap.appendChild(renderer.domElement)
    rendRef.current = renderer

    const camera = new T.PerspectiveCamera(44, W / H, 0.1, 600)
    const scene = new T.Scene()
    scene.background = new T.Color(0x0a1525)
    scene.fog = new T.Fog(0x0a1525, 110, 280)

    const skyGeo = new T.SphereGeometry(290, 12, 8)
    const skyMat = new T.MeshBasicMaterial({ color: 0x0c1e44, side: T.BackSide })
    scene.add(new T.Mesh(skyGeo, skyMat))

    scene.add(new T.AmbientLight(0xffffff, 0.30))

    const sun = new T.DirectionalLight(0xfff0d0, 1.8)
    sun.position.set(28, 55, 20)
    sun.castShadow = true
    sun.shadow.mapSize.width = 2048
    sun.shadow.mapSize.height = 2048
    sun.shadow.camera.left = -70
    sun.shadow.camera.right = 70
    sun.shadow.camera.top = 70
    sun.shadow.camera.bottom = -70
    sun.shadow.camera.far = 200
    sun.shadow.bias = -0.0004
    scene.add(sun)

    const fill = new T.DirectionalLight(0xd0e0ff, 0.55)
    fill.position.set(-30, 25, 8)
    scene.add(fill)

    const back = new T.DirectionalLight(0xffd8a0, 0.38)
    back.position.set(15, 12, -35)
    scene.add(back)

    const floors = layout.floors || [Object.assign({}, layout, { floorIndex: 0 })]
    const numFloors = floors.length
    const plotL = layout.plotL
    const plotW = layout.plotW
    const EW = layout.EW || 0.23
    const ox = -plotL / 2
    const oz = -plotW / 2
    const WALL_H = 3.2
    const SLAB = 0.24
    const PLINTH = 0.5

    const targetY = (PLINTH + WALL_H) * numFloors * 0.32 + 1
    const TARGET = new T.Vector3(0, targetY, 0)
    orb.current.r = Math.max(plotL, plotW) * (1.6 + numFloors * 0.3)

    function makeTex(canvas, rx, ry) {
      var t = new T.CanvasTexture(canvas)
      t.wrapS = T.RepeatWrapping
      t.wrapT = T.RepeatWrapping
      t.repeat.set(rx || 4, ry || 4)
      return t
    }

    function LM(col) { return new T.MeshLambertMaterial({ color: col }) }
    function LMT(canvas, rx, ry) { return new T.MeshLambertMaterial({ map: makeTex(canvas, rx, ry) }) }

    const wallMatGF = LMT(mkWallCanvas(145, 115, 72), 2, 1.5)
    const wallMatGS = LMT(mkWallCanvas(130, 102, 62), 2, 1.5)
    const wallMat1F = LMT(mkWallCanvas(162, 132, 88), 2, 1.5)
    const wallMat1S = LMT(mkWallCanvas(148, 118, 75), 2, 1.5)
    const wallMat2F = LMT(mkWallCanvas(178, 150, 105), 2, 1.5)
    const wallMat2S = LMT(mkWallCanvas(165, 138, 92), 2, 1.5)

    const roofMat   = LMT(mkRoofCanvas(), 4, 3)
    const grassMat  = LMT(mkGrassCanvas(), 20, 20)
    const concMat   = LMT(mkConcCanvas(), 4, 4)
    const terrMat   = LMT(mkWallCanvas(120, 105, 65), 5, 5)

    const goldM   = new T.MeshLambertMaterial({ color: 0xc89820, emissive: 0x4a3000, emissiveIntensity: 0.2 })
    const tileM   = LM(0xa07818)
    const copM    = LM(0xb89050)
    const parM    = LM(0xa89060)
    const plinthM = LM(0x9a7840)
    const cmpM    = LMT(mkWallCanvas(108, 92, 68), 2, 2)
    const lintM   = LM(0x886228)
    const bandM   = LM(0x9a7820)
    const slabM   = LM(0x887848)
    const railM   = LM(0xa89870)
    const eaveM   = LM(0x6a4818)
    const ridgeM  = LM(0x501402)
    const frameM  = LM(0xf0ede5)
    const glassM  = new T.MeshLambertMaterial({ color: 0x4488ff, transparent: true, opacity: 0.72 })
    const grillM  = LM(0x1c1c28)
    const sillM   = LM(0x8c6818)
    const doorM   = LM(0x2e1204)
    const doorFrM = new T.MeshLambertMaterial({ color: 0xc89820, emissive: 0x4a3000, emissiveIntensity: 0.15 })
    const knobM   = new T.MeshLambertMaterial({ color: 0xd4a030, emissive: 0x6a4000, emissiveIntensity: 0.25 })
    const colM    = LM(0xe8dac8)
    const stepM   = LM(0x888050)
    const leafM   = LM(0x1a5c0e)
    const trunkM  = LM(0x4a2408)
    const shrubM  = LM(0x255210)
    const lampPolM= LM(0x9098a0)
    const lampGlM = new T.MeshLambertMaterial({ color: 0xfffcc0, emissive: 0xffd040, emissiveIntensity: 1.0 })
    const ironM   = LM(0x1a1828)

    function addMesh(geo, mat, x, y, z, ext) {
      var m = new T.Mesh(geo, mat)
      m.position.set(x, y, z)
      m.castShadow = true
      m.receiveShadow = true
      if (ext) {
        m.userData.ext = true
        extRef.current.push(m)
      }
      scene.add(m)
      return m
    }

    function box(w, h, d, mat, x, y, z, ext) {
      return addMesh(new T.BoxGeometry(w, h, d), mat, x, y, z, ext)
    }

    function cylinder(rTop, rBot, h, seg, mat, x, y, z) {
      return addMesh(new T.CylinderGeometry(rTop, rBot, h, seg), mat, x, y, z)
    }

    // ── Ground & Foundation ──
    var ground = new T.Mesh(new T.PlaneGeometry(380, 380), grassMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    box(plotL + 0.7, 0.3, plotW + 0.7, concMat, 0, 0.15, 0)
    box(plotL + 0.22, 0.26, plotW + 0.22, plinthM, 0, 0.43, 0)

    var roofGrp = new T.Group()
    scene.add(roofGrp)
    roofRef.current = roofGrp

    var terrGrp = new T.Group()
    terrGrp.visible = false
    scene.add(terrGrp)
    terrRef.current = terrGrp

    // ══════════ BUILD EACH FLOOR ══════════
    floors.forEach(function(fl, fi) {
      var baseY = PLINTH + fi * (WALL_H + SLAB)
      var wy = baseY + WALL_H / 2
      var wt = EW

      var wA = fi === 0 ? wallMatGF : fi === 1 ? wallMat1F : wallMat2F
      var wB = fi === 0 ? wallMatGS : fi === 1 ? wallMat1S : wallMat2S

      if (fi > 0) {
        box(plotL + 0.2, SLAB, plotW + 0.2, slabM, 0, baseY - SLAB / 2, 0)
        var bH = 0.25, bY2 = baseY - SLAB - bH / 2
        box(plotL + 0.38, bH, wt * 2.4, bandM, 0, bY2, oz)
        box(plotL + 0.38, bH, wt * 2.4, bandM, 0, bY2, oz + plotW)
        box(wt * 2.4, bH, plotW + 0.32, bandM, ox, bY2, 0)
        box(wt * 2.4, bH, plotW + 0.32, bandM, ox + plotL, bY2, 0)
      }

      // ── EXTERIOR WALLS ──
      box(plotL, WALL_H, wt, wA, 0, wy, oz + wt / 2, true)
      box(plotL, WALL_H, wt, wB, 0, wy, oz + plotW - wt / 2, true)
      box(wt, WALL_H, plotW, wB, ox + wt / 2, wy, 0, true)
      box(wt, WALL_H, plotW, wA, ox + plotL - wt / 2, wy, 0, true)

      var lY = baseY + WALL_H * 0.66
      box(plotL + 0.08, 0.12, wt + 0.08, lintM, 0, lY, oz, true)
      box(plotL + 0.08, 0.12, wt + 0.08, lintM, 0, lY, oz + plotW, true)
      box(wt + 0.08, 0.12, plotW + 0.08, lintM, ox, lY, 0, true)
      box(wt + 0.08, 0.12, plotW + 0.08, lintM, ox + plotL, lY, 0, true)

      var cpH = WALL_H + (fi === 0 ? 0.24 : 0.1)
      var corners = [[ox, oz], [ox + plotL, oz], [ox, oz + plotW], [ox + plotL, oz + plotW]]
      corners.forEach(function(c) {
        box(wt + 0.24, cpH, wt + 0.24, tileM, c[0], baseY + cpH / 2, c[1], true)
      })

      // ── WINDOWS (skip bathroom/store/stair for full windows, but add small frosted for bathroom) ──
      var eps = wt + 0.06
      var winY = baseY + WALL_H * 0.63
      // Full windows for non-wet rooms
      fl.rooms.filter(function(r) {
        return !['bathroom', 'store', 'stair'].includes(r.type) && !r.inside
      }).forEach(function(r) {
        var rx = ox + r.x1 + r.w / 2
        var rz = oz + r.y1 + r.h / 2

        function placeWin(wx, wy2, wz, horiz) {
          var wW = horiz ? Math.min(1.45, r.w * 0.44) : wt * 2.5
          var wH = 1.1
          var wD = horiz ? wt * 2.5 : Math.min(1.45, r.h * 0.44)
          if (horiz) {
            var chSign = wz < 0 ? -1 : 1
            box(wW + 0.65, 0.1, 0.42, sillM, wx, wy2 - wH * 0.52 - 0.06, wz + wt * 0.2 * chSign, true)
          }
          box(wW + 0.32, wH + 0.28, wD + 0.12, sillM, wx, wy2, wz, true)
          box(wW + 0.14, wH + 0.14, wD + 0.06, frameM, wx, wy2, wz, true)
          if (horiz) {
            box(wW * 0.44, wH * 0.88, wt * 0.15, glassM, wx - wW * 0.27, wy2, wz, true)
            box(wW * 0.44, wH * 0.88, wt * 0.15, glassM, wx + wW * 0.27, wy2, wz, true)
            box(0.06, wH * 0.9, wt * 0.16, frameM, wx, wy2, wz, true)
            for (var b = 0; b < 6; b++) {
              box(0.03, wH * 0.82, wt * 0.2, grillM, wx - wW * 0.5 + wW * (b + 0.5) / 6, wy2, wz, true)
            }
          } else {
            box(wt * 0.15, wH * 0.44, wD * 0.45, glassM, wx, wy2 + wH * 0.27, wz, true)
            box(wt * 0.15, wH * 0.44, wD * 0.45, glassM, wx, wy2 - wH * 0.27, wz, true)
            box(wt * 0.15, 0.05, wD * 0.9, frameM, wx, wy2, wz, true)
          }
        }

        if (r.y2 >= plotW - eps) placeWin(rx, winY, oz + r.y2, true)
        if (r.y1 <= eps)         placeWin(rx, winY, oz + r.y1, true)
        if (r.x1 <= eps)         placeWin(ox + r.x1, winY, rz, false)
        if (r.x2 >= plotL - eps) placeWin(ox + r.x2, winY, rz, false)
      })

      // ── Small frosted ventilation windows for bathroom ──
      var bathWinY = baseY + WALL_H * 0.78
      var frostedM = new T.MeshLambertMaterial({ color: 0x88bbff, transparent: true, opacity: 0.65 })
      fl.rooms.filter(function(r) { return r.type === 'bathroom' && !r.inside }).forEach(function(r) {
        var rx = ox + r.x1 + r.w / 2
        var rz = oz + r.y1 + r.h / 2
        var bwW = 0.55, bwH = 0.55, bwD = wt + 0.1
        if (r.y1 <= eps) {
          box(bwW + 0.16, bwH + 0.16, bwD, sillM, rx, bathWinY, oz + r.y1, true)
          box(bwW + 0.06, bwH + 0.06, bwD * 0.5, frameM, rx, bathWinY, oz + r.y1, true)
          box(bwW, bwH, wt * 0.12, frostedM, rx, bathWinY, oz + r.y1, true)
        }
        if (r.y2 >= plotW - eps) {
          box(bwW + 0.16, bwH + 0.16, bwD, sillM, rx, bathWinY, oz + r.y2, true)
          box(bwW + 0.06, bwH + 0.06, bwD * 0.5, frameM, rx, bathWinY, oz + r.y2, true)
          box(bwW, bwH, wt * 0.12, frostedM, rx, bathWinY, oz + r.y2, true)
        }
        if (r.x1 <= eps) {
          box(bwD, bwH + 0.16, bwW + 0.16, sillM, ox + r.x1, bathWinY, rz, true)
          box(bwD * 0.5, bwH + 0.06, bwW + 0.06, frameM, ox + r.x1, bathWinY, rz, true)
          box(wt * 0.12, bwH, bwW, frostedM, ox + r.x1, bathWinY, rz, true)
        }
        if (r.x2 >= plotL - eps) {
          box(bwD, bwH + 0.16, bwW + 0.16, sillM, ox + r.x2, bathWinY, rz, true)
          box(bwD * 0.5, bwH + 0.06, bwW + 0.06, frameM, ox + r.x2, bathWinY, rz, true)
          box(wt * 0.12, bwH, bwW, frostedM, ox + r.x2, bathWinY, rz, true)
        }
      })

      // ── ROOM FLOORS ──
      fl.rooms.filter(function(r) { return !r.inside }).forEach(function(r) {
        var pal = PAL[r.type] || PAL.default
        var fMat = LMT(mkFloorCanvas(pal.fr, pal.fg, pal.fb), 3, 3)
        var flMesh = new T.Mesh(new T.PlaneGeometry(r.w - 0.06, r.h - 0.06), fMat)
        flMesh.rotation.x = -Math.PI / 2
        flMesh.position.set(ox + r.x1 + r.w / 2, baseY + 0.02, oz + r.y1 + r.h / 2)
        flMesh.receiveShadow = true
        scene.add(flMesh)
      })

      // ── INTERIOR PARTITION WALLS ──
      var iT = wt * 0.42, iH = WALL_H * 0.97
      fl.rooms.filter(function(r) { return !r.inside }).forEach(function(r) {
        var pal = PAL[r.type] || PAL.default
        var wm = new T.MeshLambertMaterial({ color: pal.wall })
        var rx = ox + r.x1 + r.w / 2
        var rz = oz + r.y1 + r.h / 2
        var iy = baseY + iH / 2
        if (r.y2 < plotW - wt) box(r.w, iH, iT, wm, rx, iy, oz + r.y2)
        if (r.y1 > wt)         box(r.w, iH, iT, wm, rx, iy, oz + r.y1)
        if (r.x1 > wt)         box(iT, iH, r.h, wm, ox + r.x1, iy, rz)
        if (r.x2 < plotL - wt) box(iT, iH, r.h, wm, ox + r.x2, iy, rz)
      })

      // ── INTERIOR ROOM DOORS ──
      fl.rooms.filter(function(r) {
        return !['balcony', 'garage', 'stair'].includes(r.type) && !r.inside
      }).forEach(function(r) {
        var dH = 2.15
        var dW = Math.min(0.82, r.w * 0.28)
        var dBase = baseY + dH / 2
        var rx = ox + r.x1 + r.w / 2
        if (r.y2 < plotW - wt && r.y2 > wt + 0.5) {
          box(dW, dH, wt * 0.18, doorM, rx - r.w * 0.18, dBase, oz + r.y2)
          box(dW + 0.1, dH + 0.1, wt * 0.06, frameM, rx - r.w * 0.18, dBase, oz + r.y2)
          addMesh(new T.SphereGeometry(0.04, 6, 6), knobM, rx - r.w * 0.18 + dW * 0.38, dBase + 0.12, oz + r.y2 + 0.05)
        }
      })

      // ── ROOM LABELS ──
      fl.rooms.filter(function(r) { return !r.inside }).forEach(function(r) {
        var pal = PAL[r.type] || PAL.default
        var lc = document.createElement('canvas')
        lc.width = 256; lc.height = 80
        var lx = lc.getContext('2d')
        if (!lx) return
        lx.fillStyle = 'rgba(0,0,0,0.68)'
        lx.beginPath()
        lx.rect(4, 4, 248, 72)
        lx.fill()
        lx.fillStyle = '#ffffff'
        lx.font = 'bold 19px Arial'
        lx.textAlign = 'center'
        lx.textBaseline = 'middle'
        lx.fillText(pal.name, 128, 28)
        lx.fillStyle = 'rgba(255,255,255,0.5)'
        lx.font = '13px Arial'
        var sqft = ((r.w * r.h) * 10.764).toFixed(0)
        lx.fillText(sqft + ' sq.ft', 128, 54)
        var lm = new T.Mesh(
          new T.PlaneGeometry(r.w * 0.82, r.h * 0.36),
          new T.MeshBasicMaterial({ map: new T.CanvasTexture(lc), transparent: true, depthWrite: false, side: T.DoubleSide })
        )
        lm.rotation.x = -Math.PI / 2
        lm.position.set(ox + r.x1 + r.w / 2, baseY + 0.08, oz + r.y1 + r.h / 2)
        scene.add(lm)
      })

      // ── PARAPET / RAILING ──
      var pY = baseY + WALL_H
      if (fi === numFloors - 1) {
        var pH = 0.75, pT = 0.14
        box(plotL + pT * 2, pH, pT, parM, 0, pY + pH / 2, oz)
        box(plotL + pT * 2, pH, pT, parM, 0, pY + pH / 2, oz + plotW)
        box(pT, pH, plotW, parM, ox, pY + pH / 2, 0)
        box(pT, pH, plotW, parM, ox + plotL, pY + pH / 2, 0)
        box(plotL + 0.28, 0.1, pT + 0.1, copM, 0, pY + pH + 0.05, oz)
        box(plotL + 0.28, 0.1, pT + 0.1, copM, 0, pY + pH + 0.05, oz + plotW)
        box(pT + 0.1, 0.1, plotW + 0.1, copM, ox, pY + pH + 0.05, 0)
        box(pT + 0.1, 0.1, plotW + 0.1, copM, ox + plotL, pY + pH + 0.05, 0)
        var tf = new T.Mesh(new T.PlaneGeometry(plotL - 0.1, plotW - 0.1), terrMat)
        tf.rotation.x = -Math.PI / 2
        tf.position.set(0, pY + 0.025, 0)
        tf.receiveShadow = true
        terrGrp.add(tf)
      } else {
        var rH2 = 0.9, rT = 0.065
        var postsX = Math.floor(plotL / 1.0)
        var spX = plotL / (postsX + 1)
        for (var p = 0; p <= postsX; p++) {
          box(rT, rH2, rT, railM, ox + (p + 0.5) * spX, pY + rH2 / 2, oz)
          box(rT, rH2, rT, railM, ox + (p + 0.5) * spX, pY + rH2 / 2, oz + plotW)
        }
        var postsZ = Math.floor(plotW / 1.0)
        var spZ = plotW / (postsZ + 1)
        for (var q = 0; q <= postsZ; q++) {
          box(rT, rH2, rT, railM, ox, pY + rH2 / 2, oz + (q + 0.5) * spZ)
          box(rT, rH2, rT, railM, ox + plotL, pY + rH2 / 2, oz + (q + 0.5) * spZ)
        }
        box(plotL + 0.1, 0.07, rT + 0.04, copM, 0, pY + rH2 + 0.035, oz)
        box(plotL + 0.1, 0.07, rT + 0.04, copM, 0, pY + rH2 + 0.035, oz + plotW)
        box(rT + 0.04, 0.07, plotW + 0.1, copM, ox, pY + rH2 + 0.035, 0)
        box(rT + 0.04, 0.07, plotW + 0.1, copM, ox + plotL, pY + rH2 + 0.035, 0)
      }
    })

    // ══════════ MAIN ENTRANCE — ALL 4 DIRECTIONS ══════════
    var mainRoom = floors[0].rooms.find(function(r) { return r.isMainDoor })
    if (mainRoom) {
      var facing = layout.facing || 'South'
      var dY = PLINTH

      // Room center
      var roomCx = ox + mainRoom.x1 + mainRoom.w / 2
      var roomCz = oz + mainRoom.y1 + mainRoom.h / 2

      // outX/outZ: unit vector pointing OUTWARD from building
      // perpX/perpZ: unit vector ALONG the wall (lateral)
      // outerFace: the Z or X coordinate of the wall's exterior face
      // isZWall: true = North/South walls (Z-axis), false = East/West (X-axis)
      var doorX, doorZ2, outX, outZ2, perpX, perpZ2, isZWall

      if (facing === 'South') {
        // South wall center at oz+wt/2, outer face = oz
        outX=0; outZ2=-1; perpX=1; perpZ2=0; isZWall=true
        doorX = roomCx; doorZ2 = oz
      } else if (facing === 'North') {
        // North wall outer face = oz+plotW
        outX=0; outZ2=1; perpX=1; perpZ2=0; isZWall=true
        doorX = roomCx; doorZ2 = oz + plotW
      } else if (facing === 'East') {
        // East wall outer face = ox+plotL
        outX=1; outZ2=0; perpX=0; perpZ2=1; isZWall=false
        doorX = ox + plotL; doorZ2 = roomCz
      } else {
        // West wall outer face = ox
        outX=-1; outZ2=0; perpX=0; perpZ2=1; isZWall=false
        doorX = ox; doorZ2 = roomCz
      }

      // dbox/dcyl/dmesh: lat=lateral offset, yy=Y, out=outward distance
      // All entrance elements are marked ext=true so they hide in Inside View
      function dbox(w, h, d, mat, lat, yy, out) {
        var px = doorX + perpX * lat + outX * out
        var pz = doorZ2 + perpZ2 * lat + outZ2 * out
        var fw = isZWall ? w : d
        var fd = isZWall ? d : w
        box(fw, h, fd, mat, px, yy, pz, true)
      }
      function dcyl(rTop, rBot, h, seg, mat, lat, yy, out) {
        var px = doorX + perpX * lat + outX * out
        var pz = doorZ2 + perpZ2 * lat + outZ2 * out
        var m = new T.Mesh(new T.CylinderGeometry(rTop, rBot, h, seg), mat)
        m.position.set(px, yy, pz)
        m.castShadow = true; m.receiveShadow = true
        m.userData.ext = true
        extRef.current.push(m)
        scene.add(m)
      }
      function dmesh(geo, mat, lat, yy, out) {
        var px = doorX + perpX * lat + outX * out
        var pz = doorZ2 + perpZ2 * lat + outZ2 * out
        var m = new T.Mesh(geo, mat)
        m.position.set(px, yy, pz)
        m.castShadow = true; m.receiveShadow = true
        m.userData.ext = true
        extRef.current.push(m)
        scene.add(m)
      }

      // ── Porch columns (55cm outward) ──
      var colH = WALL_H + 0.50
      var colLats = [-1.02, 1.02]
      colLats.forEach(function(lat) {
        dbox(0.50, 0.20, 0.50, tileM,  lat, dY + 0.10,              0.55)
        dcyl(0.14, 0.18, colH, 16, colM, lat, dY + colH/2 + 0.20,   0.55)
        dcyl(0.24, 0.14, 0.28, 12, tileM,lat, dY + colH + 0.34,     0.55)
        dbox(0.50, 0.10, 0.50, tileM,  lat, dY + colH + 0.50,       0.55)
      })

      // ── Entablature beam ──
      dbox(2.60, 0.26, 0.36, tileM, 0, dY + WALL_H + 0.72, 0.55)

      // ── Canopy slab (spans from wall outward 1.3m) ──
      dbox(3.10, 0.18, 1.30, LM(0xd4c090), 0, dY + WALL_H + 0.86, 0.65)

      // ── Thin gold door frame (4 strips) ──
      dbox(0.10, 2.40, 0.10, LM(0xc89820), -0.88, dY + 1.20, 0.02)
      dbox(0.10, 2.40, 0.10, LM(0xc89820),  0.88, dY + 1.20, 0.02)
      dbox(1.86, 0.10, 0.10, LM(0xc89820),  0,    dY + 2.44, 0.02)
      dbox(1.86, 0.08, 0.10, LM(0xc89820),  0,    dY + 0.04, 0.02)

      // ── Double door leaves ──
      var leafLats = [-0.44, 0.44]
      leafLats.forEach(function(lat) {
        dbox(0.72, 2.32, 0.08, doorM,          lat, dY + 1.16, 0.05)
        dbox(0.56, 0.68, 0.04, LM(0x200e04),   lat, dY + 1.84, 0.11)
        dbox(0.56, 0.72, 0.04, LM(0x200e04),   lat, dY + 0.94, 0.11)
        dbox(0.56, 0.28, 0.04, LM(0x200e04),   lat, dY + 0.22, 0.11)
        dbox(0.64, 0.04, 0.04, goldM,           lat, dY + 2.22, 0.12)
        dbox(0.64, 0.04, 0.04, goldM,           lat, dY + 1.44, 0.12)
        dbox(0.64, 0.04, 0.04, goldM,           lat, dY + 0.50, 0.12)
        dmesh(new T.SphereGeometry(0.055,8,8), knobM, lat*0.48, dY + 1.20, 0.14)
      })

      // ── Lintel (wall-toned, thin) ──
      dbox(1.80, 0.22, EW + 0.04, LM(0xa07818), 0, dY + WALL_H * 0.90, -(EW * 0.5))

      // ── Threshold ──
      dbox(1.86, 0.06, 0.44, stepM, 0, dY + 0.03, 0.24)

      // ── 3 Granite steps outward ──
      for (var st = 0; st < 3; st++) {
        var stW  = 2.20 + st * 0.40
        var stOut = 0.50 + st * 0.46
        dbox(stW, 0.14, 0.44, concMat, 0, dY - 0.07 - st*0.14, stOut)
        dbox(stW, 0.025, 0.44, stepM,  0, dY - 0.001 - st*0.14, stOut)
      }

      // ── Porch lantern ──
      dcyl(0.035, 0.035, 0.32, 8, lampPolM, 0, dY + WALL_H + 0.68, 0.65)
      dmesh(new T.SphereGeometry(0.17,10,10), lampGlM, 0, dY + WALL_H + 0.46, 0.65)
      var plx = doorX + outX * 0.65
      var plz = doorZ2 + outZ2 * 0.65
      var pl = new T.PointLight(0xffd070, 5.0, 9)
      pl.position.set(plx, dY + WALL_H + 0.46, plz)
      scene.add(pl)
    }

    // ══════════ HIP ROOF ══════════
    var topBaseY = PLINTH + numFloors * (WALL_H + SLAB) - SLAB
    var pHRoof = 0.75
    var roofY2 = topBaseY + pHRoof + 0.08
    var ov = 0.72
    var rW = plotL + ov * 2
    var rD = plotW + ov * 2
    var rHt = Math.min(3.8, Math.max(2.2, (plotL + plotW) * 0.115))
    var ridW = rW * 0.48
    var rx0 = -rW / 2, rx1 = rW / 2, rz0 = -rD / 2, rz1 = rD / 2
    var rPeak0 = [-ridW / 2, rHt, 0]
    var rPeak1 = [ridW / 2, rHt, 0]

    function roofFace(pts) {
      var geo = new T.BufferGeometry()
      var flat = []
      pts.forEach(function(p) { flat.push(p[0], p[1], p[2]) })
      geo.setAttribute('position', new T.BufferAttribute(new Float32Array(flat), 3))
      var uv = new Float32Array(pts.length * 2)
      pts.forEach(function(p, i) { uv[i * 2] = p[0] * 0.13; uv[i * 2 + 1] = p[2] * 0.13 })
      geo.setAttribute('uv', new T.BufferAttribute(uv, 2))
      geo.computeVertexNormals()
      var m = new T.Mesh(geo, roofMat)
      m.castShadow = true
      roofGrp.add(m)
    }

    roofFace([[rx0, 0, rz0], rPeak0, rPeak1])
    roofFace([[rx0, 0, rz0], rPeak1, [rx1, 0, rz0]])
    roofFace([[rx0, 0, rz1], [rx1, 0, rz1], rPeak1])
    roofFace([[rx0, 0, rz1], rPeak1, rPeak0])
    roofFace([[rx0, 0, rz0], [rx0, 0, rz1], rPeak0])
    roofFace([[rx1, 0, rz0], rPeak1, [rx1, 0, rz1]])

    var eaveData = [[rW + 0.14, 0.18, 0.28, 0, 0, rz0], [rW + 0.14, 0.18, 0.28, 0, 0, rz1],
                    [0.28, 0.18, rD + 0.14, rx0, 0, 0], [0.28, 0.18, rD + 0.14, rx1, 0, 0]]
    eaveData.forEach(function(d) {
      var m = new T.Mesh(new T.BoxGeometry(d[0], d[1], d[2]), eaveM)
      m.position.set(d[3], d[4], d[5])
      m.castShadow = true
      roofGrp.add(m)
    })
    var ridgeMesh = new T.Mesh(new T.BoxGeometry(ridW + 0.15, 0.22, 0.34), ridgeM)
    ridgeMesh.position.set(0, rHt, 0)
    roofGrp.add(ridgeMesh)
    var finPos = [-ridW / 2, ridW / 2]
    finPos.forEach(function(fx) {
      var fin = new T.Mesh(new T.ConeGeometry(0.15, 0.5, 8), goldM)
      fin.position.set(fx, rHt + 0.25, 0)
      roofGrp.add(fin)
    })
    roofGrp.position.y = roofY2

    // ══════════ COMPOUND WALL + GATE (facing-aware) ══════════
    var cPad = 3.2, cWH = 1.42, cWT = 0.2
    var cL = plotL + cPad * 2, cD = plotW + cPad * 2
    var cOX = ox - cPad, cOZ = oz - cPad
    var gateW = 3.6
    var facingC = layout.facing || 'South'

    // Gate center aligns with the main door X or Z position
    var mainRoomC = floors[0].rooms.find(function(r) { return r.isMainDoor })
    var gateCenterX, gateCenterZ   // centre of the gate opening on compound wall

    if (facingC === 'South' || facingC === 'North') {
      // Gate on south or north compound wall — X position aligned with door
      gateCenterX = mainRoomC ? (ox + mainRoomC.x1 + mainRoomC.w / 2) : 0
      gateCenterX = Math.max(cOX + gateW / 2 + 0.3, Math.min(cOX + cL - gateW / 2 - 0.3, gateCenterX))
      gateCenterZ = (facingC === 'South') ? cOZ : (cOZ + cD)
    } else {
      // Gate on east or west compound wall — Z position aligned with door
      gateCenterZ = mainRoomC ? (oz + mainRoomC.y1 + mainRoomC.h / 2) : 0
      gateCenterZ = Math.max(cOZ + gateW / 2 + 0.3, Math.min(cOZ + cD - gateW / 2 - 0.3, gateCenterZ))
      gateCenterX = (facingC === 'East') ? (cOX + cL) : cOX
    }

    // Build the 4 compound walls with gate opening cut out of the facing wall
    if (facingC === 'South' || facingC === 'North') {
      var gz = gateCenterZ
      var gx0 = gateCenterX - gateW / 2
      var gx1 = gateCenterX + gateW / 2
      var leftLen  = gx0 - cOX
      var rightLen = (cOX + cL) - gx1
      // Front wall (with gate gap)
      if (leftLen  > 0) box(leftLen,  cWH, cWT, cmpM, cOX + leftLen/2,       cWH/2, gz)
      if (rightLen > 0) box(rightLen, cWH, cWT, cmpM, gx1 + rightLen/2,      cWH/2, gz)
      // Back wall (solid)
      var backZ = (facingC === 'South') ? (cOZ + cD) : cOZ
      box(cL, cWH, cWT, cmpM, cOX + cL/2, cWH/2, backZ)
      // Side walls
      box(cWT, cWH, cD, cmpM, cOX,       cWH/2, cOZ + cD/2)
      box(cWT, cWH, cD, cmpM, cOX + cL,  cWH/2, cOZ + cD/2)
      // Coping
      if (leftLen  > 0) box(leftLen + 0.1,  0.1, cWT+0.1, copM, cOX + leftLen/2,  cWH+0.05, gz)
      if (rightLen > 0) box(rightLen + 0.1, 0.1, cWT+0.1, copM, gx1 + rightLen/2, cWH+0.05, gz)
      box(cL+0.1, 0.1, cWT+0.1, copM, cOX+cL/2, cWH+0.05, backZ)
      box(cWT+0.1, 0.1, cD+0.1, copM, cOX,    cWH+0.05, cOZ+cD/2)
      box(cWT+0.1, 0.1, cD+0.1, copM, cOX+cL, cWH+0.05, cOZ+cD/2)
      // Gate pillars
      var gpH2 = cWH + 0.95
      var gpXs = [gx0, gx1]
      gpXs.forEach(function(gx) {
        cylinder(0.22, 0.25, gpH2, 12, tileM, gx, gpH2/2, gz)
        addMesh(new T.SphereGeometry(0.26,8,8), goldM, gx, gpH2+0.26, gz)
        box(0.5, 0.16, 0.5, tileM, gx, gpH2*0.18, gz)
      })
      // Iron gate bars (two leaves)
      for (var gi=0; gi<12; gi++) {
        box(0.055, cWH*0.88, 0.055, ironM, gx0+0.1+gi*(gateW/2-0.2)/11, cWH*0.44, gz)
        box(0.055, cWH*0.88, 0.055, ironM, gateCenterX+0.08+gi*(gateW/2-0.2)/11, cWH*0.44, gz)
      }
      var gateCrossY = [cWH*0.3, cWH*0.65]
      gateCrossY.forEach(function(by) {
        box(gateW/2-0.14, 0.08, 0.07, ironM, gx0+gateW/4, by, gz)
        box(gateW/2-0.14, 0.08, 0.07, ironM, gateCenterX+gateW/4, by, gz)
      })
      // Driveway
      var drSign2 = (facingC === 'South') ? 1 : -1
      var drLen2 = cPad + 0.6
      var drv2 = new T.Mesh(new T.PlaneGeometry(gateW-0.44, drLen2), concMat)
      drv2.rotation.x = -Math.PI/2
      drv2.position.set(gateCenterX, 0.02, gz + drSign2 * drLen2/2)
      drv2.receiveShadow = true; scene.add(drv2)
      box(0.12, 0.08, drLen2, copM, gx0+0.2, 0.06, gz + drSign2*drLen2/2)
      box(0.12, 0.08, drLen2, copM, gx1-0.2, 0.06, gz + drSign2*drLen2/2)
      // Street lamp
      var lampX2 = gateCenterX - 2.5
      cylinder(0.065, 0.09, 4.6, 8, lampPolM, lampX2, 2.3, gz + drSign2*(-0.8))
      box(0.68, 0.07, 0.07, lampPolM, lampX2+0.34, 4.62, gz + drSign2*(-0.8))
      addMesh(new T.SphereGeometry(0.18,8,8), lampGlM, lampX2+0.68, 4.62, gz + drSign2*(-0.8))
      var sLamp2 = new T.PointLight(0xffeeb0, 3.0, 10)
      sLamp2.position.set(lampX2+0.68, 4.62, gz + drSign2*(-0.8))
      scene.add(sLamp2)
    } else {
      // East / West: gate on east or west compound wall
      var gx = gateCenterX
      var gz0 = gateCenterZ - gateW/2
      var gz1 = gateCenterZ + gateW/2
      var frontLen = gz0 - cOZ
      var backLen  = (cOZ+cD) - gz1
      // Side wall with gate gap
      if (frontLen > 0) box(cWT, cWH, frontLen, cmpM, gx, cWH/2, cOZ+frontLen/2)
      if (backLen  > 0) box(cWT, cWH, backLen,  cmpM, gx, cWH/2, gz1+backLen/2)
      // Opposite side wall (solid)
      var oppX = (facingC === 'East') ? cOX : (cOX+cL)
      box(cWT, cWH, cD, cmpM, oppX, cWH/2, cOZ+cD/2)
      // Top and bottom walls
      box(cL, cWH, cWT, cmpM, cOX+cL/2, cWH/2, cOZ)
      box(cL, cWH, cWT, cmpM, cOX+cL/2, cWH/2, cOZ+cD)
      // Coping
      if (frontLen > 0) box(cWT+0.1, 0.1, frontLen+0.1, copM, gx, cWH+0.05, cOZ+frontLen/2)
      if (backLen  > 0) box(cWT+0.1, 0.1, backLen+0.1,  copM, gx, cWH+0.05, gz1+backLen/2)
      box(cWT+0.1, 0.1, cD+0.1, copM, oppX, cWH+0.05, cOZ+cD/2)
      box(cL+0.1, 0.1, cWT+0.1, copM, cOX+cL/2, cWH+0.05, cOZ)
      box(cL+0.1, 0.1, cWT+0.1, copM, cOX+cL/2, cWH+0.05, cOZ+cD)
      // Gate pillars
      var gpH3 = cWH + 0.95
      var gpZs = [gz0, gz1]
      gpZs.forEach(function(gz2) {
        cylinder(0.22, 0.25, gpH3, 12, tileM, gx, gpH3/2, gz2)
        addMesh(new T.SphereGeometry(0.26,8,8), goldM, gx, gpH3+0.26, gz2)
        box(0.5, 0.16, 0.5, tileM, gx, gpH3*0.18, gz2)
      })
      // Iron gate bars
      var drSignE = (facingC === 'East') ? -1 : 1
      for (var gi2=0; gi2<12; gi2++) {
        box(0.055, cWH*0.88, 0.055, ironM, gx, cWH*0.44, gz0+0.1+gi2*(gateW/2-0.2)/11)
        box(0.055, cWH*0.88, 0.055, ironM, gx, cWH*0.44, gateCenterZ+0.08+gi2*(gateW/2-0.2)/11)
      }
      var gateCrossY2 = [cWH*0.3, cWH*0.65]
      gateCrossY2.forEach(function(by2) {
        box(0.07, 0.08, gateW/2-0.14, ironM, gx, by2, gz0+gateW/4)
        box(0.07, 0.08, gateW/2-0.14, ironM, gx, by2, gateCenterZ+gateW/4)
      })
      // Driveway (along X axis)
      var drLen3 = cPad + 0.6
      var drv3 = new T.Mesh(new T.PlaneGeometry(drLen3, gateW-0.44), concMat)
      drv3.rotation.x = -Math.PI/2
      drv3.position.set(gx + drSignE*drLen3/2, 0.02, gateCenterZ)
      drv3.receiveShadow = true; scene.add(drv3)
      box(drLen3, 0.08, 0.12, copM, gx+drSignE*drLen3/2, 0.06, gz0+0.2)
      box(drLen3, 0.08, 0.12, copM, gx+drSignE*drLen3/2, 0.06, gz1-0.2)
      // Street lamp
      var lampZ3 = gateCenterZ - 2.5
      cylinder(0.065, 0.09, 4.6, 8, lampPolM, gx+drSignE*(-0.8), 2.3, lampZ3)
      box(0.07, 0.07, 0.68, lampPolM, gx+drSignE*(-0.8), 4.62, lampZ3+0.34)
      addMesh(new T.SphereGeometry(0.18,8,8), lampGlM, gx+drSignE*(-0.8), 4.62, lampZ3+0.68)
      var sLamp3 = new T.PointLight(0xffeeb0, 3.0, 10)
      sLamp3.position.set(gx+drSignE*(-0.8), 4.62, lampZ3+0.68)
      scene.add(sLamp3)
    }

    function tree(tx2, tz, h) {
      cylinder(0.12, 0.18, h * 0.32, 8, trunkM, tx2, h * 0.16, tz)
      var branches = [[0, h * 0.38, 1.0], [h * 0.24, h * 0.3, 0.76], [h * 0.46, h * 0.22, 0.54]]
      branches.forEach(function(b) {
        addMesh(new T.ConeGeometry(b[2], b[1], 8), leafM, tx2, h * 0.38 + b[0], tz)
      })
    }
    var treeH = 5.5 + numFloors * 0.5, tPad = 1.7
    tree(ox - tPad, oz - tPad, treeH)
    tree(ox + plotL + tPad, oz - tPad, treeH)
    tree(ox - tPad, oz + plotW + tPad, treeH + 0.5)
    tree(ox + plotL + tPad, oz + plotW + tPad, treeH + 0.5)

    var shrubX = [cOX + cL * 0.26, cOX + cL * 0.74]
    shrubX.forEach(function(sx) {
      addMesh(new T.SphereGeometry(0.62, 7, 7), shrubM, sx, 0.62, cOZ + cD - 0.85)
      addMesh(new T.SphereGeometry(0.52, 7, 7), shrubM, sx, 0.52, cOZ + 0.85)
    })


    setupOrbit(renderer.domElement)
    var ro = new ResizeObserver(function() {
      if (!wrapRef.current) return
      var w = wrapRef.current.clientWidth
      var h = wrapRef.current.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(wrap)

    function animate() {
      rafRef.current = requestAnimationFrame(animate)
      var o = orb.current
      var sinPhi = Math.sin(o.phi)
      var cosPhi = Math.cos(o.phi)
      camera.position.set(
        TARGET.x + o.r * sinPhi * Math.sin(o.theta),
        TARGET.y + o.r * cosPhi,
        TARGET.z + o.r * sinPhi * Math.cos(o.theta)
      )
      camera.lookAt(TARGET)
      renderer.render(scene, camera)
    }
    animate()
  }

  function setupOrbit(el) {
    var o = orb.current
    el.addEventListener('mousedown', function(e) { o.dragging = true; o.lx = e.clientX; o.ly = e.clientY })
    window.addEventListener('mouseup', function() { o.dragging = false })
    window.addEventListener('mousemove', function(e) {
      if (!o.dragging) return
      o.theta -= (e.clientX - o.lx) * 0.006
      o.phi = Math.max(0.03, Math.min(1.55, o.phi + (e.clientY - o.ly) * 0.005))
      o.lx = e.clientX; o.ly = e.clientY
    })
    el.addEventListener('wheel', function(e) {
      e.preventDefault()
      o.r = Math.max(4, Math.min(140, o.r + e.deltaY * 0.05))
    }, { passive: false })
    el.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) { o.dragging = true; o.lx = e.touches[0].clientX; o.ly = e.touches[0].clientY }
      if (e.touches.length === 2) o.pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
    }, { passive: true })
    el.addEventListener('touchmove', function(e) {
      e.preventDefault()
      if (e.touches.length === 1 && o.dragging) {
        o.theta -= (e.touches[0].clientX - o.lx) * 0.007
        o.phi = Math.max(0.03, Math.min(1.55, o.phi + (e.touches[0].clientY - o.ly) * 0.006))
        o.lx = e.touches[0].clientX; o.ly = e.touches[0].clientY
      }
      if (e.touches.length === 2) {
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
        o.r = Math.max(4, Math.min(140, o.r - (d - o.pinch) * 0.05))
        o.pinch = d
      }
    }, { passive: false })
    el.addEventListener('touchend', function() { o.dragging = false }, { passive: true })
  }

  if (!layout) return null

  var VIEWS = [
    ['3d', '⬛', '3D View'], ['front', '⬆', 'Front'], ['corner', '◤', 'Corner'],
    ['side', '➡', 'Side'], ['aerial', '🔼', 'Aerial'], ['inside', '🏠', 'Inside']
  ]
  var floorTabs = ['All', 'G']
  if (nf > 1) floorTabs.push('G+1')
  if (nf > 2) floorTabs.push('G+2')

  return (
    <div>
      <style>{CSS}</style>

      {!open && (
        <button className="v3-ob" onClick={function() { setOpen(true) }}>
          🏠 Open 3D View — {nf > 1 ? 'G+' + (nf - 1) + ' · ' : ''}
          {cfg && cfg.facing ? cfg.facing : ''} Facing
        </button>
      )}

      {open && (
        <div className="v3-ov">
          <div className="v3-tb">
            <div className="v3-br">
              <div className="v3-bi">🏠</div>
              <div>
                <div className="v3-bn">AutoPlan Pro</div>
                <div className="v3-bs">3D Viewer</div>
              </div>
            </div>
            <div className="v3-ci">
              {cfg && cfg.facing ? cfg.facing : ''} Facing ·{' '}
              {nf === 1 ? 'Ground' : nf === 2 ? 'G+1' : 'G+2'} ·{' '}
              {(layout.plotL * 3.281).toFixed(0)}′×{(layout.plotW * 3.281).toFixed(0)}′
            </div>
            <button className="v3-cl" onClick={function() { setOpen(false) }}>✕</button>
          </div>

          <div className="v3-bd">
            <div className="v3-sb">
              <div className="v3-sc">
                <div className="v3-st">Camera</div>
                {VIEWS.map(function(v) {
                  return (
                    <button key={v[0]} className={'v3-vb' + (view === v[0] ? ' on' : '')}
                      onClick={function() { setView(v[0]) }}>
                      <span>{v[1]}</span>{v[2]}
                    </button>
                  )
                })}
              </div>

              <div className="v3-sc">
                <div className="v3-st">Display</div>
                <div className="v3-tg" onClick={function() { setRoof(function(r) { return !r }) }}>
                  <span className="v3-tl">Roof</span>
                  <div className={'v3-sw' + (roof ? ' on' : '')} />
                </div>
                <div className="v3-tg" onClick={function() { setTerrace(function(t) { return !t }) }}>
                  <span className="v3-tl">Terrace View</span>
                  <div className={'v3-sw' + (terrace ? ' on' : '')} />
                </div>
                <div className="v3-tg" onClick={function() { setView(inside ? '3d' : 'inside') }}>
                  <span className="v3-tl">Inside View</span>
                  <div className={'v3-sw' + (inside ? ' on' : '')} />
                </div>
              </div>

              {nf > 1 && (
                <div className="v3-sc">
                  <div className="v3-st">Floor</div>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {floorTabs.map(function(lbl) {
                      return <button key={lbl} className="v3-vb on" style={{ flex: '1', minWidth: 0, padding: '4px 6px', fontSize: 9 }}>{lbl}</button>
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="v3-cw" ref={wrapRef}>
              {loading && (
                <div className="v3-ld">
                  <div className="v3-sp" />
                  <div className="v3-lt">Building 3D model…</div>
                </div>
              )}
              {!loading && (
                <div className="v3-bt">
                  <div className="v3-ht"><b>Drag</b> rotate · <b>Scroll</b> zoom · <b>Pinch</b> mobile</div>
                  <button className="v3-rb" onClick={function() {
                    var o = orb.current
                    var s = Math.max(layout.plotL, layout.plotW)
                    var n = layout.numFloors || 1
                    o.theta = -0.65; o.phi = 0.85; o.r = s * (1.6 + n * 0.3)
                    setView('3d'); setInside(false)
                  }}>↺ Reset</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}