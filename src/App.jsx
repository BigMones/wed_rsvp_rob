import { useState, useCallback } from 'react'
import { LangContext } from './context/LangContext.jsx'
import Nav from './components/Nav.jsx'
import MobileSheet from './components/MobileSheet.jsx'
import Hero from './components/Hero.jsx'
import Countdown from './components/Countdown.jsx'
import Journey from './components/Journey.jsx'
import Details from './components/Details.jsx'
import Location from './components/Location.jsx'
import Info from './components/Info.jsx'
import Registry from './components/Registry.jsx'
import Gallery from './components/Gallery.jsx'
import Rsvp from './components/Rsvp.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('ar-lang') || 'it')
  const [sheetOpen, setSheetOpen] = useState(false)

  const switchLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('ar-lang', l)
    document.documentElement.lang = l
  }, [])

  return (
    <LangContext.Provider value={{ lang, switchLang }}>
      <Nav onMenuOpen={() => setSheetOpen(true)} />
      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <div className="layer" id="top">
        <Hero />
        <Countdown />
        <Journey />
        <Details />
        <Location />
        <Info />
        <Registry />
        <Gallery />
        <Rsvp />
        <Footer />
      </div>
    </LangContext.Provider>
  )
}
