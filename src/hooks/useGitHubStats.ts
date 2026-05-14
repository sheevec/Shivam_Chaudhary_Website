import { useEffect, useState } from 'react'

export interface GitHubUserStats {
  repos: number
  followers: number
}

export function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubUserStats | null>(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { public_repos?: number; followers?: number } | null) => {
        if (data && typeof data.public_repos === 'number' && typeof data.followers === 'number') {
          setStats({ repos: data.public_repos, followers: data.followers })
        }
      })
      .catch(() => {})
  }, [username])

  return stats
}
