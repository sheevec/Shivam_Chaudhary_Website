import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import portraitImg from '../assets/portrait.jpg'
import { ease, RESUME_LINK, stagger, WRITING_LIVE } from '../constants'
import {
  architectureSystems,
  capabilities,
  caseStudies,
  experience,
  heroMetrics,
  howIWork,
  LAB_FILTERS,
  labs,
  logos,
  writings,
  type LabFilter,
} from '../data/siteContent'
import { ChapterDivider } from '../components/ChapterDivider'
import { CaseCard } from '../components/CaseCard'
import { ContactForm } from '../components/ContactForm'
import { InViewSection } from '../components/InViewSection'
import { useGitHubStats } from '../hooks/useGitHubStats'
import { useHeroParallaxLayers } from '../hooks/useHeroParallaxLayers'
import { useMagnetic } from '../hooks/useMagnetic'

const LazyHeroBackground = lazy(() =>
  import('../components/hero/HeroBackground').then((m) => ({ default: m.HeroBackground }))
)
const LazyArchitectureExplorer = lazy(() =>
  import('../components/ArchitectureExplorer').then((m) => ({ default: m.ArchitectureExplorer }))
)
const LazyMetricsWithCharts = lazy(() =>
  import('../components/MetricsWithCharts').then((m) => ({ default: m.MetricsWithCharts }))
)
const LazyCaseStudyShaderCanvas = lazy(() =>
  import('../components/CaseStudyShaderCanvas').then((m) => ({ default: m.CaseStudyShaderCanvas }))
)
const LazyCaseStudyPipelineDAG = lazy(() =>
  import('../components/CaseStudyPipelineDAG').then((m) => ({ default: m.CaseStudyPipelineDAG }))
)
const LazyGitHubHeatmap = lazy(() =>
  import('../components/GitHubHeatmap').then((m) => ({ default: m.GitHubHeatmap }))
)
const LazyCodeSnippetCarousel = lazy(() =>
  import('../components/CodeSnippetCarousel').then((m) => ({ default: m.CodeSnippetCarousel }))
)

export default function HomePage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [labFilter, setLabFilter] = useState<LabFilter>('All')
  const ghStats = useGitHubStats('sheevec')
  const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.18)
  const { heroRef, backRef, midRef } = useHeroParallaxLayers(true)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <motion.main
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <section ref={heroRef} className="hero premium-hero" id="hero">
        <div ref={backRef} className="hero-parallax-back" aria-hidden="true" />
        <Suspense fallback={null}>
          <LazyHeroBackground />
        </Suspense>
        <div ref={midRef} className="hero-parallax-mid" aria-hidden="true" />

        <div className="hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease }}
          >
            <span className="status-pill" role="status">
              <span className="status-dot" aria-hidden="true" />
              Currently shipping <strong>Plurit</strong> · Open to senior roles
            </span>

            <p className="eyebrow premium-eyebrow">Senior Data Engineer · Founder · Bengaluru</p>

            <h1 className="premium-hero-title">
              I built fraud decisioning that saved Citizens Bank $2.5M a year.
              <span className="hero-highlight"> Now I'm building Plurit.</span>
            </h1>

            <p className="hero-sub premium-hero-sub">
              Eight years across credit risk, fraud ML, and enterprise data fabric — Equifax, Citizens Bank,
              PepsiCo, Telefónica. Today I run product and platform at Plurit, shipping a cloud-native consumer app
              from zero.
            </p>

            <div className="hero-actions">
              <a
                href="#work"
                className="btn-primary btn-magnet"
                ref={primaryCtaRef}
                data-cursor-magnetic
              >
                <span>View My Work ↗</span>
              </a>
              <Link to="/resume" className="btn-ghost">
                View Resume (browser) ↗
              </Link>
              <a href={RESUME_LINK} download className="btn-ghost">
                Download Resume ↓
              </a>
            </div>

            <div className="premium-social-row">
              <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer">
                in
              </a>
              <a href="https://github.com/sheevec" target="_blank" rel="noreferrer">
                GH
              </a>
              <a href="mailto:sheevechaudhary@gmail.com">✉</a>
              <a href={RESUME_LINK} download>
                CV
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual premium-hero-visual"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.82, delay: 0.12, ease }}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.y * 0.08}deg) rotateY(${-tilt.x * 0.08}deg)`,
            }}
          >
            <div className="portrait-wrap premium-portrait-wrap">
              <div className="portrait-clip">
                <img
                  src={portraitImg}
                  alt="Shivam Chaudhary"
                  className="portrait-img premium-portrait-img"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              <div className="portrait-shimmer" aria-hidden="true" />

              <div className="portrait-name-overlay">
                <strong>Shivam Chaudhary</strong>
                <span className="portrait-role">Senior Data Engineer</span>
                <span className="portrait-tags">Data Platforms · Analytics · ML · Product</span>
              </div>
            </div>

            <div className="portrait-city-row">
              {['India', 'Argentina', 'USA', 'Bengaluru'].map((c) => (
                <span key={c} className="city-pill">
                  {c}
                </span>
              ))}
            </div>

            <div className="hero-metric-overlay">
              {heroMetrics.map((m) => (
                <div key={m.label} className="hero-metric-item">
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="hero-ticker-wrap" aria-hidden="true">
        <div className="hero-ticker-track">
          {Array(6)
            .fill('Senior Data Engineer · Systems Thinker · Founder')
            .map((t, i) => (
              <span key={i} className="hero-ticker-item">
                {t}
              </span>
            ))}
        </div>
      </div>

      <InViewSection className="logo-strip premium-logo-strip">
        <p className="logo-label">Experience that shapes me</p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...logos, ...logos].map((logo, i) => (
              <span key={`${logo.name}-${i}`} className="logo-pill logo-mark" aria-label={logo.name}>
                <img src={logo.src} alt={logo.name} loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </InViewSection>

      <InViewSection className="glass-card intro-card" id="start">
        <span className="section-label">Start Here</span>
        <h2>From enterprise data fabric to founder execution.</h2>
        <div className="story-cols">
          <p>
            I began in enterprise telecom environments, where reliability, scale and delivery discipline mattered every
            day. Over time, I moved deeper into data engineering, cloud analytics and ML-backed decision workflows.
          </p>
          <p>
            Today, I combine senior data engineering experience with founder-level product execution — building
            infrastructure, user journeys and cloud-native systems that move from idea to shipped product.
          </p>
        </div>
      </InViewSection>

      <ChapterDivider />

      <InViewSection className="plurit-feature" id="plurit">
        <div className="section-head split-head">
          <div>
            <span className="section-label label-amber">Featured Builder Story</span>
            <h2>Plurit — the product I'm building from zero to scale</h2>
          </div>
          <a href="https://apps.apple.com/in/app/plur/id6748575019" target="_blank" rel="noreferrer" className="section-link">
            View App ↗
          </a>
        </div>

        <div className="plurit-grid">
          <div className="plurit-main">
            <span className="product-pill">Founder · Product · Platform</span>
            <h3>Event discovery + social connection layer for real-world experiences.</h3>
            <p>
              Plurit is built around the idea that discovery alone is not enough. Users need confidence, context and
              connection before they actually show up. I own product direction, infrastructure architecture and
              execution across event discovery, onboarding, matching and community flows.
            </p>

            <div className="plurit-actions">
              <a href="https://apps.apple.com/in/app/plur/id6748575019" target="_blank" rel="noreferrer" className="btn-primary">
                iOS App ↗
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=app.plurit.mobile&hl=en_IN"
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Android App ↗
              </a>
            </div>
          </div>

          <div className="plurit-proof-grid">
            {[
              ['Backend', 'AWS Lambda, API Gateway, DynamoDB and CDK-based infrastructure.'],
              ['Product', 'Onboarding, event discovery, social matching and community engagement journeys.'],
              ['Architecture', 'Service-oriented backend with auth, user, chat, events and notification layers.'],
              ['Execution', 'Founder-led roadmap, feature prioritization, design collaboration and launch loops.'],
            ].map(([title, desc]) => (
              <div key={title} className="proof-card">
                <span>{title}</span>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </InViewSection>

      <InViewSection className="section" id="systems">
        <div className="section-head split-head">
          <div>
            <span className="section-label label-violet">Systems I Can Design</span>
            <h2>Architecture depth beyond the resume</h2>
          </div>
          <a href="#contact" className="section-link">
            Discuss a system →
          </a>
        </div>

        <Suspense fallback={null}>
          <LazyArchitectureExplorer systems={architectureSystems} />
        </Suspense>
      </InViewSection>

      <InViewSection className="section" id="impact">
        <div className="section-head">
          <span className="section-label">By the Numbers</span>
          <h2>Impact at scale</h2>
        </div>

        <Suspense fallback={null}>
          <LazyMetricsWithCharts />
        </Suspense>
      </InViewSection>

      <InViewSection className="section work-section-vfx" id="work">
        <Suspense fallback={null}>
          <LazyCaseStudyShaderCanvas />
        </Suspense>
        <div className="work-section-fg">
          <div className="section-head">
            <span className="section-label">Selected Case Studies</span>
            <h2>Proof of systems built</h2>
            <p className="section-sub">
              A mix of enterprise data platforms, fraud decisioning, credit-risk infrastructure and founder-led product
              work.
            </p>
          </div>

          <Suspense fallback={null}>
            <LazyCaseStudyPipelineDAG studies={caseStudies} />
          </Suspense>

          <motion.div
            className="case-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {caseStudies.map((study) => (
              <CaseCard key={study.id} study={study} />
            ))}
          </motion.div>
        </div>
      </InViewSection>

      <InViewSection className="section" id="experience">
        <div className="section-head">
          <span className="section-label">Experience</span>
          <h2>Eight years of systems, platforms and outcomes</h2>
        </div>

        <div className="exp-list">
          {experience.map((role) => (
            <article key={role.company} className="exp-card">
              <div className="exp-header">
                <div>
                  <div className="exp-company">{role.company}</div>
                  <div className="exp-role">{role.role}</div>
                </div>

                <div className="exp-right">
                  <span className="exp-period">{role.period}</span>
                  <span className="exp-location">{role.location}</span>
                  <span className="exp-chapter">{role.chapter}</span>
                </div>
              </div>

              <ul className="exp-bullets">
                {role.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>

              <div className="stack-row">
                {role.stack.map((s) => (
                  <span key={s} className="stack-pill">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </InViewSection>

      <InViewSection className="section how-section" id="how">
        <div className="section-head">
          <span className="section-label">How I Work</span>
          <h2>The operating principles behind the systems I ship</h2>
        </div>

        <div className="how-grid">
          {howIWork.map((item, index) => (
            <article key={item.title} className="how-card">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </InViewSection>

      <InViewSection className="section">
        <div className="section-head">
          <span className="section-label">Core Capabilities</span>
          <h2>What I know deeply</h2>
        </div>

        <div className="cap-grid">
          {capabilities.map((cap) => (
            <article key={cap.area} className={`cap-card cap-accent-${cap.color}`}>
              <div className="cap-header">
                <span className="cap-area">{cap.area}</span>
                <span className="cap-depth">Strong</span>
              </div>

              <ul className="cap-items">
                {cap.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </InViewSection>

      <InViewSection className="section" id="labs">
        <div className="section-head">
          <span className="section-label label-blue">Labs & Experiments</span>
          <h2>Applied ML and research work</h2>
        </div>

        <div className="lab-filters" role="group" aria-label="Filter projects">
          {LAB_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`lab-filter-btn ${labFilter === f ? 'lab-filter-active' : ''}`}
              onClick={() => setLabFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="labs-grid">
          {labs
            .filter((lab) => labFilter === 'All' || lab.category === labFilter)
            .map((lab) => (
              <article key={lab.title} className="lab-card">
                <span className="lab-context">{lab.context}</span>
                <h3>{lab.title}</h3>
                <p>{lab.desc}</p>

                <div className="stack-row">
                  {lab.tags.map((t) => (
                    <span key={t} className="stack-pill">
                      {t}
                    </span>
                  ))}
                </div>

                {lab.github && (
                  <a href={lab.github} target="_blank" rel="noreferrer" className="lab-github-link">
                    View on GitHub ↗
                  </a>
                )}
              </article>
            ))}
        </div>
      </InViewSection>

      <InViewSection className="section showcase-section" id="showcase">
        <div className="section-head">
          <span className="section-label label-violet">Data engineer showcase</span>
          <h2>Shipping signal & code depth</h2>
          <p className="section-sub">Public contribution rhythm plus representative pipeline code — the resume PDF is one click away in the hero.</p>
        </div>
        <div className="showcase-grid">
          <Suspense fallback={null}>
            <LazyGitHubHeatmap username="sheevec" />
          </Suspense>
          <Suspense fallback={null}>
            <LazyCodeSnippetCarousel />
          </Suspense>
        </div>
      </InViewSection>

      <InViewSection className="glass-card edu-section" id="education">
        <span className="section-label label-green">Education</span>
        <h2>Credentials</h2>

        <div className="edu-list">
          <div className="edu-item">
            <div className="edu-accent" />
            <div className="edu-body">
              <span className="edu-degree">MS in Analytics (AI / ML)</span>
              <span className="edu-school">Northeastern University · Boston · 2019 – 2020</span>
              <span className="edu-note">Optum Health Analytics capstone · Applied ML coursework · Research projects</span>
            </div>
          </div>

          <div className="edu-item">
            <div className="edu-accent" />
            <div className="edu-body">
              <span className="edu-degree">B.Tech in Computer Engineering</span>
              <span className="edu-school">Rajasthan Technical University · India · 2011 – 2015</span>
              <span className="edu-note">Systems, algorithms, and software engineering foundations</span>
            </div>
          </div>
        </div>
      </InViewSection>

      {WRITING_LIVE && (
        <InViewSection className="section" id="writing">
          <div className="section-head split-head">
            <div>
              <span className="section-label label-cyan">Writing</span>
              <h2>Thinking out loud</h2>
              <p className="section-sub">Essays on data engineering, ML systems, and the craft of building at scale.</p>
            </div>
            <a href="#contact" className="section-link">
              More →
            </a>
          </div>

          <div className="writing-grid">
            {writings.map((w) => (
              <article key={w.title} className="writing-card">
                <div className="writing-top">
                  <span className="writing-tag">{w.tag}</span>
                  <span className="writing-time">{w.status}</span>
                </div>
                <h3>{w.title}</h3>
                <p>{w.teaser}</p>
              </article>
            ))}
          </div>
        </InViewSection>
      )}

      <InViewSection className="contact-section" id="contact">
        <div className="contact-cta-copy">
          <span className="section-label">Contact</span>
          <h2>Hiring for Senior Data Engineering or AI Platform roles?</h2>
          <p>I can help build reliable data systems, ML pipelines and cloud-native product platforms.</p>
        </div>

        <div className="contact-layout">
          <ContactForm />

          <aside className="contact-right">
            <div className="contact-info-block">
              <span>Email</span>
              <a href="mailto:sheevechaudhary@gmail.com">sheevechaudhary@gmail.com</a>
            </div>

            <div className="contact-info-block">
              <span>Location</span>
              <strong>Bengaluru, India</strong>
            </div>

            <div className="contact-socials">
              <a href="mailto:sheevechaudhary@gmail.com" className="contact-chip contact-primary">
                Email Me ↗
              </a>
              <a href={RESUME_LINK} download className="contact-chip">
                Download Resume ↓
              </a>
              <Link to="/resume" className="contact-chip">
                Resume in browser ↗
              </Link>
              <a href="https://github.com/sheevec" target="_blank" rel="noreferrer" className="contact-chip contact-chip-gh">
                View GitHub ↗
                {ghStats && <span className="chip-stat">{ghStats.repos} repos</span>}
              </a>
              <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer" className="contact-chip">
                LinkedIn ↗
              </a>
            </div>
          </aside>
        </div>
      </InViewSection>

      <footer className="footer">
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#plurit">Plurit</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#labs">Labs</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <p>Shivam Chaudhary · Senior Data Engineer · Founder Builder · Bengaluru, India</p>
        <span className="footer-year">© {new Date().getFullYear()}</span>
      </footer>
    </motion.main>
  )
}
