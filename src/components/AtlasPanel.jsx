import { useLang } from '../context/LangContext.jsx'

export default function AtlasPanel({ stops, active }) {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const s = stops[active]

  return (
    <div className="atlas-panel" id="atlasPanel">
      <div className="ap-photo">
        {s.photo && (
          <img src={s.photo} alt={s.name} key={s.photo} />
        )}
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
    </div>
  )
}
