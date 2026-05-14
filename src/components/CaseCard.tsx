import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CaseStudy } from '../data/siteContent'
import { staggerItem } from '../constants'

export function CaseCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.article
      data-case-id={study.id}
      className={`case-card case-${study.accent} ${open ? 'case-open' : ''}`}
      variants={staggerItem}
      onClick={() => setOpen(!open)}
    >
      <div className="case-topline">
        <span className="case-tag">{study.tag}</span>
        <span className="case-arrow">{open ? '−' : '+'}</span>
      </div>

      <h3>{study.title}</h3>
      <p className="case-summary">{study.summary}</p>

      {study.diagram && (
        <div className={`case-diagram diag-${study.accent}`} aria-hidden="true">
          <div className="diag-glow" />
          {study.diagram.map((node, i) => (
            <div key={node} className="diag-node-wrap">
              <span className="diag-node">{node}</span>
              {i < study.diagram.length - 1 && <span className="diag-line" />}
            </div>
          ))}
        </div>
      )}

      <div className="case-result">{study.result}</div>

      {!open && <span className="case-expand-hint">Tap to explore ↓</span>}

      <AnimatePresence>
        {open && (
          <motion.div
            className="case-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32 }}
          >
            <div className="case-block">
              <span>The Problem</span>
              <p>{study.problem}</p>
            </div>

            <div className="case-block">
              <span>What I Built</span>
              <p>{study.built}</p>
            </div>

            <div className="stack-row">
              {study.stack.map((s) => (
                <span key={s} className="stack-pill">
                  {s}
                </span>
              ))}
            </div>

            {study.github && (
              <a
                href={study.github}
                target="_blank"
                rel="noreferrer"
                className="case-github-link"
                onClick={(e) => e.stopPropagation()}
              >
                View on GitHub ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
