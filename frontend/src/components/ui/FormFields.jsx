// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ui/FormFields.jsx
// All form controls in one file.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { SpinBtn } from './Button.jsx'

const LABEL = {
  display:       'block',
  fontSize:      9,
  fontWeight:    700,
  color:         '#807060',
  textTransform: 'uppercase',
  letterSpacing: '1.2px',
  marginBottom:  5,
  fontFamily:    "'DM Mono',monospace",
}

// Wraps any input with a label + optional hint text
export function Field({ label, req, hint, children }) {
  return (
    <div>
      {label && (
        <label style={LABEL}>
          {label}
          {req && <span style={{ color: '#b03820', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children}
      {hint && (
        <div style={{ fontSize: 10, color: '#a09890', marginTop: 3, fontFamily: "'DM Mono',monospace" }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// Text / number / email / date input
export function Input({ label, req, hint, type = 'text', value, onChange, placeholder = '', min, max, step }) {
  return (
    <Field label={label} req={req} hint={hint}>
      <input type={type} value={value} onChange={onChange}
        placeholder={placeholder} min={min} max={max} step={step}
        style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 6, padding: '8px 11px', width: '100%', outline: 'none' }}
      />
    </Field>
  )
}

// Dropdown select
export function Select({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={onChange}
        style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 6, padding: '8px 11px', width: '100%', outline: 'none' }}
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </Field>
  )
}

// Number +/- spinner
export function Spinner({ label, value, onChange, min = 1, max = 4 }) {
  return (
    <Field label={label}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 3 }}>
        <SpinBtn onClick={() => { if (value > min) onChange(value - 1) }}>−</SpinBtn>
        <span style={{ fontWeight: 800, fontSize: 24, color: '#b8862a', minWidth: 28, textAlign: 'center' }}>
          {value}
        </span>
        <SpinBtn onClick={() => { if (value < max) onChange(value + 1) }}>+</SpinBtn>
      </div>
    </Field>
  )
}

// Textarea
export function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <Field label={label}>
      <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
        style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, background: '#fff', border: '1.5px solid #c8c2b8', borderRadius: 6, padding: '8px 11px', width: '100%', outline: 'none', resize: 'vertical' }}
      />
    </Field>
  )
}
