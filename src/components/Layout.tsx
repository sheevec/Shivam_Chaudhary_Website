import type { ReactNode } from 'react'
import { CustomCursor } from './CustomCursor'
import { ScrollProgress } from './ScrollProgress'
import { NavBar } from './NavBar'
import { ScrollToTop } from './ScrollToTop'
import { useLenis } from '../hooks/useLenis'

export function Layout({ children }: { children: ReactNode }) {
  useLenis()

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <NavBar />

      <div className="grain" aria-hidden="true" />
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>

      {children}

      <ScrollToTop />
    </>
  )
}
