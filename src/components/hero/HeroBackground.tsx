import { useState } from 'react'
import { DataFlowCanvas } from '../DataFlowCanvas'
import { HeroPipelineCanvas } from './HeroPipelineCanvas'

export function HeroBackground() {
  const [use3d] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.innerWidth < 900) return false
    return true
  })

  return use3d ? <HeroPipelineCanvas /> : <DataFlowCanvas />
}
