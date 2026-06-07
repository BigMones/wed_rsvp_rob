import { useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

function TlStop({ stop, onVisible }) {
  const ref = useRef(null)
  const revealRef = useReveal()

  useEffect(() => {
    const el = ref.current
    if (!el || !onVisible) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(stop.id - 1) },
      { threshold: 0, rootMargin: '-42% 0px -42% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [stop.id, onVisible])

  const { lang } = useLang()

  return (
    <div
      className={`tl-stop${stop.final ? ' final' : ''} reveal`}
      ref={el => { ref.current = el; revealRef.current = el }}
    >
      <span className="tl-dot">{stop.final ? '★' : stop.id}</span>
      <div className="tl-photo">
        <span className="lab">{lang === 'it' ? 'foto · ' : 'photo · '}{stop.name.toLowerCase()}</span>
      </div>
      <div className="tl-country">{stop.country[lang]}</div>
      <div className="tl-name">{stop.name}</div>
      <div className="tl-text">{stop[lang]}</div>
    </div>
  )
}

export default function Timeline({ stops, onStopVisible }) {
  return (
    <div className="timeline" id="timeline">
      <div className="tl-line" />
      {stops.map((stop) => (
        <TlStop key={stop.id} stop={stop} onVisible={onStopVisible} />
      ))}
    </div>
  )
}
