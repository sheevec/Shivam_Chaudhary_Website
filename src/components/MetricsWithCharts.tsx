import { memo, useMemo } from 'react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { impactPillarMeta, metricChartRows, type ImpactPillar } from '../data/metricCharts'

const pillarColor: Record<ImpactPillar, string> = {
  scale: '#22d3ee',
  reliability: '#38bdf8',
  economics: '#a78bfa',
}

export const MetricsWithCharts = memo(function MetricsWithCharts() {
  const data = useMemo(
    () =>
      metricChartRows.map((r) => ({
        ...r,
        chart: r.index,
        fill: pillarColor[r.pillar],
      })),
    []
  )

  return (
    <div className="metrics-charts">
      <div className="metrics-chart-panel glass-card">
        <span className="section-label">Read the cards first</span>
        <h3>Impact in three threads</h3>
        <p className="metrics-chart-note">
          The bars use an internal <strong>0–100 index</strong> so different units (years vs throughput vs dollars) can share one
          graphic. They are <strong>not</strong> on the same real-world scale—compare using the headline values and the cards
          below, not bar length across categories.
        </p>

        <ul className="metrics-pillar-legend" aria-label="Bar color legend">
          {(Object.keys(impactPillarMeta) as ImpactPillar[]).map((p) => (
            <li key={p}>
              <span className="metrics-pillar-swatch" style={{ background: pillarColor[p] }} />
              <span>
                <strong>{impactPillarMeta[p].title}</strong>
                <span className="metrics-pillar-legend-sub">{impactPillarMeta[p].blurb}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="metrics-rechart">
          <ResponsiveContainer width="100%" height={320} debounce={120}>
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12, top: 8, bottom: 28 }}>
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: 'Index (visual weight only)',
                  position: 'bottom',
                  offset: 12,
                  fill: '#64748b',
                  fontSize: 11,
                }}
              />
              <YAxis
                type="category"
                dataKey="short"
                width={76}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  const row = payload[0].payload as (typeof data)[number]
                  return (
                    <div className="metrics-chart-tooltip">
                      <strong>{row.label}</strong>
                      <span className="metrics-chart-tooltip-kicker">{row.short}</span>
                      <p>{impactPillarMeta[row.pillar].title}</p>
                      <p className="metrics-chart-tooltip-unit">Unit: {row.unit}</p>
                      <p className="metrics-chart-tooltip-index">
                        Bar index {row.index}/100 — for layout only; do not compare to other rows numerically.
                      </p>
                    </div>
                  )
                }}
              />
              <Bar dataKey="chart" radius={[0, 6, 6, 0]} isAnimationActive={false} animationDuration={0}>
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="metrics-grid metrics-grid-live">
        {metricChartRows.map((m) => (
          <article key={m.key} className="metric-card metric-card-live">
            <span className="metric-card-pillar" style={{ color: pillarColor[m.pillar] }}>
              {impactPillarMeta[m.pillar].title}
            </span>
            <strong>{m.short}</strong>
            <p>{m.label}</p>
          </article>
        ))}
      </div>
    </div>
  )
})
