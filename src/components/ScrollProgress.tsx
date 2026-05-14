import { motion, useScroll } from 'framer-motion'

/** Direct binding to scroll — no spring physics (springs fight Lenis and add main-thread work). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
}
