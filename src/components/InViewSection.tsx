import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp } from '../constants'

export function InViewSection({
  id,
  className = '',
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {children}
    </motion.section>
  )
}
