import { useEffect, useRef } from 'react'

const observer = typeof window !== 'undefined'
  ? new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
  : null

export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !observer) return
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])
  return ref
}
