// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// components/ui/Button.jsx
//
// WHY A SEPARATE COMPONENT?
// The app has ~20+ buttons. If you put the same
// style in each file and want to change the border-radius,
// you'd edit 20 files. With this file, edit ONCE → done.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Gold gradient primary button
export function PrimaryBtn({ onClick, disabled, children, full }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:   disabled ? '#e8e4dc' : 'linear-gradient(135deg,#b8862a,#b03820)',
        color:        disabled ? '#b8ad98' : '#fff',
        border:       'none',
        borderRadius: 8,
        padding:      '10px 22px',
        fontWeight:   700,
        fontSize:     13,
        cursor:       disabled ? 'not-allowed' : 'pointer',
        width:        full ? '100%' : undefined,
        opacity:      disabled ? 0.6 : 1,
        boxShadow:    disabled ? 'none' : '0 3px 12px rgba(184,134,42,.30)',
        fontFamily:   "'Syne',sans-serif",
      }}
    >
      {children}
    </button>
  )
}

// Ghost outline button
export function GhostBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:   'transparent',
        border:       '1.5px solid #c8c2b8',
        borderRadius: 8,
        padding:      '9px 17px',
        color:        disabled ? '#a09890' : '#0f1923',
        fontSize:     12,
        cursor:       disabled ? 'not-allowed' : 'pointer',
        opacity:      disabled ? 0.4 : 1,
        fontFamily:   "'Syne',sans-serif",
      }}
    >
      {children}
    </button>
  )
}

// Small +/- spinner button
export function SpinBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width:          32,
        height:         32,
        borderRadius:   6,
        border:         '1.5px solid #c8c2b8',
        background:     '#ede8e0',
        color:          '#b8862a',
        fontSize:       17,
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     "'Syne',sans-serif",
      }}
    >
      {children}
    </button>
  )
}

// Small tab button
export function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:      '6px 14px',
        borderRadius: 7,
        border:       'none',
        background:   active ? '#b8862a' : 'transparent',
        color:        active ? '#fff' : '#a09890',
        fontWeight:   active ? 700 : 500,
        fontSize:     12,
        cursor:       'pointer',
        fontFamily:   "'Syne',sans-serif",
      }}
    >
      {children}
    </button>
  )
}
