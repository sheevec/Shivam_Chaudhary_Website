/**
 * Impact section: real headline numbers live in `short` + `label`.
 * `index` is only for drawing bars in one chart — not comparable across rows (different units).
 */
export type ImpactPillar = 'scale' | 'reliability' | 'economics'

export const impactPillarMeta: Record<
  ImpactPillar,
  { title: string; blurb: string }
> = {
  scale: {
    title: 'Scale & throughput',
    blurb: 'How much data moves through systems you designed or operated.',
  },
  reliability: {
    title: 'Reliability & velocity',
    blurb: 'Latency and delivery wins that make pipelines usable under pressure.',
  },
  economics: {
    title: 'Business outcomes',
    blurb: 'Dollar impact where it was measured and attributable to engineering work.',
  },
}

export const metricChartRows = [
  {
    key: 'years',
    pillar: 'scale' as const,
    label: 'Years in data systems',
    short: '8+ yrs',
    value: 8,
    index: 72,
    unit: 'calendar years',
  },
  {
    key: 'credit',
    pillar: 'scale',
    label: 'Credit risk records / day',
    short: '50M+',
    value: 50,
    index: 100,
    unit: 'records/day (peak pipeline)',
  },
  {
    key: 'fraud',
    pillar: 'scale',
    label: 'Fraud / anomaly transactions / day',
    short: '20M+',
    value: 20,
    index: 88,
    unit: 'transactions/day',
  },
  {
    key: 'tb',
    pillar: 'scale',
    label: 'Enterprise ingestion',
    short: '10+ TB',
    value: 10,
    index: 76,
    unit: 'TB/day (order of magnitude)',
  },
  {
    key: 'latency',
    pillar: 'reliability',
    label: 'Feature generation latency reduction',
    short: '45%',
    value: 45,
    index: 64,
    unit: 'percent faster vs baseline',
  },
  {
    key: 'savef',
    pillar: 'economics',
    label: 'Fraud prioritization savings',
    short: '$2.5M+',
    value: 2.5,
    index: 92,
    unit: 'USD / year (bank-reported)',
  },
  {
    key: 'savea',
    pillar: 'economics',
    label: 'Telecom ops savings',
    short: '$1.2M',
    value: 1.2,
    index: 70,
    unit: 'USD / month (program-level)',
  },
] as const
