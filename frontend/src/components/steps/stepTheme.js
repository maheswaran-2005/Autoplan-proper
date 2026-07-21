// stepTheme.js — Shared CSS for all 5 wizard steps
// Full-width/height cards + Navbar styles included

export const STEP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --g:     #d4a843;
  --g2:    #f0c96a;
  --g3:    #b8882e;
  --rust:  #c04028;
  --cream: #f0e6d0;
  --ink:   #02040e;
  --panel: #080d1e;
  --panel2:#0d1530;
  --blue:  #2456c8;
  --teal:  #1a8c78;
  --green: #16a34a;
}

/* ── Keyframes ── */
@keyframes stFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
@keyframes stGlow    { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0)} 50%{box-shadow:0 0 32px 4px rgba(212,168,67,.22)} }
@keyframes stPulse   { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:.2;transform:scale(1.1)} }
@keyframes stShimmer { from{background-position:-300% center} to{background-position:300% center} }
@keyframes stScan    { from{transform:translateY(-100%)} to{transform:translateY(600px)} }
@keyframes stNavScan { from{transform:translateX(-100%)} to{transform:translateX(100vw)} }
@keyframes stBorder  { 0%,100%{box-shadow:0 0 24px rgba(212,168,67,.1),0 32px 80px rgba(0,0,0,.55),inset 0 0 24px rgba(212,168,67,.02)} 50%{box-shadow:0 0 60px rgba(212,168,67,.28),0 32px 80px rgba(0,0,0,.55),0 0 100px rgba(212,168,67,.08),inset 0 0 40px rgba(212,168,67,.04)} }
@keyframes stFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes stPop     { 0%{transform:scale(0) rotate(-10deg)} 65%{transform:scale(1.25) rotate(4deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes stSpin    { to{transform:rotate(360deg)} }
@keyframes stBar     { from{width:0} to{width:var(--bw,80%)} }
@keyframes stCount   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes stLogoGlow{ 0%,100%{box-shadow:0 0 0 1px rgba(212,168,67,.32),0 4px 18px rgba(212,168,67,.28)} 50%{box-shadow:0 0 0 1px rgba(212,168,67,.6),0 4px 32px rgba(212,168,67,.52),0 0 50px rgba(212,168,67,.14)} }
@keyframes stStepPulse{ 0%,100%{box-shadow:0 0 0 0 rgba(212,168,67,0)} 50%{box-shadow:0 0 0 5px rgba(212,168,67,.18)} }
@keyframes stBlink   { 0%,100%{opacity:1} 50%{opacity:.18} }

/* ════════════════════════════════════════
   GLOBAL PAGE RESET (applied per step)
════════════════════════════════════════ */
.st-page-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: #02040e;
  color: #f0e6d0;
  font-family: 'Outfit', sans-serif;
  z-index: 9999;
}

/* background layers */
.st-page-root::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    linear-gradient(rgba(212,168,67,.028) 1px,transparent 1px),
    linear-gradient(90deg,rgba(212,168,67,.028) 1px,transparent 1px);
  background-size:52px 52px;
}
.st-page-root::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 70% 55% at 0% 25%,   rgba(212,168,67,.055) 0%,transparent 55%),
    radial-gradient(ellipse 60% 65% at 100% 75%,  rgba(192,64,40,.045)  0%,transparent 55%),
    radial-gradient(ellipse 50% 45% at 50%  105%, rgba(26,140,120,.04)  0%,transparent 55%);
}

/* ════════════════════════════════════════
   NAVBAR  (self-contained in each step)
════════════════════════════════════════ */
.st-nav {
  position: fixed; top:0; left:0; right:0; z-index:500;
  height: 66px;
  display: flex; align-items: center;
  padding: 0 36px;
  background: rgba(2,4,14,.84);
  backdrop-filter: blur(28px) saturate(180%);
  border-bottom: 1px solid rgba(212,168,67,.14);
  transition: background .3s, border-color .3s, box-shadow .3s;
}
.st-nav.scrolled {
  background: rgba(2,4,14,.97);
  border-bottom-color: rgba(212,168,67,.26);
  box-shadow: 0 8px 48px rgba(0,0,0,.75);
}
/* gold top accent */
.st-nav::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg,transparent,rgba(212,168,67,.7) 30%,rgba(192,64,40,.6) 70%,transparent);
}
/* moving scan line on navbar */
.st-nav::after {
  content:''; position:absolute; bottom:0; left:0; height:1px; width:60px;
  background: linear-gradient(90deg,transparent,rgba(212,168,67,.5),transparent);
  animation: stNavScan 6s linear infinite;
}

/* ── Logo ── */
.st-nav-logo {
  display:flex; align-items:center; gap:11px;
  background:transparent; border:none; cursor:pointer;
  padding:0; text-decoration:none; flex-shrink:0;
}
.st-nav-logo-mark {
  width:38px; height:38px; border-radius:10px;
  background:linear-gradient(135deg,#d4a843,#c04028);
  display:flex; align-items:center; justify-content:center; font-size:18px;
  animation: stLogoGlow 5s ease-in-out infinite;
}
.st-nav-logo-text {
  font-family:'Cormorant Garamond',serif;
  font-size:22px; font-weight:700; color:#f0e6d0; letter-spacing:.2px;
}
.st-nav-logo-text b { color:#d4a843; }
.st-nav-logo-badge {
  font-family:'DM Mono',monospace; font-size:8px; color:#d4a843;
  border:1px solid rgba(212,168,67,.3); padding:2px 7px; border-radius:4px;
  letter-spacing:1.8px; background:rgba(212,168,67,.06);
}

/* ── Separator ── */
.st-nav-sep { width:1px; height:28px; background:rgba(212,168,67,.16); margin:0 22px; flex-shrink:0; }

/* ── Step dots strip ── */
.st-nav-steps { display:flex; align-items:center; gap:4px; flex:1; }
.st-nav-step-item { display:flex; align-items:center; gap:4px; }
.st-nav-connector { width:28px; height:1px; background:rgba(212,168,67,.12); flex-shrink:0; transition:background .4s; }
.st-nav-connector.done { background:rgba(22,163,74,.32); }

.st-nav-dot {
  width:30px; height:30px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-family:'DM Mono',monospace; font-size:11px; font-weight:700;
  border:1.5px solid rgba(240,230,208,.14);
  background:transparent; color:rgba(240,230,208,.28);
  transition:all .3s; cursor:default;
}
.st-nav-dot.done   { border-color:rgba(22,163,74,.5); background:rgba(22,163,74,.1); color:#16a34a; cursor:pointer; }
.st-nav-dot.active { border-color:#d4a843; background:rgba(212,168,67,.13); color:#d4a843; animation:stStepPulse 2.5s ease-in-out infinite; }
.st-nav-dot.done:hover { background:rgba(22,163,74,.2); box-shadow:0 0 18px rgba(22,163,74,.25); }

.st-nav-step-lbl {
  font-size:11px; font-weight:600; letter-spacing:.3px;
  color:rgba(240,230,208,.28); white-space:nowrap; transition:color .3s;
}
.st-nav-step-lbl.active { color:#d4a843; }
.st-nav-step-lbl.done   { color:rgba(22,163,74,.65); }

/* ── Nav right ── */
.st-nav-right { display:flex; align-items:center; gap:12px; flex-shrink:0; margin-left:18px; }
.st-nav-save  {
  display:flex; align-items:center; gap:6px;
  font-family:'DM Mono',monospace; font-size:9px; letter-spacing:1.5px;
  text-transform:uppercase; color:rgba(22,163,74,.55);
}
.st-nav-save-dot { width:6px; height:6px; border-radius:50%; background:#16a34a; animation:stBlink 3s ease-in-out infinite; }

.st-nav-home {
  display:flex; align-items:center; gap:8px;
  background:transparent; border:1.5px solid rgba(212,168,67,.24); border-radius:10px;
  padding:8px 18px; color:rgba(212,168,67,.68);
  font-size:12px; font-weight:600; cursor:pointer;
  font-family:'Outfit',sans-serif; letter-spacing:.3px;
  text-decoration:none;
  transition:border-color .22s,color .22s,background .22s,box-shadow .22s;
}
.st-nav-home:hover {
  border-color:#d4a843; color:#d4a843;
  background:rgba(212,168,67,.07);
  box-shadow:0 0 22px rgba(212,168,67,.18);
}
.st-nav-home-icon { font-size:15px; transition:transform .22s; }
.st-nav-home:hover .st-nav-home-icon { transform:translateX(-3px); }

/* ── Responsive nav ── */
@media(max-width:900px) {
  .st-nav-step-lbl { display:none; }
  .st-nav-connector { width:16px; }
  .st-nav { padding:0 18px; }
  .st-nav-sep { margin:0 14px; }
}
@media(max-width:600px) {
  .st-nav-steps { display:none; }
  .st-nav-save  { display:none; }
}

/* ════════════════════════════════════════
   PAGE CONTENT WRAPPER
════════════════════════════════════════ */
.st-page-content {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100%;
  padding: 86px 0 60px;
  display: flex;
  flex-direction: column;
}

/* Step nav buttons (Back / Continue) */
.st-step-nav {
  display:flex; align-items:center; gap:14px;
  margin-top:0; width:100%; padding:24px 36px 0;
}
.st-step-nav-back {
  display:flex; align-items:center; gap:8px;
  background:transparent; border:1.5px solid rgba(212,168,67,.28); border-radius:10px;
  padding:12px 28px; color:rgba(212,168,67,.7);
  font-size:13px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif;
  transition:all .22s;
}
.st-step-nav-back:hover:not(:disabled) { border-color:#d4a843; color:#d4a843; background:rgba(212,168,67,.07); }
.st-step-nav-back:disabled { opacity:.22; cursor:default; }
.st-step-nav-next {
  display:flex; align-items:center; gap:8px;
  background:linear-gradient(135deg,#d4a843,#c04028);
  border:none; border-radius:10px; padding:13px 34px;
  color:#fff; font-size:13px; font-weight:700; cursor:pointer;
  font-family:'Outfit',sans-serif; letter-spacing:.4px;
  box-shadow:0 4px 24px rgba(212,168,67,.32),inset 0 1px 0 rgba(255,255,255,.2);
  transition:transform .22s,box-shadow .22s;
  position:relative; overflow:hidden;
}
.st-step-nav-next::before {
  content:''; position:absolute; top:-50%; left:-80%; width:55%; height:200%;
  background:rgba(255,255,255,.18); transform:skewX(-18deg); transition:left .4s;
}
.st-step-nav-next:hover { transform:translateY(-2px); box-shadow:0 12px 38px rgba(212,168,67,.46); }
.st-step-nav-next:hover::before { left:130%; }

/* ════════════════════════════════════════
   CARD  (full width)
════════════════════════════════════════ */
.st-step { animation:stFadeUp .7s cubic-bezier(.22,1,.36,1) both; font-family:'Outfit',sans-serif; width:100%; }
.st-card {
  position:relative; overflow:hidden;
  width:100%;
  background:linear-gradient(152deg,rgba(9,13,34,.97),rgba(5,8,19,.99));
  border:none; border-top:1px solid rgba(212,168,67,.2); border-bottom:1px solid rgba(212,168,67,.2); border-radius:0; padding:44px 52px;
  animation:stBorder 9s ease-in-out infinite;
}
.st-card::before {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
  background-image:
    linear-gradient(rgba(212,168,67,.033) 1px,transparent 1px),
    linear-gradient(90deg,rgba(212,168,67,.033) 1px,transparent 1px);
  background-size:46px 46px;
}
.st-card::after {
  content:''; position:absolute; top:0; left:0; right:0; height:2px; z-index:2;
  background:linear-gradient(90deg,var(--g3),var(--g) 35%,var(--rust) 65%,var(--g3));
}
.st-scan { position:absolute; inset:0; overflow:hidden; pointer-events:none; opacity:.09; z-index:1; }
.st-scan::after {
  content:''; position:absolute; width:100%; height:3px;
  background:linear-gradient(90deg,transparent,rgba(212,168,67,.95),transparent);
  animation:stScan 14s linear infinite;
}
.st-corners::before,.st-corners::after {
  content:''; position:absolute; width:24px; height:24px; pointer-events:none; z-index:2;
}
.st-corners::before { bottom:18px;left:18px; border-bottom:1.5px solid rgba(212,168,67,.35); border-left:1.5px solid rgba(212,168,67,.35); }
.st-corners::after  { bottom:18px;right:18px; border-bottom:1.5px solid rgba(212,168,67,.35); border-right:1.5px solid rgba(212,168,67,.35); }

/* ════════ CARD HEADER ════════ */
.st-head { display:flex; align-items:flex-start; gap:16px; margin-bottom:32px; position:relative; z-index:3; }
.st-head-icon {
  width:52px; height:52px; border-radius:14px; flex-shrink:0;
  background:linear-gradient(135deg,rgba(212,168,67,.22),rgba(192,64,40,.15));
  border:1px solid rgba(212,168,67,.32);
  display:flex; align-items:center; justify-content:center; font-size:24px;
  animation:stGlow 5s ease-in-out infinite, stFloat 7s ease-in-out infinite;
}
.st-head-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:700; color:var(--cream); line-height:1.02; }
.st-head-title em {
  font-style:italic;
  background:linear-gradient(90deg,var(--g3),var(--g),var(--g2),var(--g));
  background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  animation:stShimmer 4s linear infinite;
}
.st-head-sub { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:rgba(240,230,208,.3); margin-top:6px; }
.st-step-badge {
  margin-left:auto; flex-shrink:0;
  font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
  color:rgba(212,168,67,.5); letter-spacing:1.5px;
  border:1px solid rgba(212,168,67,.2); border-radius:6px;
  padding:5px 10px; background:rgba(212,168,67,.04);
}

/* ════════ CONTENT ════════ */
.st-body { display:flex; flex-direction:column; gap:20px; position:relative; z-index:3; }
.st-g2  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.st-g3  { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.st-g4  { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.st-g22 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

.st-field { display:flex; flex-direction:column; gap:7px; }
.st-lbl { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2.2px; text-transform:uppercase; color:rgba(240,230,208,.36); display:flex; align-items:center; gap:7px; }
.st-req { width:5px; height:5px; border-radius:50%; background:var(--g); animation:stPulse 2.2s ease-in-out infinite; flex-shrink:0; }
.st-iwrap { position:relative; display:flex; align-items:center; }
.st-ico { position:absolute; left:14px; font-size:14px; color:rgba(212,168,67,.36); pointer-events:none; transition:color .22s; z-index:1; }
.st-input,.st-select,.st-textarea {
  width:100%; background:rgba(255,255,255,.025);
  border:1px solid rgba(240,230,208,.09); border-radius:12px;
  padding:14px 14px 14px 46px;
  font-size:14px; font-weight:500; color:var(--cream);
  font-family:'Outfit',sans-serif; outline:none;
  transition:border-color .22s,background .22s,box-shadow .22s;
}
.st-input::placeholder,.st-textarea::placeholder { color:rgba(240,230,208,.16); }
.st-input:focus,.st-select:focus,.st-textarea:focus {
  border-color:rgba(212,168,67,.6); background:rgba(212,168,67,.045);
  box-shadow:0 0 0 3px rgba(212,168,67,.11),0 0 24px rgba(212,168,67,.08);
}
.st-iwrap:focus-within .st-ico { color:rgba(212,168,67,.78); }
.st-plain { padding-left:16px !important; }
.st-select { appearance:none; cursor:pointer; }
.st-textarea { padding:14px 16px; resize:vertical; min-height:90px; line-height:1.72; font-weight:400; font-size:13.5px; }
option { background:#0d1530; color:var(--cream); }
.st-hint { font-family:'DM Mono',monospace; font-size:9px; color:rgba(240,230,208,.22); letter-spacing:.9px; margin-top:1px; }

.st-div { display:flex; align-items:center; gap:12px; margin:4px 0; }
.st-div-line { flex:1; height:1px; background:rgba(212,168,67,.12); }
.st-div-lbl { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(212,168,67,.38); }

.st-info { display:flex; align-items:flex-start; gap:13px; background:rgba(212,168,67,.06); border:1px solid rgba(212,168,67,.18); border-radius:12px; padding:15px 18px; }
.st-info-ic { font-size:20px; flex-shrink:0; margin-top:1px; }
.st-info-title { font-size:12px; font-weight:700; color:var(--g); margin-bottom:5px; }
.st-info-text  { font-size:12px; font-weight:300; color:rgba(240,230,208,.48); line-height:1.75; }

.st-stat { background:rgba(255,255,255,.025); border:1px solid rgba(212,168,67,.12); border-radius:12px; padding:18px 14px; text-align:center; transition:border-color .25s,background .25s,box-shadow .25s; cursor:default; position:relative; overflow:hidden; }
.st-stat::before { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--g),transparent); transform:scaleX(0); transition:transform .35s; }
.st-stat:hover { border-color:rgba(212,168,67,.35); background:rgba(212,168,67,.045); }
.st-stat:hover::before { transform:scaleX(1); }
.st-stat-n { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:700; line-height:1; color:var(--g); }
.st-stat-l { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(240,230,208,.28); margin-top:5px; }

.st-pills { display:flex; flex-wrap:wrap; gap:7px; }
.st-pill { padding:6px 15px; border-radius:22px; font-family:'DM Mono',monospace; font-size:11px; font-weight:500; letter-spacing:.7px; cursor:pointer; border:1.5px solid rgba(240,230,208,.1); background:rgba(255,255,255,.02); color:rgba(240,230,208,.38); transition:border-color .22s,background .22s,color .22s,box-shadow .22s; }
.st-pill:hover { border-color:rgba(212,168,67,.38); color:rgba(212,168,67,.72); }
.st-pill.on { border-color:var(--g); background:rgba(212,168,67,.1); color:var(--g); box-shadow:0 0 16px rgba(212,168,67,.18); }

.st-dir { padding:14px 8px; border-radius:12px; text-align:center; cursor:pointer; border:2px solid rgba(240,230,208,.1); background:rgba(255,255,255,.02); display:flex; flex-direction:column; align-items:center; gap:5px; transition:border-color .25s,background .25s,box-shadow .25s; }
.st-dir.on { border-color:var(--g); background:rgba(212,168,67,.09); box-shadow:0 0 32px rgba(212,168,67,.25); }
.st-dir:hover:not(.on) { border-color:rgba(212,168,67,.32); background:rgba(212,168,67,.045); }
.st-dir-abbr { font-family:'DM Mono',monospace; font-size:22px; font-weight:700; color:var(--g); line-height:1; }
.st-dir-name { font-size:12px; font-weight:700; color:var(--cream); }
.st-dir-desc { font-family:'DM Mono',monospace; font-size:8px; color:rgba(240,230,208,.3); line-height:1.4; letter-spacing:.4px; }

.st-spinner { display:flex; align-items:center; background:rgba(255,255,255,.025); border:1px solid rgba(240,230,208,.09); border-radius:12px; overflow:hidden; }
.st-spin-side { padding:18px 20px; display:flex; flex-direction:column; gap:3px; }
.st-spin-lbl { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(240,230,208,.3); }
.st-spin-desc { font-size:11px; font-weight:300; color:rgba(240,230,208,.28); }
.st-spin-mid { flex:1; display:flex; align-items:center; justify-content:center; border-left:1px solid rgba(240,230,208,.07); border-right:1px solid rgba(240,230,208,.07); padding:12px; }
.st-spin-val { font-family:'Cormorant Garamond',serif; font-size:64px; font-weight:700; color:var(--g); line-height:1; animation:stCount .3s ease both; }
.st-spin-btns { display:flex; flex-direction:column; gap:1px; background:rgba(240,230,208,.04); }
.st-spin-btn { width:54px; height:54px; border:none; background:transparent; color:rgba(212,168,67,.55); font-size:22px; font-weight:700; cursor:pointer; transition:background .2s,color .2s; display:flex; align-items:center; justify-content:center; font-family:'Outfit',sans-serif; }
.st-spin-btn:hover { background:rgba(212,168,67,.12); color:var(--g); }

.st-chk-grid { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.st-chk { display:flex; align-items:center; gap:11px; padding:12px 14px; border-radius:11px; cursor:pointer; user-select:none; border:1.5px solid rgba(240,230,208,.08); background:rgba(255,255,255,.02); transition:border-color .22s,background .22s; }
.st-chk.on { border-color:rgba(212,168,67,.46); background:rgba(212,168,67,.07); }
.st-chk:hover:not(.on) { border-color:rgba(212,168,67,.22); background:rgba(212,168,67,.03); }
.st-chk-box { width:20px; height:20px; border-radius:6px; flex-shrink:0; border:2px solid rgba(212,168,67,.3); background:transparent; display:flex; align-items:center; justify-content:center; font-size:11px; color:#fff; transition:background .18s,border-color .18s; }
.st-chk.on .st-chk-box { background:var(--g); border-color:var(--g); animation:stPop .22s ease; }
.st-chk-lbl { font-size:13px; font-weight:600; color:rgba(240,230,208,.52); transition:color .22s; }
.st-chk.on .st-chk-lbl { color:var(--g); }

.st-toilet { background:rgba(36,86,200,.06); border:1px solid rgba(36,86,200,.2); border-radius:12px; padding:15px 18px; }
.st-toilet-t { font-size:12px; font-weight:700; color:rgba(120,170,255,.9); margin-bottom:10px; }
.st-toilet-g { display:grid; grid-template-columns:1fr 1fr; gap:8px; font-family:'DM Mono',monospace; font-size:11px; }
.st-toilet-item { color:rgba(240,230,208,.4); }
.st-toilet-item strong { color:rgba(120,170,255,.82); }

.st-summary { background:rgba(6,9,22,.97); border:1px solid rgba(212,168,67,.2); border-radius:16px; padding:0; overflow:hidden; margin-bottom:14px; box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 0 1px rgba(212,168,67,.06); display:flex; flex-wrap:wrap; align-items:center; width:100%; }
.st-sum-item { padding:16px 24px; border-right:1px solid rgba(212,168,67,.1); transition:background .22s; }
.st-sum-item:hover { background:rgba(212,168,67,.03); }
.st-sum-last { border-right:none; margin-left:auto; padding-right:16px; }
.st-sum-lbl { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:rgba(240,230,208,.26); margin-bottom:3px; }
.st-sum-val { font-size:13px; font-weight:700; color:var(--cream); }
.st-sum-edit { background:transparent; border:1px solid rgba(212,168,67,.25); border-radius:8px; padding:7px 15px; color:rgba(212,168,67,.6); font-size:11px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif; transition:border-color .2s,color .2s,background .2s; }
.st-sum-edit:hover { border-color:var(--g); color:var(--g); background:rgba(212,168,67,.06); }

.st-tabs { display:flex; gap:5px; margin-bottom:14px; }
.st-tab { padding:10px 22px; border-radius:10px; font-size:12px; font-weight:600; border:1.5px solid rgba(240,230,208,.08); background:rgba(255,255,255,.02); color:rgba(240,230,208,.36); cursor:pointer; font-family:'Outfit',sans-serif; transition:border-color .22s,background .22s,color .22s,box-shadow .22s; }
.st-tab.on { border-color:rgba(212,168,67,.46); background:rgba(212,168,67,.09); color:var(--g); box-shadow:0 0 22px rgba(212,168,67,.16); }
.st-tab:hover:not(.on) { border-color:rgba(212,168,67,.24); color:rgba(212,168,67,.52); }

.st-canvas-shell { background:rgba(4,7,18,.97); border:1px solid rgba(212,168,67,.2); border-radius:18px; overflow:hidden; box-shadow:0 24px 72px rgba(0,0,0,.75),0 0 0 1px rgba(212,168,67,.06); animation:stBorder 10s ease-in-out infinite; }
.st-canvas-bar { display:flex; justify-content:space-between; align-items:center; padding:11px 18px; border-bottom:1px solid rgba(212,168,67,.14); background:rgba(2,4,14,.98); flex-wrap:wrap; gap:8px; }
.st-view-grp,.st-act-grp { display:flex; gap:6px; align-items:center; }
.st-vbtn { padding:8px 16px; border-radius:8px; font-size:11px; font-weight:600; border:1.5px solid rgba(240,230,208,.1); background:transparent; color:rgba(240,230,208,.38); cursor:pointer; font-family:'Outfit',sans-serif; transition:border-color .22s,background .22s,color .22s; }
.st-vbtn.on { border-color:rgba(212,168,67,.5); background:rgba(212,168,67,.1); color:var(--g); }
.st-vbtn:hover:not(.on) { border-color:rgba(212,168,67,.28); color:rgba(212,168,67,.56); }

.st-btn-primary { background:linear-gradient(135deg,var(--g),var(--rust)); border:none; border-radius:10px; padding:10px 24px; color:#fff; font-size:13px; font-weight:700; cursor:pointer; font-family:'Outfit',sans-serif; letter-spacing:.4px; box-shadow:0 4px 22px rgba(212,168,67,.3),inset 0 1px 0 rgba(255,255,255,.18); transition:transform .2s,box-shadow .2s; position:relative; overflow:hidden; }
.st-btn-primary::before { content:''; position:absolute; top:-50%; left:-80%; width:55%; height:200%; background:rgba(255,255,255,.18); transform:skewX(-18deg); transition:left .4s; }
.st-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(212,168,67,.44); }
.st-btn-primary:hover::before { left:130%; }
.st-btn-ghost { background:transparent; border:1.5px solid rgba(212,168,67,.32); border-radius:10px; padding:9px 22px; color:var(--g); font-size:12px; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif; transition:border-color .2s,background .2s,box-shadow .2s; }
.st-btn-ghost:hover { border-color:var(--g); background:rgba(212,168,67,.09); box-shadow:0 0 18px rgba(212,168,67,.18); }

.st-prog { display:flex; flex-direction:column; gap:10px; padding:24px; }
.st-prog-item { display:flex; align-items:center; gap:13px; padding:11px 15px; border-radius:10px; border:1px solid rgba(240,230,208,.06); background:rgba(255,255,255,.02); transition:background .3s,border-color .3s; }
.st-prog-item.active { background:rgba(212,168,67,.08); border-color:rgba(212,168,67,.22); }
.st-prog-item.done   { background:rgba(22,163,74,.05); border-color:rgba(22,163,74,.18); }
.st-prog-ic  { font-size:16px; width:24px; text-align:center; flex-shrink:0; }
.st-prog-txt { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.5px; color:rgba(240,230,208,.3); }
.st-prog-item.active .st-prog-txt { color:var(--g); font-weight:500; }
.st-prog-item.done   .st-prog-txt { color:rgba(22,163,74,.72); }

.st-score-big { font-family:'Cormorant Garamond',serif; font-size:80px; font-weight:700; color:var(--g); line-height:1; animation:stGlow 4s ease-in-out infinite; }
.st-score-lbl { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(240,230,208,.3); margin-top:6px; }
.st-vtable { width:100%; border-collapse:collapse; font-size:12px; }
.st-vtable th { font-family:'DM Mono',monospace; font-size:8px; letter-spacing:1.5px; text-transform:uppercase; color:rgba(240,230,208,.3); padding:10px 12px; text-align:left; border-bottom:1px solid rgba(212,168,67,.1); }
.st-vtable td { padding:10px 12px; border-bottom:1px solid rgba(240,230,208,.05); color:rgba(240,230,208,.62); vertical-align:middle; }
.st-vtable tr:hover td { background:rgba(212,168,67,.03); }
.st-dot-g { width:8px; height:8px; border-radius:50%; background:#16a34a; display:inline-block; }
.st-dot-w { width:8px; height:8px; border-radius:50%; background:#d97706; display:inline-block; }
.st-dot-b { width:8px; height:8px; border-radius:50%; background:#dc2626; display:inline-block; }

.st-empty { padding:64px 24px; text-align:center; font-family:'Cormorant Garamond',serif; font-style:italic; font-size:20px; color:rgba(240,230,208,.22); }

.st-sched-row { display:flex; align-items:center; padding:12px 0; border-bottom:1px solid rgba(240,230,208,.05); }
.st-sched-row:last-child { border-bottom:none; }
.st-sched-name { width:160px; font-size:13px; font-weight:600; color:rgba(240,230,208,.7); flex-shrink:0; }
.st-sched-bar-wrap { flex:1; height:8px; background:rgba(255,255,255,.06); border-radius:99px; overflow:hidden; margin:0 14px; }
.st-sched-bar { height:100%; border-radius:99px; animation:stBar .8s ease forwards; transition:width .4s; }
.st-sched-val { font-family:'DM Mono',monospace; font-size:11px; color:rgba(240,230,208,.45); width:70px; text-align:right; }

@media(max-width:640px) {
  .st-g2,.st-g4,.st-g22 { grid-template-columns:1fr }
  .st-g3 { grid-template-columns:1fr 1fr }
  .st-card { padding:24px 20px }
  .st-summary { flex-direction:column; align-items:flex-start }
  .st-sum-item { border-right:none; border-bottom:1px solid rgba(212,168,67,.07); width:100% }
  .st-page-content { padding:80px 0 80px }
}
`