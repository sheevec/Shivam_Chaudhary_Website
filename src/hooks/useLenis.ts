import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth scroll (Lenis) + ScrollTrigger sync. Skipped when reduced motion is preferred.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      smoothWheel: true,
      /** Higher lerp = snappier direction changes (less floaty when scrolling back up). */
      lerp: 0.24,
      wheelMultiplier: 1.12,
      anchors: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === 'number') {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          bottom: window.innerHeight,
          right: window.innerWidth,
          x: 0,
          y: 0,
          toJSON() {
            return this
          },
        }
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    })

    const onResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    ScrollTrigger.refresh()

    return () => {
      window.removeEventListener('resize', onResize)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      ScrollTrigger.scrollerProxy(document.documentElement, {})
    }
  }, [])
}
