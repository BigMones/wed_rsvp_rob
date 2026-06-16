import { useState } from 'react'
import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button className={`ro-copy${copied ? ' copied' : ''}`} onClick={handle} aria-label="Copia IBAN">
      {copied
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      }
    </button>
  )
}

export default function Registry() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const innerRef = useReveal()

  return (
    <section className="section registry" id="registry">
      <div className="wrap reg-inner reveal" ref={innerRef}>
        <div className="plane">✈</div>
        <h2>
          {t('La nostra prossima ', 'Our next ')}
          <em>{t('destinazione', 'destination')}</em>
        </h2>
        <p>{t(
          'La vostra presenza è il regalo più grande che potessimo ricevere.',
          'Your presence is the greatest gift we could receive.'
        )}</p>
        <p>{t(
          'Se vorrete farci un pensiero, potrete scegliere se contribuire al nostro viaggio di nozze o alla nostra prossima avventura. In entrambi i casi, ci aiuterete a creare nuovi ricordi e a realizzare i progetti che ci aspettano lungo il cammino.',
          'If you would like to give us a gift, you may choose to contribute either to our honeymoon or to our next adventure. Either way, you will help us create new memories and bring the dreams that lie ahead on our journey to life.'
        )}</p>

        <div className="reg-options">
          <div className="reg-option">
            <div className="reg-opt-head">
              <span className="reg-opt-icon">🏡</span>
              <h3>{t('Prossima Avventura', 'Next Adventure')}</h3>
            </div>
            <div className="ro-row">
              <span className="ro-lab">{t('Intestatario', 'Beneficiary')}</span>
              <span className="ro-val">Antonio Peluso</span>
            </div>
            <div className="ro-row">
              <span className="ro-lab">IBAN {t('(IT)', '(IT)')}</span>
              <span className="ro-iban">IT55M0200803471000420142239<CopyBtn value="IT55M0200803471000420142239" /></span>
            </div>
            <div className="ro-row">
              <span className="ro-lab">PAY ID {t('(AU)', '(AU)')}</span>
              <span className="ro-val">0414 842 808</span>
            </div>
          </div>

          <div className="reg-option">
            <div className="reg-opt-head">
              <span className="reg-opt-icon">🌴</span>
              <h3>HoneyMoon Fund 🍯</h3>
            </div>
            <div className="ro-row">
              <span className="ro-lab">{t('Agenzia', 'Agency')}</span>
              <span className="ro-val">
                MisterViaggio Ponticelli<br />
                Corso Ponticelli, 23C<br />
                80147 Napoli (NA)
              </span>
            </div>
            <div className="ro-row">
              <span className="ro-lab">{t('Intestatario', 'Beneficiary')}</span>
              <span className="ro-val">Achille Lauro Netravel S.r.l.</span>
            </div>
            <div className="ro-row">
              <span className="ro-lab">IBAN</span>
              <span className="ro-iban">IT76F0306976242100000006564<CopyBtn value="IT76F0306976242100000006564" /></span>
            </div>
            <div className="ro-row ro-row--full">
              <span className="ro-lab">WhatsApp</span>
              <span className="ro-val">
                {t('Si richiede l\'invio della ricevuta: ', 'Please send the receipt: ')}
                <a href="https://wa.me/393935056748" style={{ color: 'var(--sage-deep)', textDecoration: 'none' }}>+39 393 505 6748</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
