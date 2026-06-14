import { useState } from 'react'
import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { supabase } from '../lib/supabase.js'

export default function Rsvp() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const [sent, setSent] = useState(false)
  const [success, setSuccess] = useState({ icon: '✈', title: '', text: '' })
  const [sentDetails, setSentDetails] = useState(null)
  const headRef = useReveal()
  const leadRef = useReveal()
  const passRef = useReveal()
  const deadlineRef = useReveal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = (form.querySelector('[name=name]').value || '').trim()
    const guests = form.querySelector('[name=guests]').value
    const bambini = form.querySelector('[name=bambini]').value
    const goingEl = form.querySelector('[name=going]:checked')
    const yes = goingEl && goingEl.value === 'yes'
    const notes = (form.querySelector('[name=notes]').value || '').trim()

    if (supabase) await supabase.from('rsvp').insert({ name, guests, bambini, going: yes, notes })

    setSentDetails({ name, guests, bambini, going: yes })
    setSuccess({
      icon: yes ? '✈' : '☁',
      title: yes
        ? t('Sei a bordo!', "You're on board!")
        : t('Ci mancherai', "We'll miss you"),
      text: yes
        ? (name ? name + ', ' : '') + t(
            'il tuo posto è riservato. Non vediamo l\'ora di festeggiare insieme.',
            "your seat is reserved. We can't wait to celebrate together."
          )
        : t(
            'Grazie per avercelo fatto sapere. Sarai con noi nel pensiero.',
            "Thank you for letting us know. You'll be with us in spirit."
          ),
    })
    setSent(true)
  }

  return (
    <section className="section rsvp" id="rsvp">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">{t('Sali a bordo con noi?', 'Are you boarding with us?')}</span>
          <h2>
            {t('Conferma la tua ', 'Confirm your ')}
            <em>{t('presenza', 'presence')}</em>
          </h2>
        </div>
        <p className="lead reveal" ref={leadRef}>
          {t(
            'Non vediamo l\'ora di vivere questo nuovo capitolo insieme a voi. Vi chiediamo di confermare la vostra presenza prima del decollo.',
            "We can't wait to travel this new chapter with you. Please confirm your presence before we take off."
          )}
        </p>

        <form className={`pass reveal${sent ? ' sent' : ''}`} ref={passRef} onSubmit={handleSubmit} autoComplete="off">
          <div className="pass-main">
            <div className="pass-top">
              <span>Boarding Pass · A&amp;R</span>
              <span>{t('Volo AR · 2026', 'Flight AR · 2026')}</span>
            </div>
            <div className="pass-row">
              <div className="field">
                <label>{t('Nome e cognome', 'Full name')}</label>
                <input type="text" name="name" required />
              </div>
              <div className="field">
                <label>{t('Numero di ospiti', 'Number of guests')}</label>
                <select name="guests">
                  {['1','2','3','4','5','6','7','8','9','10+'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pass-row pass-row--half">
              <div className="field">
                <label>{t('Di cui bambini', 'Of which children')}</label>
                <select name="bambini">
                  {['0','1','2','3','4','5+'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 18 }}>
              <label>{t('Ci sarai?', 'Will you be there?')}</label>
              <div className="choice">
                <label>
                  <input type="radio" name="going" value="yes" required />
                  <span className="opt">{t('Ci sarò', "I'll be there")}</span>
                </label>
                <label>
                  <input type="radio" name="going" value="no" />
                  <span className="opt no">{t('Perderò questo volo', 'Missing this flight')}</span>
                </label>
              </div>
            </div>
            <div className="field">
              <label>{t('Note (intolleranze, canzone del cuore…)', 'Notes (dietary needs, your song…)')}</label>
              <textarea name="notes" />
            </div>
            <button type="submit" className="pass-submit">
              {t('Conferma — Sali a bordo', 'Confirm — Board now')}
            </button>
          </div>

          <aside className="pass-stub">
            <div>
              <div className="st-top">Boarding Pass</div>
              <div className="st-big">A &amp; R</div>
            </div>
            <div className="st-grid">
              <div>
                <div className="l">{t('Volo', 'Flight')}</div>
                <div className="v">AR 2026</div>
              </div>
              <div>
                <div className="l">{t('Da → A', 'From → To')}</div>
                <div className="v">{t('Napoli → Per sempre', 'Naples → Forever')}</div>
              </div>
              <div>
                <div className="l">{t('Data', 'Date')}</div>
                <div className="v">20·09·26</div>
              </div>
              <div>
                <div className="l">{t('Imbarco', 'Boarding')}</div>
                <div className="v">11:30</div>
              </div>
            </div>
            <div className="barcode" />
          </aside>

          <div className="pass-success" id="successMsg">
            <div className="ps-airline">
              <img src="/roos-airlines.jpeg" alt="Roos Airlines" />
            </div>
            <div className="ps-divider" />
            <div className="ps-icon">{success.icon}</div>
            <h3>{success.title}</h3>
            <p>{success.text}</p>
            {sentDetails && (
              <div className="ps-board">
                {sentDetails.name && (
                  <div>
                    <span className="l">{sentDetails.going ? t('Passeggero', 'Passenger') : t('Nome', 'Name')}</span>
                    <span className="v">{sentDetails.name}</span>
                  </div>
                )}
                {sentDetails.going ? (
                  <>
                    <div>
                      <span className="l">{t('Ospiti', 'Guests')}</span>
                      <span className="v">{sentDetails.guests}</span>
                    </div>
                    {sentDetails.bambini && sentDetails.bambini !== '0' && (
                      <div>
                        <span className="l">{t('Bambini', 'Children')}</span>
                        <span className="v">{sentDetails.bambini}</span>
                      </div>
                    )}
                    <div>
                      <span className="l">{t('Volo', 'Flight')}</span>
                      <span className="v">AR · 2026</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="l">{t('Stato', 'Status')}</span>
                    <span className="v ps-absent">{t('Non partecipa', 'Not attending')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        <div className="deadline reveal" ref={deadlineRef}>
          {t(
            'Scadenza · vi preghiamo di confermare entro il ',
            'Deadline · please confirm by '
          )}
          <b>{t('20 Agosto 2026', '20 August 2026')}</b>
        </div>
      </div>
    </section>
  )
}
