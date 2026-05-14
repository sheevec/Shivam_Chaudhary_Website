import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
void main() {
  vec2 uv = vUv;
  float scan = sin((uv.y + uTime * 0.06) * 18.0) * 0.012;
  float grain = hash(uv * 900.0 + uTime * 0.4) * 0.045;
  vec3 deep = vec3(0.02, 0.05, 0.1);
  vec3 glow = vec3(0.06, 0.18, 0.28);
  float h = smoothstep(0.0, 1.0, uv.x * 0.55 + uv.y * 0.25);
  vec3 col = mix(deep, glow, h * 0.55 + scan);
  col += grain;
  gl_FragColor = vec4(col, 0.38);
}
`

function ShaderQuad() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh scale={[2.8, 1.6, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export function CaseStudyShaderCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [motionOk] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  const [gpuOn, setGpuOn] = useState(false)

  useEffect(() => {
    if (!motionOk) return
    const root = wrapRef.current
    if (!root) return

    const io = new IntersectionObserver(
      ([e]) => setGpuOn(e.isIntersecting),
      { root: null, threshold: 0, rootMargin: '100px 0px 100px 0px' }
    )
    io.observe(root)
    return () => io.disconnect()
  }, [motionOk])

  if (!motionOk) {
    return <div className="case-shader-fallback" aria-hidden="true" />
  }

  return (
    <div ref={wrapRef} className="case-shader-canvas" aria-hidden="true">
      <div className="case-shader-fallback" aria-hidden="true" />
      {gpuOn && (
        <Canvas
          className="case-shader-gl"
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
          dpr={[1, 1]}
        >
          <ShaderQuad />
        </Canvas>
      )}
    </div>
  )
}
