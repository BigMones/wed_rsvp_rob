import { useLang } from '../context/LangContext.jsx'

export default function AtlasPanel({ stops, active, onPrev, onNext }) {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const s = stops[active]

  return (
    <div className="atlas-panel" id="atlasPanel">
      <div className="ap-photo">
        <span className="lab">{t('foto · ', 'photo · ')}{s.name.toLowerCase()}</span>
        <div className="stamp">
          {s.country[lang]}<br />{String(s.id).padStart(2, '0')}
        </div>
      </div>
      <div className="ap-meta">
        <span className="ap-num">
          {t('Tappa', 'Stop')} {String(s.id).padStart(2, '0')} / 11
        </span>
        <span className="ap-country">{s.country[lang]}</span>
      </div>
      <h3 className="ap-name">{s.name}</h3>
      <p className="ap-text">{s[lang]}</p>
      <div className="ap-nav">
        <button className="ap-btn" onClick={onPrev}>
          <span>←</span>
          <span> {t('Precedente', 'Previous')}</span>
        </button>
        <button className="ap-btn" onClick={onNext}>
          <span>{t('Successiva', 'Next')} </span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
