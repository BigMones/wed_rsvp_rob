import { useLang } from '../context/LangContext.jsx'

export default function Hero() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  return (
    <header className="hero">
      <svg className="hero-routes" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <path d="M-40 640 C 300 560, 460 760, 760 600 S 1180 420, 1500 540" stroke="oklch(0.64 0.13 42)" strokeWidth="1.4" strokeDasharray="3 8" opacity=".5"/>
        <path d="M-40 240 C 360 360, 560 120, 900 260 S 1240 380, 1500 240" stroke="oklch(0.64 0.13 42)" strokeWidth="1.4" strokeDasharray="3 8" opacity=".35"/>
      </svg>
      <div className="hero-crest pre">
        <img src="/logo-cutout.png" alt="Antonio &amp; Roberto" width="1108" height="878" />
      </div>
      <div className="kicker pre">
        {t('— Imbarco · 20 Settembre 2026 —', '— Now boarding · 20 September 2026 —')}
      </div>
      <h1>Antonio <span className="amp">&</span> Roberto</h1>
      <p className="tag">
        {t("Ogni storia d'amore è un viaggio. Inizia il nostro.", 'Every love story is a journey. Start ours.')}
      </p>
      <div className="meta">
        <div className="col">
          <div className="it">{t('Data', 'Date')}</div>
          <div className="vl">{t('20 Settembre 2026', '20 September 2026')}</div>
        </div>
        <div className="col">
          <div className="it">{t('Luogo', 'Place')}</div>
          <div className="vl">Bacoli · Napoli</div>
        </div>
        <div className="col">
          <div className="it">{t('Cerimonia', 'Ceremony')}</div>
          <div className="vl">11:30</div>
        </div>
      </div>
      <a className="scrolldown" href="#countdown">
        <span>{t('Scorri', 'Scroll')}</span>
        <span className="ln" />
      </a>
    </header>
  )
}
