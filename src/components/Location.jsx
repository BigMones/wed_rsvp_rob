import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function Location() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const mapRef = useReveal()
  const infoRef = useReveal()

  return (
    <section className="section location" id="location">
      <div className="wrap loc-grid">
        <div className="loc-map reveal" ref={mapRef}>
          <div className="water" />
          <div className="pinmark">
            <div className="head" />
            <div className="lbl">Punta Romana</div>
          </div>
          <div className="ph-note">{t('mappa · placeholder', 'map · placeholder')}</div>
        </div>
        <div className="loc-info reveal d1" ref={infoRef}>
          <span className="eyebrow">{t('Come arrivare', 'Getting there')}</span>
          <h2>
            {t('Sul golfo, dove', 'On the gulf, where')}<br />
            {t('il mare incontra ', 'the sea meets ')}
            <em>{t('Napoli', 'Naples')}</em>
          </h2>
          <div className="loc-addr">
            Punta Romana<br />
            Via Spiaggia Romana<br />
            80070 Bacoli (NA)
          </div>
          <p>
            {t(
              "A Bacoli, nel cuore dei Campi Flegrei, a circa 40 minuti d'auto dal centro di Napoli e dall'aeroporto di Capodichino. Ampio parcheggio disponibile in loco.",
              'In Bacoli, in the heart of the Campi Flegrei, about a 40-minute drive from central Naples and Capodichino airport. Ample parking available on site.'
            )}
          </p>
          <a
            className="btn-line"
            href="https://maps.google.com/?q=Punta+Romana+Bacoli"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Apri in Google Maps →', 'Open in Google Maps →')}
          </a>
        </div>
      </div>
    </section>
  )
}
