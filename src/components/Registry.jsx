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
        <p>{t('La vostra presenza è il regalo più grande che potessimo desiderare.', 'Your presence is the greatest gift we could ask for.')}</p>
        <p>
          {t(
            'Ma se vorrete contribuire, potrete aiutarci a creare nuovi ricordi durante il nostro viaggio di nozze ed essere parte della nostra prossima avventura.',
            'But if you wish to contribute, you can help us create new memories on our honeymoon and be part of our next adventure.'
          )}
        </p>
        <div className="reg-card">
          <span className="lab">{t('Viaggio di nozze · IBAN', 'Honeymoon fund · IBAN')}</span>
          <span className="iban">IT00 X000 0000 0000 0000 0000 000</span>
        </div>
      </div>
    </section>
  )
}
