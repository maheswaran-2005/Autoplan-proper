// Login.jsx — AutoPlan Pro Login Page
// Design: Split screen — Left: dark art panel with animated blueprint lines + brand copy.
//         Right: refined editorial form with gold field focus states.
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --ink: #050810;
  --deep: #070b16;
  --panel: #0b1020;
  --panel2: #0f1428;
  --gold: #d4a843;
  --gold2: #f0c96a;
  --rust: #c04428;
  --cream: #f0e6d0;
  --muted: rgba(240,230,208,.36);
  --border: rgba(212,168,67,.13);
  --border-soft: rgba(240,230,208,.07);
  --err: rgba(192,58,40,.55);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes drawSVG { from { stroke-dashoffset: 2400; } to { stroke-dashoffset: 0; } }
@keyframes glowPulse { 0%,100% { opacity: .6; } 50% { opacity: .15; } }

.a1 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .05s both; }
.a2 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .14s both; }
.a3 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .23s both; }
.a4 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .32s both; }
.a5 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .41s both; }
.a6 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .5s both; }

/* ── Page Layout ── */
.page {
  min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
  background: var(--deep);
}

/* ──────────────────── LEFT PANEL ──────────────────── */
.lp {
  position: relative; overflow: hidden;
  background: var(--ink); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between; padding: 42px 46px;
}
.lp-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(212,168,67,.047) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,168,67,.047) 1px, transparent 1px);
  background-size: 44px 44px;
}
.lp-glow1 {
  position: absolute; width: 440px; height: 440px; border-radius: 50%; pointer-events: none;
  top: -100px; left: -100px;
  background: radial-gradient(circle, rgba(212,168,67,.1), transparent 65%);
}
.lp-glow2 {
  position: absolute; width: 360px; height: 360px; border-radius: 50%; pointer-events: none;
  bottom: -80px; right: -80px;
  background: radial-gradient(circle, rgba(192,68,40,.09), transparent 65%);
}
.lp-art { position: absolute; inset: 0; pointer-events: none; opacity: .38; }

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


.lp-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
.lp-quote {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 2.8vw, 42px);
  font-weight: 700; line-height: 1.18; color: var(--cream);
}
.lp-quote em { font-style: italic; color: var(--gold); }
.lp-desc { font-size: 14px; font-weight: 300; color: rgba(240,230,208,.42); line-height: 1.8; max-width: 390px; }
.lp-bullets { display: flex; flex-direction: column; gap: 11px; }
.lp-bullet { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 500; color: rgba(240,230,208,.5); }
.lp-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
.lp-foot {
  position: relative; z-index: 1;
  font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(212,168,67,.26); letter-spacing: 1.5px;
}

/* ──────────────────── RIGHT PANEL ──────────────────── */
.rp {
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 64px 56px; background: var(--deep); min-height: 100vh; overflow-y: auto;
}
.rp-inner { width: 100%; max-width: 408px; }

.form-tag {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold); margin-bottom: 13px;
}
.form-title {
  font-family: 'Cormorant Garamond', serif; font-size: 40px;
  font-weight: 700; color: var(--cream); line-height: 1.05; margin-bottom: 7px;
}
.form-title em { font-style: italic; color: var(--gold); }
.form-sub { font-size: 13px; font-weight: 300; color: rgba(240,230,208,.38); margin-bottom: 36px; line-height: 1.65; }

/* ── Fields ── */
.fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.fl {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.8px;
  text-transform: uppercase; color: rgba(240,230,208,.32);
}
.fw { position: relative; display: flex; align-items: center; }
.fi {
  position: absolute; left: 14px; font-size: 14px;
  color: rgba(212,168,67,.4); pointer-events: none; top: 50%; transform: translateY(-50%);
}
.finput {
  width: 100%; background: rgba(255,255,255,.028);
  border: 1px solid rgba(240,230,208,.085); border-radius: 10px;
  padding: 14px 14px 14px 44px; font-size: 14px; font-weight: 500;
  color: var(--cream); font-family: 'Outfit', sans-serif; outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
}
.finput::placeholder { color: rgba(240,230,208,.16); }
.finput:focus {
  border-color: rgba(212,168,67,.5);
  background: rgba(212,168,67,.032);
  box-shadow: 0 0 0 3px rgba(212,168,67,.08);
}
.finput.err { border-color: rgba(192,58,40,.52); }
.feye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: rgba(240,230,208,.24); font-size: 14px; padding: 4px; transition: color .2s;
}
.feye:hover { color: var(--gold); }

/* forgot */
.row-end { display: flex; justify-content: flex-end; margin: 2px 0 22px; }
.link-small {
  font-size: 11px; color: rgba(212,168,67,.5); text-decoration: none;
  font-weight: 500; transition: color .2s;
}
.link-small:hover { color: var(--gold); }

/* error alert */
.err-alert {
  display: flex; align-items: center; gap: 10px;
  background: rgba(192,58,40,.09); border: 1px solid rgba(192,58,40,.28);
  border-radius: 9px; padding: 11px 14px; margin-bottom: 18px;
  font-size: 12px; color: #e89090; font-weight: 500;
}

/* submit */
.sbtn {
  width: 100%; background: linear-gradient(135deg, var(--gold), var(--rust));
  border: none; border-radius: 10px; padding: 15px;
  color: #fff; font-size: 14px; font-weight: 700;
  cursor: pointer; font-family: 'Outfit', sans-serif; letter-spacing: .3px;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 6px 26px rgba(212,168,67,.22);
  transition: opacity .2s, transform .15s;
}
.sbtn:hover:not(:disabled) { opacity: .87; transform: translateY(-2px); }
.sbtn:disabled { opacity: .44; cursor: not-allowed; }

/* divider */
.div-row { display: flex; align-items: center; gap: 12px; margin: 26px 0; }
.div-line { flex: 1; height: 1px; background: rgba(240,230,208,.07); }
.div-txt { font-size: 11px; color: rgba(240,230,208,.18); white-space: nowrap; }

/* register link */
.reg-row { text-align: center; font-size: 13px; color: rgba(240,230,208,.3); }
.reg-link { color: var(--gold); text-decoration: none; font-weight: 700; transition: color .2s; }
.reg-link:hover { color: var(--gold2); }

/* spinner */
.spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255,255,255,.28); border-top-color: #fff; animation: spin .65s linear infinite; }

/* ── Responsive ── */
@media (max-width: 820px) {
  .page { grid-template-columns: 1fr; }
  .lp { display: none; }
  .rp { padding: 48px 24px; }
}
`;

export default function Login({ onNavigate }) {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };

  const go = (path) => {
    if (onNavigate) return onNavigate(path);
    navigate(path);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Replace with real axios call:
      // const res = await axios.post("/api/auth/login", form);
      // localStorage.setItem("token", res.data.token);
      await new Promise(r => setTimeout(r, 900)); // mock delay
      go("/planner");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page">

        {/* ─────────── LEFT ─────────── */}
        <div className="lp">
          <div className="lp-grid" />
          <div className="lp-glow1" />
          <div className="lp-glow2" />

          {/* Decorative blueprint art */}
          <svg className="lp-art" viewBox="0 0 560 840" xmlns="http://www.w3.org/2000/svg">
            <rect x="52" y="130" width="456" height="580" fill="none"
              stroke="rgba(212,168,67,.42)" strokeWidth="1.6"
              style={{ strokeDasharray: 2200, strokeDashoffset: 2200, animation: "drawSVG 2.4s ease forwards .5s" }}
            />
            <line x1="52" y1="390" x2="508" y2="390" stroke="rgba(212,168,67,.26)" strokeWidth="1.1" />
            <line x1="290" y1="130" x2="290" y2="710" stroke="rgba(212,168,67,.22)" strokeWidth="1.1" />
            <line x1="52" y1="540" x2="290" y2="540" stroke="rgba(212,168,67,.18)" strokeWidth="1.1" />
            {/* toilet box */}
            <rect x="52" y="391" width="62" height="80" fill="none" stroke="rgba(96,160,220,.32)" strokeWidth=".9" />
            <rect x="290" y="391" width="62" height="80" fill="none" stroke="rgba(96,160,220,.32)" strokeWidth=".9" />
            {/* window hints */}
            <line x1="148" y1="130" x2="220" y2="130" stroke="rgba(96,178,255,.4)" strokeWidth="4" />
            <line x1="340" y1="130" x2="412" y2="130" stroke="rgba(96,178,255,.4)" strokeWidth="4" />
            <line x1="508" y1="220" x2="508" y2="292" stroke="rgba(96,178,255,.4)" strokeWidth="4" />
            {/* vastu dots */}
            <circle cx="276" cy="145" r="4.5" fill="#16a34a" opacity=".55" />
            <circle cx="494" cy="145" r="4.5" fill="#16a34a" opacity=".55" />
            <circle cx="160" cy="404" r="4.5" fill="#65a30d" opacity=".55" />
            {/* labels */}
            {[
              [171, 260, "LIVING ROOM"],
              [399, 260, "KITCHEN"],
              [171, 465, "MASTER BED"],
              [399, 465, "BEDROOM 2"],
              [280, 630, "DINING"],
            ].map(([x, y, t]) => (
              <text key={t} x={x} y={y} textAnchor="middle" fill="rgba(212,168,67,.22)"
                fontSize="9" fontFamily="DM Mono, monospace">{t}</text>
            ))}
          </svg>

           <button className="st-nav-logo" onClick={() => navigate('/')}>
        <div className="st-nav-logo-mark">🏠</div>
        <span className="st-nav-logo-text">Auto<b>Plan</b></span>
        <span className="st-nav-logo-badge">PRO</span>
      </button>
       

          <div className="lp-body">
            <h2 className="lp-quote">
              Your <em>dream home</em><br />starts with<br />a perfect plan.
            </h2>
            <p className="lp-desc">
              Generate Vastu-compliant floor plans in seconds —
              intelligent layouts, detailed blueprints, instant export.
            </p>
            <div className="lp-bullets">
              {[
                "Vastu compliance scoring for all rooms",
                "Toilet carved inside each bedroom",
                "4 layout variants per plot",
                "Export blueprint as PNG",
              ].map(t => (
                <div className="lp-bullet" key={t}><div className="lp-dot" />{t}</div>
              ))}
            </div>
          </div>

          <div className="lp-foot">© 2025 AUTOPLAN PRO · ALL RIGHTS RESERVED</div>
        </div>

        {/* ─────────── RIGHT ─────────── */}
        <div className="rp">
          <div className="rp-inner">
            <div className="form-tag a1">Welcome Back</div>
            <h1 className="form-title a2">Sign in to<br /><em>AutoPlan</em></h1>
            <p className="form-sub a3">Access your floor plans and continue building.</p>

            {error && (
              <div className="err-alert a3"><span>⚠</span> {error}</div>
            )}

            <form onSubmit={submit}>
              <div className="fields a3">
                <div className="field">
                  <label className="fl">Email Address</label>
                  <div className="fw">
                    <span className="fi">✉</span>
                    <input
                      className={`finput${error ? " err" : ""}`}
                      type="email" placeholder="you@example.com"
                      value={form.email} onChange={set("email")} required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="fl">Password</label>
                  <div className="fw">
                    <span className="fi">🔒</span>
                    <input
                      className={`finput${error ? " err" : ""}`}
                      type={showPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password} onChange={set("password")} required
                    />
                    <button type="button" className="feye" onClick={() => setShowPw(v => !v)}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="row-end a4">
                <a href="#" className="link-small">Forgot password?</a>
              </div>

              <button className="sbtn a4" type="submit" disabled={loading}>
                {loading ? <div className="spin" /> : <>Sign In <span>→</span></>}
              </button>
            </form>

            <div className="div-row a5">
              <div className="div-line" />
              <span className="div-txt">New to AutoPlan?</span>
              <div className="div-line" />
            </div>

            <div className="reg-row a6">
              <span
                className="reg-link"
                style={{ cursor: "pointer" }}
                onClick={() => go("/register")}
              >
                Create a free account →
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
