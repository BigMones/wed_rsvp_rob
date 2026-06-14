import { useState } from 'react'

const PWD = import.meta.env.VITE_DASHBOARD_PASSWORD

export default function DashboardLogin({ onAuth }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value === PWD) {
      sessionStorage.setItem('ar-dash', '1')
      onAuth()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--ivory)', fontFamily: 'var(--sans)',
    }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}>
        <div style={{ fontFamily: 'var(--class)', fontSize: 28, marginBottom: 8, textAlign: 'center' }}>
          Antonio <span style={{ fontStyle: 'italic', color: 'var(--sage-deep)' }}>&</span> Roberto
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase',
          color: 'var(--ink-faint)', textAlign: 'center', marginBottom: 40,
        }}>
          Dashboard · Accesso riservato
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontFamily: 'var(--mono)', fontSize: 10,
            letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 7,
          }}>Password</label>
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false) }}
            autoFocus
            required
            style={{
              width: '100%', fontFamily: 'var(--class)', fontSize: 17,
              background: 'var(--white)', border: `1px solid ${error ? '#c0614a' : 'var(--line)'}`,
              borderRadius: 3, padding: '11px 13px', color: 'var(--ink)',
              outline: 'none', boxSizing: 'border-box',
              boxShadow: error ? '0 0 0 3px rgba(192,97,74,.15)' : 'none',
            }}
          />
          {error && (
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.14em',
              color: '#c0614a', marginTop: 7, textTransform: 'uppercase',
            }}>Password errata</div>
          )}
        </div>

        <button type="submit" style={{
          width: '100%', background: 'var(--sage-deep)', color: 'var(--ivory)',
          border: 'none', borderRadius: 3, padding: 14,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '.2em',
          textTransform: 'uppercase', cursor: 'pointer', marginTop: 8,
        }}>
          Accedi
        </button>
      </form>
    </div>
  )
}
