import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_SECTIONS, NAV_SECTION_MAP, ease, homeSectionHash } from '../constants'

export function NavBar() {
  const location = useLocation()
  const onHome = location.pathname === '/' || location.pathname === ''
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!onHome) {
      setActiveSection('')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(NAV_SECTION_MAP[entry.target.id] ?? '')
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [onHome])

  useEffect(() => {
    const onHash = () => setMenuOpen(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLink = (sectionId: string, label: string, activeId: string) => (
    <a href={homeSectionHash(sectionId)} className={onHome && activeSection === activeId ? 'nav-active' : ''}>
      {label}
    </a>
  )

  return (
    <motion.nav
      className={`nav premium-nav ${scrolled ? 'nav-scrolled' : ''} ${menuOpen ? 'nav-menu-open' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <Link to="/" className="nav-brand premium-brand">
        <span className="brand-mark">SC</span>
        <span className="brand-text">
          <strong>Shivam</strong>
          <small>Chaudhary</small>
        </span>
      </Link>

      <div className="nav-links">
        {navLink('plurit', 'Plurit', 'plurit')}
        {navLink('work', 'Work', 'work')}
        {navLink('experience', 'Experience', 'experience')}
        {navLink('labs', 'Labs', 'labs')}
        {navLink('education', 'Education', 'education')}
        <Link to="/resume" className="nav-resume">
          Resume
        </Link>
      </div>

      <a href={homeSectionHash('contact')} className="nav-cta premium-nav-cta" data-cursor-magnetic>
        Let's Talk ↗
      </a>

      <button
        type="button"
        className="nav-burger"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-mobile-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <a href={homeSectionHash('plurit')} onClick={() => setMenuOpen(false)}>
              Plurit
            </a>
            <a href={homeSectionHash('systems')} onClick={() => setMenuOpen(false)}>
              Systems
            </a>
            <a href={homeSectionHash('work')} onClick={() => setMenuOpen(false)}>
              Case Studies
            </a>
            <a href={homeSectionHash('experience')} onClick={() => setMenuOpen(false)}>
              Experience
            </a>
            <a href={homeSectionHash('labs')} onClick={() => setMenuOpen(false)}>
              Labs
            </a>
            <a href={homeSectionHash('education')} onClick={() => setMenuOpen(false)}>
              Education
            </a>
            <Link to="/resume" onClick={() => setMenuOpen(false)}>
              Resume
            </Link>
            <a href={homeSectionHash('contact')} onClick={() => setMenuOpen(false)} className="nav-mobile-cta">
              Let's Talk ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
