import { useState, useCallback, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { STOPS } from '../data/stops.js'
import AtlasStage from './AtlasStage.jsx'
import AtlasPanel from './AtlasPanel.jsx'
import Timeline from './Timeline.jsx'

export default function Journey() {
  const [active, setActive] = useState(0)
  const [mapMode, setMapMode] = useState('chart')
  const headRef = useReveal()
  const atlasRef = useReveal()
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  const handleSelect = useCallback((i) => setActive(i), [])
  const handlePrev = useCallback(() => setActive(i => (i - 1 + STOPS.length) % STOPS.length), [])
  const handleNext = useCallback(() => setActive(i => (i + 1) % STOPS.length), [])

  // On mobile auto-switch to globe mode; restore user's desktop choice on resize
  const desktopModeRef = useRef('chart')
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)')
    const apply = () => {
      if (mq.matches) {
        setMapMode('globe')
      } else {
        setMapMode(desktopModeRef.current)
      }
    }
    mq.addEventListener('change', apply)
    apply()
    return () => mq.removeEventListener('change', apply)
  }, [])

  const handleModeChange = useCallback((m) => {
    const mq = window.matchMedia('(max-width: 960px)')
    if (!mq.matches) desktopModeRef.current = m
    setMapMode(m)
  }, [])

  // Timeline scroll → rotate globe to that stop
  const handleStopVisible = useCallback((i) => setActive(i), [])

  return (
    <section className="section journey" id="journey">
      <div className="wrap">
        <div className="sec-head reveal" ref={headRef}>
          <span className="kicker">
            {t('11 tappe · un\'unica destinazione', "11 stops · one destination")}
          </span>
          <h2>
            {t('Il nostro ', 'Our ')}
            <em>{t('viaggio', 'journey')}</em>
          </h2>
        </div>

        <div className="atlas reveal" ref={atlasRef}>
          <div className="atlas-stage-wrap">
            <AtlasStage
              stops={STOPS}
              active={active}
              mode={mapMode}
              onSelect={handleSelect}
              onModeChange={handleModeChange}
            />
          </div>
          <AtlasPanel
            stops={STOPS}
            active={active}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>

        <Timeline stops={STOPS} onStopVisible={handleStopVisible} />
      </div>
    </section>
  )
}
