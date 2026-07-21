// Register.jsx — AutoPlan Pro Register Page
// Design: Mirror of Login split-screen. Left panel shows live "plan cards" with
// vastu scores. Right has full form with password strength bar + role selector.
import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";

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
  --green: #16a34a;
  --teal: #1a7a6a;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; }

@keyframes fadeUp  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes spin    { to { transform: rotate(360deg); } }
@keyframes drawSVG { from { stroke-dashoffset: 2400; } to { stroke-dashoffset: 0; } }
@keyframes barIn   { from { width: 0; } to { } }

.a1 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .04s both; }
.a2 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .12s both; }
.a3 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .2s both; }
.a4 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .28s both; }
.a5 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .36s both; }
.a6 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .44s both; }
.a7 { animation: fadeUp .6s cubic-bezier(.22,1,.36,1) .52s both; }

/* ── Page ── */
.page {
  min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
  background: var(--deep);
}

/* ─────────────── LEFT ─────────────── */
.lp {
  position: relative; overflow: hidden;
  background: var(--ink); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between; padding: 42px 46px;
}
.lp-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(212,168,67,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,168,67,.045) 1px, transparent 1px);
  background-size: 44px 44px;
}
.lp-glow1 {
  position: absolute; width: 400px; height: 400px; border-radius: 50%;
  bottom: -80px; left: -80px; pointer-events: none;
  background: radial-gradient(circle, rgba(26,122,106,.12), transparent 65%);
}
.lp-glow2 {
  position: absolute; width: 350px; height: 350px; border-radius: 50%;
  top: -60px; right: -60px; pointer-events: none;
  background: radial-gradient(circle, rgba(212,168,67,.09), transparent 65%);
}
.lp-art { position: absolute; inset: 0; pointer-events: none; opacity: .32; }

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



.lp-body { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 30px; }
.lp-quote {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(30px, 2.6vw, 40px);
  font-weight: 700; line-height: 1.18; color: var(--cream);
}
.lp-quote em { font-style: italic; color: var(--gold); }

/* Plan preview cards */
.plan-cards { display: flex; flex-direction: column; gap: 10px; }
.plan-card {
  background: rgba(255,255,255,.028); border: 1px solid rgba(240,230,208,.08);
  border-radius: 12px; padding: 16px 18px; display: flex; align-items: center; gap: 14px;
  transition: border-color .2s;
}
.plan-card:hover { border-color: rgba(212,168,67,.2); }
.plan-card-icon {
  width: 38px; height: 38px; border-radius: 9px;
  background: rgba(212,168,67,.1); border: 1px solid rgba(212,168,67,.2);
  display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;
}
.plan-card-body { flex: 1; min-width: 0; }
.plan-card-title { font-size: 13px; font-weight: 700; color: var(--cream); margin-bottom: 3px; }
.plan-card-desc { font-size: 11px; color: rgba(240,230,208,.36); margin-bottom: 8px; }
.plan-card-bar { height: 3px; background: rgba(255,255,255,.07); border-radius: 2px; overflow: hidden; }
.plan-card-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--teal), var(--gold)); }
.plan-card-score { font-family: 'DM Mono', monospace; font-size: 8px; color: rgba(240,230,208,.32); margin-top: 4px; }
.plan-card-badge {
  font-family: 'DM Mono', monospace; font-size: 8px; color: var(--green);
  background: rgba(22,163,74,.1); border: 1px solid rgba(22,163,74,.22);
  border-radius: 4px; padding: 3px 8px; flex-shrink: 0; letter-spacing: .8px;
}

.lp-foot {
  position: relative; z-index: 1;
  font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(212,168,67,.24); letter-spacing: 1.5px;
}

/* ─────────────── RIGHT ─────────────── */
.rp {
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 52px 56px; background: var(--deep); min-height: 100vh; overflow-y: auto;
}
.rp-inner { width: 100%; max-width: 420px; }

.form-tag {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold); margin-bottom: 13px;
}
.form-title {
  font-family: 'Cormorant Garamond', serif; font-size: 38px;
  font-weight: 700; color: var(--cream); line-height: 1.05; margin-bottom: 7px;
}
.form-title em { font-style: italic; color: var(--gold); }
.form-sub { font-size: 13px; font-weight: 300; color: rgba(240,230,208,.38); margin-bottom: 30px; line-height: 1.65; }

/* ── Field Row (2-col grid) ── */
.f-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; margin-bottom: 13px; }
.f-row  { margin-bottom: 13px; }
.field  { display: flex; flex-direction: column; gap: 6px; }
.fl {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.8px;
  text-transform: uppercase; color: rgba(240,230,208,.3);
}
.fw { position: relative; display: flex; align-items: center; }
.fi {
  position: absolute; left: 14px; font-size: 14px;
  color: rgba(212,168,67,.38); pointer-events: none; top: 50%; transform: translateY(-50%);
}
.finput {
  width: 100%; background: rgba(255,255,255,.028);
  border: 1px solid rgba(240,230,208,.085); border-radius: 10px;
  padding: 13px 13px 13px 43px; font-size: 13px; font-weight: 500;
  color: var(--cream); font-family: 'Outfit', sans-serif; outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
}
.finput::placeholder { color: rgba(240,230,208,.15); }
.finput:focus {
  border-color: rgba(212,168,67,.5);
  background: rgba(212,168,67,.03);
  box-shadow: 0 0 0 3px rgba(212,168,67,.08);
}
.finput.valid { border-color: rgba(22,163,74,.38); }
.feye {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: rgba(240,230,208,.22); font-size: 13px; padding: 4px; transition: color .2s;
}
.feye:hover { color: var(--gold); }

/* password strength */
.pw-strength { margin-top: 7px; }
.pw-bars { display: flex; gap: 4px; margin-bottom: 4px; }
.pw-bar {
  flex: 1; height: 3px; border-radius: 2px;
  background: rgba(255,255,255,.07); transition: background .3s;
}
.pw-lbl { font-size: 10px; transition: color .3s; }

/* role selector */
.section-lbl {
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.8px;
  text-transform: uppercase; color: rgba(240,230,208,.3); margin-bottom: 9px;
}
.role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 20px; }
.role-opt {
  padding: 13px 14px; border-radius: 10px; cursor: pointer;
  border: 1.5px solid rgba(240,230,208,.07);
  background: rgba(255,255,255,.022);
  display: flex; align-items: center; gap: 11px;
  transition: border-color .2s, background .2s;
}
.role-opt.sel { border-color: rgba(212,168,67,.5); background: rgba(212,168,67,.06); }
.role-opt:hover:not(.sel) { border-color: rgba(240,230,208,.14); background: rgba(255,255,255,.03); }
.role-emoji { font-size: 20px; flex-shrink: 0; }
.role-name { font-size: 12px; font-weight: 700; color: var(--cream); }
.role-desc { font-size: 10px; color: rgba(240,230,208,.35); margin-top: 1px; }

/* error */
.err-alert {
  display: flex; align-items: center; gap: 10px;
  background: rgba(192,58,40,.09); border: 1px solid rgba(192,58,40,.28);
  border-radius: 9px; padding: 11px 14px; margin-bottom: 16px;
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
  transition: opacity .2s, transform .15s; margin-bottom: 22px;
}
.sbtn:hover:not(:disabled) { opacity: .87; transform: translateY(-2px); }
.sbtn:disabled { opacity: .44; cursor: not-allowed; }

/* terms */
.terms {
  font-size: 11px; color: rgba(240,230,208,.24); text-align: center;
  margin-bottom: 22px; line-height: 1.65;
}
.terms a { color: rgba(212,168,67,.55); text-decoration: none; }
.terms a:hover { color: var(--gold); }

/* login row */
.login-row { text-align: center; font-size: 13px; color: rgba(240,230,208,.3); }
.login-link { color: var(--gold); text-decoration: none; font-weight: 700; transition: color .2s; cursor: pointer; }
.login-link:hover { color: var(--gold2); }

/* spinner */
.spin { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255,255,255,.28); border-top-color: #fff; animation: spin .65s linear infinite; }

/* ── Responsive ── */
@media (max-width: 860px) {
  .page { grid-template-columns: 1fr; }
  .lp { display: none; }
  .rp { padding: 48px 24px; }
  .f-grid { grid-template-columns: 1fr; }
}
`;

const ROLES = [
  { k: "user",      emoji: "🏠", name: "Home Owner",  desc: "Plan your residence" },
  { k: "architect", emoji: "🏗", name: "Architect",   desc: "Plan for clients" },
  { k: "builder",   emoji: "🔨", name: "Builder",     desc: "Construction projects" },
  { k: "agent",     emoji: "💼", name: "Real Estate", desc: "Site evaluations" },
];

const PLAN_CARDS = [
  { ic: "📐", title: "30×40 South Facing", desc: "3 Beds + Pooja + Dining",   score: 88, badge: "EXCELLENT" },
  { ic: "🏠", title: "40×60 North Facing", desc: "4 Beds + Garage + Balcony", score: 74, badge: "GOOD" },
];

function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const PW_COLORS = ["rgba(255,255,255,.07)", "#c03428", "#d4a843", "#65a30d", "#16a34a"];
const PW_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

export default function Register({ onNavigate }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "user" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set  = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };
  const setR = (k) =>         setForm(f => ({ ...f, role: k }));
  const str  = pwStrength(form.password);

  const go = (path) => {
    if (onNavigate) return onNavigate(path);
    navigate(path);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      // Replace with real axios call:
      // await axios.post("/api/auth/register", form);
      await new Promise(r => setTimeout(r, 900)); // mock
      go("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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

          <svg className="lp-art" viewBox="0 0 560 880" xmlns="http://www.w3.org/2000/svg">
            <rect x="52" y="100" width="456" height="680" fill="none"
              stroke="rgba(212,168,67,.4)" strokeWidth="1.6"
              style={{ strokeDasharray: 2600, strokeDashoffset: 2600, animation: "drawSVG 2.6s ease forwards .4s" }}
            />
            <line x1="52" y1="420" x2="508" y2="420" stroke="rgba(212,168,67,.22)" strokeWidth="1.1" />
            <line x1="290" y1="100" x2="290" y2="780" stroke="rgba(212,168,67,.18)" strokeWidth="1.1" />
            <circle cx="280" cy="450" r="90" fill="none" stroke="rgba(212,168,67,.07)" strokeDasharray="6,8" strokeWidth="1" />
            {[["148","100","220","100"],["340","100","412","100"],["508","220","508","290"]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(96,178,255,.38)" strokeWidth="4" />
            ))}
            {[[276,115,"#16a34a"],[494,115,"#16a34a"],[160,435,"#65a30d"]].map(([x,y,c],i)=>(
              <circle key={i} cx={x} cy={y} r="4.5" fill={c} opacity=".55" />
            ))}
          </svg>
          
          
        <button className="st-nav-logo" onClick={() => navigate('/')}>
        <div className="st-nav-logo-mark">🏠</div>
        <span className="st-nav-logo-text">Auto<b>Plan</b></span>
        <span className="st-nav-logo-badge">PRO</span>
      </button>
       
          
          <div className="lp-body">
            <h2 className="lp-quote">
              Join <em>thousands</em><br />planning their<br />dream home.
            </h2>
            <div className="plan-cards">
              {PLAN_CARDS.map(p => (
                <div className="plan-card" key={p.title}>
                  <div className="plan-card-icon">{p.ic}</div>
                  <div className="plan-card-body">
                    <div className="plan-card-title">{p.title}</div>
                    <div className="plan-card-desc">{p.desc}</div>
                    <div className="plan-card-bar">
                      <div className="plan-card-fill" style={{ width: p.score + "%" }} />
                    </div>
                    <div className="plan-card-score">Vastu Score: {p.score}%</div>
                  </div>
                  <div className="plan-card-badge">{p.badge}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lp-foot">CREATE YOUR ACCOUNT · IT'S FREE</div>
        </div>

        {/* ─────────── RIGHT ─────────── */}
        <div className="rp">
          <div className="rp-inner">
            <div className="form-tag a1">Get Started Free</div>
            <h1 className="form-title a2">Create your<br /><em>AutoPlan</em> account</h1>
            <p className="form-sub a3">Start generating Vastu-compliant floor plans today.</p>

            {error && <div className="err-alert a3"><span>⚠</span> {error}</div>}

            <form onSubmit={submit}>
              {/* Name + Phone */}
              <div className="f-grid a3">
                <div className="field">
                  <label className="fl">Full Name</label>
                  <div className="fw">
                    <span className="fi">👤</span>
                    <input className={`finput${form.name.length > 2 ? " valid" : ""}`}
                      type="text" placeholder="Rajesh Kumar"
                      value={form.name} onChange={set("name")} required />
                  </div>
                </div>
                <div className="field">
                  <label className="fl">Phone</label>
                  <div className="fw">
                    <span className="fi">📱</span>
                    <input className="finput"
                      type="tel" placeholder="+91 98765 43210"
                      value={form.phone} onChange={set("phone")} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="f-row a4">
                <div className="field">
                  <label className="fl">Email Address</label>
                  <div className="fw">
                    <span className="fi">✉</span>
                    <input className={`finput${form.email.includes("@") ? " valid" : ""}`}
                      type="email" placeholder="you@example.com"
                      value={form.email} onChange={set("email")} required />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="f-row a4">
                <div className="field">
                  <label className="fl">Password</label>
                  <div className="fw">
                    <span className="fi">🔒</span>
                    <input className="finput"
                      type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                      value={form.password} onChange={set("password")} required minLength={8} />
                    <button type="button" className="feye" onClick={() => setShowPw(v => !v)}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {form.password && (
                    <div className="pw-strength">
                      <div className="pw-bars">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="pw-bar" style={{ background: i <= str ? PW_COLORS[str] : undefined }} />
                        ))}
                      </div>
                      <div className="pw-lbl" style={{ color: PW_COLORS[str] }}>{PW_LABELS[str]}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="a5">
                <div className="section-lbl">I am a</div>
                <div className="role-grid">
                  {ROLES.map(r => (
                    <div key={r.k} className={`role-opt${form.role === r.k ? " sel" : ""}`} onClick={() => setR(r.k)}>
                      <div className="role-emoji">{r.emoji}</div>
                      <div>
                        <div className="role-name">{r.name}</div>
                        <div className="role-desc">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="terms a6">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>

              <button className="sbtn a6" type="submit" disabled={loading}>
                {loading ? <div className="spin" /> : <>Create Account <span>→</span></>}
              </button>
            </form>

            <div className="login-row a7">
              Already have an account?{" "}
              <span className="login-link" onClick={() => go("/login")}>Sign in →</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
