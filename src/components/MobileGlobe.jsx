import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

const LAND_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json'
const SAGE_DEEP = 'oklch(0.42 0.055 150)'
const LINE = '#cdbfa4'
const LAND_FILL = 'oklch(0.815 0.045 142)'
const COAST = 'oklch(0.46 0.05 145)'
const ROT_DUR = 1100
const SPIN_SPEED = 5

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

export default function MobileGlobe({ stops, active, visible }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const apiRef = useRef(null)
  const activeRef = useRef(active)
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext('2d')
    const grat = d3.geoGraticule10()
    const route = buildRoute(stops)
    const state = {
      land: null, proj: null, pathGen: null,
      W: 0, H: 0, DPR: 1,
      rot: [-12, -18],
      rotFrom: null, targetRot: null, rotT0: 0,
      raf: null, lastTs: 0, spinPauseUntil: 0,
      ready: false,
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
      const W = window.innerWidth
      const H = window.innerHeight
      state.W = W; state.H = H
      state.DPR = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * state.DPR)
      canvas.height = Math.round(H * state.DPR)
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(state.DPR, 0, 0, state.DPR, 0, 0)
    }

    function makeProjection() {
      if (!state.land || !state.W) return
      const side = Math.min(state.W, state.H) * 0.82
      const pad = (state.W - side) / 2
      const padV = (state.H - side) / 2
      state.proj = d3.geoOrthographic()
        .clipAngle(90)
        .rotate(state.rot)
        .fitExtent([[pad, padV], [pad + side, padV + side]], { type: 'Sphere' })
      state.pathGen = d3.geoPath(state.proj, ctx)
    }

    function draw() {
      if (!state.ready || canvas.width <= 2) return
      ctx.clearRect(0, 0, state.W, state.H)

      ctx.beginPath(); state.pathGen({ type: 'Sphere' })
      ctx.fillStyle = globeGradient(); ctx.fill()
      ctx.lineWidth = 1; ctx.strokeStyle = LINE; ctx.stroke()

      ctx.beginPath(); state.pathGen(grat)
      ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(43,38,32,0.10)'; ctx.stroke()

      ctx.beginPath(); state.pathGen(state.land)
      ctx.fillStyle = LAND_FILL; ctx.fill()
      ctx.lineWidth = 0.8; ctx.strokeStyle = COAST; ctx.stroke()

      ctx.beginPath(); state.pathGen(route)
      ctx.lineWidth = 1.2; ctx.setLineDash([1.4, 4])
      ctx.strokeStyle = SAGE_DEEP; ctx.stroke(); ctx.setLineDash([])
    }

    function ensureRAF() {
      if (state.raf == null) state.raf = requestAnimationFrame(frame)
    }

    function frame(ts) {
      state.raf = null
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
        if (t >= 1) { state.targetRot = null; state.spinPauseUntil = ts + 3000 }
        draw()
        state.raf = requestAnimationFrame(frame)
        return
      }

      if (!reduceMotion.current && ts > state.spinPauseUntil) {
        state.rot = [state.rot[0] + SPIN_SPEED * dt / 1000, state.rot[1]]
        state.proj.rotate(state.rot)
        draw()
        state.raf = requestAnimationFrame(frame)
        return
      }

      if (!reduceMotion.current) state.raf = requestAnimationFrame(frame)
    }

    function handleActiveChange(i) {
      activeRef.current = i
      if (!state.ready) return
      state.rotFrom = state.proj.rotate().slice()
      state.targetRot = [-stops[i].lng, -stops[i].lat]
      state.rotT0 = performance.now()
      if (reduceMotion.current) {
        state.rot = state.targetRot.slice(); state.targetRot = null
        state.proj.rotate(state.rot); draw()
      } else {
        state.lastTs = 0; ensureRAF()
      }
    }

    apiRef.current = { handleActiveChange }

    const onResize = () => { sizeCanvas(); makeProjection(); draw() }
    window.addEventListener('resize', onResize)

    fetch(LAND_URL)
      .then(r => r.json())
      .then(topo => {
        state.land = topojson.feature(topo, topo.objects.land)
        state.ready = true
        sizeCanvas()
        makeProjection()
        draw()
        state.lastTs = 0
        ensureRAF()
      })
      .catch(() => {})

    return () => {
      window.removeEventListener('resize', onResize)
      if (state.raf != null) { cancelAnimationFrame(state.raf); state.raf = null }
      apiRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (apiRef.current) apiRef.current.handleActiveChange(active)
  }, [active])

  return (
    <div className={`mobile-globe-wrap${visible ? ' active' : ''}`} ref={wrapRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}
