import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext.jsx'

export default function Nav({ onMenuOpen }) {
  const { lang, switchLang } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (it, en) => lang === 'it' ? it : en

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#top">
        Antonio <span className="plane">✈</span> Roberto
      </a>
      <div className="nav-right">
        <div className="nav-links">
          <a href="#journey">{t('La storia', 'The story')}</a>
          <a href="#details">{t('Dettagli', 'Details')}</a>
          <a href="#location">Location</a>
          <a href="#info">Info</a>
          <a href="#rsvp">RSVP</a>
        </div>
        <div className="lang">
          <button className={lang === 'it' ? 'active' : ''} onClick={() => switchLang('it')}>IT</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>EN</button>
        </div>
        <button className="menu-btn" onClick={onMenuOpen} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
