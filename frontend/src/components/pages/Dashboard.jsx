// pages/Dashboard.jsx — AutoPlan Pro Dashboard

import { useState } from 'react'
import { usePlan } from '../../context/PlanContext.jsx'
import { Link, useNavigate } from "react-router-dom";

const CSS = `
@keyframes fadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
@keyframes pulse    { 0%,100% { opacity:.6 } 50% { opacity:1 } }
@keyframes shimmer  { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
@keyframes spin     { to { transform:rotate(360deg) } }
@keyframes scaleIn  { from { transform:scale(.94); opacity:0 } to { transform:scale(1); opacity:1 } }

.db-root {
  min-height:100vh; background:#0d1520;
  font-family:'Syne',sans-serif; color:#f0ead8;
}

/* ── TOP HEADER ── */
.db-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:0 32px; height:58px;
  background:rgba(10,18,30,.98);
  border-bottom:1px solid rgba(212,168,67,.14);
  position:sticky; top:0; z-index:50;
  backdrop-filter:blur(10px);
}
.db-logo { display:flex;align-items:center;gap:12px;text-decoration:none; }
.db-logo { display:flex; align-items:center; gap:10px; }
.db-logo-icon {
  width:32px; height:32px; border-radius:8px;
  background:linear-gradient(135deg,#d4a843,#8a5810);
  display:flex; align-items:center; justify-content:center; font-size:16px;
}
.db-logo-text { font-size:14px; font-weight:800; letter-spacing:.3px; }
.db-logo-text span { color:#d4a843; }
.db-logo-badge {
  font-size:7px; margin-left:5px;
  background:rgba(212,168,67,.15); color:#d4a843;
  border:1px solid rgba(212,168,67,.3); border-radius:4px; padding:1px 5px;
  font-family:'DM Mono',monospace; letter-spacing:1px;
}
.db-nav { display:flex; align-items:center; gap:4px; }
.db-nav-btn {
  padding:6px 14px; border-radius:7px; border:none;
  font-size:11px; font-weight:600; cursor:pointer; transition:.15s;
  font-family:'Syne',sans-serif; letter-spacing:.3px;
}
.db-nav-btn.active {
  background:rgba(212,168,67,.15); color:#d4a843;
  border:1px solid rgba(212,168,67,.28);
}
.db-nav-btn.inactive {
  background:transparent; color:rgba(240,234,216,.4);
  border:1px solid transparent;
}
.db-nav-btn.inactive:hover {
  background:rgba(255,255,255,.05); color:rgba(240,234,216,.7);
  border-color:rgba(255,255,255,.08);
}
.db-new-btn {
  padding:7px 18px; border-radius:8px;
  background:linear-gradient(135deg,#d4a843,#a87820);
  border:none; color:#0d1520; font-size:12px; font-weight:800;
  cursor:pointer; transition:.15s; font-family:'Syne',sans-serif;
  display:flex; align-items:center; gap:6px; letter-spacing:.3px;
}
.db-new-btn:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(212,168,67,.35); }

/* ── MAIN LAYOUT ── */
.db-body { display:flex; }
.db-sidebar {
  width:230px; flex-shrink:0; min-height:calc(100vh - 58px);
  background:rgba(8,14,26,.96);
  border-right:1px solid rgba(212,168,67,.08);
  padding:20px 12px;
  display:flex; flex-direction:column; gap:4px;
}
.db-side-section { padding:8px 10px 4px; }
.db-side-label {
  font-size:8px; color:rgba(212,168,67,.3); letter-spacing:2.5px;
  text-transform:uppercase; font-family:'DM Mono',monospace;
  margin-bottom:6px;
}
.db-side-item {
  display:flex; align-items:center; gap:10px;
  padding:9px 12px; border-radius:8px;
  cursor:pointer; transition:.15s;
  border:1px solid transparent;
  font-size:12px; font-weight:600; color:rgba(240,234,216,.45);
  margin-bottom:2px;
}
.db-side-item:hover {
  background:rgba(212,168,67,.06); color:rgba(240,234,216,.75);
  border-color:rgba(212,168,67,.1);
}
.db-side-item.active {
  background:rgba(212,168,67,.12); color:#d4a843;
  border-color:rgba(212,168,67,.22);
}
.db-side-icon { font-size:14px; width:18px; text-align:center; }
.db-side-badge {
  margin-left:auto; font-size:9px; padding:1px 7px; border-radius:10px;
  background:rgba(212,168,67,.18); color:#d4a843; font-family:'DM Mono',monospace;
}

.db-content { flex:1; padding:28px 32px; overflow-y:auto; }

/* ── GREETING HERO ── */
.db-hero {
  background:linear-gradient(135deg,rgba(212,168,67,.08) 0%,rgba(180,100,30,.06) 60%,rgba(10,18,30,0) 100%);
  border:1px solid rgba(212,168,67,.14); border-radius:16px;
  padding:28px 32px; margin-bottom:28px;
  display:flex; align-items:center; justify-content:space-between;
  position:relative; overflow:hidden;
  animation:scaleIn .5s ease both;
}
.db-hero::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(circle at 80% 50%,rgba(212,168,67,.06) 0%,transparent 60%);
  pointer-events:none;
}
.db-hero-grid {
  position:absolute; inset:0; opacity:.04;
  background-image:linear-gradient(rgba(212,168,67,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,67,.5) 1px,transparent 1px);
  background-size:32px 32px;
  pointer-events:none;
}
.db-hero-left { position:relative; }
.db-hero-greeting {
  font-size:11px; color:rgba(212,168,67,.55); letter-spacing:2px;
  text-transform:uppercase; font-family:'DM Mono',monospace; margin-bottom:8px;
}
.db-hero-title { font-size:26px; font-weight:800; line-height:1.2; margin-bottom:10px; }
.db-hero-title span { color:#d4a843; }
.db-hero-sub { font-size:12px; color:rgba(240,234,216,.45); line-height:1.6; max-width:440px; }
.db-hero-actions { display:flex; gap:10px; margin-top:18px; }
.db-btn-primary {
  padding:10px 22px; border-radius:9px;
  background:linear-gradient(135deg,#d4a843,#a87820);
  border:none; color:#0d1520; font-size:12px; font-weight:800;
  cursor:pointer; transition:.15s; font-family:'Syne',sans-serif;
  display:flex; align-items:center; gap:7px;
}
.db-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(212,168,67,.3); }
.db-btn-ghost {
  padding:10px 20px; border-radius:9px;
  background:rgba(212,168,67,.08); border:1px solid rgba(212,168,67,.22);
  color:#d4a843; font-size:12px; font-weight:700;
  cursor:pointer; transition:.15s; font-family:'Syne',sans-serif;
}
.db-btn-ghost:hover { background:rgba(212,168,67,.15); }
.db-hero-visual {
  position:relative; flex-shrink:0;
  width:160px; height:120px; opacity:.65;
}
.db-house-svg { position:absolute; inset:0; }

/* ── STATS ROW ── */
.db-stats {
  display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:28px;
}
.db-stat {
  background:rgba(10,18,30,.8); border:1px solid rgba(212,168,67,.1);
  border-radius:12px; padding:18px 20px;
  animation:fadeUp .5s ease both;
  transition:.2s; cursor:default;
}
.db-stat:hover { border-color:rgba(212,168,67,.25); background:rgba(212,168,67,.04); }
.db-stat-row { display:flex; align-items:center; justify-content:space-between; }
.db-stat-icon {
  width:36px; height:36px; border-radius:9px;
  display:flex; align-items:center; justify-content:center; font-size:16px;
}
.db-stat-val { font-size:28px; font-weight:800; line-height:1; margin:10px 0 4px; }
.db-stat-lbl { font-size:10px; color:rgba(240,234,216,.4); letter-spacing:.8px; font-family:'DM Mono',monospace; }
.db-stat-trend { font-size:10px; font-family:'DM Mono',monospace; }
.db-stat-trend.up { color:#4ade80; }
.db-stat-trend.neutral { color:rgba(240,234,216,.3); }

/* ── TWO-COL GRID ── */
.db-grid { display:grid; grid-template-columns:1.55fr 1fr; gap:20px; margin-bottom:20px; }
.db-grid-full { margin-bottom:20px; }

/* ── PANELS ── */
.db-panel {
  background:rgba(10,18,30,.8); border:1px solid rgba(212,168,67,.1);
  border-radius:14px; overflow:hidden;
  animation:fadeUp .5s ease both;
}
.db-panel-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 20px; border-bottom:1px solid rgba(212,168,67,.08);
}
.db-panel-title { font-size:13px; font-weight:700; display:flex; align-items:center; gap:8px; }
.db-panel-title-icon { font-size:14px; }
.db-panel-action {
  font-size:10px; color:rgba(212,168,67,.5); font-family:'DM Mono',monospace;
  cursor:pointer; background:none; border:none; padding:3px 8px;
  border-radius:5px; transition:.15s; font-family:'Syne',sans-serif;
}
.db-panel-action:hover { color:#d4a843; background:rgba(212,168,67,.08); }

/* ── PLAN CARDS ── */
.db-plans { padding:14px; display:flex; flex-direction:column; gap:10px; }
.db-plan-card {
  display:flex; align-items:center; gap:14px;
  padding:14px 16px; border-radius:10px;
  background:rgba(255,255,255,.025); border:1px solid rgba(212,168,67,.07);
  cursor:pointer; transition:.2s;
}
.db-plan-card:hover {
  background:rgba(212,168,67,.06); border-color:rgba(212,168,67,.2);
  transform:translateX(3px);
}
.db-plan-thumb {
  width:52px; height:42px; border-radius:7px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:20px; border:1px solid rgba(212,168,67,.15);
}
.db-plan-info { flex:1; min-width:0; }
.db-plan-name { font-size:12px; font-weight:700; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.db-plan-meta { font-size:10px; color:rgba(240,234,216,.38); font-family:'DM Mono',monospace; }
.db-plan-badge {
  font-size:9px; padding:3px 8px; border-radius:12px; font-family:'DM Mono',monospace;
  flex-shrink:0;
}
.db-plan-badge.done { background:rgba(74,222,128,.12); color:#4ade80; border:1px solid rgba(74,222,128,.2); }
.db-plan-badge.draft { background:rgba(212,168,67,.1); color:#d4a843; border:1px solid rgba(212,168,67,.18); }
.db-plan-badge.new { background:rgba(96,165,250,.1); color:#60a5fa; border:1px solid rgba(96,165,250,.18); }

/* ── QUICK ACTIONS ── */
.db-actions { padding:14px; display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.db-action-btn {
  padding:16px 14px; border-radius:10px;
  background:rgba(255,255,255,.025); border:1px solid rgba(212,168,67,.08);
  cursor:pointer; transition:.2s; text-align:left;
  display:flex; flex-direction:column; gap:7px;
}
.db-action-btn:hover {
  background:rgba(212,168,67,.07); border-color:rgba(212,168,67,.2);
  transform:translateY(-2px); box-shadow:0 4px 20px rgba(0,0,0,.3);
}
.db-action-icon { font-size:22px; }
.db-action-title { font-size:11px; font-weight:700; }
.db-action-desc { font-size:10px; color:rgba(240,234,216,.35); line-height:1.4; }

/* ── VASTU TIPS ── */
.db-vastu { padding:14px; display:flex; flex-direction:column; gap:8px; }
.db-vastu-item {
  display:flex; align-items:flex-start; gap:11px; padding:11px 13px;
  border-radius:8px; background:rgba(255,255,255,.02);
  border:1px solid rgba(212,168,67,.06); transition:.15s;
}
.db-vastu-item:hover { background:rgba(212,168,67,.04); border-color:rgba(212,168,67,.12); }
.db-vastu-dot { width:28px; height:28px; border-radius:7px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:13px; }
.db-vastu-text { }
.db-vastu-title { font-size:11px; font-weight:700; margin-bottom:3px; }
.db-vastu-desc { font-size:10px; color:rgba(240,234,216,.4); line-height:1.5; }

/* ── ACTIVITY FEED ── */
.db-activity { padding:14px; display:flex; flex-direction:column; gap:0; }
.db-act-item {
  display:flex; gap:12px; padding:11px 0;
  border-bottom:1px solid rgba(212,168,67,.05);
}
.db-act-item:last-child { border-bottom:none; }
.db-act-dot {
  width:8px; height:8px; border-radius:50%; margin-top:5px; flex-shrink:0;
}
.db-act-line { flex:1; }
.db-act-text { font-size:11px; line-height:1.5; color:rgba(240,234,216,.65); }
.db-act-text strong { color:#f0ead8; font-weight:700; }
.db-act-time { font-size:9px; color:rgba(240,234,216,.25); margin-top:2px; font-family:'DM Mono',monospace; }

/* ── PLOT SIZE CHART ── */
.db-chart { padding:18px 20px; }
.db-chart-bars { display:flex; flex-direction:column; gap:10px; }
.db-chart-row { display:flex; align-items:center; gap:10px; }
.db-chart-lbl { font-size:10px; color:rgba(240,234,216,.45); font-family:'DM Mono',monospace; width:52px; text-align:right; flex-shrink:0; }
.db-chart-track { flex:1; height:8px; background:rgba(255,255,255,.05); border-radius:4px; overflow:hidden; }
.db-chart-fill { height:100%; border-radius:4px; transition:.8s ease; }
.db-chart-count { font-size:10px; color:rgba(240,234,216,.4); width:22px; font-family:'DM Mono',monospace; }

/* ── FACING DONUT ── */
.db-donut-wrap { display:flex; align-items:center; justify-content:center; gap:24px; padding:20px; }
.db-donut-svg { flex-shrink:0; }
.db-donut-legend { display:flex; flex-direction:column; gap:8px; }
.db-donut-legend-item { display:flex; align-items:center; gap:8px; }
.db-donut-swatch { width:10px; height:10px; border-radius:3px; flex-shrink:0; }
.db-donut-lbl { font-size:11px; color:rgba(240,234,216,.6); }
.db-donut-val { font-size:11px; font-weight:700; color:#f0ead8; margin-left:auto; font-family:'DM Mono',monospace; }

/* ── RESPONSIVE ── */
@media (max-width:1100px) {
  .db-stats { grid-template-columns:repeat(2,1fr); }
  .db-grid { grid-template-columns:1fr; }
}
@media (max-width:720px) {
  .db-sidebar { display:none; }
  .db-content { padding:16px; }
  .db-stats { grid-template-columns:1fr 1fr; }
  .db-hero { flex-direction:column; }
  .db-hero-visual { display:none; }
}
`

// ── Mock data for saved plans ──
const SAVED_PLANS = [
  { id:1, name:'Sharma Residence', plot:'40×30', facing:'North', floors:'G+1', beds:3, date:'2 days ago', status:'done',  icon:'🏡', vastu:92 },
  { id:2, name:'Kumar Villa',      plot:'50×40', facing:'East',  floors:'G+2', beds:4, date:'5 days ago', status:'done',  icon:'🏠', vastu:88 },
  { id:3, name:'Reddy Home',       plot:'30×40', facing:'South', floors:'G',   beds:2, date:'1 week ago', status:'draft', icon:'🏘', vastu:74 },
  { id:4, name:'Patel Bungalow',   plot:'60×40', facing:'East',  floors:'G+1', beds:3, date:'2 weeks ago',status:'done',  icon:'🏡', vastu:96 },
  { id:5, name:'New Project',      plot:'—',     facing:'—',     floors:'—',   beds:0, date:'Just now',   status:'new',   icon:'✨', vastu:0  },
]

const VASTU_TIPS = [
  { icon:'🧭', color:'rgba(212,168,67,.15)', title:'Main Entrance Direction', desc:'North or East facing entrances invite prosperity and positive energy per Vastu Shastra.', tag:'Critical' },
  { icon:'🔥', color:'rgba(239,68,68,.12)',  title:'Kitchen Placement',       desc:'Kitchen should ideally be in the South-East corner — the zone of fire (Agneya).', tag:'Important' },
  { icon:'🛏', color:'rgba(96,165,250,.12)', title:'Master Bedroom',          desc:'South-West corner is ideal for master bedroom, ensuring restful sleep and stability.', tag:'Recommended' },
  { icon:'🙏', color:'rgba(251,191,36,.12)', title:'Pooja Room',              desc:'North-East direction (Ishan) is the most auspicious zone for prayer and meditation.', tag:'Auspicious' },
  { icon:'💧', color:'rgba(34,211,238,.12)', title:'Water Storage',           desc:'Underground water tanks and sumps should be placed in the North-East corner.', tag:'Important' },
]

const ACTIVITY = [
  { color:'#4ade80', text: <span>Blueprint generated for <strong>Sharma Residence</strong> — Variant B, G+1</span>,            time:'2 hours ago' },
  { color:'#d4a843', text: <span>Vastu score updated: <strong>92/100</strong> for Sharma Residence</span>,                     time:'2 hours ago' },
  { color:'#60a5fa', text: <span><strong>Kumar Villa</strong> exported as PNG — Detailed blueprint</span>,                     time:'5 days ago'  },
  { color:'#4ade80', text: <span>New plan created: <strong>Patel Bungalow</strong>, 60×40, East facing</span>,                 time:'2 weeks ago' },
  { color:'#d4a843', text: <span>Regenerated <strong>Reddy Home</strong> blueprint — trying Variant C</span>,                  time:'2 weeks ago' },
  { color:'#a78bfa', text: <span>AutoPlan Pro account created. Welcome aboard!</span>,                                          time:'3 weeks ago' },
]

const FACING_DATA = [
  { label:'North', val:2, pct:40, color:'#d4a843' },
  { label:'East',  val:2, pct:40, color:'#60a5fa' },
  { label:'South', val:1, pct:20, color:'#f87171' },
  { label:'West',  val:0, pct:0,  color:'#a78bfa' },
]

const PLOT_DATA = [
  { label:'30×40', count:1, pct:20 },
  { label:'40×30', count:1, pct:20 },
  { label:'50×40', count:1, pct:20 },
  { label:'60×40', count:1, pct:20 },
  { label:'Other', count:1, pct:20 },
]

// ── Donut chart SVG ──
function DonutChart() {
  const R = 52, cx = 60, cy = 60, strokeW = 14
  const circumference = 2 * Math.PI * R
  let offset = 0
  const slices = FACING_DATA.filter(d => d.pct > 0)
  return (
    <svg className="db-donut-svg" width={120} height={120} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={strokeW} />
      {slices.map((d, i) => {
        const dash = (d.pct / 100) * circumference
        const gap  = circumference - dash
        const el = (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none"
            stroke={d.color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circumference / 100}
            strokeLinecap="round"
            style={{ transformOrigin:'60px 60px', transform:'rotate(-90deg)', transition:'stroke-dasharray .8s ease' }}
          />
        )
        offset += d.pct
        return el
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#f0ead8" fontSize={18} fontWeight={800} fontFamily="Syne">5</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="rgba(240,234,216,.4)" fontSize={9} fontFamily="DM Mono">PLANS</text>
    </svg>
  )
}

// ── House illustration SVG ──
function HouseIllustration() {
  return (
    <svg className="db-house-svg" viewBox="0 0 160 120" fill="none">
      {/* Ground */}
      <rect x="10" y="98" width="140" height="4" rx="2" fill="rgba(212,168,67,.2)" />
      {/* Main building */}
      <rect x="30" y="52" width="100" height="50" rx="2" fill="rgba(212,168,67,.1)" stroke="rgba(212,168,67,.3)" strokeWidth="1.5" />
      {/* Roof */}
      <polygon points="20,54 80,18 140,54" fill="rgba(212,168,67,.15)" stroke="rgba(212,168,67,.4)" strokeWidth="1.5" />
      <line x1="57" y1="54" x2="80" y2="33" stroke="rgba(212,168,67,.2)" strokeWidth="1" />
      <line x1="103" y1="54" x2="80" y2="33" stroke="rgba(212,168,67,.2)" strokeWidth="1" />
      {/* Door */}
      <rect x="68" y="72" width="24" height="30" rx="2" fill="rgba(212,168,67,.25)" stroke="rgba(212,168,67,.4)" strokeWidth="1.5" />
      <circle cx="88" cy="87" r="2" fill="#d4a843" />
      {/* Windows */}
      {[[38,60,18,14],[104,60,18,14],[38,82,18,12],[104,82,18,12]].map(([x,y,w,h],i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} rx="2" fill="rgba(96,165,250,.15)" stroke="rgba(212,168,67,.25)" strokeWidth="1" />
          <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke="rgba(212,168,67,.2)" strokeWidth=".8" />
          <line x1={x} y1={y+h/2} x2={x+w} y2={y+h/2} stroke="rgba(212,168,67,.2)" strokeWidth=".8" />
        </g>
      ))}
      {/* Trees */}
      <line x1="15" y1="98" x2="15" y2="75" stroke="#4a6835" strokeWidth="2" />
      <ellipse cx="15" cy="68" rx="8" ry="9" fill="rgba(34,120,30,.4)" stroke="rgba(74,168,60,.3)" strokeWidth="1" />
      <line x1="145" y1="98" x2="145" y2="70" stroke="#4a6835" strokeWidth="2" />
      <ellipse cx="145" cy="62" rx="8" ry="10" fill="rgba(34,120,30,.4)" stroke="rgba(74,168,60,.3)" strokeWidth="1" />
      {/* G+1 floor hint */}
      <rect x="30" y="30" width="100" height="24" rx="2" fill="rgba(212,168,67,.06)" stroke="rgba(212,168,67,.18)" strokeWidth="1" strokeDasharray="4,3" />
      {/* Stars */}
      {[[148,12],[14,22],[130,8],[8,45]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={1.2} fill="rgba(212,168,67,.5)" />
      ))}
    </svg>
  )
}

export default function Dashboard({ onStartNew }) {
  const { state, goTo } = usePlan()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [activeSide, setActiveSide] = useState('overview')
  const ownerName = state.cfg?.owner || 'Architect'

  const SIDE_ITEMS = [
    { key:'overview',  icon:'📊', label:'Overview' },
    { key:'plans',     icon:'📐', label:'My Plans',   badge:'5' },
    { key:'vastu',     icon:'🧭', label:'Vastu Guide' },
    { key:'settings',  icon:'⚙️',  label:'Settings' },
  ]

  return (
    <div className="db-root">
      <style>{CSS}</style>

      {/* ── HEADER ── */}
      <header className="db-header">
         <Link to="/" className="db-logo">
         <div className="db-logo">
          <div className="db-logo-icon">🏠</div>
           <div className="db-logo-text">
            AUTO<span>PLAN</span> </div>
          <span className="db-logo-badge">PRO</span>
        </div>
        </Link>
       
       
        <nav className="db-nav">
          {[['dashboard','Dashboard'],['planner','Planner'],['reports','Reports']].map(([key,lbl]) => (
            <button key={key} className={`db-nav-btn ${activeNav===key?'active':'inactive'}`}
              onClick={() => { setActiveNav(key); if(key==='planner') onStartNew() }}>
              {lbl}
            </button>
          ))}
        </nav>

        <button className="db-new-btn" onClick={onStartNew}>
          <span>+</span> New Plan
        </button>
      </header>

      <div className="db-body">

        {/* ── SIDEBAR ── */}
        <aside className="db-sidebar">
          <div className="db-side-section">
            <div className="db-side-label">Navigation</div>
            {SIDE_ITEMS.map(item => (
              <div key={item.key} className={`db-side-item ${activeSide===item.key?'active':''}`}
                onClick={() => setActiveSide(item.key)}>
                <span className="db-side-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="db-side-badge">{item.badge}</span>}
              </div>
            ))}
          </div>

          <div style={{ flex:1 }} />

          {/* User card */}
          <div style={{ padding:'12px', borderTop:'1px solid rgba(212,168,67,.08)', marginTop:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, background:'rgba(212,168,67,.06)', border:'1px solid rgba(212,168,67,.1)' }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#d4a843,#a87820)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ownerName}</div>
                <div style={{ fontSize:9, color:'rgba(240,234,216,.35)', fontFamily:'DM Mono,monospace' }}>Pro Plan</div>
              </div>
              <div style={{ fontSize:12, color:'rgba(212,168,67,.4)' }}>›</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="db-content">

          {/* Hero greeting */}
          <div className="db-hero">
            <div className="db-hero-grid" />
            <div className="db-hero-left">
              <div className="db-hero-greeting">Welcome back</div>
              <h1 className="db-hero-title">
                Good Morning,<br /><span>{ownerName.split(' ')[0]}.</span>
              </h1>
              <p className="db-hero-sub">
                You have 5 saved plans, 4 blueprints generated, and your latest Vastu score is 92/100. Ready to build something new?
              </p>
              <div className="db-hero-actions">
                <button className="db-btn-primary" onClick={onStartNew}>
                  🏠 Start New Plan
                </button>
                <button className="db-btn-ghost">View All Plans</button>
              </div>
            </div>
            <div className="db-hero-visual">
              <HouseIllustration />
            </div>
          </div>

          {/* Stats row */}
          <div className="db-stats">
            {[
              { icon:'📐', bg:'rgba(212,168,67,.12)', val:'5',   label:'TOTAL PLANS',       trend:'+2 this month',  trendType:'up' },
              { icon:'✅', bg:'rgba(74,222,128,.1)',  val:'4',   label:'BLUEPRINTS DONE',   trend:'80% completion', trendType:'up' },
              { icon:'🧭', bg:'rgba(251,191,36,.1)',  val:'92',  label:'BEST VASTU SCORE',  trend:'Sharma Res.',    trendType:'neutral' },
              { icon:'🏠', bg:'rgba(96,165,250,.1)',  val:'G+2', label:'HIGHEST FLOORS',    trend:'Kumar Villa',    trendType:'neutral' },
            ].map((s, i) => (
              <div className="db-stat" key={i} style={{ animationDelay: i * 0.08 + 's' }}>
                <div className="db-stat-row">
                  <div className="db-stat-icon" style={{ background:s.bg }}>{s.icon}</div>
                  <span className={`db-stat-trend ${s.trendType}`}>{s.trend}</span>
                </div>
                <div className="db-stat-val">{s.val}</div>
                <div className="db-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Two-column grid */}
          <div className="db-grid">

            {/* Left: Recent Plans */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">
                  <span className="db-panel-title-icon">📐</span> Recent Plans
                </span>
                <button className="db-panel-action">View All →</button>
              </div>
              <div className="db-plans">
                {SAVED_PLANS.map(plan => (
                  <div className="db-plan-card" key={plan.id}
                    onClick={() => plan.status !== 'new' ? null : onStartNew()}>
                    <div className="db-plan-thumb"
                      style={{ background: plan.status==='done' ? 'rgba(212,168,67,.1)' : plan.status==='draft' ? 'rgba(255,255,255,.04)' : 'rgba(96,165,250,.1)' }}>
                      {plan.icon}
                    </div>
                    <div className="db-plan-info">
                      <div className="db-plan-name">{plan.name}</div>
                      <div className="db-plan-meta">
                        {plan.status !== 'new'
                          ? `${plan.plot} · ${plan.facing} · ${plan.floors} · ${plan.beds}BR`
                          : 'Click to start a new plan'}
                      </div>
                    </div>
                    {plan.status !== 'new' && (
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        {plan.vastu > 0 && (
                          <div style={{ fontSize:11, fontWeight:800, color: plan.vastu >= 90 ? '#4ade80' : plan.vastu >= 75 ? '#d4a843' : '#f87171', marginBottom:3 }}>
                            {plan.vastu}%
                          </div>
                        )}
                        <span className={`db-plan-badge ${plan.status}`}>
                          {plan.status === 'done' ? '✓ Done' : 'Draft'}
                        </span>
                      </div>
                    )}
                    {plan.status === 'new' && (
                      <span className="db-plan-badge new">+ New</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Actions + Facing Chart */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Quick Actions */}
              <div className="db-panel">
                <div className="db-panel-header">
                  <span className="db-panel-title">
                    <span className="db-panel-title-icon">⚡</span> Quick Actions
                  </span>
                </div>
                <div className="db-actions">
                  {[
                    { icon:'🏗', title:'New Blueprint',  desc:'Start a fresh Vastu plan',       action: onStartNew },
                    { icon:'📥', title:'Import Plot',    desc:'Upload site measurements',        action: null },
                    { icon:'🧭', title:'Vastu Audit',    desc:'Check your existing plan',        action: null },
                    { icon:'📤', title:'Export PDF',     desc:'Download all blueprints',         action: null },
                  ].map((a, i) => (
                    <button key={i} className="db-action-btn" onClick={a.action || undefined}>
                      <div className="db-action-icon">{a.icon}</div>
                      <div className="db-action-title">{a.title}</div>
                      <div className="db-action-desc">{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Facing distribution */}
              <div className="db-panel">
                <div className="db-panel-header">
                  <span className="db-panel-title">
                    <span className="db-panel-title-icon">🧭</span> Plans by Facing
                  </span>
                </div>
                <div className="db-donut-wrap">
                  <DonutChart />
                  <div className="db-donut-legend">
                    {FACING_DATA.map(d => (
                      <div className="db-donut-legend-item" key={d.label}>
                        <div className="db-donut-swatch" style={{ background:d.color }} />
                        <span className="db-donut-lbl">{d.label}</span>
                        <span className="db-donut-val">{d.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom row: Plot sizes + Activity + Vastu tips */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1.3fr', gap:20, marginBottom:20 }}>

            {/* Plot size chart */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">
                  <span className="db-panel-title-icon">📏</span> Plot Sizes
                </span>
              </div>
              <div className="db-chart">
                <div className="db-chart-bars">
                  {PLOT_DATA.map((d, i) => (
                    <div className="db-chart-row" key={i}>
                      <span className="db-chart-lbl">{d.label}</span>
                      <div className="db-chart-track">
                        <div className="db-chart-fill"
                          style={{ width: d.pct + '%', background: `linear-gradient(90deg,rgba(212,168,67,.7),rgba(212,168,67,.35))` }} />
                      </div>
                      <span className="db-chart-count">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">
                  <span className="db-panel-title-icon">🕐</span> Activity
                </span>
                <button className="db-panel-action">Clear</button>
              </div>
              <div className="db-activity">
                {ACTIVITY.map((a, i) => (
                  <div className="db-act-item" key={i}>
                    <div className="db-act-dot" style={{ background: a.color }} />
                    <div className="db-act-line">
                      <div className="db-act-text">{a.text}</div>
                      <div className="db-act-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vastu Tips */}
            <div className="db-panel">
              <div className="db-panel-header">
                <span className="db-panel-title">
                  <span className="db-panel-title-icon">🧿</span> Vastu Guidelines
                </span>
                <button className="db-panel-action">All Tips →</button>
              </div>
              <div className="db-vastu">
                {VASTU_TIPS.map((tip, i) => (
                  <div className="db-vastu-item" key={i}>
                    <div className="db-vastu-dot" style={{ background: tip.color }}>{tip.icon}</div>
                    <div className="db-vastu-text">
                      <div className="db-vastu-title">{tip.title}</div>
                      <div className="db-vastu-desc">{tip.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  )
}