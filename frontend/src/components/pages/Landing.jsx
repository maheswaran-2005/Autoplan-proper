// Landing.jsx — AutoPlan Pro · SPECTACULAR Edition
// Deep space aurora + particle constellation + 3D tilt + shimmer text
// Morphing blobs + glowing borders + ticker + parallax depth layers
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS — Everything in one shot
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg:    #02040e;
  --bg2:   #030610;
  --panel: #080d1e;
  --panel2:#0d1528;
  --gold:  #d4a843;
  --gold2: #f2cc6e;
  --gold3: #b8882e;
  --rust:  #c04028;
  --amber: #e8862a;
  --cream: #f0e6d0;
  --teal:  #1a8c78;
  --blue:  #2456c8;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body {
  background: var(--bg);
  color: var(--cream);
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: rgba(212,168,67,.3); border-radius: 2px; }

/* ═══════ KEYFRAMES ═══════ */
@keyframes fadeUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
@keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
@keyframes scanLine  { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
@keyframes rotate    { to{transform:rotate(360deg)} }
@keyframes rotateCCW { to{transform:rotate(-360deg)} }
@keyframes shimmer   { from{background-position:-300% center} to{background-position:300% center} }
@keyframes textGlow  { 0%,100%{text-shadow:0 0 40px rgba(212,168,67,.5),0 0 80px rgba(212,168,67,.2)} 50%{text-shadow:0 0 80px rgba(212,168,67,1),0 0 160px rgba(232,134,42,.5),0 0 240px rgba(212,168,67,.2)} }
@keyframes borderPulse { 0%,100%{box-shadow:0 0 20px rgba(212,168,67,.15),inset 0 0 20px rgba(212,168,67,.02)} 50%{box-shadow:0 0 60px rgba(212,168,67,.4),0 0 120px rgba(212,168,67,.1),inset 0 0 40px rgba(212,168,67,.06)} }
@keyframes aura { 0%{opacity:.5;transform:scale(1) rotate(0deg)} 33%{opacity:.8;transform:scale(1.18) rotate(120deg)} 66%{opacity:.55;transform:scale(.92) rotate(240deg)} 100%{opacity:.5;transform:scale(1) rotate(360deg)} }
@keyframes morphBlob { 0%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} 50%{border-radius:50% 50% 50% 50%} 75%{border-radius:40% 60% 30% 70%/40% 50% 60% 40%} 100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} }
@keyframes drawPath  { from{stroke-dashoffset:3000} to{stroke-dashoffset:0} }
@keyframes tickerMove{ from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.15} }
@keyframes slideInUp { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:none} }
@keyframes ripple    { to{transform:scale(4);opacity:0} }

.fu1{animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .1s both}
.fu2{animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .26s both}
.fu3{animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .42s both}
.fu4{animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .58s both}
.fu5{animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .74s both}

/* ═══════ LAYERED BACKGROUND SYSTEM ═══════ */

/* 1. Deep space base */
.space-bg {
  position:fixed;inset:0;z-index:0;
  background:
    radial-gradient(ellipse 120% 70% at 50% -10%, rgba(18,28,72,.95) 0%, transparent 55%),
    radial-gradient(ellipse 70% 50% at 85% 90%,   rgba(36,18,8,.9)   0%, transparent 50%),
    radial-gradient(ellipse 55% 70% at 5%  65%,   rgba(8,20,52,.8)   0%, transparent 50%),
    #02040e;
}

/* 2. Aurora blobs */
.aurora { position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden; }
.ab {
  position:absolute;border-radius:50%;filter:blur(90px);
  animation:aura linear infinite;
}
.ab.a1 { width:720px;height:520px;top:-200px;left:-180px; background:radial-gradient(circle,rgba(212,168,67,.13) 0%,rgba(192,64,40,.09) 50%,transparent 70%); animation-duration:20s; }
.ab.a2 { width:640px;height:740px;top:25%;right:-220px; background:radial-gradient(circle,rgba(20,80,200,.11) 0%,rgba(16,120,100,.08) 50%,transparent 70%); animation-duration:26s;animation-direction:reverse; }
.ab.a3 { width:520px;height:420px;bottom:-120px;left:28%; background:radial-gradient(circle,rgba(192,64,40,.11) 0%,rgba(212,168,67,.07) 50%,transparent 70%); animation-duration:22s; }
.ab.a4 { width:420px;height:420px;top:55%;left:8%; background:radial-gradient(circle,rgba(26,140,120,.09) 0%,transparent 65%); animation-duration:30s;animation-direction:reverse; }

/* 3. Blueprint grid */
.grid-layer {
  position:fixed;inset:0;z-index:1;pointer-events:none;
  background-image:
    linear-gradient(rgba(212,168,67,.044) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,168,67,.044) 1px, transparent 1px),
    linear-gradient(rgba(212,168,67,.017) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,168,67,.017) 1px, transparent 1px);
  background-size:100px 100px,100px 100px,25px 25px,25px 25px;
}

/* 4. Scan line */
.scanwrap { position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:1;opacity:.14; }
.scanwrap::after {
  content:'';position:absolute;width:100%;height:4px;
  background:linear-gradient(90deg,transparent 0%,rgba(212,168,67,.9) 50%,transparent 100%);
  animation:scanLine 14s linear infinite;
}

/* 5. Film grain */
.grain {
  position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.032;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px 200px;
}

/* 6. Particle canvas (sits above grain, below content) */
.pcanvas { position:fixed;inset:0;z-index:3;pointer-events:none; }

/* Corner marks */
.cm { position:fixed;pointer-events:none;z-index:10; }
.cm::before,.cm::after { content:'';position:absolute;background:var(--gold); }
.cm.tl{top:18px;left:18px}  .cm.tl::before{width:44px;height:1.5px;top:0;left:0} .cm.tl::after{width:1.5px;height:44px;top:0;left:0}
.cm.tr{top:18px;right:18px} .cm.tr::before{width:44px;height:1.5px;top:0;right:0}.cm.tr::after{width:1.5px;height:44px;top:0;right:0}
.cm.bl{bottom:18px;left:18px}  .cm.bl::before{width:44px;height:1.5px;bottom:0;left:0} .cm.bl::after{width:1.5px;height:44px;bottom:0;left:0}
.cm.br{bottom:18px;right:18px} .cm.br::before{width:44px;height:1.5px;bottom:0;right:0}.cm.br::after{width:1.5px;height:44px;bottom:0;right:0}

/* ═══════ NAVIGATION ═══════ */
nav {
  position:fixed;top:0;left:0;right:0;z-index:100;
  height:68px;display:flex;align-items:center;justify-content:space-between;
  padding:0 60px;
  background:rgba(2,4,14,.78);
  backdrop-filter:blur(30px) saturate(180%);
  border-bottom:1px solid rgba(212,168,67,.1);
  transition:background .3s,border-color .3s,box-shadow .3s;
}
nav.scrolled {
  background:rgba(2,4,14,.96);
  border-bottom-color:rgba(212,168,67,.2);
  box-shadow:0 8px 48px rgba(0,0,0,.7);
}
.logo { display:flex;align-items:center;gap:12px;text-decoration:none; }
.logo-mark {
  width:38px;height:38px;border-radius:10px;
  background:linear-gradient(135deg,var(--gold),var(--rust));
  display:flex;align-items:center;justify-content:center;font-size:18px;
  box-shadow:0 0 0 1px rgba(212,168,67,.35),0 6px 22px rgba(212,168,67,.32);
  animation:borderPulse 4s ease-in-out infinite;
}
.logo-type { font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--cream);letter-spacing:.3px; }
.logo-type b { color:var(--gold); }
.logo-badge {
  font-family:'DM Mono',monospace;font-size:8px;color:var(--gold);
  border:1px solid rgba(212,168,67,.38);padding:2px 7px;border-radius:4px;
  letter-spacing:1.8px;margin-left:4px;vertical-align:middle;
  background:rgba(212,168,67,.06);
}
.nav-mid { display:flex;align-items:center;gap:32px; }
.nav-a {
  font-size:11px;font-weight:600;color:rgba(240,230,208,.44);
  text-decoration:none;letter-spacing:1.1px;text-transform:uppercase;
  transition:color .22s;position:relative;
}
.nav-a::after {
  content:'';position:absolute;bottom:-3px;left:0;right:0;height:1px;
  background:var(--gold);transform:scaleX(0);transition:transform .28s cubic-bezier(.22,1,.36,1);
}
.nav-a:hover { color:var(--gold); }
.nav-a:hover::after { transform:scaleX(1); }
.nav-r { display:flex;gap:10px;align-items:center; }
.btn-nav-ghost {
  background:transparent;border:1px solid rgba(240,230,208,.1);border-radius:8px;
  padding:8px 20px;color:rgba(240,230,208,.48);font-size:12px;font-weight:600;
  cursor:pointer;font-family:'Outfit',sans-serif;
  transition:border-color .22s,color .22s,background .22s;
}
.btn-nav-ghost:hover { border-color:var(--gold);color:var(--gold);background:rgba(212,168,67,.05); }
.btn-nav-cta {
  background:linear-gradient(135deg,var(--gold),var(--rust));border:none;border-radius:9px;
  padding:9px 24px;color:#fff;font-size:12px;font-weight:800;
  cursor:pointer;font-family:'Outfit',sans-serif;letter-spacing:.4px;
  box-shadow:0 4px 24px rgba(212,168,67,.32),0 0 0 1px rgba(212,168,67,.22);
  transition:transform .22s,box-shadow .22s;position:relative;overflow:hidden;
}
.btn-nav-cta::before {
  content:'';position:absolute;top:-50%;left:-60%;width:50%;height:200%;
  background:rgba(255,255,255,.16);transform:skewX(-20deg);
  transition:left .4s;
}
.btn-nav-cta:hover { transform:translateY(-2px);box-shadow:0 10px 36px rgba(212,168,67,.48); }
.btn-nav-cta:hover::before { left:120%; }

/* ═══════ HERO ═══════ */
.hero {
  position:relative;z-index:5;min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:130px 56px 80px;text-align:center;overflow:hidden;
}
.hero::before {
  content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 80% 65% at 50% 45%,rgba(212,168,67,.055) 0%,transparent 65%);
}

/* Pill badge */
.hero-pill {
  display:inline-flex;align-items:center;gap:10px;margin-bottom:34px;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;
  color:var(--gold);padding:9px 22px;
  border:1px solid rgba(212,168,67,.25);border-radius:100px;
  background:rgba(212,168,67,.06);backdrop-filter:blur(12px);
}
.hero-pill-dot { width:7px;height:7px;border-radius:50%;background:var(--gold);animation:blink 2.2s ease-in-out infinite; }

/* Giant headline */
.hero-h1 {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(62px,10.5vw,118px);
  line-height:.91;font-weight:700;color:var(--cream);
  max-width:1080px;margin:0 auto 12px;letter-spacing:-.5px;
}
/* Gold shimmer text */
.gold-shimmer {
  font-style:italic;font-weight:600;
  background:linear-gradient(90deg,var(--gold3) 0%,var(--gold) 25%,var(--gold2) 50%,var(--gold) 75%,var(--gold3) 100%);
  background-size:250% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  animation:shimmer 4s linear infinite;
}
.hero-subtitle {
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:clamp(20px,2.8vw,32px);font-weight:300;
  color:rgba(240,230,208,.5);display:block;margin-top:4px;
}
.hero-sub {
  font-size:17px;font-weight:300;color:rgba(240,230,208,.44);
  max-width:580px;line-height:1.86;margin:28px auto 56px;
}
.hero-sub strong { color:rgba(240,230,208,.72);font-weight:600; }

/* Mega CTA buttons */
.hero-btns { display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:84px; }
.btn-mega {
  background:linear-gradient(135deg,var(--gold),var(--amber),var(--rust));
  border:none;border-radius:14px;padding:18px 50px;
  color:#fff;font-size:15px;font-weight:800;
  cursor:pointer;font-family:'Outfit',sans-serif;letter-spacing:.5px;
  display:flex;align-items:center;gap:11px;
  box-shadow:0 12px 44px rgba(212,168,67,.38),0 0 0 1px rgba(212,168,67,.3),
             inset 0 1px 0 rgba(255,255,255,.22);
  transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s;
  position:relative;overflow:hidden;
}
.btn-mega::before {
  content:'';position:absolute;top:-50%;left:-80%;width:60%;height:200%;
  background:rgba(255,255,255,.18);transform:skewX(-18deg);
  transition:left .45s ease;
}
.btn-mega:hover { transform:translateY(-4px) scale(1.02);box-shadow:0 22px 64px rgba(212,168,67,.55),0 0 0 1px rgba(212,168,67,.5); }
.btn-mega:hover::before { left:130%; }
.btn-mega .arr { display:inline-block;transition:transform .22s; }
.btn-mega:hover .arr { transform:translateX(6px); }

.btn-outline {
  background:rgba(240,230,208,.04);border:1.5px solid rgba(240,230,208,.16);
  backdrop-filter:blur(14px);border-radius:14px;padding:17px 44px;
  color:rgba(240,230,208,.82);font-size:15px;font-weight:600;
  cursor:pointer;font-family:'Outfit',sans-serif;
  display:flex;align-items:center;gap:11px;
  transition:border-color .25s,background .25s,color .25s;
}
.btn-outline:hover { border-color:var(--gold);background:rgba(212,168,67,.07);color:var(--gold); }

/* ═══════ 3D BLUEPRINT CARD ═══════ */
.card-3d-wrap { position:relative;width:100%;max-width:1020px;margin:0 auto;perspective:1400px; }
.card-3d-inner {
  transform-style:preserve-3d;transition:transform .12s ease;
  animation:floatY 9s ease-in-out infinite;
  will-change:transform;
}
.preview-shell {
  background:rgba(6,10,22,.92);border:1px solid rgba(212,168,67,.22);border-radius:22px;
  overflow:hidden;
  box-shadow:
    0 70px 130px rgba(0,0,0,.88),
    0 0 0 1px rgba(212,168,67,.08),
    0 0 90px rgba(212,168,67,.07),
    inset 0 1px 0 rgba(240,230,208,.06);
  animation:borderPulse 7s ease-in-out infinite;
}
.preview-bar {
  display:flex;align-items:center;gap:8px;padding:14px 22px;
  background:rgba(2,4,14,.96);border-bottom:1px solid rgba(212,168,67,.14);
}
.pdot { width:12px;height:12px;border-radius:50%; }
.pbar-path { margin-left:12px;font-family:'DM Mono',monospace;font-size:9px;color:rgba(212,168,67,.4);letter-spacing:1.8px; }
.pbar-status {
  margin-left:auto;display:flex;align-items:center;gap:7px;
  font-family:'DM Mono',monospace;font-size:9px;color:rgba(22,163,74,.85);
}
.pbar-dot { width:7px;height:7px;border-radius:50%;background:#16a34a;animation:blink 2s ease-in-out infinite; }
.psvg { display:block;width:100%; }
.card-glow {
  position:absolute;inset:-30px;border-radius:40px;pointer-events:none;z-index:-1;
  background:radial-gradient(ellipse at 50% 50%,rgba(212,168,67,.14),transparent 68%);
  filter:blur(24px);
}

/* ═══════ STATS BAND ═══════ */
.stats-band {
  position:relative;z-index:5;margin-top:108px;
  border-top:1px solid rgba(212,168,67,.1);
  border-bottom:1px solid rgba(212,168,67,.1);
  overflow:hidden;
}
.stats-band::before {
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent 0%,rgba(212,168,67,.04) 30%,rgba(212,168,67,.07) 50%,rgba(212,168,67,.04) 70%,transparent 100%);
}
.stats-inner { display:flex;justify-content:center;flex-wrap:wrap; }
.stat {
  padding:46px 76px;text-align:center;border-right:1px solid rgba(212,168,67,.1);
  position:relative;overflow:hidden;transition:background .3s;cursor:default;
}
.stat:last-child { border-right:none; }
.stat:hover { background:rgba(212,168,67,.025); }
.stat::after {
  content:'';position:absolute;bottom:0;left:10%;right:10%;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  transform:scaleX(0);transition:transform .4s;
}
.stat:hover::after { transform:scaleX(1); }
.stat-n {
  font-family:'Cormorant Garamond',serif;font-size:58px;font-weight:700;line-height:1;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.stat-l { font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(240,230,208,.26);margin-top:8px; }

/* ═══════ FEATURES ═══════ */
.features-wrap { position:relative;z-index:5;max-width:1280px;margin:0 auto;padding:128px 60px; }
.sec-over {
  display:inline-flex;align-items:center;gap:10px;margin-bottom:18px;
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:3.5px;text-transform:uppercase;color:var(--gold);
}
.sec-over::before { content:'';width:32px;height:1px;background:var(--gold); }
.sec-h2 {
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(40px,5.5vw,64px);font-weight:700;color:var(--cream);line-height:1.07;
}
.sec-h2 em { font-style:italic;color:var(--gold); }

/* Asymmetric feature grid */
.feat-grid {
  display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:1px;
  margin-top:64px;background:rgba(212,168,67,.08);
}
.fc {
  background:rgba(6,10,22,.94);padding:46px 40px;
  transition:background .28s;cursor:default;position:relative;overflow:hidden;
}
.fc::before {
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  transform:scaleX(0);transition:transform .4s;
}
.fc:hover { background:rgba(10,16,36,.98); }
.fc:hover::before { transform:scaleX(1); }
.fc.tall { grid-row:span 2;display:flex;flex-direction:column;justify-content:space-between; }
.fc-icon {
  width:52px;height:52px;border-radius:14px;margin-bottom:28px;
  background:rgba(212,168,67,.08);border:1px solid rgba(212,168,67,.16);
  display:flex;align-items:center;justify-content:center;font-size:24px;
  transition:background .28s,box-shadow .28s;
}
.fc:hover .fc-icon { background:rgba(212,168,67,.13);box-shadow:0 0 22px rgba(212,168,67,.22); }
.fc-h { font-size:17px;font-weight:700;color:var(--cream);margin-bottom:12px;line-height:1.3; }
.fc-p { font-size:13px;font-weight:300;color:rgba(240,230,208,.4);line-height:1.82; }
.fc-chip {
  display:inline-block;margin-top:20px;
  font-family:'DM Mono',monospace;font-size:8px;letter-spacing:2px;text-transform:uppercase;
  color:var(--gold);padding:4px 10px;border:1px solid rgba(212,168,67,.22);
  border-radius:4px;background:rgba(212,168,67,.04);
}
.fc-visual { margin-top:auto;height:160px;border-radius:12px;border:1px solid rgba(212,168,67,.12);overflow:hidden;background:rgba(2,4,14,.8); }

/* ═══════ TRUST TICKER ═══════ */
.ticker-wrap {
  position:relative;z-index:5;overflow:hidden;
  border-top:1px solid rgba(212,168,67,.07);
  border-bottom:1px solid rgba(212,168,67,.07);
  padding:32px 0;
}
.ticker-wrap::before,.ticker-wrap::after {
  content:'';position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none;
}
.ticker-wrap::before { left:0;background:linear-gradient(90deg,var(--bg),transparent); }
.ticker-wrap::after  { right:0;background:linear-gradient(270deg,var(--bg),transparent); }
.ticker {
  display:flex;gap:0;width:max-content;
  animation:tickerMove 22s linear infinite;
}
.ticker:hover { animation-play-state:paused; }
.tick-item {
  display:flex;align-items:center;gap:8px;padding:0 32px;white-space:nowrap;
  font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
  color:rgba(240,230,208,.35);letter-spacing:.8px;
  border-right:1px solid rgba(212,168,67,.1);
  transition:color .2s;
}
.tick-item:hover { color:var(--gold); }
.tick-ic { font-size:15px; }

/* ═══════ HOW IT WORKS ═══════ */
.how-wrap { position:relative;z-index:5;max-width:1280px;margin:0 auto;padding:0 60px 128px; }
.steps-row {
  display:grid;grid-template-columns:repeat(5,1fr);gap:0;
  margin-top:76px;position:relative;
}
.steps-row::before {
  content:'';position:absolute;top:30px;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold) 20%,var(--gold) 80%,transparent);
}
.step { text-align:center;padding:0 16px;transition:transform .3s; }
.step:hover { transform:translateY(-8px); }
.step-num {
  width:60px;height:60px;border-radius:50%;background:var(--panel);
  border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center;
  margin:0 auto 24px;font-family:'DM Mono',monospace;font-size:16px;font-weight:700;color:var(--gold);
  position:relative;z-index:1;transition:background .3s,box-shadow .3s;
}
.step:hover .step-num { background:rgba(212,168,67,.1);box-shadow:0 0 36px rgba(212,168,67,.35); }
.step-h { font-size:13px;font-weight:700;color:var(--cream);margin-bottom:7px; }
.step-p { font-size:11px;color:rgba(240,230,208,.34);line-height:1.65; }

/* ═══════ CTA ═══════ */
.cta-wrap { position:relative;z-index:5;padding:0 60px 128px; }
.cta-card {
  max-width:980px;margin:0 auto;padding:100px 80px;text-align:center;
  border-radius:28px;position:relative;overflow:hidden;
  border:1px solid rgba(212,168,67,.2);
  background:linear-gradient(140deg,rgba(10,16,40,.92),rgba(4,8,18,.96));
  animation:borderPulse 9s ease-in-out infinite;
}
.cta-card::before {
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 70% 55% at 50% 0%,rgba(212,168,67,.11),transparent),
             radial-gradient(ellipse 40% 60% at 85% 100%,rgba(192,64,40,.09),transparent);
}
.cta-ring {
  position:absolute;border-radius:50%;pointer-events:none;
  top:50%;left:50%;transform:translate(-50%,-50%);
}
.cta-ring.r1 { width:660px;height:660px;border:1px solid rgba(212,168,67,.06);animation:rotate 32s linear infinite; }
.cta-ring.r2 { width:460px;height:460px;border:1px dashed rgba(212,168,67,.05);animation:rotateCCW 22s linear infinite; }
.cta-ring.r3 { width:280px;height:280px;border:1px solid rgba(212,168,67,.07);animation:rotate 16s linear infinite; }
.cta-h {
  font-family:'Cormorant Garamond',serif;font-size:clamp(38px,5vw,62px);font-weight:700;
  color:var(--cream);margin-bottom:16px;position:relative;
  animation:textGlow 6s ease-in-out infinite;
}
.cta-h em { font-style:italic;color:var(--gold); }
.cta-p { font-size:16px;font-weight:300;color:rgba(240,230,208,.42);margin-bottom:54px;position:relative; }
.cta-badges {
  display:flex;justify-content:center;gap:14px;flex-wrap:wrap;
  margin-top:36px;position:relative;
}
.cta-badge {
  display:flex;align-items:center;gap:7px;
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(240,230,208,.3);padding:7px 14px;
  border:1px solid rgba(212,168,67,.1);border-radius:100px;
  background:rgba(212,168,67,.03);
}

/* ═══════ FOOTER ═══════ */
footer {
  position:relative;z-index:5;
  border-top:1px solid rgba(212,168,67,.1);padding:34px 60px;
  display:flex;align-items:center;justify-content:space-between;
}
footer::before {
  content:'';position:absolute;top:0;left:8%;right:8%;height:1px;
  background:linear-gradient(90deg,transparent,rgba(212,168,67,.35),transparent);
}
.foot-l { display:flex;flex-direction:column;gap:4px; }
.foot-copy { font-family:'DM Mono',monospace;font-size:9px;color:rgba(240,230,208,.18);letter-spacing:1.6px; }
.foot-tag { font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:rgba(212,168,67,.32); }
.foot-links { display:flex;gap:26px; }
.foot-a { font-size:11px;color:rgba(240,230,208,.22);text-decoration:none;transition:color .2s; }
.foot-a:hover { color:var(--gold); }

/* ═══════ RESPONSIVE ═══════ */
@media(max-width:960px){
  nav{padding:0 24px}
  .nav-mid{display:none}
  .hero{padding:120px 24px 60px}
  .features-wrap,.how-wrap{padding:80px 24px}
  .cta-wrap{padding:0 24px 80px}
  .cta-card{padding:60px 28px}
  .feat-grid{grid-template-columns:1fr}
  .fc.tall{grid-row:span 1}
  .steps-row{grid-template-columns:1fr 1fr;gap:36px}
  .steps-row::before{display:none}
  .stat{padding:28px 36px}
  footer{flex-direction:column;gap:18px;text-align:center;padding:28px 24px}
}
`;

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CANVAS COMPONENT
═══════════════════════════════════════════════════════════════ */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize();
    addEventListener("resize", resize);

    const COLS = ["rgba(212,168,67,","rgba(232,134,42,","rgba(192,64,40,","rgba(240,204,100,"];
    const pts = Array.from({ length: 110 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.6 + .3,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .18 - .06,
      a: Math.random() * .55 + .12,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      tw: Math.random() * Math.PI * 2, tws: Math.random() * .018 + .004,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.tw += p.tws;
        if (p.x < -10) p.x = c.width + 10;
        if (p.x > c.width + 10) p.x = -10;
        if (p.y < -10) p.y = c.height + 10;
        if (p.y > c.height + 10) p.y = -10;
        const a = p.a * (.5 + .5 * Math.sin(p.tw));
        // glow halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, p.col + (a * .9) + ")");
        g.addColorStop(1, p.col + "0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        // core
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.min(a * 1.8, 1) + ")"; ctx.fill();
      });
      // constellation lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(212,168,67,${(.055 * (1 - d/140)).toFixed(3)})`;
            ctx.lineWidth = .55; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="pcanvas" />;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN BLUEPRINT SVG
═══════════════════════════════════════════════════════════════ */
function BlueprintSVG() {
  return (
    <svg className="psvg" viewBox="0 0 1000 460" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="g" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0L0 0 0 25" fill="none" stroke="rgba(212,168,67,.055)" strokeWidth=".5"/>
        </pattern>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="sglow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(212,168,67,.72)"/>
          <stop offset="100%" stopColor="rgba(192,64,40,.52)"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="460" fill="#02040e"/>
      <rect width="1000" height="460" fill="url(#g)"/>
      {/* Ambient glow */}
      <ellipse cx="400" cy="230" rx="330" ry="180" fill="rgba(212,168,67,.022)"/>
      {/* Outer wall — animated draw */}
      <rect x="72" y="36" width="680" height="388" fill="none" stroke="url(#wg)" strokeWidth="3"
        style={{strokeDasharray:2500,strokeDashoffset:2500,animation:"drawPath 3s ease forwards .3s"}}/>
      {/* Room fills */}
      {[["73","37","252","194","rgba(212,168,67,.038)"],["73","232","164","191","rgba(192,64,40,.036)"],["238","232","164","191","rgba(212,168,67,.044)"],["326","37","210","194","rgba(26,116,100,.04)"],["537","37","215","388","rgba(30,60,140,.036)"]].map(([x,y,w,h,f])=><rect key={x+y} x={x} y={y} width={w} height={h} fill={f}/>)}
      {/* Interior walls */}
      {[["326","37","326","424"],["73","231","326","231"],["238","231","238","424"],["537","37","537","424"],["326","228","537","228"]].map(([x1,y1,x2,y2])=><line key={x1+y1} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,168,67,.32)" strokeWidth="1.6"/>)}
      {/* Toilet sub-rooms */}
      <rect x="73" y="232" width="62" height="78" fill="rgba(96,160,220,.09)" stroke="rgba(96,160,220,.36)" strokeWidth="1.2"/>
      <rect x="238" y="232" width="62" height="78" fill="rgba(96,160,220,.09)" stroke="rgba(96,160,220,.36)" strokeWidth="1.2"/>
      {/* Door arcs */}
      {["M 172 231 A 56 56 0 0 1 116 175","M 326 134 A 44 44 0 0 0 370 90","M 537 120 A 40 40 0 0 1 577 80"].map((d,i)=><path key={i} d={d} fill="none" stroke="rgba(212,168,67,.45)" strokeWidth="1.2" strokeDasharray="4,3.5"/>)}
      {/* Windows */}
      {[[192,36,76,0],[408,36,76,0],[598,36,76,0],[752,36,0,76],[752,280,0,76]].map(([x,y,w,h],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={w?x+w:x} y2={h?y+h:y} stroke="rgba(100,180,255,.65)" strokeWidth="5"/>
          <line x1={x+(w?14:0)} y1={y+(h?14:0)} x2={w?x+w-14:x} y2={h?y+h-14:y} stroke="rgba(100,180,255,.3)" strokeWidth="1.5"/>
          <line x1={x+(w?w/2:0)} y1={y+(h?h/2:0)} x2={w?x+w/2:x} y2={h?y+h/2:y} stroke="rgba(100,180,255,.3)" strokeWidth="1.5"/>
        </g>
      ))}
      {/* Room labels */}
      {[[198,130,"LIVING ROOM","18.6 sqm"],[430,130,"KITCHEN","15.4 sqm"],[155,330,"MASTER BED","13.2 sqm"],[320,330,"BEDROOM 2","12.1 sqm"],[644,232,"DINING","20.1 sqm"]].map(([x,y,t,s])=>(
        <g key={t}>
          <text x={x} y={+y-7} textAnchor="middle" fill="rgba(212,168,67,.76)" fontSize="11" fontFamily="DM Mono,monospace">{t}</text>
          <text x={x} y={+y+10} textAnchor="middle" fill="rgba(240,230,208,.28)" fontSize="8.5" fontFamily="DM Mono,monospace">{s}</text>
        </g>
      ))}
      <text x="104" y="276" textAnchor="middle" fill="rgba(96,180,255,.7)" fontSize="7.5" fontFamily="DM Mono,monospace">WC</text>
      <text x="269" y="276" textAnchor="middle" fill="rgba(96,180,255,.7)" fontSize="7.5" fontFamily="DM Mono,monospace">WC</text>
      {/* Vastu dots */}
      {[[290,50,"#16a34a"],[512,50,"#16a34a"],[224,244,"#16a34a"],[382,244,"#65a30d"],[714,50,"#16a34a"]].map(([x,y,c],i)=>(
        <g key={i}><circle cx={x} cy={y} r="9" fill={c} opacity=".16" filter="url(#sglow)"/><circle cx={x} cy={y} r="5" fill={c} opacity=".92" filter="url(#glow)"/></g>
      ))}
      {/* Dimension lines */}
      <line x1="72" y1="436" x2="752" y2="436" stroke="rgba(212,168,67,.28)" strokeWidth=".9"/>
      <line x1="72" y1="428" x2="72" y2="444" stroke="rgba(212,168,67,.28)" strokeWidth=".9"/>
      <line x1="752" y1="428" x2="752" y2="444" stroke="rgba(212,168,67,.28)" strokeWidth=".9"/>
      <text x="412" y="452" textAnchor="middle" fill="rgba(212,168,67,.44)" fontSize="9" fontFamily="DM Mono,monospace">12.19m  (40'0")</text>
      <line x1="778" y1="36" x2="778" y2="424" stroke="rgba(212,168,67,.28)" strokeWidth=".9"/>
      <text x="794" y="234" textAnchor="middle" fill="rgba(212,168,67,.44)" fontSize="9" fontFamily="DM Mono,monospace" transform="rotate(-90,794,234)">9.14m  (30'0")</text>
      {/* Compass */}
      <circle cx="880" cy="96" r="38" fill="rgba(2,4,14,.92)" stroke="rgba(212,168,67,.28)" strokeWidth="1.3"/>
      <circle cx="880" cy="96" r="32" fill="none" stroke="rgba(212,168,67,.09)" strokeWidth=".7" strokeDasharray="3,5"/>
      <polygon points="880,62 872,96 880,89 888,96" fill="rgba(240,230,208,.92)" filter="url(#glow)"/>
      <polygon points="880,130 872,96 880,103 888,96" fill="rgba(212,168,67,.48)"/>
      <circle cx="880" cy="96" r="5" fill="rgba(2,4,14,.9)" stroke="rgba(212,168,67,.52)" strokeWidth="1.4"/>
      <text x="880" y="55" textAnchor="middle" fill="rgba(240,230,208,.84)" fontSize="11" fontFamily="DM Mono,monospace" fontWeight="700">N</text>
      <text x="880" y="148" textAnchor="middle" fill="rgba(212,168,67,.44)" fontSize="8.5" fontFamily="DM Mono,monospace">SOUTH</text>
      {/* Title block */}
      <rect x="806" y="172" width="182" height="130" fill="rgba(2,4,14,.84)" stroke="rgba(212,168,67,.24)" strokeWidth=".9"/>
      <line x1="806" y1="196" x2="988" y2="196" stroke="rgba(212,168,67,.18)" strokeWidth=".6"/>
      <text x="897" y="189" textAnchor="middle" fill="rgba(212,168,67,.76)" fontSize="10" fontFamily="DM Mono,monospace">AUTOPLAN PRO</text>
      <text x="897" y="212" textAnchor="middle" fill="rgba(240,230,208,.38)" fontSize="8.5" fontFamily="DM Mono,monospace">SOUTH FACING · VAR A</text>
      <text x="897" y="228" textAnchor="middle" fill="rgba(240,230,208,.38)" fontSize="8.5" fontFamily="DM Mono,monospace">12.19 × 9.14m</text>
      <text x="897" y="254" textAnchor="middle" fill="#16a34a" fontSize="12" fontFamily="DM Mono,monospace">VASTU: 88%</text>
      <rect x="822" y="266" width="150" height="10" rx="5" fill="rgba(255,255,255,.06)"/>
      <rect x="822" y="266" width="132" height="10" rx="5" fill="rgba(22,163,74,.4)"/>
      <text x="897" y="292" textAnchor="middle" fill="rgba(22,163,74,.6)" fontSize="7.5" fontFamily="DM Mono,monospace">EXCELLENT COMPLIANCE</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MINI BLUEPRINT (inside feature card)
═══════════════════════════════════════════════════════════════ */
function MiniPlan() {
  return (
    <svg viewBox="0 0 280 148" style={{width:"100%",height:"100%",display:"block"}}>
      <rect width="280" height="148" fill="#030610"/>
      <pattern id="g2" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0L0 0 0 14" fill="none" stroke="rgba(212,168,67,.05)" strokeWidth=".5"/></pattern>
      <rect width="280" height="148" fill="url(#g2)"/>
      <rect x="18" y="10" width="244" height="128" fill="none" stroke="rgba(212,168,67,.42)" strokeWidth="1.2"
        style={{strokeDasharray:800,strokeDashoffset:800,animation:"drawPath 2.2s ease forwards 1.2s"}}/>
      <line x1="18" y1="74" x2="162" y2="74" stroke="rgba(212,168,67,.24)" strokeWidth="1"/>
      <line x1="162" y1="10" x2="162" y2="138" stroke="rgba(212,168,67,.24)" strokeWidth="1"/>
      <line x1="18" y1="74" x2="18" y2="138" stroke="rgba(212,168,67,.0)" strokeWidth="0"/>
      <rect x="18" y="75" width="52" height="63" fill="rgba(96,160,220,.07)" stroke="rgba(96,160,220,.26)" strokeWidth=".8"/>
      {[[44,22,"#16a34a"],[90,22,"#16a34a"],[148,22,"#16a34a"],[200,22,"#16a34a"]].map(([x,y,c],i)=><circle key={i} cx={x} cy={y} r="4" fill={c} opacity=".85"/>)}
      <text x="90" y="50" textAnchor="middle" fill="rgba(212,168,67,.52)" fontSize="7" fontFamily="DM Mono,monospace">LIVING ROOM</text>
      <text x="214" y="78" textAnchor="middle" fill="rgba(212,168,67,.52)" fontSize="7" fontFamily="DM Mono,monospace">DINING</text>
      <text x="90" y="108" textAnchor="middle" fill="rgba(212,168,67,.52)" fontSize="7" fontFamily="DM Mono,monospace">MASTER BED</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const FEATURES = [
  { ic:"📐", h:"Intelligent Layout Engine", p:"Rooms positioned using Vastu science. Toilet carved into each bedroom corner — zero overlap, perfect ventilation guaranteed.", chip:"AI LAYOUT", tall:true },
  { ic:"🧭", h:"Vastu Compliance Scoring",   p:"Every room scored across 14 Vastu rules. North, South, East, West — four full variants per plot.", chip:"VASTU SHASTRA" },
  { ic:"📄", h:"Blueprint-Grade Export",      p:"Dimensions, doors, windows, furniture. Schematic toggle. PNG export.", chip:"PRINT READY" },
  { ic:"📏", h:"Metric & Imperial",           p:"Metres or feet/inches. Plots from 20×30 to 60×80 ft.", chip:"DUAL UNITS" },
  { ic:"🏠", h:"Flexible Rooms",              p:"1–4 bedrooms each with attached toilet. Add pooja, dining, garage, study, balcony.", chip:"CONFIGURABLE" },
  { ic:"⚡", h:"4-Variant Generator",         p:"Four unique room arrangements per plot. All Vastu-compliant. Regenerate instantly.", chip:"4× OPTIONS" },
];
const STEPS = [
  {n:"01",h:"Owner Details",  p:"Name, contact, site address"},
  {n:"02",h:"Plot Dimensions",p:"Length, width, facing direction"},
  {n:"03",h:"Room Selection", p:"Bedrooms + optional spaces"},
  {n:"04",h:"Choose Style",   p:"Vastu mode, construction type"},
  {n:"05",h:"Generate Plan",  p:"Blueprint ready in seconds"},
];
const TICKS = ["📐 Vastu Compliant","🏠 12,400+ Plans","🧭 88% Avg Score","📄 PNG Export","⚡ 4 Variants","📏 Dual Units","🚽 Attached Toilets","🏗 G+1 & G+2","🔄 Instant Regen","🗺 All Directions"];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({a:0,b:0,c:0,d:0});
  const [scrolled, setScrolled] = useState(false);
  const tiltRef = useRef(null);

  // Counter
  useEffect(() => {
    const T={a:12400,b:88,c:6,d:4}, dur=2200, start=Date.now();
    const tick=()=>{
      const p=Math.min((Date.now()-start)/dur,1), e=1-Math.pow(1-p,3);
      setCounts({a:Math.floor(T.a*e),b:Math.floor(T.b*e),c:Math.floor(T.c*e),d:T.d});
      if(p<1)requestAnimationFrame(tick);
    };
    setTimeout(()=>requestAnimationFrame(tick),500);
  }, []);

  // Nav scroll
  useEffect(()=>{
    const fn=()=>setScrolled(scrollY>40);
    addEventListener("scroll",fn,{passive:true});
    return()=>removeEventListener("scroll",fn);
  },[]);

  // 3D tilt
  const onMove=useCallback(e=>{
    const el=tiltRef.current; if(!el)return;
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`rotateY(${x*12}deg) rotateX(${-y*7}deg)`;
  },[]);
  const onLeave=useCallback(()=>{
    if(tiltRef.current) tiltRef.current.style.transform="";
  },[]);

  const go = path => navigate(path);

  return (
    <>
      <style>{CSS}</style>

      {/* ── Background layers ── */}
      <div className="space-bg"/>
      <div className="aurora">
        <div className="ab a1"/><div className="ab a2"/>
        <div className="ab a3"/><div className="ab a4"/>
      </div>
      <div className="grid-layer"/>
      <div className="scanwrap"/>
      <div className="grain"/>
      <Particles/>
      <div className="cm tl"/><div className="cm tr"/><div className="cm bl"/><div className="cm br"/>

      {/* ══ NAV ══ */}
      <nav className={scrolled?"scrolled":""}>
        <Link to="/" className="logo">
          <div className="logo-mark">🏠</div>
          <span className="logo-type">Auto<b>Plan</b></span>
          <span className="logo-badge">PRO</span>
        </Link>
        <div className="nav-mid">
          <a href="#features" className="nav-a">Features</a>
          <a href="#how" className="nav-a">How It Works</a>
           <a className="nav-a" onClick={() => navigate('/Dashboard')}>Dashboard</a>
  
        </div>
        <div className="nav-r">
          <button className="btn-nav-ghost" onClick={()=>go("/login")}>Sign In</button>
          <button className="btn-nav-cta" onClick={()=>go("/register")}>Get Started →</button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-pill fu1">
          <div className="hero-pill-dot"/>
          Vastu-Compliant Floor Plans · AI-Powered
        </div>
        <h1 className="hero-h1 fu2">
          Generate Your<br/>
          <span className="gold-shimmer">Perfect Blueprint</span>
          <span className="hero-subtitle">Where ancient Vastu meets modern design</span>
        </h1>
        <p className="hero-sub fu3">
          AutoPlan Pro creates <strong>Vastu-compliant floor plans</strong> for any plot —
          attached toilets in every bedroom, 4 layout variants, instant PNG export.
        </p>
        <div className="hero-btns fu4">
          <button className="btn-mega" onClick={()=>go("/register")}>
            Generate Free Plan <span className="arr">→</span>
          </button>
          <button className="btn-outline" onClick={()=>go("/planner")}>
            <span>🏗</span> Open Planner
          </button>
        </div>

        {/* 3D Blueprint Card */}
        <div className="card-3d-wrap fu5">
          <div className="card-glow"/>
          <div className="card-3d-inner" ref={tiltRef} onMouseMove={onMove} onMouseLeave={onLeave}>
            <div className="preview-shell">
              <div className="preview-bar">
                <div className="pdot" style={{background:"#ff5f57"}}/>
                <div className="pdot" style={{background:"#ffbd2e"}}/>
                <div className="pdot" style={{background:"#28ca41"}}/>
                <span className="pbar-path">AUTOPLAN PRO  ·  SOUTH FACING  ·  VARIANT A</span>
                <div className="pbar-status"><div className="pbar-dot"/>VASTU 88% · EXCELLENT</div>
              </div>
              <BlueprintSVG/>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="stats-band">
        <div className="stats-inner">
          {[
            {n:counts.a.toLocaleString()+"+",l:"Plans Generated"},
            {n:counts.b+"%",                 l:"Avg Vastu Score"},
            {n:counts.c+"+",                 l:"Plot Presets"},
            {n:counts.d,                      l:"Layout Variants"},
          ].map(s=>(
            <div className="stat" key={s.l}>
              <div className="stat-n">{s.n}</div>
              <div className="stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <div className="features-wrap" id="features">
        <div className="sec-over">Capabilities</div>
        <h2 className="sec-h2">Everything to design your <em>ideal home</em></h2>
        <div className="feat-grid">
          {FEATURES.map(f=>(
            <div className={`fc${f.tall?" tall":""}`} key={f.h}>
              <div>
                <div className="fc-icon">{f.ic}</div>
                <div className="fc-h">{f.h}</div>
                <div className="fc-p">{f.p}</div>
                <div className="fc-chip">{f.chip}</div>
              </div>
              {f.tall&&<div className="fc-visual"><MiniPlan/></div>}
            </div>
          ))}
        </div>
      </div>

      {/* ══ TICKER ══ */}
      <div className="ticker-wrap">
        <div className="ticker">
          {[...TICKS,...TICKS].map((t,i)=>(
            <div className="tick-item" key={i}>
              <span className="tick-ic">{t.split(" ")[0]}</span>
              <span>{t.slice(t.indexOf(" ")+1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div className="how-wrap" id="how">
        <div style={{textAlign:"center"}}>
          <div className="sec-over" style={{justifyContent:"center"}}>Workflow</div>
          <h2 className="sec-h2" style={{maxWidth:"100%",textAlign:"center"}}>Five steps to your <em>blueprint</em></h2>
        </div>
        <div className="steps-row">
          {STEPS.map(s=>(
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-h">{s.h}</div>
              <div className="step-p">{s.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div className="cta-wrap">
        <div className="cta-card">
          <div className="cta-ring r1"/><div className="cta-ring r2"/><div className="cta-ring r3"/>
          <h2 className="cta-h">Ready to plan your <em>dream home?</em></h2>
          <p className="cta-p">Create your first Vastu blueprint free — no credit card needed.</p>
          <button className="btn-mega" style={{margin:"0 auto"}} onClick={()=>go("/register")}>
            Start For Free <span className="arr">→</span>
          </button>
          <div className="cta-badges">
            {["✓ Free Forever Plan","✓ No Credit Card","✓ Instant Download","✓ 4 Variants Included"].map(b=>(
              <div className="cta-badge" key={b}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="foot-l">
          <div className="foot-copy">© 2025 AUTOPLAN PRO · VASTU FLOOR PLAN GENERATOR</div>
          <div className="foot-tag">Where ancient wisdom meets modern design</div>
        </div>
        <div className="foot-links">
          <a href="#" className="foot-a">Privacy</a>
          <a href="#" className="foot-a">Terms</a>
          <a href="#" className="foot-a">Contact</a>
        </div>
      </footer>
    </>
  );
}