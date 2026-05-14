import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Parallax depth on hero background layers (GSAP scrub). */
export function useHeroParallaxLayers(enabled: boolean) {
  const heroRef = useRef<HTMLElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!enabled || !heroRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hero = heroRef.current
    const back = backRef.current
    const mid = midRef.current
    const ctx = gsap.context(() => {
      if (back) {
        gsap.fromTo(
          back,
          { y: '8%' },
          {
            y: '-14%',
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              /** Lower = less “rubber band” when reversing scroll (was 0.85s catch-up). */
              scrub: 0.32,
              fastScrollEnd: true,
            },
          }
        )
      }
      if (mid) {
        gsap.fromTo(
          mid,
          { y: '4%' },
          {
            y: '-8%',
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              /** Lower = less “rubber band” when reversing scroll (was 0.85s catch-up). */
              scrub: 0.32,
              fastScrollEnd: true,
            },
          }
        )
      }
    }, hero)

    return () => ctx.revert()
  }, [enabled])

  return { heroRef, backRef, midRef }
}
