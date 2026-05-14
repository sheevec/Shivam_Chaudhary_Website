import { useCallback, useEffect, useState } from 'react'
import type { ArchitectureSystem } from '../data/siteContent'

export function ArchitectureExplorer({ systems }: { systems: ArchitectureSystem[] }) {
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)
  const sys = systems[active]
  const maxStep = Math.max(0, sys.flow.length - 1)

  const selectSystem = useCallback((i: number) => {
    setActive(i)
    setStep(0)
  }, [])

  const goPrev = useCallback(() => setStep((s) => Math.max(0, s - 1)), [])
  const goNext = useCallback(() => setStep((s) => Math.min(maxStep, s + 1)), [maxStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  return (
    <div className="arch-explorer">
      <div className="architecture-grid arch-grid-cards">
        {systems.map((system, i) => (
          <button
            key={system.title}
            type="button"
            className={`architecture-card arch-card-btn ${i === active ? 'arch-card-active' : ''}`}
            onClick={() => selectSystem(i)}
            aria-pressed={i === active}
          >
            <h3>{system.title}</h3>
            <p>{system.description}</p>
            <div className="flow-row arch-flow-preview">
              {system.flow.map((node, index) => (
                <span key={node}>
                  {node}
                  {index < system.flow.length - 1 && <b>→</b>}
                </span>
              ))}
            </div>
            <div className="stack-row">
              {system.stack.map((s) => (
                <span key={s} className="stack-pill">
                  {s}
                </span>
              ))}
            </div>
            <span className="arch-tap-hint">{i === active ? 'Selected · use arrows below' : 'Click to explore flow'}</span>
          </button>
        ))}
      </div>

      <div className="arch-stage glass-card" aria-live="polite">
        <div className="arch-stage-head">
          <span className="section-label label-violet">Interactive flow</span>
          <h3>{sys.title}</h3>
          <p className="arch-stage-desc">{sys.description}</p>
        </div>

        <div className="arch-step-track">
          {sys.flow.map((node, i) => (
            <button
              key={node}
              type="button"
              className={`arch-step ${i === step ? 'arch-step-on' : ''} ${i < step ? 'arch-step-done' : ''}`}
              onClick={() => setStep(i)}
            >
              <span className="arch-step-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="arch-step-label">{node}</span>
            </button>
          ))}
        </div>

        <div className="arch-step-detail">
          <p>
            <strong>{sys.flow[step]}</strong> — stage {step + 1} of {sys.flow.length} in this reference architecture. Arrow keys step through the
            diagram.
          </p>
        </div>

        <div className="arch-nav">
          <button type="button" className="btn-ghost arch-arrow" onClick={goPrev} disabled={step === 0} aria-label="Previous stage">
            ← Prev
          </button>
          <button type="button" className="btn-ghost arch-arrow" onClick={goNext} disabled={step === maxStep} aria-label="Next stage">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
