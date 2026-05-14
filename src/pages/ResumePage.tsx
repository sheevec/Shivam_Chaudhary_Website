import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import { resumeAbsoluteUrl } from '../constants'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const SIDEBAR = [
  {
    title: 'Why ship the CV here',
    body:
      'Hiring loops are noisy. I want one calm place where you can skim the same document everyone else downloads — without leaving the site — and still get a sense of how I think about product and platforms.',
  },
  {
    title: 'What I want you to take away',
    body:
      'Eight years across credit risk, fraud ML, and enterprise data fabric; today I split time between founder execution at Plurit and serious data/platform work. If a role needs someone who bridges pipelines and product, we should talk.',
  },
  {
    title: 'Built like internal tooling',
    body:
      'This viewer uses the same in-browser PDF stack I would reach for in an admin console or ops tool: fast load, keyboard-friendly pages, and a download path when you need the file in email or ATS.',
  },
] as const

export default function ResumePage() {
  const [pages, setPages] = useState<number | null>(null)
  const [err, setErr] = useState(false)
  const [pw, setPw] = useState(720)
  const resumeFile = useMemo(() => resumeAbsoluteUrl(), [])

  useEffect(() => {
    const ro = () => setPw(Math.min(720, Math.max(280, window.innerWidth - 48)))
    ro()
    window.addEventListener('resize', ro)
    return () => window.removeEventListener('resize', ro)
  }, [])

  return (
    <main className="page resume-page">
      <div className="resume-hero glass-card">
        <Link to="/" className="resume-back">
          ← Back to site
        </Link>
        <h1>CV</h1>
        <p className="resume-lead">
          Same PDF recruiters get by email — rendered here so you can skim it in context, then grab a copy if you need it for your system.
        </p>
      </div>

      <div className="resume-layout">
        <div className="resume-pdf-wrap glass-card">
          {err ? (
            <p className="resume-err">Could not load the PDF. Use Download below or open the home page and try again.</p>
          ) : (
            <Document
              file={resumeFile}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
              onLoadError={(e) => {
                console.error('[resume]', e)
                setErr(true)
              }}
            >
              {pages === null && !err && <p className="resume-loading">Opening PDF…</p>}
              {pages !== null &&
                Array.from({ length: pages }, (_, i) => <Page key={i + 1} pageNumber={i + 1} width={pw} />)}
            </Document>
          )}
        </div>

        <aside className="resume-callouts" aria-label="From Shivam">
          <h2>From me</h2>
          {SIDEBAR.map((c) => (
            <div key={c.title} className="resume-callout">
              <strong>{c.title}</strong>
              <p>{c.body}</p>
            </div>
          ))}
          <a href={resumeFile} download="Shivam_Chaudhary_CV_DE.pdf" className="btn-primary resume-dl">
            Download PDF ↓
          </a>
        </aside>
      </div>
    </main>
  )
}
