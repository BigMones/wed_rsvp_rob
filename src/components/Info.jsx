import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

export default function Info() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const headRef = useReveal()
  const leadRef = useReveal()
  const card1Ref = useReveal()
  const card2Ref = useReveal()
  const card3Ref = useReveal()

  return (
    <section className="section info" id="info">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">{t('Prima di partire', 'Before you go')}</span>
          <h2>
            {t('Info ', 'Good to ')}
            <em>{t('pratiche', 'know')}</em>
          </h2>
        </div>
        <p className="info-lead reveal" ref={leadRef}>
          {t(
            'Prima di unirvi a noi in questo viaggio, ecco tutto ciò che c\'è da sapere.',
            "Before you join us on this journey, here's everything you need to know."
          )}
        </p>
        <div className="info-grid">
          <div className="info-card reveal" ref={card1Ref}>
            <div className="n">01</div>
            <h3>{t('Meteo & ambientazione', 'Weather & setting')}</h3>
            <p>
              {t(
                'A settembre, a Napoli, il clima è solitamente caldo e soleggiato, con una leggera brezza marina. La cerimonia e parte del ricevimento si svolgeranno all\'aperto.',
                'September in Naples is usually warm and sunny, with a gentle sea breeze. The ceremony and part of the reception will take place outdoors.'
              )}
            </p>
          </div>
          <div className="info-card reveal d1" ref={card2Ref}>
            <div className="n">02</div>
            <h3>{t('Consigli di viaggio', 'Travel tips')}</h3>
            <ul>
              <li>{t('Portate occhiali da sole e magari uno strato leggero per la sera.', 'Bring sunglasses and maybe a light layer for the evening.')}</li>
              <li>{t('Evitate tacchi troppo sottili se camminate su superfici naturali.', 'Avoid very thin heels if walking on natural surfaces.')}</li>
              <li>{t('Venite pronti a godervi buon cibo, sole e tanto amore.', 'Come ready to enjoy good food, sunshine, and lots of love.')}</li>
            </ul>
          </div>
          <div className="info-card reveal d2" ref={card3Ref}>
            <div className="n">03</div>
            <h3>{t('Una piccola nota', 'A little note')}</h3>
            <p>
              {t(
                "Napoli è vibrante, autentica e piena di vita. Prendetevi il tempo per esplorare, assaporare e godervi ogni momento del vostro soggiorno.",
                'Naples is vibrant, authentic, and full of life. Take your time to explore, taste, and enjoy every moment of your stay.'
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
