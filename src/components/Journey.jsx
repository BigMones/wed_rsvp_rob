import { useState, useCallback, useEffect, useRef } from 'react'
import { useLang } from '../context/LangContext.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { STOPS } from '../data/stops.js'
import AtlasStage from './AtlasStage.jsx'
import AtlasPanel from './AtlasPanel.jsx'
import Timeline from './Timeline.jsx'
import MobileGlobe from './MobileGlobe.jsx'

export default function Journey() {
  const [active, setActive] = useState(0)
  const [mapMode, setMapMode] = useState('chart')
  const [globeActive, setGlobeActive] = useState(0)
  const [globeVisible, setGlobeVisible] = useState(false)
  const sectionRef = useRef(null)
  const headRef = useReveal()
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  const handleSelect = useCallback((i) => setActive(i), [])
  const handlePrev = useCallback(() => setActive(i => (i - 1 + STOPS.length) % STOPS.length), [])
  const handleNext = useCallback(() => setActive(i => (i + 1) % STOPS.length), [])

  // Show/hide mobile globe when journey section is in view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      ([entry]) => setGlobeVisible(entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  const handleStopVisible = useCallback((i) => setGlobeActive(i), [])

  return (
    <>
      <MobileGlobe stops={STOPS} active={globeActive} visible={globeVisible} />
      <section
        className={`section journey${globeVisible ? ' globe-visible' : ''}`}
        id="journey"
        ref={sectionRef}
      >
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

          <div className="atlas reveal">
            <div className="atlas-stage-wrap">
              <AtlasStage
                stops={STOPS}
                active={active}
                mode={mapMode}
                onSelect={handleSelect}
                onModeChange={setMapMode}
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
    </>
  )
}
