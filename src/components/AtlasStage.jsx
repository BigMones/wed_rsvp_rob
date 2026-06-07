import { useRef } from 'react'
import { useAtlasGeo } from '../hooks/useAtlasGeo.js'
import { useLang } from '../context/LangContext.jsx'

export default function AtlasStage({ stops, active, mode, onSelect, onModeChange }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const pinRefs = useRef([])
  const planeRef = useRef(null)
  const { lang } = useLang()
  const t = (it, en) => lang === 'it' ? it : en

  useAtlasGeo({ canvasRef, stageRef, pinRefs, planeRef, stops, active, mode })

  return (
    <div className={`atlas-stage mode-${mode}`} id="atlasStage" ref={stageRef}>
      <canvas id="atlasCanvas" ref={canvasRef} />
      <div className="atlas-frame" />

      <div className="map-toggle" id="mapToggle">
        <button
          className={mode === 'chart' ? 'active' : ''}
          onClick={() => onModeChange('chart')}
        >{t('Mappa', 'Map')}</button>
        <button
          className={mode === 'globe' ? 'active' : ''}
          onClick={() => onModeChange('globe')}
        >{t('Globo', 'Globe')}</button>
      </div>

      <div className="atlas-hint">
        {t('Clicca una tappa per leggere la storia', 'Click a stop to read the story')}
      </div>

      {stops.map((stop, i) => (
        <button
          key={stop.id}
          ref={el => pinRefs.current[i] = el}
          className={`pin${stop.final ? ' final' : ''}`}
          aria-label={stop.name}
          onClick={() => onSelect(i)}
        >
          <span className="dot">{stop.final ? '★' : stop.id}</span>
          <span className="nm">{stop.name}</span>
        </button>
      ))}

      <div className="atlas-plane" ref={planeRef}>✈</div>
      <div className="globe-label">
        <b>{String(stops[active].id).padStart(2, '0')}</b>
        <span className="gl-sep">·</span>
        {stops[active].name}
      </div>
    </div>
  )
}
