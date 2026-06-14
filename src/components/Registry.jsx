import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'

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
              <span className="ro-iban">IT55 M020 0803 4710 0042 0142 239</span>
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
              <span className="ro-iban">IT76 F030 6976 2421 0000 0006 564</span>
            </div>
          </div>
        </div>

        <p className="reg-whatsapp">
          {t(
            'Si richiede l\'invio della ricevuta su WhatsApp: ',
            'Please send the receipt via WhatsApp: '
          )}
          <a href="https://wa.me/393935056748">+39 393 505 6748</a>
        </p>
      </div>
    </section>
  )
}
