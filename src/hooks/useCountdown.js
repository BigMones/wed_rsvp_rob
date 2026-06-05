import { useState, useEffect } from 'react'

const TARGET = new Date('2026-09-20T11:30:00+02:00').getTime()

function compute() {
  let diff = Math.max(0, TARGET - Date.now())
  const d = Math.floor(diff / 86400000); diff -= d * 86400000
  const h = Math.floor(diff / 3600000);  diff -= h * 3600000
  const m = Math.floor(diff / 60000);    diff -= m * 60000
  const s = Math.floor(diff / 1000)
  return { d, h, m, s }
}

export function useCountdown() {
  const [time, setTime] = useState(compute)
  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}
