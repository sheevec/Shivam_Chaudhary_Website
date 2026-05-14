export const RESUME_LINK = '/Shivam_Chaudhary_CV_DE.pdf'
export const FORMSPREE_ID = 'mkopyepo'

/** Hash link to a section on the home page (works from /resume and other routes). */
export function homeSectionHash(sectionId: string): string {
  let base = import.meta.env.BASE_URL ?? '/'
  if (base !== '/' && base.endsWith('/')) base = base.slice(0, -1)
  return base === '/' ? `/#${sectionId}` : `${base}#${sectionId}`
}

/** Absolute URL to the public resume PDF (for react-pdf and downloads). */
export function resumeAbsoluteUrl(): string {
  if (typeof window === 'undefined') return RESUME_LINK
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')
  const path = RESUME_LINK.startsWith('/') ? RESUME_LINK : `/${RESUME_LINK}`
  return `${window.location.origin}${base}${path}`
}

/** Toggle when at least one essay is published. */
export const WRITING_LIVE = false

export const ease = [0.16, 1, 0.3, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease },
  }),
}

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease },
  },
}

export const NAV_SECTIONS = [
  'hero',
  'plurit',
  'systems',
  'impact',
  'work',
  'experience',
  'labs',
  'education',
  'contact',
] as const

export const NAV_SECTION_MAP: Record<string, string> = {
  plurit: 'plurit',
  systems: 'plurit',
  impact: 'work',
  work: 'work',
  experience: 'experience',
  labs: 'labs',
  education: 'education',
  contact: 'contact',
  hero: '',
}
