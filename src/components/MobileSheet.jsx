import { useLang } from '../context/LangContext.jsx'

export default function MobileSheet({ open, onClose }) {
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  return (
    <div className={`sheet${open ? ' open' : ''}`}>
      <button className="close" onClick={onClose}>✕</button>
      <a href="#journey" onClick={onClose}>{t('La storia', 'The story')}</a>
      <a href="#details" onClick={onClose}>{t('Dettagli', 'Details')}</a>
      <a href="#location" onClick={onClose}>Location</a>
      <a href="#info" onClick={onClose}>Info</a>
      <a href="#rsvp" onClick={onClose}>RSVP</a>
    </div>
  )
}
