import { useEffect, useRef, useState } from 'react'

function useFinePointerCursor() {
  return useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(pointer: coarse)').matches) return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return true
  })
}

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [on] = useFinePointerCursor()

  useEffect(() => {
    if (!on) return

    document.body.classList.add('custom-cursor-on')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let tx = mx
    let ty = my
    let pullX = 0
    let pullY = 0
    let raf = 0
    let magneticEls: HTMLElement[] = []
    let lastMagListRefresh = 0

    const refreshMagneticList = () => {
      magneticEls = Array.from(document.querySelectorAll<HTMLElement>('[data-cursor-magnetic]'))
    }
    refreshMagneticList()

    const recomputePull = () => {
      pullX = 0
      pullY = 0
      for (const el of magneticEls) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(mx - cx, my - cy)
        if (d < 140) {
          const f = 1 - d / 140
          pullX += (cx - mx) * f * 0.08
          pullY += (cy - my) * f * 0.08
        }
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const loop = () => {
      tx = lerp(tx, mx, 0.28)
      ty = lerp(ty, my, 0.28)

      const rdx = tx + pullX
      const rdy = ty + pullY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rdx}px, ${rdy}px, 0) translate(-50%, -50%)`
      }

      const still = Math.abs(mx - tx) < 0.35 && Math.abs(my - ty) < 0.35
      if (still) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(loop)
    }

    const startLoop = () => {
      if (raf === 0) raf = requestAnimationFrame(loop)
    }

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const now = performance.now()
      if (now - lastMagListRefresh > 450) {
        lastMagListRefresh = now
        refreshMagneticList()
      }
      recomputePull()
      startLoop()
    }

    window.addEventListener('mousemove', move, { passive: true })
    recomputePull()
    startLoop()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      window.removeEventListener('mousemove', move)
      document.body.classList.remove('custom-cursor-on')
    }
  }, [on])

  if (!on) return null

  return (
    <div className="custom-cursor-root" aria-hidden="true">
      <div ref={ring} className="custom-cursor-ring" />
      <div ref={dot} className="custom-cursor-dot" />
    </div>
  )
}
