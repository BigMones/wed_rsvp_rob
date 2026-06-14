import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function Dashboard({ onLogout }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setRows(data || [])
        setLoading(false)
      })
  }, [])

  const going = rows.filter(r => r.going)
  const notGoing = rows.filter(r => !r.going)
  const totalGuests = going.reduce((s, r) => s + (parseInt(r.guests) || 1), 0)

  const mono = { fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase' }
  const cell = { padding: '12px 14px', borderBottom: '1px solid var(--line-soft)', verticalAlign: 'top' }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--ivory)', fontFamily: 'var(--sans)' }}>

      {/* header */}
      <div style={{
        background: 'var(--ink)', color: 'var(--ivory)',
        padding: '18px clamp(22px,5vw,48px)', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: 'var(--class)', fontSize: 17, letterSpacing: '.1em' }}>
          A <span style={{ fontStyle: 'italic', color: 'oklch(0.82 0.10 58)' }}>&</span> R · Dashboard
        </div>
        <button onClick={onLogout} style={{
          background: 'none', border: '1px solid rgba(247,242,234,.3)', color: 'var(--ivory)',
          borderRadius: 3, padding: '6px 14px', cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase',
        }}>Esci</button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px clamp(22px,5vw,48px) 80px' }}>

        {/* stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          {[
            { label: 'Risposte totali', value: rows.length },
            { label: 'Presenti', value: going.length },
            { label: 'Assenti', value: notGoing.length },
            { label: 'Ospiti totali', value: totalGuests },
          ].map(s => (
            <div key={s.label} style={{
              flex: '1 1 140px', background: 'var(--white)', border: '1px solid var(--line)',
              borderRadius: 4, padding: '20px 24px',
            }}>
              <div style={{ ...mono, color: 'var(--ink-faint)', marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 42, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* table */}
        {loading && <div style={{ ...mono, color: 'var(--ink-faint)' }}>Caricamento…</div>}
        {err && <div style={{ ...mono, color: '#c0614a' }}>Errore: {err}</div>}
        {!loading && !err && rows.length === 0 && (
          <div style={{ ...mono, color: 'var(--ink-faint)' }}>Nessuna risposta ancora.</div>
        )}
        {!loading && rows.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 4 }}>
              <thead>
                <tr style={{ background: 'var(--paper)' }}>
                  {['Nome', 'Ospiti', 'Presenza', 'Note', 'Data'].map(h => (
                    <th key={h} style={{ ...cell, ...mono, color: 'var(--ink-faint)', textAlign: 'left', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ ...cell, fontFamily: 'var(--class)', fontSize: 17 }}>{r.name}</td>
                    <td style={{ ...cell, ...mono, color: 'var(--ink-soft)' }}>{r.guests}</td>
                    <td style={{ ...cell }}>
                      <span style={{
                        ...mono, fontSize: 9,
                        color: r.going ? 'var(--sage-deep)' : 'var(--ink-faint)',
                        background: r.going ? 'var(--sage-tint)' : 'var(--paper)',
                        border: `1px solid ${r.going ? 'var(--sage-deep)' : 'var(--line)'}`,
                        borderRadius: 3, padding: '3px 8px',
                      }}>
                        {r.going ? 'Presente' : 'Assente'}
                      </span>
                    </td>
                    <td style={{ ...cell, color: 'var(--ink-soft)', fontSize: 14, maxWidth: 260 }}>{r.notes || '—'}</td>
                    <td style={{ ...cell, ...mono, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
