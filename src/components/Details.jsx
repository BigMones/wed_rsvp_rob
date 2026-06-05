import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function Details() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const headRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="section details" id="details">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">{t('Il grande giorno', 'The big day')}</span>
          <h2>
            {t('Dove & ', 'Where & ')}
            <em>{t('quando', 'when')}</em>
          </h2>
        </div>
        <div className="det-grid reveal" ref={gridRef}>
          <div className="det-card">
            <div className="ic">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
            </div>
            <h3>{t('Quando', 'When')}</h3>
            <div className="big">
              {t('Domenica', 'Sunday')}<br />
              {t('20 Settembre 2026', '20 September 2026')}
            </div>
            <div className="small">
              {t('Cerimonia ore 11:30', 'Ceremony 11:30')}<br />
              {t('Ricevimento ore 13:30', 'Reception 13:30')}
            </div>
          </div>
          <div className="det-card">
            <div className="ic">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="10" r="3"/><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
              </svg>
            </div>
            <h3>{t('Dove', 'Where')}</h3>
            <div className="big">Punta Romana</div>
            <div className="small">
              Via Spiaggia Romana<br />
              80070 Bacoli (NA), {t('Italia', 'Italy')}
            </div>
          </div>
          <div className="det-card">
            <div className="ic">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 3l8 8-8 8-8-8z"/>
              </svg>
            </div>
            <h3>Dress code</h3>
            <div className="big">
              {t('Elegante', 'Elegant')}<br />
              Summer Chic
            </div>
            <div className="small">
              {t(
                'Toni chiari e tessuti leggeri, pronti per il sole di settembre.',
                'Light tones and breezy fabrics, ready for the September sun.'
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
