import { useCallback, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark.js'
import { codeSnippets } from '../data/codeSnippets'

export function CodeSnippetCarousel() {
  const [i, setI] = useState(0)
  const sn = codeSnippets[i]
  const next = useCallback(() => setI((v) => (v + 1) % codeSnippets.length), [])
  const prev = useCallback(() => setI((v) => (v - 1 + codeSnippets.length) % codeSnippets.length), [])

  return (
    <div className="code-carousel glass-card">
      <div className="code-carousel-head">
        <span className="section-label label-blue">Algorithms & pipelines</span>
        <h3>Code I actually write</h3>
        <p className="code-carousel-sub">Small, representative snippets — not toy Leetcode, but production-shaped patterns.</p>
      </div>

      <div className="code-carousel-toolbar">
        <button type="button" className="btn-ghost" onClick={prev} aria-label="Previous snippet">
          ← Prev
        </button>
        <span className="code-carousel-title">
          {i + 1} / {codeSnippets.length} — {sn.title}
        </span>
        <button type="button" className="btn-ghost" onClick={next} aria-label="Next snippet">
          Next →
        </button>
      </div>

      <div className="code-carousel-body">
        <SyntaxHighlighter language={sn.lang} style={oneDark} showLineNumbers wrapLines customStyle={{ margin: 0, borderRadius: 12, fontSize: 13 }}>
          {sn.code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
