import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function PipelineScene() {
  const points = useMemo(
    () => [
      new THREE.Vector3(-3.4, 0.15, 0),
      new THREE.Vector3(-1.6, -0.35, 0),
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(1.7, -0.2, 0),
      new THREE.Vector3(3.5, 0.2, 0),
    ],
    []
  )
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.45), [points])

  return (
    <group>
      <ambientLight intensity={0.22} />
      <pointLight position={[5, 3, 6]} intensity={1.4} color="#67e8f9" />
      <pointLight position={[-4, -2, 4]} intensity={0.35} color="#a78bfa" />

      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.26, 0.16, 0.1]} />
          <meshStandardMaterial
            color="#0b1224"
            metalness={0.55}
            roughness={0.38}
            emissive="#164e63"
            emissiveIntensity={0.45}
          />
        </mesh>
      ))}

      <mesh>
        <tubeGeometry args={[curve, 96, 0.04, 10, false]} />
        <meshStandardMaterial
          color="#155e75"
          transparent
          opacity={0.45}
          emissive="#06b6d4"
          emissiveIntensity={0.55}
          metalness={0.15}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

export function HeroPipelineCanvas() {
  const [mount] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.innerWidth < 900) return false
    return true
  })

  const wrapRef = useRef<HTMLDivElement>(null)
  /** Unmount WebGL when the hero is off-screen so scroll (esp. reversing) is not competing with a 60fps canvas. */
  const [pipelineActive, setPipelineActive] = useState(true)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!mount) return
    const el = wrapRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (hideTimer.current) {
            clearTimeout(hideTimer.current)
            hideTimer.current = null
          }
          setPipelineActive(true)
        } else {
          if (hideTimer.current) clearTimeout(hideTimer.current)
          hideTimer.current = setTimeout(() => setPipelineActive(false), 220)
        }
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [mount])

  if (!mount) return null

  return (
    <div ref={wrapRef} className="hero-pipeline-3d" aria-hidden="true">
      {pipelineActive && (
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 38 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 1]}
          style={{ width: '100%', height: '100%' }}
        >
          <PipelineScene />
        </Canvas>
      )}
    </div>
  )
}
