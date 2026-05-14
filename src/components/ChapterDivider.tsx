import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dividerImg from '../assets/divider.jpg'

export function ChapterDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.08, 1.05])

  return (
    <motion.div
      ref={ref}
      className="chapter-divider"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9 }}
    >
      <motion.img
        src={dividerImg}
        alt=""
        aria-hidden="true"
        className="divider-img"
        loading="lazy"
        style={{ y, scale }}
      />
      <div className="divider-overlay">
        <span>"I build systems that make complexity usable."</span>
        <small>— Shivam</small>
      </div>
    </motion.div>
  )
}
