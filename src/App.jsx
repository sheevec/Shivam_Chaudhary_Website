import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import portraitImg from './assets/portrait.jpg'
import dividerImg from './assets/divider.jpg'
import './App.css'

const RESUME_LINK = '/Shivam_Chaudhary_CV_DE.pdf'

/* ─ Animation Variants ─────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease } },
}

/* ─ Data ────────────────────────────────────────────────────── */
const caseStudies = [
  {
    id: 'credit-risk',
    tag: 'Credit Risk · BFSI · LTIMindtree',
    title: 'Credit Risk Data Seeding & FICO Integration',
    problem: 'Equifax needed a scalable pipeline to ingest and seed credit profiles, FICO scores, bureau data, and transaction records — connected to downstream ML feature stores with tight latency SLAs.',
    built: 'Designed search-and-match algorithms for seeding and inquiry orchestration; built SQL-driven feature pipelines; implemented GCP metadata backup and load balancing with CI/CD automation around keying and linking modules.',
    metrics: [{ v: '50M+/day', l: 'records' }, { v: '45%', l: 'faster latency' }, { v: '~30%', l: 'better SLAs' }],
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'Airflow', 'dbt'],
    accent: 'cyan',
  },
  {
    id: 'fraud',
    tag: 'Fraud Detection · BFSI · LTIMindtree',
    title: 'AI-Driven Fraud Detection & Anomaly Scoring',
    problem: 'Citizens Bank required an ML-backed decisioning layer capable of processing high-volume transaction streams and reducing false positives without sacrificing recall on actual fraud signals.',
    built: 'Developed ML-driven fraud decisioning flows over streaming transaction data, integrated anomaly scoring pipelines, and built monitoring and threshold automation to support continuous tuning.',
    metrics: [{ v: '20M+/day', l: 'transactions' }, { v: '35%', l: 'fewer false positives' }, { v: '$2.5M+', l: 'annual savings' }],
    stack: ['Python', 'ML', 'PySpark', 'GCP', 'BigQuery', 'SQL'],
    accent: 'violet',
  },
  {
    id: 'enterprise-data',
    tag: 'Data Engineering · Enterprise Scale',
    title: 'Enterprise Data Engineering Layer',
    problem: 'Multiple business units needed a unified data layer handling diverse input formats at massive scale — with consistent validation, observability, and delivery SLAs measured in minutes, not hours.',
    built: 'Architected batch and streaming ingestion layers for CSV, GZIP, and Parquet inputs; built automation and validation frameworks; delivered data contracts and quality controls across the full pipeline lifecycle.',
    metrics: [{ v: '10+ TB/day', l: 'ingestion' }, { v: 'Hours → mins', l: 'latency' }, { v: '40%', l: 'less manual prep' }],
    stack: ['Python', 'PySpark', 'SQL', 'GCP', 'dbt', 'Airflow', 'Data Contracts'],
    accent: 'blue',
  },
  {
    id: 'plurit',
    tag: 'Product · Platform · Founder',
    title: 'Plurit — Event Discovery, Matching & Community',
    problem: 'Building a consumer platform from scratch: event discovery, social matching, and community engagement — with a cloud-native backend that could scale and iterate at startup speed.',
    built: 'Defined product roadmap and infrastructure architecture; built AWS-native backend with Lambda, DynamoDB, API Gateway, and CDK; shipped onboarding, matching, and event discovery flows from concept to live.',
    metrics: [{ v: 'Founder', l: 'execution' }, { v: 'Full-stack', l: 'ownership' }, { v: 'Concept', l: '→ shipped' }],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native', 'Product'],
    accent: 'amber',
  },
]

const experience = [
  {
    company: 'Plurit',
    role: 'Director, Product & Platform Architecture',
    period: '2024 – Present',
    location: 'Bengaluru, India',
    chapter: 'Founder-Operator',
    chapterColor: 'amber',
    summary: 'Shaping product direction, cloud infrastructure, and user journeys for a social events and community discovery platform.',
    highlights: [
      'Owned end-to-end strategy for event discovery, community matching, and social engagement journeys',
      'Defined product roadmap: onboarding flows, matching algorithms, and retention/growth loops',
      'Scaled backend with AWS microservices — Lambda, DynamoDB, API Gateway, and CDK infrastructure',
      'Led cross-functional execution across product, design, and engineering from concept to shipped features',
    ],
    stack: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'CDK', 'React Native'],
  },
  {
    company: 'LTIMindtree',
    role: 'Senior Data Engineer',
    period: '2022 – 2024',
    location: 'USA',
    chapter: 'Enterprise Data Fabric',
    chapterColor: 'cyan',
    summary: 'Enterprise analytics engineering for Equifax and Citizens Bank — credit risk infrastructure, fraud decisioning, and high-volume data platform work across GCP.',
    highlights: [
      'Designed search-and-match algorithms for credit seeding and inquiry pipeline orchestration at Equifax',
      'Built SQL-driven feature pipelines processing 50M+ records/day integrated with FICO and bureau data',
      'Implemented GCP metadata backup and load balancing across distributed ingestion layers',
      'Built CI/CD automation around keying, linking, and validation modules; reduced latency by 45%',
      'Delivered fraud/anomaly scoring on 20M+ daily transactions — contributed $2.5M+ in annual savings',
    ],
    stack: ['Python', 'SQL', 'GCP', 'BigQuery', 'PySpark', 'dbt', 'Airflow'],
  },
  {
    company: 'PepsiCo',
    role: 'Data Engineer',
    period: '2021 – 2022',
    location: 'USA',
    chapter: 'Cloud Migration + Feature Pipelines',
    chapterColor: 'blue',
    summary: 'Cloud migration, feature pipeline automation, and ML experiment validation across supply chain and commercial data domains.',
    highlights: [
      'Led BigQuery SQL migration from legacy data warehouse systems across supply chain and commercial domains',
      'Built ETL automation for hit-rate and feature-building pipelines from CSV, API, and semi-structured sources',
      'Architected Azure Databricks + ADF workflows with integrated Power BI reporting layers',
      'Validated ML experiments and led architecture reviews for analytics modernization initiatives',
    ],
    stack: ['BigQuery', 'SQL', 'Azure', 'Databricks', 'ADF', 'Power BI', 'Python'],
  },
  {
    company: 'Rangam',
    role: 'AI & Data Systems Consultant',
    period: '2021',
    location: 'USA',
    chapter: 'AI Systems Layer',
    chapterColor: 'violet',
    summary: 'Secure AI solutions, CV preprocessing pipelines, and staffing-domain conversational architecture.',
    highlights: [
      'Built resume and CV preprocessing pipelines for structured data extraction and candidate matching',
      'Designed architecture for a staffing-domain chatbot with NLP and retrieval workflows',
      'Delivered scalable AI solutions with emphasis on data security and system reliability',
    ],
    stack: ['Python', 'NLP', 'AWS', 'REST APIs'],
  },
  {
    company: 'Amdocs',
    role: 'Data Engineer & QA Analyst',
    period: '2015 – 2018',
    location: 'India & Argentina',
    chapter: 'Foundations Under Pressure',
    chapterColor: 'green',
    summary: 'Where reliability, scale, and delivery discipline became instinct — building data warehouse and OSS/BSS foundations for Telefónica Argentina and major telecom operators.',
    highlights: [
      'Built data warehouse and data lake foundations using SQL and NoSQL across telecom billing and operations',
      'Delivered ETL pipelines for OSS/BSS systems serving Telefónica Argentina and other major operators',
      'Collaborated across product, finance, and marketing to automate deployment and delivery workflows',
      'Led UAT and system integration testing for large-scale telecom platform rollouts',
      'Contributed to $1.2M/month in operational savings through system optimization',
    ],
    stack: ['SQL', 'NoSQL', 'ETL', 'Data Warehouse', 'OSS/BSS', 'Telecom Platforms'],
  },
]

const capabilities = [
  {
    area: 'Data Engineering',
    depth: 'Expert',
    color: 'cyan',
    items: ['Python · SQL · PySpark', 'ETL/ELT pipelines', 'Data lakehouse architecture', 'dbt · Airflow · Spark', 'Data contracts + validation'],
  },
  {
    area: 'Cloud Platforms',
    depth: 'Expert',
    color: 'blue',
    items: ['GCP · BigQuery · Dataflow', 'AWS Lambda · S3 · SageMaker · CDK', 'Azure Databricks · ADF · Power BI', 'Multi-cloud architecture'],
  },
  {
    area: 'Analytics & ML',
    depth: 'Advanced',
    color: 'violet',
    items: ['Feature engineering + stores', 'Model validation + experiment tracking', 'Regression · Classification · NLP', 'Fraud/anomaly detection systems'],
  },
  {
    area: 'Product & Platform',
    depth: 'Advanced',
    color: 'amber',
    items: ['Product roadmap + strategy', 'CI/CD + observability', 'Stakeholder + architecture alignment', 'Founder-level execution'],
  },
]

const labs = [
  { title: 'Optum Health Analytics Capstone', context: 'Northeastern · MS Analytics', desc: 'Analytics pipelines and ML classification models for healthcare data pattern detection.', tags: ['Python', 'ML', 'Healthcare'] },
  { title: 'Fashion-MNIST Neural Network Benchmarking', context: 'Academic Research', desc: 'Benchmarked CNN architectures on Fashion-MNIST — accuracy, training dynamics, and generalization.', tags: ['PyTorch', 'CNN', 'Deep Learning'] },
  { title: 'IMDb Text Analytics & Sentiment Classification', context: 'Applied NLP', desc: 'NLP pipeline for sentiment classification and topic modeling on a large-scale review corpus.', tags: ['NLP', 'Python', 'Scikit-learn'] },
  { title: 'Black Friday Purchase Prediction', context: 'Applied ML', desc: 'Feature-engineered retail transaction data to predict purchase behavior and segment buyer intent.', tags: ['Python', 'XGBoost', 'Feature Engineering'] },
  { title: 'CrowdDoing — Non-Profit Data Analytics', context: 'Volunteer · 2021 – Present', desc: 'Hypothesis-testing frameworks for sparse datasets; Tableau + R Shiny dashboards for impact measurement.', tags: ['R', 'Tableau', 'Statistics'] },
]

const journey = [
  {
    period: '2011–2015',
    place: 'India',
    role: 'Student → Engineer',
    text: 'Completed B.Tech in Computer Engineering at Rajasthan Technical University. Built foundations in algorithms, systems design, and software engineering that would underpin everything that followed.',
    highlights: ['B.Tech Computer Engineering, RTU', 'Foundations in systems, algorithms, and programming', 'First exposure to data and software architecture'],
  },
  {
    period: '2015–2018',
    place: 'India + Argentina',
    role: 'Data Engineer & QA — Amdocs',
    text: 'Moved from Gurgaon to Buenos Aires working on telecom data systems for Telefónica Argentina. Built data warehouse, data lake, and ETL foundations for OSS/BSS platforms under real production pressure.',
    highlights: ['Data warehouse, data lake, and ETL systems for major telecom operators', 'Deployed across Gurgaon and Buenos Aires — Telefónica Argentina client', 'Raised a CR that saved $1.2M/month in operational costs', 'UAT, system integration, and cross-functional delivery discipline'],
  },
  {
    period: '2019–2020',
    place: 'Boston, USA',
    role: 'MS Analytics (AI/ML) — Northeastern',
    text: 'Pursued a Master\'s in Analytics with AI/ML focus at Northeastern University in Boston. Completed the Optum health analytics capstone, conducted ML experiments, and built applied research projects.',
    highlights: ['MS in Analytics (AI/ML), Northeastern University', 'Optum Health Analytics capstone project', 'Fashion-MNIST, IMDb NLP, and Black Friday ML experiments', 'CrowdDoing non-profit volunteer data work began'],
  },
  {
    period: '2021–2022',
    place: 'Texas, USA',
    role: 'Data Engineer — PepsiCo + Rangam',
    text: 'Joined PepsiCo in Texas, leading a BigQuery migration from legacy data systems and building feature pipelines across supply chain and commercial data. Also delivered AI/CV preprocessing work at Rangam.',
    highlights: ['Led BigQuery SQL migration from legacy warehouse at PepsiCo', 'Built ETL automation reducing manual intervention by 50%', 'Integrated Azure Databricks, ADF, and Power BI workflows', 'Delivered NLP + CV preprocessing systems at Rangam'],
  },
  {
    period: '2022–2024',
    place: 'Georgia, USA',
    role: 'Senior Data Engineer — LTIMindtree',
    text: 'Senior Data Engineer at LTIMindtree, embedded with Equifax and Citizens Bank. Built credit risk seeding infrastructure, fraud detection pipelines, and enterprise data fabric at 10+ TB/day scale.',
    highlights: ['Credit risk seeding + FICO integration for Equifax — 50M+ records/day', 'Fraud/anomaly ML decisioning for Citizens Bank — $2.5M+ annual savings', 'GCP metadata backup, load balancing, and CI/CD for keying/linking modules', '45% latency reduction in feature generation pipelines'],
  },
  {
    period: '2024–Now',
    place: 'Bengaluru, India',
    role: 'Director, Product & Platform — Plurit',
    text: 'Back in India as Director of Product and Platform at Plurit — a social events and community discovery app. Owning strategy, cloud infrastructure, and end-to-end product execution at founder speed.',
    highlights: ['End-to-end product strategy for event discovery, matching, and community', 'AWS-native backend — Lambda, DynamoDB, API Gateway, CDK', '30% latency reduction, 40% increase in product usage', 'Leading cross-functional teams: product, design, and engineering'],
  },
]

const logos = ['Plurit', 'LTIMindtree', 'PepsiCo', 'Rangam', 'Amdocs', 'Northeastern', 'Equifax', 'Citizens Bank', 'Telefónica']

const testimonials = [
  {
    quote: "Shivam brought rare clarity to our data architecture. He didn't just build pipelines — he built systems we could reason about and trust at scale.",
    name: 'Engineering Lead',
    context: 'LTIMindtree · Equifax engagement',
    accent: 'cyan',
  },
  {
    quote: "His ability to bridge data engineering and product thinking is genuinely uncommon. He understood what we needed before we could articulate it ourselves.",
    name: 'Product Stakeholder',
    context: 'PepsiCo · Supply Chain Analytics',
    accent: 'blue',
  },
  {
    quote: "Shivam's fraud pipeline work reduced our investigation overhead significantly. He's someone who takes ownership of outcomes, not just deliverables.",
    name: 'Analytics Manager',
    context: 'Citizens Bank · Fraud & Anomaly Detection',
    accent: 'violet',
  },
]

const writings = [
  {
    tag: 'ML Engineering',
    title: 'How I Cut Fraud False Positives by 35%',
    teaser: 'Building the ML decisioning layer at Citizens Bank — what the feature pipeline looked like, how we tuned thresholds, and why precision-recall tradeoffs are never just a data science problem.',
    readTime: '6 min read',
    accent: 'violet',
  },
  {
    tag: 'Data Engineering',
    title: 'What 10+ TB/Day Actually Looks Like in Production',
    teaser: 'Behind the metric: the ingestion patterns, contract enforcement, and failure modes that make enterprise data fabric either hold or collapse under pressure.',
    readTime: '8 min read',
    accent: 'cyan',
  },
  {
    tag: 'Founder',
    title: 'Why I Left a Senior DE Role to Build Plurit',
    teaser: 'The honest version — what I gave up, what I learned in the first 90 days, and why the skills that make a great data engineer transfer surprisingly well to product execution.',
    readTime: '5 min read',
    accent: 'amber',
  },
]

/* ─ Components ──────────────────────────────────────────────── */

/* ─ Data Flow Canvas ────────────────────────────────────────── */
function DataFlowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const NODE_COUNT = window.innerWidth < 768 ? 16 : 30
    const MAX_DIST = window.innerWidth < 768 ? 110 : 150
    const nodes = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.13
            ctx.beginPath()
            ctx.strokeStyle = `rgba(34,211,238,${a})`
            ctx.lineWidth = 0.7
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(34,211,238,0.35)'
        ctx.fill()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="data-canvas" aria-hidden="true" />
}

/* ─ Custom Cursor ───────────────────────────────────────────── */
function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: -100, y: -100 })
  const ring    = useRef({ x: -100, y: -100 })
  const hover   = useRef(false)
  const rafId   = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`
      }
    }
    const onOver = (e) => {
      if (e.target.closest('a,button,[role="button"]')) {
        hover.current = true
        ringRef.current?.classList.add('cursor-hover')
      }
    }
    const onOut = (e) => {
      if (e.target.closest('a,button,[role="button"]')) {
        hover.current = false
        ringRef.current?.classList.remove('cursor-hover')
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)

    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.11)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.11)
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`
      }
      rafId.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

const NAV_SECTIONS = ['work', 'experience', 'labs', 'writing', 'contact']

function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ratios = new Map()
    const observers = NAV_SECTIONS.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios.set(id, entry.intersectionRatio)
          let best = '', bestRatio = 0
          ratios.forEach((v, k) => { if (v > bestRatio) { bestRatio = v; best = k } })
          if (bestRatio > 0) setActive(best)
        },
        { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-15% 0px -15% 0px' }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return active
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const active = useActiveSection()

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setScrolled(v > 0.02))
    return unsub
  }, [scrollYProgress])

  return (
    <motion.nav
      className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease }}
    >
      <a href="#hero" className="nav-brand">SC</a>
      <div className="nav-links">
        {[['#work','work','Work'],['#experience','experience','Experience'],['#labs','labs','Labs'],['#writing','writing','Writing'],['#contact','contact','Contact']].map(([href, id, label]) => (
          <a key={id} href={href} className={active === id ? 'active' : ''}>{label}</a>
        ))}
        <a href={RESUME_LINK} download className="nav-cta">Download CV</a>
      </div>
    </motion.nav>
  )
}

function InViewSection({ children, className, id, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      custom={delay}
    >
      {children}
    </motion.section>
  )
}

function CaseCard({ study, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.article
      ref={ref}
      className={`case-card case-${study.accent} ${open ? 'case-open' : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease }}
      onClick={() => setOpen(!open)}
    >
      <div className="case-tag">{study.tag}</div>
      <h3>{study.title}</h3>
      <div className="case-metrics">
        {study.metrics.map((m) => (
          <div key={m.l} className="metric-chip">
            <strong>{m.v}</strong>
            <span>{m.l}</span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="case-detail"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="case-block">
              <span className="block-label">The Problem</span>
              <p>{study.problem}</p>
            </div>
            <div className="case-block">
              <span className="block-label">What I Built</span>
              <p>{study.built}</p>
            </div>
            <div className="stack-row">
              {study.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="case-toggle-row">
        <span className="case-toggle">{open ? '↑ Collapse' : '↓ Expand'}</span>
      </div>
    </motion.article>
  )
}

function ExpCard({ role, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className="exp-card"
      variants={slideLeft}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay: index * 0.08 }}
    >
      <div className="exp-header">
        <div className="exp-left">
          <div className="exp-company">{role.company}</div>
          <div className="exp-role">{role.role}</div>
        </div>
        <div className="exp-right">
          <span className="exp-period">{role.period}</span>
          <span className="exp-location">{role.location}</span>
          <span className={`exp-chapter chapter-${role.chapterColor}`}>{role.chapter}</span>
        </div>
      </div>
      <p className="exp-summary">{role.summary}</p>
      <ul className="exp-bullets">
        {role.highlights.map((h) => <li key={h}>{h}</li>)}
      </ul>
      <div className="stack-row">
        {role.stack.map((s) => <span key={s} className="stack-pill">{s}</span>)}
      </div>
    </motion.div>
  )
}

/* ─ Count Up ────────────────────────────────────────────────── */
function CountUp({ prefix = '', value, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [display, setDisplay] = useState(decimals > 0 ? (0).toFixed(decimals) : '0')
  const rafId = useRef(null)

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    let startTime = null

    const animate = (ts) => {
      if (!startTime) startTime = ts
      const elapsed = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = eased * value
      setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString())
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      }
    }

    rafId.current = requestAnimationFrame(animate)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [inView, value, decimals])

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

/* ─ Scroll To Top ───────────────────────────────────────────── */
function ScrollToTop() {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setVisible(v > 0.25))
    return unsub
  }, [scrollYProgress])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* ─ Contact Form ─────────────────────────────────────────────── */
// Sign up at formspree.io → create form → replace YOUR_FORM_ID below
const FORMSPREE_ID = 'mkopyepo'

function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="cf-subject">Subject</label>
        <input
          id="cf-subject"
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Role opportunity / Advisory / Collaboration"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about the opportunity or what you'd like to discuss..."
          rows={5}
          required
        />
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            className="form-success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            key="success"
          >
            Message sent — I'll get back to you soon.
          </motion.div>
        ) : status === 'error' ? (
          <motion.div
            className="form-error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            key="error"
          >
            Something went wrong. Try emailing directly.
          </motion.div>
        ) : (
          <motion.button
            key="submit"
            type="submit"
            className="form-submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  )
}

/* ─ App ─────────────────────────────────────────────────────── */
export default function App() {
  const [activeStage, setActiveStage] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const onMove = (e) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 14,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <ScrollProgress />
      <NavBar />
      <CustomCursor />
      <div className="grain" aria-hidden="true" />

      {/* Ambient background orbs */}
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />
      </div>

      <main className="page" id="hero">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section className="hero" ref={heroRef}>
          <DataFlowCanvas />
          <motion.div className="hero-content" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="hero-grid">
              <div className="hero-copy">
                <motion.p
                  className="eyebrow"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                >
                  Senior Data Engineer · Systems Thinker · Founder
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.18, ease }}
                >
                  Building data systems that scale, decide, and deliver.
                </motion.h1>

                <motion.p
                  className="hero-sub"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.28, ease }}
                >
                  8+ years across cloud-native data platforms, analytics engineering,
                  and applied ML — from telecom foundations and enterprise data systems
                  to founder-led product infrastructure.
                </motion.p>

                <motion.div
                  className="hero-actions"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.38, ease }}
                >
                  <a href="#work" className="btn-primary">View My Work</a>
                  <a href="#experience" className="btn-ghost">Experience</a>
                  <a href={RESUME_LINK} download className="btn-ghost">Download CV</a>
                  <a href="#contact" className="btn-ghost">Connect</a>
                </motion.div>
              </div>

              <motion.div
                className="hero-visual"
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease }}
                style={{
                  transform: `perspective(1200px) rotateX(${tilt.y * 0.08}deg) rotateY(${-tilt.x * 0.08}deg)`,
                }}
              >
                <div className="portrait-wrap">
                  <img src={portraitImg} alt="Shivam Chaudhary — Senior Data Engineer" className="portrait-img" />
                  <div className="portrait-overlay">
                    <span className="po-name">Shivam Chaudhary</span>
                    <span className="po-title">Senior Data Engineer</span>
                    <span className="po-sub">Data Platforms · Analytics · ML · Product</span>
                  </div>
                  {/* Liquid glass shimmer */}
                  <div className="portrait-shimmer" aria-hidden="true" />
                </div>

                <motion.div
                  className="location-strip"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5, ease }}
                >
                  {['India', 'Argentina', 'USA', 'Bengaluru'].map((loc) => (
                    <span key={loc} className="loc-tag">{loc}</span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.div
              className="scroll-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.div
                className="scroll-dot"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── LOGO STRIP ──────────────────────────────────────────── */}
        <InViewSection className="logo-strip">
          <p className="logo-label">Trusted experience across</p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...logos, ...logos].map((logo, i) => (
                <span key={`${logo}-${i}`} className="logo-pill">{logo}</span>
              ))}
            </div>
          </div>
        </InViewSection>

        {/* ── START HERE ──────────────────────────────────────────── */}
        <InViewSection className="glass-card" id="start">
          <span className="section-label">Start Here</span>
          <h2>I build systems that make complexity usable.</h2>
          <div className="story-cols">
            <p>
              I began in enterprise telecom environments, where reliability, scale, and delivery
              discipline mattered every day. Over time, I moved deeper into data engineering,
              cloud analytics, and ML-backed workflows — building systems that improve how
              businesses ingest, validate, model, and act on data.
            </p>
            <p>
              My work has taken me across India, Argentina, and the United States, spanning
              telecom, BFSI, supply chain, and consumer technology. Today, alongside
              enterprise-scale data engineering, I also operate as a founder-builder — shaping
              product direction, infrastructure, and user journeys at Plurit.
            </p>
          </div>
        </InViewSection>

        {/* ── CHAPTER DIVIDER ─────────────────────────────────────── */}
        <motion.div
          className="chapter-divider"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
        >
          <img src={dividerImg} alt="" aria-hidden="true" className="divider-img" loading="lazy" />
          <div className="divider-overlay">
            <span>"I build systems that make complexity usable."</span>
          </div>
        </motion.div>

        {/* ── IMPACT METRICS ──────────────────────────────────────── */}
        <InViewSection className="section" id="impact">
          <div className="section-head">
            <span className="section-label">By the Numbers</span>
            <h2>Impact at scale</h2>
          </div>
          <motion.div
            className="metrics-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { prefix: '',  value: 8,   suffix: '+ Years', decimals: 0, l: 'building data and analytics systems' },
              { prefix: '',  value: 50,  suffix: 'M+/day',  decimals: 0, l: 'credit risk records ingested and seeded' },
              { prefix: '',  value: 20,  suffix: 'M+/day',  decimals: 0, l: 'transactions in fraud/anomaly workflows' },
              { prefix: '',  value: 10,  suffix: '+ TB/day',decimals: 0, l: 'enterprise ingestion scale' },
              { prefix: '',  value: 45,  suffix: '% Faster',decimals: 0, l: 'feature generation latency reduction' },
              { prefix: '$', value: 2.5, suffix: 'M+/yr',   decimals: 1, l: 'savings via fraud prioritization' },
              { prefix: '$', value: 1.2, suffix: 'M/mo',    decimals: 1, l: 'operational savings at Amdocs' },
            ].map((m) => (
              <motion.article key={m.l} className="metric-card" variants={staggerItem}>
                <strong>
                  <CountUp prefix={m.prefix} value={m.value} suffix={m.suffix} decimals={m.decimals} />
                </strong>
                <p>{m.l}</p>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── SELECTED WORK ───────────────────────────────────────── */}
        <section className="section" id="work">
          <div className="section-head">
            <span className="section-label">Selected Work</span>
            <h2>Four systems worth understanding</h2>
            <p className="section-sub">
              High-scale risk and fraud infrastructure to founder-led consumer product execution.
              Click any card to expand the full story.
            </p>
          </div>
          <div className="case-grid">
            {caseStudies.map((study, i) => (
              <CaseCard key={study.id} study={study} index={i} />
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ──────────────────────────────────────────── */}
        <section className="section" id="experience">
          <div className="section-head">
            <span className="section-label">Experience</span>
            <h2>Eight years of systems, platforms, and outcomes</h2>
          </div>
          <div className="exp-list">
            {experience.map((role, i) => (
              <ExpCard key={role.company} role={role} index={i} />
            ))}
          </div>
        </section>

        {/* ── CAREER JOURNEY ──────────────────────────────────────── */}
        <InViewSection className="section" id="journey">
          <div className="section-head">
            <span className="section-label">Career Journey</span>
            <h2>India → Argentina → USA → Bengaluru</h2>
          </div>
          <div className="journey-layout">
            <div className="journey-rail">
              {journey.map((step, i) => (
                <button
                  key={step.period}
                  className={`journey-btn ${activeStage === i ? 'active' : ''}`}
                  onClick={() => setActiveStage(i)}
                >
                  <span className="j-period">{step.period}</span>
                  <span className="j-place">{step.place}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={journey[activeStage].period}
                className="journey-detail glass-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
              >
                <div className="jd-place">{journey[activeStage].place}</div>
                <div className="jd-period">{journey[activeStage].period}</div>
                <div className="jd-role">{journey[activeStage].role}</div>
                <p>{journey[activeStage].text}</p>
                <ul className="jd-highlights">
                  {journey[activeStage].highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </InViewSection>

        {/* ── CAPABILITIES ────────────────────────────────────────── */}
        <InViewSection className="section">
          <div className="section-head">
            <span className="section-label">What I Know Deeply</span>
            <h2>Core capabilities</h2>
          </div>
          <motion.div
            className="cap-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {capabilities.map((cap) => (
              <motion.div key={cap.area} className={`cap-card cap-${cap.color}`} variants={staggerItem}>
                <div className="cap-header">
                  <span className="cap-area">{cap.area}</span>
                  <span className="cap-depth">{cap.depth}</span>
                </div>
                <ul className="cap-items">
                  {cap.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── LABS ────────────────────────────────────────────────── */}
        <InViewSection className="section" id="labs">
          <div className="section-head">
            <span className="section-label">Labs & Experiments</span>
            <h2>Research, applied ML, and side systems</h2>
            <p className="section-sub">
              Academic work, volunteer projects, and applied experiments — the intellectual
              layer beneath the production systems.
            </p>
          </div>
          <motion.div
            className="labs-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {labs.map((lab) => (
              <motion.article key={lab.title} className="lab-card" variants={staggerItem}>
                <span className="lab-context">{lab.context}</span>
                <h3>{lab.title}</h3>
                <p>{lab.desc}</p>
                <div className="stack-row">
                  {lab.tags.map((t) => <span key={t} className="stack-pill">{t}</span>)}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── EDUCATION ───────────────────────────────────────────── */}
        <InViewSection className="glass-card edu-section">
          <span className="section-label">Education</span>
          <h2>Credentials</h2>
          <div className="edu-list">
            <div className="edu-item">
              <div className="edu-accent" />
              <div>
                <span className="edu-degree">MS in Analytics (AI/ML)</span>
                <span className="edu-school">Northeastern University · Boston · 2019–2020</span>
                <span className="edu-note">Optum capstone · ML coursework · Applied research</span>
              </div>
            </div>
            <div className="edu-item">
              <div className="edu-accent" />
              <div>
                <span className="edu-degree">B.Tech in Computer Engineering</span>
                <span className="edu-school">Rajasthan Technical University · India · 2011–2015</span>
                <span className="edu-note">Systems, algorithms, and software foundations</span>
              </div>
            </div>
          </div>
        </InViewSection>

        {/* ── FOUNDER NOTE ────────────────────────────────────────── */}
        <InViewSection className="glass-card founder-card">
          <span className="section-label">Founder Note</span>
          <h2>Why I build</h2>
          <p>
            I am most energized by systems at the intersection of scale, clarity, and
            decision-making. Whether enterprise data infrastructure or product execution,
            I build foundations that make complexity usable — and I bring the same discipline
            to a startup environment that I applied at Equifax and PepsiCo.
          </p>
        </InViewSection>

        {/* ── TESTIMONIALS ────────────────────────────────────────── */}
        <InViewSection className="section" id="testimonials">
          <div className="section-head">
            <span className="section-label">What People Say</span>
            <h2>Voices from the work</h2>
          </div>
          <motion.div
            className="testimonials-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name + t.context} className={`testimonial-card testi-${t.accent}`} variants={staggerItem}>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-meta">
                  <span className="testi-name">{t.name}</span>
                  <span className="testi-context">{t.context}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── WRITING ─────────────────────────────────────────────── */}
        <InViewSection className="section" id="writing">
          <div className="section-head">
            <span className="section-label">Writing</span>
            <h2>Thinking out loud</h2>
            <p className="section-sub">
              Essays on data engineering, ML systems, and the craft of building at scale.
              Articles in progress — publishing soon.
            </p>
          </div>
          <motion.div
            className="writing-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {writings.map((w) => (
              <motion.article key={w.title} className={`writing-card writing-${w.accent}`} variants={staggerItem}>
                <div className="writing-top">
                  <span className="writing-tag">{w.tag}</span>
                  <span className="writing-time">{w.readTime}</span>
                </div>
                <h3>{w.title}</h3>
                <p>{w.teaser}</p>
                <div className="writing-cta">
                  <span className="writing-soon">Coming soon</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </InViewSection>

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <InViewSection className="contact-section" id="contact">
          <span className="section-label">Contact</span>
          <h2>Let's connect</h2>
          <p className="section-sub" style={{ textAlign: 'center', margin: '0 auto 2.5rem' }}>
            Open to senior data engineering roles, advisory work, and founder-level conversations.
          </p>

          <div className="contact-layout">
            {/* Left — form */}
            <ContactForm />

            {/* Right — links */}
            <div className="contact-right">
              <div className="contact-info-block">
                <span className="contact-info-label">Email</span>
                <a href="mailto:sheevechaudhary@gmail.com" className="contact-info-value">sheevechaudhary@gmail.com</a>
              </div>
              <div className="contact-info-block">
                <span className="contact-info-label">Phone</span>
                <a href="tel:+15084944767" className="contact-info-value">+1 508 494 4767</a>
              </div>
              <div className="contact-info-block">
                <span className="contact-info-label">Location</span>
                <span className="contact-info-value">Bengaluru, India</span>
              </div>
              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/shivamchaudhary69/" target="_blank" rel="noreferrer" className="contact-chip">LinkedIn</a>
                <a href="https://github.com/sheevec" target="_blank" rel="noreferrer" className="contact-chip">GitHub</a>
                <a href={RESUME_LINK} download className="contact-chip contact-primary">Download CV</a>
              </div>
            </div>
          </div>
        </InViewSection>

        <footer className="footer">
          <p>Shivam Chaudhary · Senior Data Engineer · Bengaluru, India</p>
        </footer>

      </main>

      <ScrollToTop />
    </>
  )
}
