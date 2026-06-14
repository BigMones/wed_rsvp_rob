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
import DashboardLogin from './components/DashboardLogin.jsx'
import Dashboard from './components/Dashboard.jsx'

const path = window.location.pathname

function DashboardRoute() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ar-dash') === '1')

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('ar-dash')
    setAuthed(false)
  }, [])

  if (!authed) return <DashboardLogin onAuth={() => setAuthed(true)} />
  return <Dashboard onLogout={handleLogout} />
}

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('ar-lang') || 'it')
  const [sheetOpen, setSheetOpen] = useState(false)

  const switchLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('ar-lang', l)
    document.documentElement.lang = l
  }, [])

  if (path === '/dashboard/login' || path === '/dashboard') {
    return <DashboardRoute />
  }

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
        <Rsvp />
        <Gallery />
        <Footer />
      </div>
    </LangContext.Provider>
  )
}
