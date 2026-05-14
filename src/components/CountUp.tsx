import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function CountUp({
  prefix = '',
  value,
  suffix = '',
  decimals = 0,
}: {
  prefix?: string
  value: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0')
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (!inView) return

    const duration = 1600
    let startTime: number | null = null

    const animate = (ts: number) => {
      if (startTime === null) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = eased * value

      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString())

      if (progress < 1) rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [inView, value, decimals])

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
