import { useLang } from '../context/LangContext.jsx'

export default function Footer() {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  return (
    <footer className="footer">
      <div className="mono">Antonio <span className="amp">&</span> Roberto</div>
      <div className="sub">{t('La vostra presenza significa tutto per noi.', 'Your presence means the world to us.')}</div>
      <div className="date">{t('Un · Matrimonio · da · Cangurini.', 'A · Roos · Wedding')} 20 · 09 · 2026</div>
    </footer>
  )
}
