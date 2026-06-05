import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json'
const SAGE_DEEP = 'oklch(0.42 0.055 150)'
const LINE = '#cdbfa4'
const LAND_FILL = 'oklch(0.815 0.045 142)'
const COAST = 'oklch(0.46 0.05 145)'
const OCEAN_FLAT = '#f1e9d8'
const HALF_PI = Math.PI / 2
const ROT_DUR = 1150
const SPIN_SPEED = 6

function shortAngle(a, b) { return ((b - a) % 360 + 540) % 360 - 180 }
function lerpAngle(a, b, t) { return a + shortAngle(a, b) * t }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 }

function buildRoute(stops) {
  const coords = []
  for (let i = 0; i < stops.length - 1; i++) {
    const a = [stops[i].lng, stops[i].lat]
    const b = [stops[i + 1].lng, stops[i + 1].lat]
    const interp = d3.geoInterpolate(a, b)
    for (let t = 0; t <= 1.0001; t += 1 / 30) coords.push(interp(Math.min(1, t)))
  }
  return { type: 'LineString', coordinates: coords }
}

export function useAtlasGeo({ canvasRef, stageRef, pinRefs, planeRef, stops, active, mode, showPins = true }) {
  const apiRef = useRef(null)
  const modeRef = useRef(mode)
  const activeRef = useRef(active)
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    const ctx = canvas.getContext('2d')
    const grat = d3.geoGraticule10()
    const route = buildRoute(stops)
    const state = {
      land: null, proj: null, pathGen: null,
      W: 0, H: 0, DPR: 1,
      rot: [-12, -18],
      rotFrom: null, targetRot: null, rotT0: 0,
      raf: null, lastTs: 0, spinPauseUntil: 0,
      dragging: false, ready: false,
      lastX: 0, lastY: 0,
    }

    function globeGradient() {
      const c = state.proj.translate()
      const r = state.proj.scale()
      const g = ctx.createRadialGradient(c[0] - r * 0.34, c[1] - r * 0.4, r * 0.1, c[0], c[1], r * 1.08)
      g.addColorStop(0, '#f6edda')
      g.addColorStop(0.65, '#ece0c8')
      g.addColorStop(1, '#dccfb3')
      return g
    }

    function sizeCanvas() {
      const rect = stage.getBoundingClientRect()
      if (rect.width < 2 || rect.height < 2) return false
      state.W = rect.width
      state.H = rect.height
      state.DPR = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(state.W * state.DPR)
      canvas.height = Math.round(state.H * state.DPR)
      canvas.style.width = state.W + 'px'
      canvas.style.height = state.H + 'px'
      ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0)
      return true
    }

    function makeProjection() {
      if (!state.land || !state.W) return
      if (modeRef.current === 'globe') {
        state.proj = d3.geoOrthographic()
          .clipAngle(90)
          .rotate(state.rot)
          .fitExtent([[18, 18], [state.W - 18, state.H - 18]], { type: 'Sphere' })
      } else {
        state.proj = d3.geoNaturalEarth1()
          .fitExtent([[6, 12], [state.W - 6, state.H - 12]], { type: 'Sphere' })
      }
      state.pathGen = d3.geoPath(state.proj, ctx)
    }

    function positionPins() {
      if (!state.proj || !showPins) return
      const m = modeRef.current
      const r = m === 'globe' ? state.proj.rotate() : [0, 0]
      const center = m === 'globe' ? [-r[0], -r[1]] : null
      const ai = activeRef.current
      const pins = pinRefs?.current || []
      const plane = planeRef?.current

      pins.forEach((pin, i) => {
        if (!pin) return
        const s = stops[i]
        const p = state.proj([s.lng, s.lat])
        let vis = !!p
        if (m === 'globe' && center && d3.geoDistance([s.lng, s.lat], center) > HALF_PI) vis = false
        if (!vis) { pin.style.display = 'none'; return }
        pin.style.display = 'flex'
        pin.style.left = p[0] + 'px'
        pin.style.top = p[1] + 'px'
        pin.classList.toggle('active', i === ai)
      })

      if (plane) {
        const s = stops[ai]
        const p = state.proj([s.lng, s.lat])
        let vis = !!p
        if (m === 'globe' && center && d3.geoDistance([s.lng, s.lat], center) > HALF_PI) vis = false
        if (vis) {
          plane.style.display = 'block'
          plane.style.left = p[0] + 'px'
          plane.style.top = (p[1] - 2) + 'px'
        } else {
          plane.style.display = 'none'
        }
      }
    }

    function draw() {
      if (!state.ready) return
      const rect = stage.getBoundingClientRect()
      if (
        (!state.proj || canvas.width <= 2 ||
          Math.abs(rect.width - state.W) > 1 ||
          Math.abs(rect.height - state.H) > 1) &&
        rect.width > 2
      ) {
        if (sizeCanvas()) makeProjection()
      }
      if (!state.proj || canvas.width <= 2) return

      ctx.clearRect(0, 0, state.W, state.H)
      const isGlobe = modeRef.current === 'globe'

      ctx.beginPath(); state.pathGen({ type: 'Sphere' })
      ctx.fillStyle = isGlobe ? globeGradient() : OCEAN_FLAT
      ctx.fill()
      ctx.lineWidth = 1; ctx.strokeStyle = LINE; ctx.stroke()

      ctx.beginPath(); state.pathGen(grat)
      ctx.lineWidth = 0.6; ctx.strokeStyle = 'rgba(43,38,32,0.13)'; ctx.stroke()

      ctx.beginPath(); state.pathGen(state.land)
      ctx.fillStyle = LAND_FILL; ctx.fill()
      ctx.lineWidth = 1; ctx.strokeStyle = COAST; ctx.stroke()

      ctx.beginPath(); state.pathGen(route)
      ctx.lineWidth = 1.4; ctx.setLineDash([1.6, 4.2])
      ctx.strokeStyle = SAGE_DEEP; ctx.stroke(); ctx.setLineDash([])

      positionPins()
    }

    function ensureRAF() {
      if (modeRef.current === 'globe' && state.raf == null) {
        state.raf = requestAnimationFrame(frame)
      }
    }

    function frame(ts) {
      state.raf = null
      if (modeRef.current !== 'globe') return
      const dt = state.lastTs ? ts - state.lastTs : 16
      state.lastTs = ts

      if (state.targetRot) {
        const t = Math.min(1, (ts - state.rotT0) / ROT_DUR)
        const e = easeInOut(t)
        state.rot = [
          lerpAngle(state.rotFrom[0], state.targetRot[0], e),
          lerpAngle(state.rotFrom[1], state.targetRot[1], e),
        ]
        state.proj.rotate(state.rot)
        if (t >= 1) { state.targetRot = null; state.spinPauseUntil = ts + 2600 }
        draw()
        state.raf = requestAnimationFrame(frame)
        return
      }

      if (!reduceMotion.current && !state.dragging && ts > state.spinPauseUntil) {
        state.rot = [state.rot[0] + SPIN_SPEED * dt / 1000, state.rot[1]]
        state.proj.rotate(state.rot)
        draw()
        state.raf = requestAnimationFrame(frame)
        return
      }

      if (!reduceMotion.current) state.raf = requestAnimationFrame(frame)
    }

    function onDown(e) {
      if (modeRef.current !== 'globe') return
      state.dragging = true; state.lastX = e.clientX; state.lastY = e.clientY
      stage.classList.add('dragging')
      try { canvas.setPointerCapture(e.pointerId) } catch (_) {}
    }
    function onMove(e) {
      if (!state.dragging || modeRef.current !== 'globe') return
      const dx = e.clientX - state.lastX, dy = e.clientY - state.lastY
      state.lastX = e.clientX; state.lastY = e.clientY
      const r = state.proj.rotate()
      state.rot = [r[0] + dx * 0.32, Math.max(-82, Math.min(82, r[1] - dy * 0.32))]
      state.proj.rotate(state.rot); state.targetRot = null
      draw()
    }
    function onUp() {
      if (!state.dragging) return
      state.dragging = false; stage.classList.remove('dragging')
      state.spinPauseUntil = performance.now() + 3200
      state.lastTs = 0; ensureRAF()
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onUp)

    let ro
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => {
        if (!state.ready) return
        if (sizeCanvas()) { makeProjection(); draw() }
      })
      ro.observe(stage)
    }

    function handleModeChange(newMode) {
      modeRef.current = newMode
      if (!state.ready) return
      if (state.raf != null) { cancelAnimationFrame(state.raf); state.raf = null }
      makeProjection()
      if (newMode === 'globe') {
        const a = activeRef.current
        state.rotFrom = state.proj.rotate().slice()
        state.targetRot = [-stops[a].lng, -stops[a].lat]
        state.rotT0 = performance.now()
        if (reduceMotion.current) {
          state.rot = state.targetRot.slice(); state.targetRot = null
          state.proj.rotate(state.rot); draw()
        } else {
          state.lastTs = 0; ensureRAF()
        }
      } else {
        draw()
      }
    }

    function handleActiveChange(i) {
      activeRef.current = i
      if (!state.ready) return
      if (modeRef.current === 'globe') {
        state.rotFrom = state.proj.rotate().slice()
        state.targetRot = [-stops[i].lng, -stops[i].lat]
        state.rotT0 = performance.now()
        if (reduceMotion.current) {
          state.rot = state.targetRot.slice(); state.targetRot = null
          state.proj.rotate(state.rot); draw()
        } else {
          state.lastTs = 0; ensureRAF()
        }
      } else {
        draw()
      }
    }

    apiRef.current = { handleModeChange, handleActiveChange }

    fetch(LAND_URL)
      .then(r => r.json())
      .then(topo => {
        state.land = topojson.feature(topo, topo.objects.land)
        state.ready = true
        sizeCanvas()
        makeProjection()
        draw()
        if (modeRef.current === 'globe') { state.lastTs = 0; ensureRAF() }
      })
      .catch(err => console.warn('atlas-geo: land load failed', err))

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onUp)
      if (ro) ro.disconnect()
      if (state.raf != null) { cancelAnimationFrame(state.raf); state.raf = null }
      apiRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (apiRef.current) apiRef.current.handleModeChange(mode)
  }, [mode])

  useEffect(() => {
    if (apiRef.current) apiRef.current.handleActiveChange(active)
  }, [active])
}
