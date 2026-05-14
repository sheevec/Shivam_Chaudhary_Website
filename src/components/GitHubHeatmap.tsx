import { useEffect, useMemo, useState } from 'react'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface ApiResponse {
  contributions: ContributionDay[]
}

const LEVEL_CLASS = ['gh-l0', 'gh-l1', 'gh-l2', 'gh-l3', 'gh-l4'] as const

/** Approximate GitHub-style grid: 53 week-columns × 7 day-rows, column-major from oldest→newest slice. */
function buildWeekGrid(days: ContributionDay[]) {
  const sorted = [...days].filter((d) => d.date).sort((a, b) => a.date.localeCompare(b.date))
  const slice = sorted.slice(-371)
  const cols: ContributionDay[][] = []
  for (let c = 0; c < 53; c++) {
    const col: ContributionDay[] = []
    for (let r = 0; r < 7; r++) {
      const i = c * 7 + r
      col.push(slice[i] ?? { date: '', count: 0, level: 0 })
    }
    cols.push(col)
  }
  return cols
}

export function GitHubHeatmap({ username }: { username: string }) {
  const [data, setData] = useState<ContributionDay[] | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: ApiResponse) => {
        if (Array.isArray(json.contributions)) setData(json.contributions)
        else setErr(true)
      })
      .catch(() => setErr(true))
  }, [username])

  const grid = useMemo(() => (data ? buildWeekGrid(data) : []), [data])

  return (
    <div className="gh-heatmap-wrap">
      <div className="gh-heatmap-head">
        <span className="section-label label-green">Shipping history</span>
        <h3>GitHub activity</h3>
        <p className="gh-heatmap-sub">
          Last ~year of public commits (via{' '}
          <a href="https://github.com/grubersjoe/github-contributions-api" target="_blank" rel="noreferrer">
            contributions API
          </a>
          ). Private work won&apos;t appear here.
        </p>
      </div>

      {err && <p className="gh-heatmap-err">Could not load contributions — network or rate limits blocked the request.</p>}

      {!err && !data && <p className="gh-heatmap-loading">Loading contribution grid…</p>}

      {grid.length > 0 && (
        <div className="gh-heatmap" role="img" aria-label={`Contribution heatmap for ${username}`}>
          {grid.map((week, wi) => (
            <div key={wi} className="gh-week">
              {week.map((cell, di) => (
                <span
                  key={`${wi}-${di}`}
                  className={`gh-cell ${LEVEL_CLASS[Math.min(4, Math.max(0, cell.level))] ?? 'gh-l0'}`}
                  title={cell.date ? `${cell.date}: ${cell.count} contributions` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <a className="gh-profile-link" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
        Open @{username} on GitHub ↗
      </a>
    </div>
  )
}
