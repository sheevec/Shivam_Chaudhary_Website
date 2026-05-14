import type { CaseStudy } from '../data/siteContent'

const pipelineStages = [
  { id: 'ingest', label: 'Sources', sub: 'Bureaus · streams · files' },
  { id: 'credit-risk', label: 'Credit Risk', sub: 'Seeding & FICO' },
  { id: 'fraud', label: 'Fraud ML', sub: 'Anomaly & scoring' },
  { id: 'enterprise-data', label: 'Enterprise', sub: 'Lakehouse fabric' },
  { id: 'plurit', label: 'Plurit', sub: 'Product platform' },
  { id: 'serve', label: 'Downstream', sub: 'Features · decisions' },
] as const

export function CaseStudyPipelineDAG({ studies }: { studies: CaseStudy[] }) {
  const scrollToCase = (id: string) => {
    if (id === 'ingest' || id === 'serve') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    const el = document.querySelector(`[data-case-id="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const nodeX = (i: number) => 6 + i * 118
  const y = 52

  return (
    <div className="dag-wrap" aria-label="Animated case study pipeline">
      <div className="dag-head">
        <span className="section-label label-cyan">Live pipeline</span>
        <p className="dag-sub">Tap a stage — scrolls to the matching case study card.</p>
      </div>
      <svg className="dag-svg" viewBox="0 0 760 110" role="img">
        <defs>
          <linearGradient id="dag-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>
          <filter id="dag-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pipelineStages.slice(0, -1).map((_, i) => {
          const x1 = nodeX(i)
          const x2 = nodeX(i + 1)
          return (
            <line
              key={`e-${i}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              className="dag-edge"
              stroke="url(#dag-grad)"
              strokeWidth="2"
              filter="url(#dag-glow)"
            />
          )
        })}

        {pipelineStages.map((stage, i) => {
          const cx = nodeX(i)
          const interactive = studies.some((s) => s.id === stage.id)
          const study = studies.find((s) => s.id === stage.id)
          return (
            <g key={stage.id}>
              <circle
                cx={cx}
                cy={y}
                r={interactive ? 14 : 11}
                className={`dag-node ${interactive ? 'dag-node-hit' : ''}`}
                onClick={() => interactive && scrollToCase(stage.id)}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
                tabIndex={interactive ? 0 : -1}
                role={interactive ? 'button' : 'presentation'}
                aria-label={
                  interactive && study
                    ? `Scroll to case study: ${study.title}`
                    : `${stage.label} — ${stage.sub}`
                }
                onKeyDown={(e) => {
                  if (!interactive) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollToCase(stage.id)
                  }
                }}
              />
              <text x={cx} y={y + 36} textAnchor="middle" className="dag-label">
                {stage.label}
              </text>
              <text x={cx} y={y + 50} textAnchor="middle" className="dag-sublabel">
                {stage.sub}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
