import { useCountdown } from '../hooks/useCountdown.js'
import { useReveal } from '../hooks/useReveal.js'
import { useLang } from '../context/LangContext.jsx'

function pad(n) { return String(n).padStart(2, '0') }

export default function Countdown() {
  const { d, h, m, s } = useCountdown()
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en
  const kickerRef = useReveal()
  const gridRef = useReveal()

  return (
    <section className="section countdown" id="countdown">
      <div className="wrap center">
        <div className="kicker reveal" ref={kickerRef}>
          {t('Manca poco al decollo', 'Counting down to take-off')}
        </div>
        <div className="rule" />
        <div className="cd-grid reveal d1" ref={gridRef}>
          <div className="cd-unit">
            <div className="num">{pad(d)}</div>
            <div className="lab">{t('Giorni', 'Days')}</div>
          </div>
          <div className="cd-sep">·</div>
          <div className="cd-unit">
            <div className="num">{pad(h)}</div>
            <div className="lab">{t('Ore', 'Hours')}</div>
          </div>
          <div className="cd-sep">·</div>
          <div className="cd-unit">
            <div className="num">{pad(m)}</div>
            <div className="lab">{t('Minuti', 'Minutes')}</div>
          </div>
          <div className="cd-sep">·</div>
          <div className="cd-unit">
            <div className="num">{pad(s)}</div>
            <div className="lab">{t('Secondi', 'Seconds')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
