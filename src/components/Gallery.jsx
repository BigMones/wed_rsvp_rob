import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function Gallery() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="section gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">{t('Istantanee', 'Snapshots')}</span>
          <h2>
            {t('Frammenti di ', 'Fragments of ')}
            <em>{t('noi', 'us')}</em>
          </h2>
        </div>
        <div className="gal-grid reveal" ref={gridRef}>
          <div className="gal-item wide tall"><span className="lab">foto · 16:10</span></div>
          <div className="gal-item"><span className="lab">foto</span></div>
          <div className="gal-item"><span className="lab">foto</span></div>
          <div className="gal-item tall"><span className="lab">foto · ritratto</span></div>
          <div className="gal-item"><span className="lab">foto</span></div>
          <div className="gal-item wide"><span className="lab">foto · panorama</span></div>
          <div className="gal-item"><span className="lab">foto</span></div>
        </div>
      </div>
    </section>
  )
}
